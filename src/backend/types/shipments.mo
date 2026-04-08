import Common "common";

module {
  public type TruckDimensions = {
    lengthCm : Nat;
    widthCm : Nat;
    heightCm : Nat;
  };

  public type PartPlacement = {
    partId : Common.PartId;
    productId : Common.ProductId;
    orderId : Common.OrderId;
    posX : Float;
    posY : Float;
    posZ : Float;
    rotX : Float;
    rotY : Float;
    rotZ : Float;
    rotW : Float;
  };

  public type TruckLoad = {
    id : Common.TruckLoadId;
    truckDimensions : TruckDimensions;
    orderIds : [Common.OrderId];
    status : Common.TruckLoadStatus;
    loadingScheme : [PartPlacement];
    createdAt : Common.Timestamp;
  };
};
