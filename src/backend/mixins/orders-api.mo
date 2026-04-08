import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserApproval "mo:caffeineai-user-approval/approval";
import Common "../types/common";
import OrderTypes "../types/orders";
import OrderLib "../lib/orders";

mixin (
  accessControlState : AccessControl.AccessControlState,
  approvalState : UserApproval.UserApprovalState,
  orders : OrderLib.OrderState,
  nextOrderId : { var value : Nat },
) {
  private func requireApprovedOrders(caller : Principal) {
    if (caller.isAnonymous()) { Runtime.trap("Unauthorized: Anonymous callers cannot perform this action") };
    let isAdmin = switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) { true };
      case (_) { false };
    };
    if (not (isAdmin or UserApproval.isApproved(approvalState, caller))) {
      Runtime.trap("Unauthorized: Only approved users can perform this action");
    };
  };

  public query ({ caller }) func listOrders(
    statusFilter : ?Common.OrderStatus,
    emergencyOnly : Bool,
  ) : async [OrderTypes.Order] {
    requireApprovedOrders(caller);
    OrderLib.listOrders(orders, statusFilter, emergencyOnly);
  };

  public query ({ caller }) func getOrder(id : Common.OrderId) : async ?OrderTypes.Order {
    requireApprovedOrders(caller);
    OrderLib.getOrder(orders, id);
  };

  public shared ({ caller }) func createOrder(
    clientName : Text,
    clientStore : Text,
    items : [OrderTypes.OrderItem],
    deadline : Common.Timestamp,
    emergency : Bool,
  ) : async OrderTypes.Order {
    requireApprovedOrders(caller);
    let id = nextOrderId.value;
    nextOrderId.value += 1;
    OrderLib.createOrder(orders, id, clientName, clientStore, items, deadline, emergency, Time.now());
  };

  public shared ({ caller }) func updateOrder(
    id : Common.OrderId,
    clientName : Text,
    clientStore : Text,
    items : [OrderTypes.OrderItem],
    deadline : Common.Timestamp,
    emergency : Bool,
  ) : async Bool {
    requireApprovedOrders(caller);
    OrderLib.updateOrder(orders, id, clientName, clientStore, items, deadline, emergency);
  };

  public shared ({ caller }) func deleteOrder(id : Common.OrderId) : async Bool {
    requireApprovedOrders(caller);
    // Soft-delete: refuse to delete shipped orders
    let order = OrderLib.getOrder(orders, id);
    switch (order) {
      case null { false };
      case (?o) {
        if (o.status == #Shipped) { Runtime.trap("Cannot delete a shipped order") };
        OrderLib.deleteOrder(orders, id);
      };
    };
  };

  public shared ({ caller }) func setOrderStatus(
    id : Common.OrderId,
    status : Common.OrderStatus,
  ) : async Bool {
    requireApprovedOrders(caller);
    OrderLib.setOrderStatus(orders, id, status);
  };
};
