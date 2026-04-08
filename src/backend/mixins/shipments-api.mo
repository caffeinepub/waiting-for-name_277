import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserApproval "mo:caffeineai-user-approval/approval";
import Common "../types/common";
import OrderTypes "../types/orders";
import ShipmentTypes "../types/shipments";
import ShipmentLib "../lib/shipments";
import OrderLib "../lib/orders";
import ProductLib "../lib/products";

mixin (
  accessControlState : AccessControl.AccessControlState,
  approvalState : UserApproval.UserApprovalState,
  truckLoads : ShipmentLib.ShipmentState,
  orders : OrderLib.OrderState,
  products : ProductLib.ProductState,
  nextTruckLoadId : { var value : Nat },
) {
  private func requireApprovedShipments(caller : Principal) {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized: Anonymous callers cannot perform this action") };
    let isAdmin = switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) { true };
      case (_) { false };
    };
    if (not (isAdmin or UserApproval.isApproved(approvalState, caller))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
  };

  public query ({ caller }) func listTruckLoads() : async [ShipmentTypes.TruckLoad] {
    requireApprovedShipments(caller);
    ShipmentLib.listTruckLoads(truckLoads);
  };

  public query ({ caller }) func getTruckLoad(id : Common.TruckLoadId) : async ?ShipmentTypes.TruckLoad {
    requireApprovedShipments(caller);
    ShipmentLib.getTruckLoad(truckLoads, id);
  };

  public shared ({ caller }) func createTruckLoad(
    truckDimensions : ShipmentTypes.TruckDimensions,
    orderIds : [Common.OrderId],
  ) : async ShipmentTypes.TruckLoad {
    requireApprovedShipments(caller);
    let id = nextTruckLoadId.value;
    nextTruckLoadId.value += 1;
    ShipmentLib.createTruckLoad(truckLoads, id, truckDimensions, orderIds, Time.now());
  };

  public shared ({ caller }) func setTruckLoadStatus(
    id : Common.TruckLoadId,
    status : Common.TruckLoadStatus,
  ) : async Bool {
    requireApprovedShipments(caller);
    ShipmentLib.setTruckLoadStatus(truckLoads, id, status);
  };

  public shared ({ caller }) func saveLoadingScheme(
    id : Common.TruckLoadId,
    placements : [ShipmentTypes.PartPlacement],
  ) : async Bool {
    requireApprovedShipments(caller);
    ShipmentLib.saveLoadingScheme(truckLoads, id, placements);
  };

  // Returns prioritized order IDs across all pending orders.
  public query ({ caller }) func getPrioritizedOrderIds() : async [Common.OrderId] {
    requireApprovedShipments(caller);
    let allOrders = OrderLib.listOrders(orders, ?#Pending, false);
    ShipmentLib.prioritizedOrderIds(allOrders);
  };

  // Server-side packing optimization for a specific truck load.
  public shared ({ caller }) func optimizeTruckLoad(id : Common.TruckLoadId) : async Bool {
    requireApprovedShipments(caller);
    let truckLoadOpt = ShipmentLib.getTruckLoad(truckLoads, id);
    let truckLoad = switch (truckLoadOpt) {
      case null { Runtime.trap("TruckLoad not found") };
      case (?t) { t };
    };

    // Gather orders assigned to this truck load
    let allOrders = orders.toArray();
    let truckOrders = allOrders.filter(func(o : OrderTypes.Order) : Bool {
      truckLoad.orderIds.find(func(oid : Common.OrderId) : Bool { oid == o.id }) != null
    });

    // Prioritize them
    let prioritized = ShipmentLib.prioritizedOrderIds(truckOrders);
    let allProducts = ProductLib.listProducts(products);

    let placements = ShipmentLib.optimizePlacements(
      truckLoad.truckDimensions,
      prioritized,
      truckOrders,
      allProducts,
    );

    ShipmentLib.saveLoadingScheme(truckLoads, id, placements);
  };
};
