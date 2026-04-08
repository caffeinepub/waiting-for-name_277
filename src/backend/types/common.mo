module {
  public type Timestamp = Int;
  public type ProductId = Nat;
  public type PartId = Nat;
  public type OrderId = Nat;
  public type TruckLoadId = Nat;

  public type BottomSide = {
    #Top;
    #Bottom;
    #Front;
    #Back;
    #Left;
    #Right;
  };

  public type OrderStatus = {
    #Pending;
    #Shipped;
  };

  public type TruckLoadStatus = {
    #Pending;
    #Shipped;
  };
};
