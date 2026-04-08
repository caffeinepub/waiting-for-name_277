import { c as createLucideIcon, i as useTruckLoads, u as useOrders, k as useUpdateTruckLoadStatus, r as reactExports, T as TruckLoadStatus, O as OrderStatus, j as jsxRuntimeExports, B as Button, l as Truck, e as cn, L as LoadingSpinner, m as useCreateTruckLoad } from "./index-CbpfYT_H.js";
import { P as Plus, a as Package, M as Modal } from "./Modal-BLXGrGdJ.js";
import { u as ue, C as ChevronDown, T as TriangleAlert } from "./index-5CA7VSEo.js";
import { C as Clock, a as CircleCheck } from "./clock-Ck6WwRyC.js";
import { B as Box, R as RotateCcw } from "./rotate-ccw-BQl1oRiX.js";
import { C as Calendar } from "./calendar-ClG5HqOx.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 16 2 2 4-4", key: "gfu2re" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }]
];
const PackageCheck = createLucideIcon("package-check", __iconNode);
function formatDeadline(ts) {
  const d = new Date(Number(ts));
  return d.toLocaleDateString("mk-MK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
function daysUntil(ts) {
  return Math.ceil((Number(ts) - Date.now()) / (1e3 * 60 * 60 * 24));
}
function sortOrdersByPriority(orders) {
  return [...orders].sort((a, b) => {
    if (a.emergency !== b.emergency) return a.emergency ? -1 : 1;
    return Number(a.deadline) - Number(b.deadline);
  });
}
const LOAD_STATUS_LABELS = {
  [TruckLoadStatus.Pending]: {
    label: "Нацрт",
    cls: "bg-muted text-muted-foreground border-border"
  },
  [TruckLoadStatus.Shipped]: {
    label: "Испратено",
    cls: "bg-chart-2/15 text-chart-2 border-chart-2/30"
  }
};
function StatusBadge({ status }) {
  const { label, cls } = LOAD_STATUS_LABELS[status] ?? {
    label: String(status),
    cls: "bg-muted text-muted-foreground border-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border",
        cls
      ),
      children: [
        status === TruckLoadStatus.Shipped && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
        label
      ]
    }
  );
}
function OrderDetailRow({ order }) {
  const days = daysUntil(order.deadline);
  const urgentColor = days <= 1 ? "text-destructive" : days <= 3 ? "text-accent" : "text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex items-start justify-between gap-3 px-3 py-2 rounded border",
        order.emergency ? "border-accent/30 bg-accent/5" : "border-border bg-muted/20"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            order.emergency && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-emergency flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
              "Итно"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground truncate", children: order.clientName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: order.clientStore }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-0.5", children: order.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "text-xs text-muted-foreground",
              children: [
                "×",
                Number(item.quantity)
              ]
            },
            String(item.productId)
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn("flex items-center gap-1 text-xs shrink-0", urgentColor),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
              formatDeadline(order.deadline),
              days <= 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                "(",
                days <= 0 ? "Денес!" : `${days}д`,
                ")"
              ] })
            ]
          }
        )
      ]
    }
  );
}
function TruckLoadCard({
  load,
  orders,
  onShip,
  onRevert,
  onOpenVisualizer
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const isShipped = load.status === TruckLoadStatus.Shipped;
  const loadOrders = sortOrdersByPriority(
    orders.filter((o) => load.orderIds.includes(o.id))
  );
  const { lengthCm, widthCm, heightCm } = load.truckDimensions;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "rounded-lg border bg-card transition-smooth",
        isShipped ? "border-border opacity-80" : "border-border card-interactive"
      ),
      "data-ocid": `truck-load-card-${load.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-sm text-foreground font-display", children: [
                "Товар #",
                String(load.id)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: load.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-0.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { className: "h-3 w-3" }),
                Number(lengthCm),
                "×",
                Number(widthCm),
                "×",
                Number(heightCm),
                " cm"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3 w-3" }),
                load.orderIds.length,
                " ",
                load.orderIds.length === 1 ? "нарачка" : "нарачки"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
            !isShipped && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => onOpenVisualizer(load.id),
                  "data-ocid": `visualize-load-${load.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { className: "h-3.5 w-3.5" }),
                    "Товарење"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "default",
                  size: "sm",
                  onClick: () => onShip(load.id),
                  "data-ocid": `ship-load-${load.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PackageCheck, { className: "h-3.5 w-3.5" }),
                    "Испрати"
                  ]
                }
              )
            ] }),
            isShipped && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => onRevert(load.id),
                "data-ocid": `revert-load-${load.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3.5 w-3.5" }),
                  "Поврати"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => setExpanded((v) => !v),
                "aria-label": expanded ? "Склопи" : "Прошири",
                children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border px-4 py-3 flex flex-col gap-2", children: loadOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground py-2 text-center", children: "Нема нарачки во овој товар." }) : loadOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrderDetailRow, { order }, String(order.id))) })
      ]
    }
  );
}
const EMPTY_DIMS = { lengthCm: 620, widthCm: 240, heightCm: 250 };
function CreateTruckLoadPanel({
  orders,
  onCreated
}) {
  const createMutation = useCreateTruckLoad();
  const [dims, setDims] = reactExports.useState(EMPTY_DIMS);
  const [selectedOrderIds, setSelectedOrderIds] = reactExports.useState(
    /* @__PURE__ */ new Set()
  );
  const prioritized = sortOrdersByPriority(
    orders.filter((o) => o.status === OrderStatus.Pending)
  );
  function toggleOrder(id) {
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      const key = String(id);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
  function handleDimChange(field, val) {
    const n = Number.parseInt(val, 10);
    if (!Number.isNaN(n) && n > 0) setDims((d) => ({ ...d, [field]: n }));
  }
  async function handleSubmit() {
    if (selectedOrderIds.size === 0) {
      ue.error("Изберете барем една нарачка");
      return;
    }
    const truckDimensions = {
      lengthCm: BigInt(dims.lengthCm),
      widthCm: BigInt(dims.widthCm),
      heightCm: BigInt(dims.heightCm)
    };
    const orderIds = [...selectedOrderIds].map((s) => BigInt(s));
    await createMutation.mutateAsync({ truckDimensions, orderIds });
    ue.success("Товарот е создаден");
    setDims(EMPTY_DIMS);
    setSelectedOrderIds(/* @__PURE__ */ new Set());
    onCreated();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3.5 w-3.5" }),
        "Димензии на камион (cm)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: [
        ["lengthCm", "Должина"],
        ["widthCm", "Ширина"],
        ["heightCm", "Висина"]
      ].map(([field, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: `dim-${field}`,
            className: "text-xs text-muted-foreground",
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: `dim-${field}`,
              type: "number",
              min: 1,
              value: dims[field],
              onChange: (e) => handleDimChange(field, e.target.value),
              className: "w-full bg-card border border-input rounded-md px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
              "data-ocid": `dim-${field}-input`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground", children: "cm" })
        ] })
      ] }, field)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 rounded-md bg-primary/5 border border-primary/20 text-xs text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold", children: [
          dims.lengthCm,
          " × ",
          dims.widthCm,
          " × ",
          dims.heightCm,
          " cm"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" }),
        "Нарачки — по приоритет",
        selectedOrderIds.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-primary font-semibold normal-case", children: [
          selectedOrderIds.size,
          " избрано"
        ] })
      ] }),
      prioritized.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6 text-sm text-muted-foreground border border-dashed border-border rounded-lg", children: "Нема нарачки на чекање" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1",
          "data-ocid": "order-selection-list",
          children: prioritized.map((order) => {
            const selected = selectedOrderIds.has(String(order.id));
            const days = daysUntil(order.deadline);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => toggleOrder(order.id),
                className: cn(
                  "w-full flex items-start gap-3 px-3 py-2.5 rounded border text-left transition-smooth",
                  selected ? "border-primary/50 bg-primary/8" : order.emergency ? "border-accent/30 bg-accent/5 hover:border-accent/50" : "border-border bg-muted/20 hover:border-border/80"
                ),
                "data-ocid": `select-order-${order.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: cn(
                        "mt-0.5 h-4 w-4 rounded border-2 shrink-0 flex items-center justify-center transition-smooth",
                        selected ? "border-primary bg-primary" : "border-border"
                      ),
                      children: selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "svg",
                        {
                          className: "h-2.5 w-2.5 text-primary-foreground",
                          fill: "none",
                          viewBox: "0 0 10 10",
                          "aria-hidden": "true",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "path",
                            {
                              d: "M1.5 5L4 7.5 8.5 2.5",
                              stroke: "currentColor",
                              strokeWidth: "1.8",
                              strokeLinecap: "round",
                              strokeLinejoin: "round"
                            }
                          )
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      order.emergency && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-emergency flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                        "Итно"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground truncate", children: order.clientName })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: order.clientStore })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: cn(
                        "flex items-center gap-1 text-xs shrink-0",
                        days <= 1 ? "text-destructive" : days <= 3 ? "text-accent" : "text-muted-foreground"
                      ),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                        days <= 0 ? "Денес!" : days === 1 ? "Утре" : `${days} дена`
                      ]
                    }
                  )
                ]
              },
              String(order.id)
            );
          })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "default",
        onClick: handleSubmit,
        loading: createMutation.isPending,
        disabled: selectedOrderIds.size === 0,
        "data-ocid": "create-load-submit",
        className: "w-full",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          "Создај товар"
        ]
      }
    )
  ] });
}
function ShipmentPage({ onOpenVisualizer }) {
  const { data: truckLoads = [], isLoading: loadsLoading } = useTruckLoads();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const updateStatus = useUpdateTruckLoadStatus();
  const [filter, setFilter] = reactExports.useState("all");
  const [showCreateModal, setShowCreateModal] = reactExports.useState(false);
  const isLoading = loadsLoading || ordersLoading;
  async function handleShip(id) {
    await updateStatus.mutateAsync({ id, status: TruckLoadStatus.Shipped });
    ue.success("Товарот е означен како испратен");
  }
  async function handleRevert(id) {
    await updateStatus.mutateAsync({ id, status: TruckLoadStatus.Pending });
    ue.success("Товарот е вратен во нацрт");
  }
  function handleOpenVisualizer(id) {
    if (onOpenVisualizer) {
      onOpenVisualizer(id);
    } else {
      ue.info("Отворете го табот 3Д Визуализација за деталниот товар.");
    }
  }
  const filtered = truckLoads.filter((load) => {
    if (filter === "active") return load.status !== TruckLoadStatus.Shipped;
    if (filter === "shipped") return load.status === TruckLoadStatus.Shipped;
    return true;
  });
  const pendingOrderCount = orders.filter(
    (o) => o.status === OrderStatus.Pending
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0 min-h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-b border-border px-6 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold font-display text-foreground tracking-tight", children: "Нов Товар" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Планирање и управување со пратки и товарни листи" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "default",
            onClick: () => setShowCreateModal(true),
            "data-ocid": "new-load-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              "Нов товар"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4 mt-4 flex-wrap", children: [
        {
          label: "Вкупно товари",
          value: truckLoads.length,
          icon: Truck,
          color: "text-primary",
          bg: "bg-primary/10"
        },
        {
          label: "Активни",
          value: truckLoads.filter(
            (l) => l.status !== TruckLoadStatus.Shipped
          ).length,
          icon: Clock,
          color: "text-accent",
          bg: "bg-accent/10"
        },
        {
          label: "Испратени",
          value: truckLoads.filter(
            (l) => l.status === TruckLoadStatus.Shipped
          ).length,
          icon: CircleCheck,
          color: "text-chart-2",
          bg: "bg-chart-2/10"
        },
        {
          label: "Нарачки на чекање",
          value: pendingOrderCount,
          icon: Package,
          color: "text-muted-foreground",
          bg: "bg-muted/40"
        }
      ].map(({ label, value, icon: Icon, color, bg }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/20",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("rounded p-1", bg), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-3.5 w-3.5", color) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              label,
              ":"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-sm font-bold font-mono", color), children: value })
          ]
        },
        label
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-background border-b border-border px-6 flex items-center gap-1 pt-2", children: [
      { id: "all", label: "Сите" },
      { id: "active", label: "Активни" },
      { id: "shipped", label: "Испратени" }
    ].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setFilter(tab.id),
        className: cn(
          filter === tab.id ? "tab-active" : "tab-inactive",
          "text-sm"
        ),
        "data-ocid": `filter-tab-${tab.id}`,
        children: tab.label
      },
      tab.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-background px-6 py-5", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg", fullPage: true, label: "Се вчитуваат пратките..." }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-4 py-16 text-center",
        "data-ocid": "empty-state-loads",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-xl bg-muted/40 border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-8 w-8 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground", children: filter === "shipped" ? "Нема испратени товари" : "Нема товари" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: filter === "all" || filter === "active" ? "Создадете нов товар со кликање на Нов товар." : "Испратените товари ќе се прикажат овде." })
          ] }),
          (filter === "all" || filter === "active") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => setShowCreateModal(true),
              "data-ocid": "empty-new-load-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                "Нов товар"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3 max-w-4xl", children: filtered.map((load) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TruckLoadCard,
      {
        load,
        orders,
        onShip: handleShip,
        onRevert: handleRevert,
        onOpenVisualizer: handleOpenVisualizer
      },
      String(load.id)
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: showCreateModal,
        onClose: () => setShowCreateModal(false),
        title: "Нов Товар",
        size: "lg",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          CreateTruckLoadPanel,
          {
            orders,
            onCreated: () => setShowCreateModal(false)
          }
        )
      }
    )
  ] });
}
export {
  ShipmentPage as default
};
