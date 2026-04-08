import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserApproval "mo:caffeineai-user-approval/approval";
import Common "../types/common";
import ProductTypes "../types/products";
import ProductLib "../lib/products";

mixin (
  accessControlState : AccessControl.AccessControlState,
  approvalState : UserApproval.UserApprovalState,
  products : ProductLib.ProductState,
  nextProductId : { var value : Nat },
  nextPartId : { var value : Nat },
) {
  private func requireApproved(caller : Principal) {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized: Anonymous callers cannot perform this action") };
    let isAdmin = switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) { true };
      case (_) { false };
    };
    if (not (isAdmin or UserApproval.isApproved(approvalState, caller))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
  };

  public query ({ caller }) func listProducts() : async [ProductTypes.Product] {
    requireApproved(caller);
    ProductLib.listProducts(products);
  };

  public query ({ caller }) func getProduct(id : Common.ProductId) : async ?ProductTypes.Product {
    requireApproved(caller);
    ProductLib.getProduct(products, id);
  };

  public shared ({ caller }) func createProduct(name : Text) : async ProductTypes.Product {
    requireApproved(caller);
    let id = nextProductId.value;
    nextProductId.value += 1;
    ProductLib.createProduct(products, id, name);
  };

  public shared ({ caller }) func updateProduct(
    id : Common.ProductId,
    name : Text,
    active : Bool,
    parts : [ProductTypes.Part],
  ) : async Bool {
    requireApproved(caller);
    ProductLib.updateProduct(products, id, name, active, parts);
  };

  public shared ({ caller }) func deactivateProduct(id : Common.ProductId) : async Bool {
    requireApproved(caller);
    ProductLib.deactivateProduct(products, id);
  };

  public shared ({ caller }) func addPart(
    productId : Common.ProductId,
    name : Text,
    lengthCm : Nat,
    widthCm : Nat,
    heightCm : Nat,
    weightKg : Float,
    bottomSide : Common.BottomSide,
  ) : async ?ProductTypes.Part {
    requireApproved(caller);
    let partId = nextPartId.value;
    nextPartId.value += 1;
    ProductLib.addPart(products, productId, partId, name, lengthCm, widthCm, heightCm, weightKg, bottomSide);
  };

  public shared ({ caller }) func updatePart(
    productId : Common.ProductId,
    partId : Common.PartId,
    name : Text,
    lengthCm : Nat,
    widthCm : Nat,
    heightCm : Nat,
    weightKg : Float,
    bottomSide : Common.BottomSide,
  ) : async Bool {
    requireApproved(caller);
    ProductLib.updatePart(products, productId, partId, name, lengthCm, widthCm, heightCm, weightKg, bottomSide);
  };

  public shared ({ caller }) func removePart(
    productId : Common.ProductId,
    partId : Common.PartId,
  ) : async Bool {
    requireApproved(caller);
    ProductLib.removePart(products, productId, partId);
  };
};
