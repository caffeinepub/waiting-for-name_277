import List "mo:core/List";
import Common "../types/common";
import ProductTypes "../types/products";

module {
  public type ProductState = List.List<ProductTypes.Product>;

  public func listProducts(state : ProductState) : [ProductTypes.Product] {
    state.filter(func(p) { p.active }).toArray();
  };

  public func getProduct(state : ProductState, id : Common.ProductId) : ?ProductTypes.Product {
    state.find(func(p) { p.id == id });
  };

  public func createProduct(state : ProductState, nextId : Nat, name : Text) : ProductTypes.Product {
    let product : ProductTypes.Product = {
      id = nextId;
      name = name;
      active = true;
      parts = [];
    };
    state.add(product);
    product;
  };

  public func updateProduct(
    state : ProductState,
    id : Common.ProductId,
    name : Text,
    active : Bool,
    parts : [ProductTypes.Part],
  ) : Bool {
    let idx = state.findIndex(func(p) { p.id == id });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = state.at(i);
        state.put(i, { existing with name = name; active = active; parts = parts });
        true;
      };
    };
  };

  public func deactivateProduct(state : ProductState, id : Common.ProductId) : Bool {
    let idx = state.findIndex(func(p) { p.id == id });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = state.at(i);
        state.put(i, { existing with active = false });
        true;
      };
    };
  };

  public func addPart(
    state : ProductState,
    productId : Common.ProductId,
    nextPartId : Nat,
    name : Text,
    lengthCm : Nat,
    widthCm : Nat,
    heightCm : Nat,
    weightKg : Float,
    bottomSide : Common.BottomSide,
  ) : ?ProductTypes.Part {
    let idx = state.findIndex(func(p) { p.id == productId });
    switch (idx) {
      case null { null };
      case (?i) {
        let product = state.at(i);
        let newPart : ProductTypes.Part = {
          id = nextPartId;
          name = name;
          lengthCm = lengthCm;
          widthCm = widthCm;
          heightCm = heightCm;
          weightKg = weightKg;
          bottomSide = bottomSide;
        };
        let updatedParts = product.parts.concat([newPart]);
        state.put(i, { product with parts = updatedParts });
        ?newPart;
      };
    };
  };

  public func updatePart(
    state : ProductState,
    productId : Common.ProductId,
    partId : Common.PartId,
    name : Text,
    lengthCm : Nat,
    widthCm : Nat,
    heightCm : Nat,
    weightKg : Float,
    bottomSide : Common.BottomSide,
  ) : Bool {
    let idx = state.findIndex(func(p) { p.id == productId });
    switch (idx) {
      case null { false };
      case (?i) {
        let product = state.at(i);
        let partExists = product.parts.find(func(pt : ProductTypes.Part) : Bool { pt.id == partId });
        switch (partExists) {
          case null { false };
          case (?_) {
            let updatedParts = product.parts.map(
              func(pt : ProductTypes.Part) : ProductTypes.Part {
                if (pt.id == partId) {
                  { pt with name = name; lengthCm = lengthCm; widthCm = widthCm; heightCm = heightCm; weightKg = weightKg; bottomSide = bottomSide }
                } else { pt }
              },
            );
            state.put(i, { product with parts = updatedParts });
            true;
          };
        };
      };
    };
  };

  public func removePart(
    state : ProductState,
    productId : Common.ProductId,
    partId : Common.PartId,
  ) : Bool {
    let idx = state.findIndex(func(p) { p.id == productId });
    switch (idx) {
      case null { false };
      case (?i) {
        let product = state.at(i);
        let partExists = product.parts.find(func(pt : ProductTypes.Part) : Bool { pt.id == partId });
        switch (partExists) {
          case null { false };
          case (?_) {
            let updatedParts = product.parts.filter(func(pt : ProductTypes.Part) : Bool { pt.id != partId });
            state.put(i, { product with parts = updatedParts });
            true;
          };
        };
      };
    };
  };
};
