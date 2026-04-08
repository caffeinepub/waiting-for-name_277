import { c as createLucideIcon, u as useOrders, a as useProducts, b as useUpdateOrderStatus, d as useDeleteOrder, r as reactExports, O as OrderStatus, j as jsxRuntimeExports, B as Button, L as LoadingSpinner, e as cn, f as useCreateOrder, g as useUpdateOrder, U as User } from "./index-CbpfYT_H.js";
import { P as Plus, a as Package, M as Modal } from "./Modal-BLXGrGdJ.js";
import { T as TriangleAlert, C as ChevronDown, u as ue, X } from "./index-5CA7VSEo.js";
import { S as Search, P as Pencil, T as Trash2 } from "./trash-2-ohZrNdQN.js";
import { C as Calendar } from "./calendar-ClG5HqOx.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7", key: "ztvudi" }],
  ["path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", key: "1b2hhj" }],
  ["path", { d: "M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4", key: "2ebpfo" }],
  ["path", { d: "M2 7h20", key: "1fcdvo" }],
  [
    "path",
    {
      d: "M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7",
      key: "6c3vgh"
    }
  ]
];
const Store = createLucideIcon("store", __iconNode);
const STATUS_LABELS = {
  [OrderStatus.Pending]: "Нова",
  [OrderStatus.Shipped]: "Испратена"
};
const STATUS_OPTIONS = [OrderStatus.Pending, OrderStatus.Shipped];
function formatDeadline(ts) {
  const d = new Date(Number(ts));
  return d.toLocaleDateString("mk-MK", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function deadlineUrgency(ts) {
  const diff = Number(ts) - Date.now();
  if (diff < 0) return "overdue";
  if (diff < 2 * 24 * 3600 * 1e3) return "soon";
  return "ok";
}
function statusClass(s) {
  if (s === OrderStatus.Shipped) return "opacity-70";
  return "";
}
const EMPTY_FORM = {
  clientName: "",
  clientStore: "",
  items: [],
  deadline: "",
  emergency: false,
  status: OrderStatus.Pending
};
function toDateInput(ts) {
  return new Date(Number(ts)).toISOString().split("T")[0];
}
function OrderFormModal({
  open,
  onClose,
  editOrder
}) {
  const { data: products = [] } = useProducts();
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const [form, setForm] = reactExports.useState(
    () => editOrder ? {
      clientName: editOrder.clientName,
      clientStore: editOrder.clientStore,
      items: editOrder.items.map((i) => {
        var _a;
        return {
          productId: i.productId,
          productName: ((_a = products.find((p) => p.id === i.productId)) == null ? void 0 : _a.name) ?? String(i.productId),
          quantity: Number(i.quantity)
        };
      }),
      deadline: toDateInput(editOrder.deadline),
      emergency: editOrder.emergency,
      status: editOrder.status
    } : EMPTY_FORM
  );
  const [selectedProductId, setSelectedProductId] = reactExports.useState("");
  const [qty, setQty] = reactExports.useState(1);
  const addItem = () => {
    const prod = products.find((p) => String(p.id) === selectedProductId);
    if (!prod) return;
    const existing = form.items.find((i) => i.productId === prod.id);
    if (existing) {
      setForm((f) => ({
        ...f,
        items: f.items.map(
          (i) => i.productId === prod.id ? { ...i, quantity: i.quantity + qty } : i
        )
      }));
    } else {
      setForm((f) => ({
        ...f,
        items: [
          ...f.items,
          { productId: prod.id, productName: prod.name, quantity: qty }
        ]
      }));
    }
    setSelectedProductId("");
    setQty(1);
  };
  const removeItem = (productId) => {
    setForm((f) => ({
      ...f,
      items: f.items.filter((i) => i.productId !== productId)
    }));
  };
  const isValid = form.clientName.trim().length > 0 && form.clientStore.trim().length > 0 && form.items.length > 0 && form.deadline.length > 0;
  const handleSubmit = async () => {
    if (!isValid) return;
    const items = form.items.map((i) => ({
      productId: i.productId,
      quantity: BigInt(i.quantity)
    }));
    const deadline = BigInt(new Date(form.deadline).getTime());
    if (editOrder) {
      await updateOrder.mutateAsync({
        id: editOrder.id,
        clientName: form.clientName.trim(),
        clientStore: form.clientStore.trim(),
        items,
        deadline,
        emergency: form.emergency
      });
      ue.success("Нарачката е ажурирана");
    } else {
      await createOrder.mutateAsync({
        clientName: form.clientName.trim(),
        clientStore: form.clientStore.trim(),
        items,
        deadline,
        emergency: form.emergency
      });
      ue.success("Нарачката е креирана");
    }
    onClose();
  };
  const isPending = createOrder.isPending || updateOrder.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose,
      title: editOrder ? "Уреди нарачка" : "Нова нарачка",
      size: "lg",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: onClose,
            disabled: isPending,
            children: "Откажи"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "default",
            size: "sm",
            onClick: handleSubmit,
            disabled: !isValid,
            loading: isPending,
            "data-ocid": "order-form-submit",
            children: editOrder ? "Зачувај" : "Креирај нарачка"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "order-client-name",
              className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
              children: "Клиент (ime и презиме) *"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "order-client-name",
                placeholder: "пр. Боби Христов",
                value: form.clientName,
                onChange: (e) => setForm((f) => ({ ...f, clientName: e.target.value })),
                className: "w-full bg-card border border-input rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring",
                "data-ocid": "order-client-name-input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "order-client-store",
              className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
              children: "Продавница *"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "order-client-store",
                placeholder: "пр. Продавница Алфа Мебел",
                value: form.clientStore,
                onChange: (e) => setForm((f) => ({ ...f, clientStore: e.target.value })),
                className: "w-full bg-card border border-input rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring",
                "data-ocid": "order-client-store-input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "order-deadline",
                className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
                children: "Рок на испорака *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "order-deadline",
                type: "date",
                value: form.deadline,
                onChange: (e) => setForm((f) => ({ ...f, deadline: e.target.value })),
                className: "w-full bg-card border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                "data-ocid": "order-deadline-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: "Итно" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: cn(
                  "flex items-center gap-2 cursor-pointer h-9 px-3 rounded-md border text-sm transition-smooth",
                  form.emergency ? "border-accent/60 bg-accent/10 text-accent" : "border-input bg-transparent text-muted-foreground hover:text-foreground"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      className: "sr-only",
                      checked: form.emergency,
                      onChange: (e) => setForm((f) => ({ ...f, emergency: e.target.checked })),
                      "data-ocid": "order-emergency-checkbox"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
                  "ИТНО"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "order-model-select",
              className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
              children: "Модели"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  id: "order-model-select",
                  value: selectedProductId,
                  onChange: (e) => setSelectedProductId(e.target.value),
                  className: "w-full appearance-none bg-card border border-input rounded-md px-3 py-2 text-sm text-foreground pr-8 focus:outline-none focus:ring-1 focus:ring-ring",
                  "data-ocid": "order-model-select",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Изберете модел —" }),
                    products.filter((p) => p.active !== false).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: String(p.id), children: [
                      p.name,
                      " (",
                      p.parts.length,
                      " ",
                      p.parts.length === 1 ? "дел" : "дела",
                      ")"
                    ] }, String(p.id)))
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                min: 1,
                value: qty,
                onChange: (e) => setQty(Math.max(1, Number(e.target.value))),
                className: "w-20 text-center bg-card border border-input rounded-md px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                "aria-label": "Количина",
                "data-ocid": "order-qty-input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: addItem,
                disabled: !selectedProductId,
                "data-ocid": "order-add-item-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                  "Додај"
                ]
              }
            )
          ] }),
          form.items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1 mt-1", children: form.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between px-3 py-2 rounded-md bg-muted/40 border border-border",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: item.productName })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                    "× ",
                    item.quantity
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeItem(item.productId),
                      className: "text-muted-foreground hover:text-destructive transition-smooth",
                      "aria-label": "Отстрани",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
                    }
                  )
                ] })
              ]
            },
            String(item.productId)
          )) }),
          form.items.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic mt-1", children: "Нема додадени модели. Изберете и додајте барем еден." })
        ] })
      ] })
    }
  );
}
function DeleteConfirmModal({
  open,
  onClose,
  order,
  onConfirm,
  isDeleting
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose,
      title: "Избриши нарачка",
      size: "sm",
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: onClose,
            disabled: isDeleting,
            children: "Откажи"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "destructive",
            size: "sm",
            onClick: onConfirm,
            loading: isDeleting,
            "data-ocid": "order-delete-confirm-btn",
            children: "Избриши"
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Дали сте сигурни дека сакате да ја избришете нарачката за",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-medium", children: [
          order == null ? void 0 : order.clientName,
          " — ",
          order == null ? void 0 : order.clientStore
        ] }),
        "? Оваа акција не може да се врати."
      ] })
    }
  );
}
function StatusDropdown({
  order,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "select",
      {
        value: order.status,
        onChange: (e) => onChange(e.target.value),
        "aria-label": "Статус на нарачка",
        className: "appearance-none bg-transparent border border-border rounded px-2 py-1 text-xs pr-6 text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer",
        "data-ocid": `order-status-select-${order.id}`,
        children: STATUS_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: STATUS_LABELS[s] }, s))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" })
  ] });
}
function OrderRow({
  order,
  products,
  onEdit,
  onDelete,
  onStatusChange
}) {
  const urgency = deadlineUrgency(order.deadline);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: cn(
        "border-b border-border hover:bg-muted/20 transition-smooth",
        statusClass(order.status)
      ),
      "data-ocid": `order-row-${order.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground truncate max-w-[160px]", children: order.clientName }),
            order.emergency && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "badge-emergency shrink-0",
                "data-ocid": "emergency-badge",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "inline h-3 w-3 mr-0.5" }),
                  "ИТНО"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-0.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3 w-3 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[160px]", children: order.clientStore })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: order.items.map((item) => {
          const prod = products.find((p) => p.id === item.productId);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3 w-3" }),
                (prod == null ? void 0 : prod.name) ?? "Непознат",
                " ×",
                Number(item.quantity)
              ]
            },
            String(item.productId)
          );
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "flex items-center gap-1.5 text-sm",
              urgency === "overdue" ? "text-destructive" : urgency === "soon" ? "text-accent" : "text-muted-foreground"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
              formatDeadline(order.deadline),
              urgency === "overdue" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "(ЗАДОЦНЕТО)" }),
              urgency === "soon" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: "(НАСКОРО)" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatusDropdown,
          {
            order,
            onChange: (s) => onStatusChange(order.id, s)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              onClick: () => onEdit(order),
              "aria-label": "Уреди",
              "data-ocid": `order-edit-btn-${order.id}`,
              className: "h-7 w-7",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              onClick: () => onDelete(order),
              "aria-label": "Избриши",
              "data-ocid": `order-delete-btn-${order.id}`,
              className: "h-7 w-7 hover:text-destructive",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ] }) })
      ]
    }
  );
}
function OrdersPage() {
  const { data: orders = [], isLoading } = useOrders();
  const { data: products = [] } = useProducts();
  const updateOrderStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const [search, setSearch] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [editOrder, setEditOrder] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const sortedOrders = reactExports.useMemo(
    () => [...orders].sort((a, b) => {
      if (a.emergency !== b.emergency) return a.emergency ? -1 : 1;
      return Number(a.deadline) - Number(b.deadline);
    }),
    [orders]
  );
  const filtered = reactExports.useMemo(
    () => sortedOrders.filter((o) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || o.clientName.toLowerCase().includes(q) || o.clientStore.toLowerCase().includes(q) || o.items.some((i) => {
        const prod = products.find((p) => p.id === i.productId);
        return prod == null ? void 0 : prod.name.toLowerCase().includes(q);
      });
      const matchStatus = filterStatus === "all" || o.status === filterStatus;
      return matchSearch && matchStatus;
    }),
    [sortedOrders, search, filterStatus, products]
  );
  const handleStatusChange = async (id, status) => {
    await updateOrderStatus.mutateAsync({ id, status });
    ue.success(`Статусот е ажуриран: ${STATUS_LABELS[status]}`);
  };
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteOrder.mutateAsync(deleteTarget.id);
    ue.success("Нарачката е избришана");
    setIsDeleting(false);
    setDeleteTarget(null);
  };
  const emergencyCount = orders.filter(
    (o) => o.emergency && o.status !== OrderStatus.Shipped
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border bg-card flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold font-display text-foreground tracking-tight", children: "Нарачки" }),
            emergencyCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "badge-emergency",
                "data-ocid": "emergency-count-badge",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "inline h-3 w-3 mr-0.5" }),
                  emergencyCount,
                  " ИТНО"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Преглед и управување со сите нарачки" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "default",
            size: "sm",
            onClick: () => setShowCreate(true),
            "data-ocid": "new-order-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              "Нова нарачка"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px] max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Пребарај клиент, продавница или модел...",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              "aria-label": "Пребарај нарачки",
              className: "w-full bg-card border border-input rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring",
              "data-ocid": "orders-search-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: filterStatus,
              onChange: (e) => setFilterStatus(e.target.value),
              "aria-label": "Филтрирај по статус",
              className: "appearance-none bg-card border border-input rounded-md px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
              "data-ocid": "orders-status-filter",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Сите статуси" }),
                STATUS_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: STATUS_LABELS[s] }, s))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-auto", children: [
          filtered.length,
          " ",
          filtered.length === 1 ? "нарачка" : "нарачки"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "md", label: "Се вчитуваат нарачките..." }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 gap-4 text-center",
        "data-ocid": "orders-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-7 w-7 text-primary/60" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: search || filterStatus !== "all" ? "Нема нарачки со овие критериуми" : "Нема нарачки сè уште" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: search || filterStatus !== "all" ? "Обидете се со поинаков филтер." : "Започнете со додавање на прва нарачка." })
          ] }),
          !search && filterStatus === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: () => setShowCreate(true),
              "data-ocid": "orders-empty-new-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                "Нова нарачка"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full data-table", "data-ocid": "orders-table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30 sticky top-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Клиент / Продавница" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Модели" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Рок" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Статус" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Акции" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        OrderRow,
        {
          order,
          products,
          onEdit: setEditOrder,
          onDelete: setDeleteTarget,
          onStatusChange: handleStatusChange
        },
        String(order.id)
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OrderFormModal, { open: showCreate, onClose: () => setShowCreate(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      OrderFormModal,
      {
        open: !!editOrder,
        onClose: () => setEditOrder(null),
        editOrder: editOrder ?? void 0
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmModal,
      {
        open: !!deleteTarget,
        onClose: () => setDeleteTarget(null),
        order: deleteTarget,
        onConfirm: handleDelete,
        isDeleting
      }
    )
  ] });
}
export {
  OrdersPage as default
};
