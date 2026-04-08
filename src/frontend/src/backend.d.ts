import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Part {
    id: PartId;
    lengthCm: bigint;
    widthCm: bigint;
    bottomSide: BottomSide;
    heightCm: bigint;
    name: string;
    weightKg: number;
}
export type PartId = bigint;
export type TruckLoadId = bigint;
export type Timestamp = bigint;
export interface TruckLoad {
    id: TruckLoadId;
    status: TruckLoadStatus;
    loadingScheme: Array<PartPlacement>;
    truckDimensions: TruckDimensions;
    createdAt: Timestamp;
    orderIds: Array<OrderId>;
}
export type OrderId = bigint;
export interface OrderItem {
    productId: ProductId;
    quantity: bigint;
}
export interface PartPlacement {
    posX: number;
    posY: number;
    posZ: number;
    rotW: number;
    rotX: number;
    rotY: number;
    rotZ: number;
    productId: ProductId;
    orderId: OrderId;
    partId: PartId;
}
export interface Order {
    id: OrderId;
    status: OrderStatus;
    emergency: boolean;
    clientName: string;
    createdAt: Timestamp;
    clientStore: string;
    deadline: Timestamp;
    items: Array<OrderItem>;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface TruckDimensions {
    lengthCm: bigint;
    widthCm: bigint;
    heightCm: bigint;
}
export type ProductId = bigint;
export interface Product {
    id: ProductId;
    active: boolean;
    name: string;
    parts: Array<Part>;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum BottomSide {
    Top = "Top",
    Back = "Back",
    Left = "Left",
    Right = "Right",
    Front = "Front",
    Bottom = "Bottom"
}
export enum OrderStatus {
    Shipped = "Shipped",
    Pending = "Pending"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPart(productId: ProductId, name: string, lengthCm: bigint, widthCm: bigint, heightCm: bigint, weightKg: number, bottomSide: BottomSide): Promise<Part | null>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bootstrapAdmin(): Promise<void>;
    createOrder(clientName: string, clientStore: string, items: Array<OrderItem>, deadline: Timestamp, emergency: boolean): Promise<Order>;
    createProduct(name: string): Promise<Product>;
    createTruckLoad(truckDimensions: TruckDimensions, orderIds: Array<OrderId>): Promise<TruckLoad>;
    deactivateProduct(id: ProductId): Promise<boolean>;
    deleteOrder(id: OrderId): Promise<boolean>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(id: OrderId): Promise<Order | null>;
    getPrioritizedOrderIds(): Promise<Array<OrderId>>;
    getProduct(id: ProductId): Promise<Product | null>;
    getTruckLoad(id: TruckLoadId): Promise<TruckLoad | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listOrders(statusFilter: OrderStatus | null, emergencyOnly: boolean): Promise<Array<Order>>;
    listProducts(): Promise<Array<Product>>;
    listTruckLoads(): Promise<Array<TruckLoad>>;
    optimizeTruckLoad(id: TruckLoadId): Promise<boolean>;
    removePart(productId: ProductId, partId: PartId): Promise<boolean>;
    requestApproval(): Promise<void>;
    saveLoadingScheme(id: TruckLoadId, placements: Array<PartPlacement>): Promise<boolean>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setOrderStatus(id: OrderId, status: OrderStatus): Promise<boolean>;
    setTruckLoadStatus(id: TruckLoadId, status: TruckLoadStatus): Promise<boolean>;
    updateOrder(id: OrderId, clientName: string, clientStore: string, items: Array<OrderItem>, deadline: Timestamp, emergency: boolean): Promise<boolean>;
    updatePart(productId: ProductId, partId: PartId, name: string, lengthCm: bigint, widthCm: bigint, heightCm: bigint, weightKg: number, bottomSide: BottomSide): Promise<boolean>;
    updateProduct(id: ProductId, name: string, active: boolean, parts: Array<Part>): Promise<boolean>;
}
