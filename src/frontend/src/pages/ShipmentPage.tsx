/**
 * ShipmentPage.tsx — Нов Товар
 * Two-panel layout: create new shipment on the left, existing shipments on the right.
 */

import { Button } from "@/components/ui/AppButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";
import { OrderStatus, TruckLoadStatus } from "@/hooks/useBackend";
import {
  useCreateTruckLoad,
  useOrders,
  useTruckLoads,
  useUpdateTruckLoadStatus,
} from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import type {
  Order,
  OrderId,
  TruckDimensions,
  TruckLoad,
  TruckLoadId,
} from "@/types";
import {
  AlertTriangle,
  Box,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Package,
  PackageCheck,
  Plus,
  RotateCcw,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDeadline(ts: bigint): string {
  const d = new Date(Number(ts));
  return d.toLocaleDateString("mk-MK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function daysUntil(ts: bigint): number {
  return Math.ceil((Number(ts) - Date.now()) / (1000 * 60 * 60 * 24));
}

function sortOrdersByPriority(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => {
    if (a.emergency !== b.emergency) return a.emergency ? -1 : 1;
    return Number(a.deadline) - Number(b.deadline);
  });
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const LOAD_STATUS_LABELS: Record<
  TruckLoadStatus,
  { label: string; cls: string }
> = {
  [TruckLoadStatus.Pending]: {
    label: "Нацрт",
    cls: "bg-muted text-muted-foreground border-border",
  },
  [TruckLoadStatus.Shipped]: {
    label: "Испратено",
    cls: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  },
};

function StatusBadge({ status }: { status: TruckLoadStatus }) {
  const { label, cls } = LOAD_STATUS_LABELS[status] ?? {
    label: String(status),
    cls: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border",
        cls,
      )}
    >
      {status === TruckLoadStatus.Shipped && (
        <CheckCircle2 className="h-3 w-3" />
      )}
      {label}
    </span>
  );
}

// ─── Order Detail Row ─────────────────────────────────────────────────────────

function OrderDetailRow({ order }: { order: Order }) {
  const days = daysUntil(order.deadline);
  const urgentColor =
    days <= 1
      ? "text-destructive"
      : days <= 3
        ? "text-accent"
        : "text-muted-foreground";

  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 px-3 py-2 rounded border",
        order.emergency
          ? "border-accent/30 bg-accent/5"
          : "border-border bg-muted/20",
      )}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2">
          {order.emergency && (
            <span className="badge-emergency flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Итно
            </span>
          )}
          <span className="text-sm font-semibold text-foreground truncate">
            {order.clientName}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {order.clientStore}
        </span>
        <div className="flex flex-wrap gap-2 mt-0.5">
          {order.items.map((item) => (
            <span
              key={String(item.productId)}
              className="text-xs text-muted-foreground"
            >
              ×{Number(item.quantity)}
            </span>
          ))}
        </div>
      </div>
      <div
        className={cn("flex items-center gap-1 text-xs shrink-0", urgentColor)}
      >
        <Calendar className="h-3 w-3" />
        {formatDeadline(order.deadline)}
        {days <= 3 && (
          <span className="font-semibold">
            ({days <= 0 ? "Денес!" : `${days}д`})
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Truck Load Card ──────────────────────────────────────────────────────────

function TruckLoadCard({
  load,
  orders,
  onShip,
  onRevert,
  onOpenVisualizer,
}: {
  load: TruckLoad;
  orders: Order[];
  onShip: (id: TruckLoadId) => void;
  onRevert: (id: TruckLoadId) => void;
  onOpenVisualizer: (id: TruckLoadId) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isShipped = load.status === TruckLoadStatus.Shipped;

  const loadOrders = sortOrdersByPriority(
    orders.filter((o) => load.orderIds.includes(o.id)),
  );

  const { lengthCm, widthCm, heightCm } = load.truckDimensions;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card transition-smooth",
        isShipped
          ? "border-border opacity-80"
          : "border-border card-interactive",
      )}
      data-ocid={`truck-load-card-${load.id}`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Truck className="h-4 w-4 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground font-display">
              Товар #{String(load.id)}
            </span>
            <StatusBadge status={load.status} />
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Box className="h-3 w-3" />
              {Number(lengthCm)}×{Number(widthCm)}×{Number(heightCm)} cm
            </span>
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {load.orderIds.length}{" "}
              {load.orderIds.length === 1 ? "нарачка" : "нарачки"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isShipped && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenVisualizer(load.id)}
                data-ocid={`visualize-load-${load.id}`}
              >
                <Box className="h-3.5 w-3.5" />
                Товарење
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onShip(load.id)}
                data-ocid={`ship-load-${load.id}`}
              >
                <PackageCheck className="h-3.5 w-3.5" />
                Испрати
              </Button>
            </>
          )}
          {isShipped && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRevert(load.id)}
              data-ocid={`revert-load-${load.id}`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Поврати
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Склопи" : "Прошири"}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border px-4 py-3 flex flex-col gap-2">
          {loadOrders.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2 text-center">
              Нема нарачки во овој товар.
            </p>
          ) : (
            loadOrders.map((order) => (
              <OrderDetailRow key={String(order.id)} order={order} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Create Truck Load Panel ──────────────────────────────────────────────────

const EMPTY_DIMS = { lengthCm: 620, widthCm: 240, heightCm: 250 };

function CreateTruckLoadPanel({
  orders,
  onCreated,
}: {
  orders: Order[];
  onCreated: () => void;
}) {
  const createMutation = useCreateTruckLoad();

  const [dims, setDims] = useState(EMPTY_DIMS);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set(),
  );

  const prioritized = sortOrdersByPriority(
    orders.filter((o) => o.status === OrderStatus.Pending),
  );

  function toggleOrder(id: OrderId) {
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      const key = String(id);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleDimChange(field: keyof typeof dims, val: string) {
    const n = Number.parseInt(val, 10);
    if (!Number.isNaN(n) && n > 0) setDims((d) => ({ ...d, [field]: n }));
  }

  async function handleSubmit() {
    if (selectedOrderIds.size === 0) {
      toast.error("Изберете барем една нарачка");
      return;
    }
    const truckDimensions: TruckDimensions = {
      lengthCm: BigInt(dims.lengthCm),
      widthCm: BigInt(dims.widthCm),
      heightCm: BigInt(dims.heightCm),
    };
    const orderIds: OrderId[] = [...selectedOrderIds].map((s) => BigInt(s));
    await createMutation.mutateAsync({ truckDimensions, orderIds });
    toast.success("Товарот е создаден");
    setDims(EMPTY_DIMS);
    setSelectedOrderIds(new Set());
    onCreated();
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Truck Dimensions */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5" />
          Димензии на камион (cm)
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["lengthCm", "Должина"],
              ["widthCm", "Ширина"],
              ["heightCm", "Висина"],
            ] as const
          ).map(([field, label]) => (
            <div key={field} className="flex flex-col gap-1">
              <label
                htmlFor={`dim-${field}`}
                className="text-xs text-muted-foreground"
              >
                {label}
              </label>
              <div className="relative">
                <input
                  id={`dim-${field}`}
                  type="number"
                  min={1}
                  value={dims[field]}
                  onChange={(e) => handleDimChange(field, e.target.value)}
                  className="w-full bg-card border border-input rounded-md px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  data-ocid={`dim-${field}-input`}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  cm
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/5 border border-primary/20 text-xs text-primary">
          <Box className="h-3.5 w-3.5 shrink-0" />
          <span className="font-mono font-semibold">
            {dims.lengthCm} × {dims.widthCm} × {dims.heightCm} cm
          </span>
        </div>
      </div>

      {/* Order Selection */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          <Package className="h-3.5 w-3.5" />
          Нарачки — по приоритет
          {selectedOrderIds.size > 0 && (
            <span className="ml-auto text-primary font-semibold normal-case">
              {selectedOrderIds.size} избрано
            </span>
          )}
        </p>

        {prioritized.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
            Нема нарачки на чекање
          </div>
        ) : (
          <div
            className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1"
            data-ocid="order-selection-list"
          >
            {prioritized.map((order) => {
              const selected = selectedOrderIds.has(String(order.id));
              const days = daysUntil(order.deadline);
              return (
                <button
                  key={String(order.id)}
                  type="button"
                  onClick={() => toggleOrder(order.id)}
                  className={cn(
                    "w-full flex items-start gap-3 px-3 py-2.5 rounded border text-left transition-smooth",
                    selected
                      ? "border-primary/50 bg-primary/8"
                      : order.emergency
                        ? "border-accent/30 bg-accent/5 hover:border-accent/50"
                        : "border-border bg-muted/20 hover:border-border/80",
                  )}
                  data-ocid={`select-order-${order.id}`}
                >
                  <div
                    className={cn(
                      "mt-0.5 h-4 w-4 rounded border-2 shrink-0 flex items-center justify-center transition-smooth",
                      selected ? "border-primary bg-primary" : "border-border",
                    )}
                  >
                    {selected && (
                      <svg
                        className="h-2.5 w-2.5 text-primary-foreground"
                        fill="none"
                        viewBox="0 0 10 10"
                        aria-hidden="true"
                      >
                        <path
                          d="M1.5 5L4 7.5 8.5 2.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {order.emergency && (
                        <span className="badge-emergency flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Итно
                        </span>
                      )}
                      <span className="text-sm font-semibold text-foreground truncate">
                        {order.clientName}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {order.clientStore}
                    </span>
                  </div>

                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs shrink-0",
                      days <= 1
                        ? "text-destructive"
                        : days <= 3
                          ? "text-accent"
                          : "text-muted-foreground",
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    {days <= 0
                      ? "Денес!"
                      : days === 1
                        ? "Утре"
                        : `${days} дена`}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Button
        variant="default"
        onClick={handleSubmit}
        loading={createMutation.isPending}
        disabled={selectedOrderIds.size === 0}
        data-ocid="create-load-submit"
        className="w-full"
      >
        <Plus className="h-4 w-4" />
        Создај товар
      </Button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface ShipmentPageProps {
  onOpenVisualizer?: (truckLoadId: TruckLoadId) => void;
}

export default function ShipmentPage({ onOpenVisualizer }: ShipmentPageProps) {
  const { data: truckLoads = [], isLoading: loadsLoading } = useTruckLoads();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const updateStatus = useUpdateTruckLoadStatus();

  const [filter, setFilter] = useState<"all" | "active" | "shipped">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isLoading = loadsLoading || ordersLoading;

  async function handleShip(id: TruckLoadId) {
    await updateStatus.mutateAsync({ id, status: TruckLoadStatus.Shipped });
    toast.success("Товарот е означен како испратен");
  }

  async function handleRevert(id: TruckLoadId) {
    await updateStatus.mutateAsync({ id, status: TruckLoadStatus.Pending });
    toast.success("Товарот е вратен во нацрт");
  }

  function handleOpenVisualizer(id: TruckLoadId) {
    if (onOpenVisualizer) {
      onOpenVisualizer(id);
    } else {
      toast.info("Отворете го табот 3Д Визуализација за деталниот товар.");
    }
  }

  const filtered = truckLoads.filter((load) => {
    if (filter === "active") return load.status !== TruckLoadStatus.Shipped;
    if (filter === "shipped") return load.status === TruckLoadStatus.Shipped;
    return true;
  });

  const pendingOrderCount = orders.filter(
    (o) => o.status === OrderStatus.Pending,
  ).length;

  return (
    <div className="flex flex-col gap-0 min-h-full">
      {/* Page header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold font-display text-foreground tracking-tight">
              Нов Товар
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Планирање и управување со пратки и товарни листи
            </p>
          </div>
          <Button
            variant="default"
            onClick={() => setShowCreateModal(true)}
            data-ocid="new-load-btn"
          >
            <Plus className="h-4 w-4" />
            Нов товар
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          {[
            {
              label: "Вкупно товари",
              value: truckLoads.length,
              icon: Truck,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              label: "Активни",
              value: truckLoads.filter(
                (l) => l.status !== TruckLoadStatus.Shipped,
              ).length,
              icon: Clock,
              color: "text-accent",
              bg: "bg-accent/10",
            },
            {
              label: "Испратени",
              value: truckLoads.filter(
                (l) => l.status === TruckLoadStatus.Shipped,
              ).length,
              icon: CheckCircle2,
              color: "text-chart-2",
              bg: "bg-chart-2/10",
            },
            {
              label: "Нарачки на чекање",
              value: pendingOrderCount,
              icon: Package,
              color: "text-muted-foreground",
              bg: "bg-muted/40",
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/20"
            >
              <div className={cn("rounded p-1", bg)}>
                <Icon className={cn("h-3.5 w-3.5", color)} />
              </div>
              <span className="text-xs text-muted-foreground">{label}:</span>
              <span className={cn("text-sm font-bold font-mono", color)}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-background border-b border-border px-6 flex items-center gap-1 pt-2">
        {(
          [
            { id: "all", label: "Сите" },
            { id: "active", label: "Активни" },
            { id: "shipped", label: "Испратени" },
          ] as const
        ).map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              filter === tab.id ? "tab-active" : "tab-inactive",
              "text-sm",
            )}
            data-ocid={`filter-tab-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 bg-background px-6 py-5">
        {isLoading ? (
          <LoadingSpinner size="lg" fullPage label="Се вчитуваат пратките..." />
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-4 py-16 text-center"
            data-ocid="empty-state-loads"
          >
            <div className="h-16 w-16 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
              <Truck className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">
                {filter === "shipped" ? "Нема испратени товари" : "Нема товари"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {filter === "all" || filter === "active"
                  ? "Создадете нов товар со кликање на Нов товар."
                  : "Испратените товари ќе се прикажат овде."}
              </p>
            </div>
            {(filter === "all" || filter === "active") && (
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(true)}
                data-ocid="empty-new-load-btn"
              >
                <Plus className="h-4 w-4" />
                Нов товар
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-4xl">
            {filtered.map((load) => (
              <TruckLoadCard
                key={String(load.id)}
                load={load}
                orders={orders}
                onShip={handleShip}
                onRevert={handleRevert}
                onOpenVisualizer={handleOpenVisualizer}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Нов Товар"
        size="lg"
      >
        <CreateTruckLoadPanel
          orders={orders}
          onCreated={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
}
