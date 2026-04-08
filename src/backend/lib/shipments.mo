import List "mo:core/List";
import Order "mo:core/Order";
import Common "../types/common";
import ShipmentTypes "../types/shipments";
import OrderTypes "../types/orders";
import ProductTypes "../types/products";

module {
  public type ShipmentState = List.List<ShipmentTypes.TruckLoad>;

  public func listTruckLoads(state : ShipmentState) : [ShipmentTypes.TruckLoad] {
    state.toArray();
  };

  public func getTruckLoad(state : ShipmentState, id : Common.TruckLoadId) : ?ShipmentTypes.TruckLoad {
    state.find(func(t) { t.id == id });
  };

  public func createTruckLoad(
    state : ShipmentState,
    nextId : Nat,
    truckDimensions : ShipmentTypes.TruckDimensions,
    orderIds : [Common.OrderId],
    now : Common.Timestamp,
  ) : ShipmentTypes.TruckLoad {
    let truckLoad : ShipmentTypes.TruckLoad = {
      id = nextId;
      truckDimensions = truckDimensions;
      orderIds = orderIds;
      status = #Pending;
      loadingScheme = [];
      createdAt = now;
    };
    state.add(truckLoad);
    truckLoad;
  };

  public func setTruckLoadStatus(
    state : ShipmentState,
    id : Common.TruckLoadId,
    status : Common.TruckLoadStatus,
  ) : Bool {
    let idx = state.findIndex(func(t) { t.id == id });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = state.at(i);
        state.put(i, { existing with status = status });
        true;
      };
    };
  };

  public func saveLoadingScheme(
    state : ShipmentState,
    id : Common.TruckLoadId,
    placements : [ShipmentTypes.PartPlacement],
  ) : Bool {
    let idx = state.findIndex(func(t) { t.id == id });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = state.at(i);
        state.put(i, { existing with loadingScheme = placements });
        true;
      };
    };
  };

  // Sort orders: emergency first, then by earliest deadline ascending.
  public func prioritizedOrderIds(
    orders : [OrderTypes.Order],
  ) : [Common.OrderId] {
    let sorted = orders.sort(
      func(a : OrderTypes.Order, b : OrderTypes.Order) : Order.Order {
        if (a.emergency and not b.emergency) { #less }
        else if (not a.emergency and b.emergency) { #greater }
        else {
          if (a.deadline < b.deadline) { #less }
          else if (a.deadline > b.deadline) { #greater }
          else { #equal }
        }
      },
    );
    sorted.map<OrderTypes.Order, Common.OrderId>(func(o) { o.id });
  };

  // 3D bin-packing: fit as many full products as possible.
  // Products are placed sequentially: parts line up along the truck length (X-axis).
  // Rows advance along the truck width (Z-axis) when X runs out.
  // Returns PartPlacements with positions respecting each part's bottomSide orientation.
  public func optimizePlacements(
    truckDimensions : ShipmentTypes.TruckDimensions,
    orderedOrderIds : [Common.OrderId],
    orders : [OrderTypes.Order],
    products : [ProductTypes.Product],
  ) : [ShipmentTypes.PartPlacement] {
    let truckLF = truckDimensions.lengthCm.toFloat();
    let truckWF = truckDimensions.widthCm.toFloat();
    let truckHF = truckDimensions.heightCm.toFloat();

    let placements = List.empty<ShipmentTypes.PartPlacement>();

    // Shelf-packing state
    var cursorX : Float = 0.0;
    var cursorZ : Float = 0.0;
    var rowDepth : Float = 0.0; // max width (Z) used in current row

    label orderLoop for (orderId in orderedOrderIds.values()) {
      let orderOpt = orders.find(func(o : OrderTypes.Order) : Bool { o.id == orderId });
      let order = switch (orderOpt) { case null { continue orderLoop }; case (?o) { o } };

      label itemLoop for (item in order.items.values()) {
        let productOpt = products.find(func(p : ProductTypes.Product) : Bool { p.id == item.productId and p.active });
        let product = switch (productOpt) { case null { continue itemLoop }; case (?p) { p } };

        var qty = item.quantity;
        label qtyLoop while (qty > 0) {
          qty -= 1;

          // Compute product footprint: parts laid end-to-end along X
          var productXLen : Float = 0.0;
          var productZDepth : Float = 0.0;
          var productYHeight : Float = 0.0;

          for (part in product.parts.values()) {
            let (pX, pZ, pY) = partOrientedDims(part);
            if (pZ > productZDepth) { productZDepth := pZ };
            if (pY > productYHeight) { productYHeight := pY };
            productXLen += pX;
          };

          // Skip product if it exceeds truck dimensions entirely
          if (productXLen > truckLF or productZDepth > truckWF or productYHeight > truckHF) {
            continue qtyLoop;
          };

          // Advance to new row if product doesn't fit in remaining X
          if (cursorX + productXLen > truckLF) {
            cursorX := 0.0;
            cursorZ += rowDepth;
            rowDepth := 0.0;
          };

          // Skip if no Z space left
          if (cursorZ + productZDepth > truckWF) {
            continue qtyLoop;
          };

          // Place each part
          var partX : Float = cursorX;
          for (part in product.parts.values()) {
            let (pX, pZ, pY) = partOrientedDims(part);
            let (rX, rY, rZ, rW) = bottomSideRotation(part.bottomSide);
            let placement : ShipmentTypes.PartPlacement = {
              partId = part.id;
              productId = product.id;
              orderId = orderId;
              posX = partX + pX / 2.0;
              posY = pY / 2.0;
              posZ = cursorZ + pZ / 2.0;
              rotX = rX;
              rotY = rY;
              rotZ = rZ;
              rotW = rW;
            };
            placements.add(placement);
            partX += pX;
          };

          cursorX += productXLen;
          if (productZDepth > rowDepth) { rowDepth := productZDepth };
        };
      };
    };

    placements.toArray();
  };

  // Returns (xLen, zDepth, yHeight) as Floats based on which face is on the floor.
  private func partOrientedDims(part : ProductTypes.Part) : (Float, Float, Float) {
    let l = part.lengthCm.toFloat();
    let w = part.widthCm.toFloat();
    let h = part.heightCm.toFloat();
    // Default orientation: L=length, W=width, H=height
    // When bottomSide is Bottom/Top, part stands normally (L x W footprint, H tall)
    // When Front/Back: part tips forward — H becomes xLen, L becomes yHeight
    // When Left/Right: part tips sideways — W becomes yHeight
    switch (part.bottomSide) {
      case (#Bottom) { (l, w, h) };
      case (#Top)    { (l, w, h) };
      case (#Front)  { (h, w, l) };
      case (#Back)   { (h, w, l) };
      case (#Left)   { (l, h, w) };
      case (#Right)  { (l, h, w) };
    };
  };

  // Returns quaternion (rotX, rotY, rotZ, rotW) for the given bottomSide orientation.
  private func bottomSideRotation(side : Common.BottomSide) : (Float, Float, Float, Float) {
    switch (side) {
      case (#Bottom) { (0.0, 0.0, 0.0, 1.0) };
      case (#Top)    { (1.0, 0.0, 0.0, 0.0) };
      case (#Front)  { (0.7071067811865476, 0.0, 0.0, 0.7071067811865476) };
      case (#Back)   { (-0.7071067811865476, 0.0, 0.0, 0.7071067811865476) };
      case (#Left)   { (0.0, 0.0, 0.7071067811865476, 0.7071067811865476) };
      case (#Right)  { (0.0, 0.0, -0.7071067811865476, 0.7071067811865476) };
    };
  };
};
