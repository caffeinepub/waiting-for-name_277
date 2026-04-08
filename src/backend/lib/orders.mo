import List "mo:core/List";
import Common "../types/common";
import OrderTypes "../types/orders";

module {
  public type OrderState = List.List<OrderTypes.Order>;

  public func listOrders(
    state : OrderState,
    statusFilter : ?Common.OrderStatus,
    emergencyOnly : Bool,
  ) : [OrderTypes.Order] {
    state.filter(func(o) {
      let statusMatch = switch (statusFilter) {
        case null { true };
        case (?s) { o.status == s };
      };
      let emergencyMatch = if emergencyOnly { o.emergency } else { true };
      statusMatch and emergencyMatch;
    }).toArray();
  };

  public func getOrder(state : OrderState, id : Common.OrderId) : ?OrderTypes.Order {
    state.find(func(o) { o.id == id });
  };

  public func createOrder(
    state : OrderState,
    nextId : Nat,
    clientName : Text,
    clientStore : Text,
    items : [OrderTypes.OrderItem],
    deadline : Common.Timestamp,
    emergency : Bool,
    now : Common.Timestamp,
  ) : OrderTypes.Order {
    let order : OrderTypes.Order = {
      id = nextId;
      clientName = clientName;
      clientStore = clientStore;
      items = items;
      deadline = deadline;
      emergency = emergency;
      status = #Pending;
      createdAt = now;
    };
    state.add(order);
    order;
  };

  public func updateOrder(
    state : OrderState,
    id : Common.OrderId,
    clientName : Text,
    clientStore : Text,
    items : [OrderTypes.OrderItem],
    deadline : Common.Timestamp,
    emergency : Bool,
  ) : Bool {
    let idx = state.findIndex(func(o) { o.id == id });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = state.at(i);
        state.put(i, { existing with clientName = clientName; clientStore = clientStore; items = items; deadline = deadline; emergency = emergency });
        true;
      };
    };
  };

  public func deleteOrder(state : OrderState, id : Common.OrderId) : Bool {
    let idx = state.findIndex(func(o) { o.id == id });
    switch (idx) {
      case null { false };
      case (?_i) {
        // Soft-delete: only remove if pending; if shipped keep but mark as deleted not applicable here.
        // We simply filter out the order (it should not be deleted if shipped per requirements).
        // The mixin checks status before calling.
        let sizeBefore = state.size();
        let filtered = state.filter(func(o) { o.id != id });
        state.clear();
        state.append(filtered);
        state.size() < sizeBefore;
      };
    };
  };

  public func setOrderStatus(
    state : OrderState,
    id : Common.OrderId,
    status : Common.OrderStatus,
  ) : Bool {
    let idx = state.findIndex(func(o) { o.id == id });
    switch (idx) {
      case null { false };
      case (?i) {
        let existing = state.at(i);
        state.put(i, { existing with status = status });
        true;
      };
    };
  };
};
