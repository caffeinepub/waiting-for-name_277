import Common "common";

module {
  public type OrderItem = {
    productId : Common.ProductId;
    quantity : Nat;
  };

  public type Order = {
    id : Common.OrderId;
    clientName : Text;
    clientStore : Text;
    items : [OrderItem];
    deadline : Common.Timestamp;
    emergency : Bool;
    status : Common.OrderStatus;
    createdAt : Common.Timestamp;
  };
};
