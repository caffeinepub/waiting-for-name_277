import Common "common";

module {
  public type Part = {
    id : Common.PartId;
    name : Text;
    lengthCm : Nat;
    widthCm : Nat;
    heightCm : Nat;
    weightKg : Float;
    bottomSide : Common.BottomSide;
  };

  public type Product = {
    id : Common.ProductId;
    name : Text;
    active : Bool;
    parts : [Part];
  };
};
