// ─── Re-export backend types for use in UI ────────────────────────────────────
export type {
  ApprovalStatus,
  BottomSide,
  Order,
  OrderId,
  OrderItem,
  OrderStatus,
  Part,
  PartId,
  PartPlacement,
  Product,
  ProductId,
  Timestamp,
  TruckDimensions,
  TruckLoad,
  TruckLoadId,
  UserApprovalInfo,
} from "@/backend";

// ─── UI-only helpers ──────────────────────────────────────────────────────────

export type TabId =
  | "approval"
  | "products"
  | "orders"
  | "shipment"
  | "visualizer";

export interface NavTab {
  id: TabId;
  label: string;
  adminOnly: boolean;
}

export const NAV_TABS: NavTab[] = [
  { id: "approval", label: "Одобрување", adminOnly: true },
  { id: "products", label: "Модели", adminOnly: false },
  { id: "orders", label: "Нарачки", adminOnly: false },
  { id: "shipment", label: "Нов Товар", adminOnly: false },
  { id: "visualizer", label: "3Д Визуализација", adminOnly: false },
];
