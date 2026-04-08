import { Button } from "@/components/ui/AppButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";
import { OrderStatus } from "@/hooks/useBackend";
import {
  useCreateOrder,
  useDeleteOrder,
  useOrders,
  useProducts,
  useUpdateOrder,
  useUpdateOrderStatus,
} from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import type { Order, OrderId, OrderItem, ProductId } from "@/types";
import {
  AlertTriangle,
  Calendar,
  ChevronDown,
  Package,
  Pencil,
  Plus,
  Search,
  Store,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "Нова",
  [OrderStatus.Shipped]: "Испратена",
};

const STATUS_OPTIONS = [OrderStatus.Pending, OrderStatus.Shipped] as const;

function formatDeadline(ts: bigint) {
  const d = new Date(Number(ts));
  return d.toLocaleDateString("mk-MK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function deadlineUrgency(ts: bigint): "overdue" | "soon" | "ok" {
  const diff = Number(ts) - Date.now();
  if (diff < 0) return "overdue";
  if (diff < 2 * 24 * 3600 * 1000) return "soon";
  return "ok";
}

function statusClass(s: OrderStatus) {
  if (s === OrderStatus.Shipped) return "opacity-70";
  return "";
}

// ─── Order Form ───────────────────────────────────────────────────────────────

interface OrderFormState {
  clientName: string;
  clientStore: string;
  items: { productId: ProductId; productName: string; quantity: number }[];
  deadline: string;
  emergency: boolean;
  status: OrderStatus;
}

const EMPTY_FORM: OrderFormState = {
  clientName: "",
  clientStore: "",
  items: [],
  deadline: "",
  emergency: false,
  status: OrderStatus.Pending,
};

function toDateInput(ts: bigint): string {
  return new Date(Number(ts)).toISOString().split("T")[0];
}

function OrderFormModal({
  open,
  onClose,
  editOrder,
}: {
  open: boolean;
  onClose: () => void;
  editOrder?: Order;
}) {
  const { data: products = [] } = useProducts();
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();

  const [form, setForm] = useState<OrderFormState>(() =>
    editOrder
      ? {
          clientName: editOrder.clientName,
          clientStore: editOrder.clientStore,
          items: editOrder.items.map((i) => ({
            productId: i.productId,
            productName:
              products.find((p) => p.id === i.productId)?.name ??
              String(i.productId),
            quantity: Number(i.quantity),
          })),
          deadline: toDateInput(editOrder.deadline),
          emergency: editOrder.emergency,
          status: editOrder.status,
        }
      : EMPTY_FORM,
  );

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [qty, setQty] = useState(1);

  const addItem = () => {
    const prod = products.find((p) => String(p.id) === selectedProductId);
    if (!prod) return;
    const existing = form.items.find((i) => i.productId === prod.id);
    if (existing) {
      setForm((f) => ({
        ...f,
        items: f.items.map((i) =>
          i.productId === prod.id ? { ...i, quantity: i.quantity + qty } : i,
        ),
      }));
    } else {
      setForm((f) => ({
        ...f,
        items: [
          ...f.items,
          { productId: prod.id, productName: prod.name, quantity: qty },
        ],
      }));
    }
    setSelectedProductId("");
    setQty(1);
  };

  const removeItem = (productId: ProductId) => {
    setForm((f) => ({
      ...f,
      items: f.items.filter((i) => i.productId !== productId),
    }));
  };

  const isValid =
    form.clientName.trim().length > 0 &&
    form.clientStore.trim().length > 0 &&
    form.items.length > 0 &&
    form.deadline.length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    const items: OrderItem[] = form.items.map((i) => ({
      productId: i.productId,
      quantity: BigInt(i.quantity),
    }));
    const deadline = BigInt(new Date(form.deadline).getTime());

    if (editOrder) {
      await updateOrder.mutateAsync({
        id: editOrder.id,
        clientName: form.clientName.trim(),
        clientStore: form.clientStore.trim(),
        items,
        deadline,
        emergency: form.emergency,
      });
      toast.success("Нарачката е ажурирана");
    } else {
      await createOrder.mutateAsync({
        clientName: form.clientName.trim(),
        clientStore: form.clientStore.trim(),
        items,
        deadline,
        emergency: form.emergency,
      });
      toast.success("Нарачката е креирана");
    }
    onClose();
  };

  const isPending = createOrder.isPending || updateOrder.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editOrder ? "Уреди нарачка" : "Нова нарачка"}
      size="lg"
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isPending}
          >
            Откажи
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSubmit}
            disabled={!isValid}
            loading={isPending}
            data-ocid="order-form-submit"
          >
            {editOrder ? "Зачувај" : "Креирај нарачка"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Client name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="order-client-name"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            Клиент (ime и презиме) *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              id="order-client-name"
              placeholder="пр. Боби Христов"
              value={form.clientName}
              onChange={(e) =>
                setForm((f) => ({ ...f, clientName: e.target.value }))
              }
              className="w-full bg-card border border-input rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
              data-ocid="order-client-name-input"
            />
          </div>
        </div>

        {/* Client store */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="order-client-store"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            Продавница *
          </label>
          <div className="relative">
            <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              id="order-client-store"
              placeholder="пр. Продавница Алфа Мебел"
              value={form.clientStore}
              onChange={(e) =>
                setForm((f) => ({ ...f, clientStore: e.target.value }))
              }
              className="w-full bg-card border border-input rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
              data-ocid="order-client-store-input"
            />
          </div>
        </div>

        {/* Deadline + Emergency */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label
              htmlFor="order-deadline"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              Рок на испорака *
            </label>
            <input
              id="order-deadline"
              type="date"
              value={form.deadline}
              onChange={(e) =>
                setForm((f) => ({ ...f, deadline: e.target.value }))
              }
              className="w-full bg-card border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              data-ocid="order-deadline-input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Итно
            </span>
            <label
              className={cn(
                "flex items-center gap-2 cursor-pointer h-9 px-3 rounded-md border text-sm transition-smooth",
                form.emergency
                  ? "border-accent/60 bg-accent/10 text-accent"
                  : "border-input bg-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={form.emergency}
                onChange={(e) =>
                  setForm((f) => ({ ...f, emergency: e.target.checked }))
                }
                data-ocid="order-emergency-checkbox"
              />
              <AlertTriangle className="h-3.5 w-3.5" />
              ИТНО
            </label>
          </div>
        </div>

        {/* Model picker */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="order-model-select"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            Модели
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                id="order-model-select"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full appearance-none bg-card border border-input rounded-md px-3 py-2 text-sm text-foreground pr-8 focus:outline-none focus:ring-1 focus:ring-ring"
                data-ocid="order-model-select"
              >
                <option value="">— Изберете модел —</option>
                {products
                  .filter((p) => p.active !== false)
                  .map((p) => (
                    <option key={String(p.id)} value={String(p.id)}>
                      {p.name} ({p.parts.length}{" "}
                      {p.parts.length === 1 ? "дел" : "дела"})
                    </option>
                  ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="w-20 text-center bg-card border border-input rounded-md px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              aria-label="Количина"
              data-ocid="order-qty-input"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
              disabled={!selectedProductId}
              data-ocid="order-add-item-btn"
            >
              <Plus className="h-3.5 w-3.5" />
              Додај
            </Button>
          </div>

          {form.items.length > 0 && (
            <div className="flex flex-col gap-1 mt-1">
              {form.items.map((item) => (
                <div
                  key={String(item.productId)}
                  className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/40 border border-border"
                >
                  <div className="flex items-center gap-2">
                    <Package className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {item.productName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      × {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground hover:text-destructive transition-smooth"
                      aria-label="Отстрани"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {form.items.length === 0 && (
            <p className="text-xs text-muted-foreground italic mt-1">
              Нема додадени модели. Изберете и додајте барем еден.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirmModal({
  open,
  onClose,
  order,
  onConfirm,
  isDeleting,
}: {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirm: () => void;
  isDeleting: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Избриши нарачка"
      size="sm"
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Откажи
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            loading={isDeleting}
            data-ocid="order-delete-confirm-btn"
          >
            Избриши
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">
        Дали сте сигурни дека сакате да ја избришете нарачката за{" "}
        <span className="text-foreground font-medium">
          {order?.clientName} — {order?.clientStore}
        </span>
        ? Оваа акција не може да се врати.
      </p>
    </Modal>
  );
}

// ─── Status Dropdown ──────────────────────────────────────────────────────────

function StatusDropdown({
  order,
  onChange,
}: {
  order: Order;
  onChange: (status: OrderStatus) => void;
}) {
  return (
    <div className="relative">
      <select
        value={order.status}
        onChange={(e) => onChange(e.target.value as OrderStatus)}
        aria-label="Статус на нарачка"
        className="appearance-none bg-transparent border border-border rounded px-2 py-1 text-xs pr-6 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        data-ocid={`order-status-select-${order.id}`}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
    </div>
  );
}

// ─── Order Row ────────────────────────────────────────────────────────────────

function OrderRow({
  order,
  products,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  order: Order;
  products: { id: bigint; name: string }[];
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  onStatusChange: (id: OrderId, status: OrderStatus) => void;
}) {
  const urgency = deadlineUrgency(order.deadline);

  return (
    <tr
      className={cn(
        "border-b border-border hover:bg-muted/20 transition-smooth",
        statusClass(order.status),
      )}
      data-ocid={`order-row-${order.id}`}
    >
      {/* Client */}
      <td className="px-4 py-3">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate max-w-[160px]">
              {order.clientName}
            </span>
            {order.emergency && (
              <span
                className="badge-emergency shrink-0"
                data-ocid="emergency-badge"
              >
                <AlertTriangle className="inline h-3 w-3 mr-0.5" />
                ИТНО
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
            <Store className="h-3 w-3 shrink-0" />
            <span className="truncate max-w-[160px]">{order.clientStore}</span>
          </div>
        </div>
      </td>

      {/* Models */}
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {order.items.map((item) => {
            const prod = products.find((p) => p.id === item.productId);
            return (
              <span
                key={String(item.productId)}
                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
              >
                <Package className="h-3 w-3" />
                {prod?.name ?? "Непознат"} ×{Number(item.quantity)}
              </span>
            );
          })}
        </div>
      </td>

      {/* Deadline */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div
          className={cn(
            "flex items-center gap-1.5 text-sm",
            urgency === "overdue"
              ? "text-destructive"
              : urgency === "soon"
                ? "text-accent"
                : "text-muted-foreground",
          )}
        >
          <Calendar className="h-3.5 w-3.5" />
          {formatDeadline(order.deadline)}
          {urgency === "overdue" && (
            <span className="text-xs font-bold">(ЗАДОЦНЕТО)</span>
          )}
          {urgency === "soon" && (
            <span className="text-xs font-semibold">(НАСКОРО)</span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusDropdown
          order={order}
          onChange={(s) => onStatusChange(order.id, s)}
        />
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEdit(order)}
            aria-label="Уреди"
            data-ocid={`order-edit-btn-${order.id}`}
            className="h-7 w-7"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onDelete(order)}
            aria-label="Избриши"
            data-ocid={`order-delete-btn-${order.id}`}
            className="h-7 w-7 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

// ─── Orders Page ──────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders();
  const { data: products = [] } = useProducts();
  const updateOrderStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sort: emergency first, then earliest deadline
  const sortedOrders = useMemo(
    () =>
      [...orders].sort((a, b) => {
        if (a.emergency !== b.emergency) return a.emergency ? -1 : 1;
        return Number(a.deadline) - Number(b.deadline);
      }),
    [orders],
  );

  const filtered = useMemo(
    () =>
      sortedOrders.filter((o) => {
        const q = search.trim().toLowerCase();
        const matchSearch =
          !q ||
          o.clientName.toLowerCase().includes(q) ||
          o.clientStore.toLowerCase().includes(q) ||
          o.items.some((i) => {
            const prod = products.find((p) => p.id === i.productId);
            return prod?.name.toLowerCase().includes(q);
          });
        const matchStatus = filterStatus === "all" || o.status === filterStatus;
        return matchSearch && matchStatus;
      }),
    [sortedOrders, search, filterStatus, products],
  );

  const handleStatusChange = async (id: OrderId, status: OrderStatus) => {
    await updateOrderStatus.mutateAsync({ id, status });
    toast.success(`Статусот е ажуриран: ${STATUS_LABELS[status]}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteOrder.mutateAsync(deleteTarget.id);
    toast.success("Нарачката е избришана");
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const emergencyCount = orders.filter(
    (o) => o.emergency && o.status !== OrderStatus.Shipped,
  ).length;

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="px-6 py-4 border-b border-border bg-card flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold font-display text-foreground tracking-tight">
                Нарачки
              </h2>
              {emergencyCount > 0 && (
                <span
                  className="badge-emergency"
                  data-ocid="emergency-count-badge"
                >
                  <AlertTriangle className="inline h-3 w-3 mr-0.5" />
                  {emergencyCount} ИТНО
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Преглед и управување со сите нарачки
            </p>
          </div>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setShowCreate(true)}
            data-ocid="new-order-btn"
          >
            <Plus className="h-3.5 w-3.5" />
            Нова нарачка
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Пребарај клиент, продавница или модел..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Пребарај нарачки"
              className="w-full bg-card border border-input rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
              data-ocid="orders-search-input"
            />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as OrderStatus | "all")
              }
              aria-label="Филтрирај по статус"
              className="appearance-none bg-card border border-input rounded-md px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              data-ocid="orders-status-filter"
            >
              <option value="all">Сите статуси</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>

          <span className="text-xs text-muted-foreground ml-auto">
            {filtered.length} {filtered.length === 1 ? "нарачка" : "нарачки"}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="md" label="Се вчитуваат нарачките..." />
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 gap-4 text-center"
            data-ocid="orders-empty-state"
          >
            <div className="h-14 w-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Package className="h-7 w-7 text-primary/60" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {search || filterStatus !== "all"
                  ? "Нема нарачки со овие критериуми"
                  : "Нема нарачки сè уште"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {search || filterStatus !== "all"
                  ? "Обидете се со поинаков филтер."
                  : "Започнете со додавање на прва нарачка."}
              </p>
            </div>
            {!search && filterStatus === "all" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCreate(true)}
                data-ocid="orders-empty-new-btn"
              >
                <Plus className="h-3.5 w-3.5" />
                Нова нарачка
              </Button>
            )}
          </div>
        ) : (
          <table className="w-full data-table" data-ocid="orders-table">
            <thead>
              <tr className="border-b border-border bg-muted/30 sticky top-0">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Клиент / Продавница
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Модели
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Рок
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Акции
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <OrderRow
                  key={String(order.id)}
                  order={order}
                  products={products}
                  onEdit={setEditOrder}
                  onDelete={setDeleteTarget}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <OrderFormModal open={showCreate} onClose={() => setShowCreate(false)} />
      <OrderFormModal
        open={!!editOrder}
        onClose={() => setEditOrder(null)}
        editOrder={editOrder ?? undefined}
      />
      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        order={deleteTarget}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
