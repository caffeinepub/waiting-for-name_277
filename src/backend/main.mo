import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import UserApproval "mo:caffeineai-user-approval/approval";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import ProductTypes "types/products";
import OrderTypes "types/orders";
import ShipmentTypes "types/shipments";
import ProductLib "lib/products";
import OrderLib "lib/orders";
import ShipmentLib "lib/shipments";
import ProductsApi "mixins/products-api";
import OrdersApi "mixins/orders-api";
import ShipmentsApi "mixins/shipments-api";



actor {
  // Authorization & approval state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let approvalState = UserApproval.initState(accessControlState);

  // Bootstrap: first caller becomes admin (one-time use, no-op if admin already assigned)
  public shared ({ caller }) func bootstrapAdmin() : async () {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous callers cannot bootstrap admin") };
    AccessControl.initialize(accessControlState, caller);
    // Also register the new admin as approved in the approval state
    if (AccessControl.isAdmin(accessControlState, caller)) {
      UserApproval.setApproval(approvalState, caller, #approved);
    };
  };

  // Approval endpoints
  public query ({ caller }) func isCallerApproved() : async Bool {
    if (caller.isAnonymous()) { return false };
    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) { true };
      case (_) { UserApproval.isApproved(approvalState, caller) };
    };
  };

  // Open to any authenticated (non-anonymous) user — no approval required
  public shared ({ caller }) func requestApproval() : async () {
    if (caller.isAnonymous()) { Runtime.trap("Anonymous callers cannot request approval") };
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public shared ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // Products state
  let products : ProductLib.ProductState = List.empty<ProductTypes.Product>();
  let nextProductId = { var value : Nat = 0 };
  let nextPartId = { var value : Nat = 0 };

  include ProductsApi(accessControlState, approvalState, products, nextProductId, nextPartId);

  // Orders state
  let orders : OrderLib.OrderState = List.empty<OrderTypes.Order>();
  let nextOrderId = { var value : Nat = 0 };

  include OrdersApi(accessControlState, approvalState, orders, nextOrderId);

  // Shipments state
  let truckLoads : ShipmentLib.ShipmentState = List.empty<ShipmentTypes.TruckLoad>();
  let nextTruckLoadId = { var value : Nat = 0 };

  include ShipmentsApi(accessControlState, approvalState, truckLoads, orders, products, nextTruckLoadId);
};
