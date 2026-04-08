import { c as createLucideIcon, a as useProducts, p as useDeleteProduct, r as reactExports, j as jsxRuntimeExports, B as Button, L as LoadingSpinner, q as useCreateProduct, s as useUpdateProduct, t as useAddPart, v as useUpdatePart, w as useDeletePart, x as BottomSide } from "./index-CbpfYT_H.js";
import { B as Badge } from "./badge-DpOzHE2R.js";
import { P as Plus, a as Package, M as Modal } from "./Modal-BLXGrGdJ.js";
import { X, T as TriangleAlert, u as ue, C as ChevronDown } from "./index-5CA7VSEo.js";
import { S as Search, T as Trash2, P as Pencil } from "./trash-2-ohZrNdQN.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode);
const BOTTOM_SIDE_OPTIONS = [
  { value: BottomSide.Bottom, label: "Дно" },
  { value: BottomSide.Top, label: "Горе" },
  { value: BottomSide.Front, label: "Напред" },
  { value: BottomSide.Back, label: "Назад" },
  { value: BottomSide.Left, label: "Лево" },
  { value: BottomSide.Right, label: "Десно" }
];
function bottomSideLabel(side) {
  var _a;
  return ((_a = BOTTOM_SIDE_OPTIONS.find((o) => o.value === side)) == null ? void 0 : _a.label) ?? String(side);
}
function PartEditor({ part, onSave, onCancel, isSaving }) {
  const uid = reactExports.useId();
  const [form, setForm] = reactExports.useState(() => ({
    name: (part == null ? void 0 : part.name) ?? "",
    lengthCm: part ? String(Number(part.lengthCm)) : "",
    widthCm: part ? String(Number(part.widthCm)) : "",
    heightCm: part ? String(Number(part.heightCm)) : "",
    weightKg: part ? String(part.weightKg) : "",
    bottomSide: (part == null ? void 0 : part.bottomSide) ?? BottomSide.Bottom
  }));
  const handleSave = () => {
    if (!form.name.trim()) {
      ue.error("Внесете го името на делот");
      return;
    }
    const l = Number.parseFloat(form.lengthCm);
    const w = Number.parseFloat(form.widthCm);
    const h = Number.parseFloat(form.heightCm);
    if (!l || !w || !h || l <= 0 || w <= 0 || h <= 0) {
      ue.error("Внесете валидни димензии");
      return;
    }
    onSave({
      name: form.name.trim(),
      lengthCm: BigInt(Math.round(l)),
      widthCm: BigInt(Math.round(w)),
      heightCm: BigInt(Math.round(h)),
      weightKg: form.weightKg ? Number.parseFloat(form.weightKg) : 0,
      bottomSide: form.bottomSide
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: `${uid}-part-name`,
          className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
          children: "Назив на дел"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: `${uid}-part-name`,
          className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
          placeholder: "пр. Лева секција",
          value: form.name,
          onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
          "data-ocid": "part-name-input"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide block", children: "Димензии (Д×Ш×В во cm)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: ["lengthCm", "widthCm", "heightCm"].map((dim) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: `${uid}-dim-${dim}`, className: "sr-only", children: dim === "lengthCm" ? "Должина" : dim === "widthCm" ? "Ширина" : "Висина" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: `${uid}-dim-${dim}`,
            type: "number",
            min: "0",
            className: "w-full rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
            placeholder: dim === "lengthCm" ? "Д" : dim === "widthCm" ? "Ш" : "В",
            value: form[dim],
            onChange: (e) => setForm((f) => ({ ...f, [dim]: e.target.value })),
            "data-ocid": `part-dim-${dim}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none", children: "cm" })
      ] }, dim)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide block", children: "Дно (страна која е надолу)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: BOTTOM_SIDE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setForm((f) => ({ ...f, bottomSide: opt.value })),
          "data-ocid": `bottom-side-${opt.value}`,
          className: [
            "px-3 py-1.5 rounded-md text-xs font-medium border transition-smooth",
            form.bottomSide === opt.value ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
          ].join(" "),
          children: opt.label
        },
        opt.value
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: `${uid}-part-weight`,
          className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
          children: "Тежина (kg) — незадолжително"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-32", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: `${uid}-part-weight`,
            type: "number",
            min: "0",
            className: "w-full rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
            placeholder: "0",
            value: form.weightKg,
            onChange: (e) => setForm((f) => ({ ...f, weightKg: e.target.value })),
            "data-ocid": "part-weight-input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none", children: "kg" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "default",
          onClick: handleSave,
          loading: isSaving,
          "data-ocid": "save-part-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
            "Зачувај дел"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", onClick: onCancel, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }),
        "Откажи"
      ] })
    ] })
  ] });
}
function PartsPanel({ product }) {
  const [addingPart, setAddingPart] = reactExports.useState(false);
  const [editingPartId, setEditingPartId] = reactExports.useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = reactExports.useState(null);
  const addPart = useAddPart();
  const updatePart = useUpdatePart();
  const deletePart = useDeletePart();
  const handleAddPart = async (data) => {
    await addPart.mutateAsync({ productId: product.id, ...data });
    ue.success("Делот е додаден");
    setAddingPart(false);
  };
  const handleUpdatePart = async (partId, data) => {
    await updatePart.mutateAsync({ productId: product.id, partId, ...data });
    ue.success("Делот е ажуриран");
    setEditingPartId(null);
  };
  const handleDeletePart = async (partId) => {
    await deletePart.mutateAsync({ productId: product.id, partId });
    ue.success("Делот е избришан");
    setConfirmDeleteId(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 pt-3 space-y-3", children: [
    product.parts.length === 0 && !addingPart && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 py-4 text-sm text-muted-foreground border border-dashed border-border rounded-lg justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4" }),
      "Нема додадени делови"
    ] }),
    product.parts.map((part) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-lg border border-border bg-card",
        children: editingPartId === part.id ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          PartEditor,
          {
            part,
            onSave: (data) => handleUpdatePart(part.id, data),
            onCancel: () => setEditingPartId(null),
            isSaving: updatePart.isPending
          }
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground truncate", children: part.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono bg-muted/40 px-2 py-0.5 rounded", children: [
              Number(part.lengthCm),
              "×",
              Number(part.widthCm),
              "×",
              Number(part.heightCm),
              " cm"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
              "Дно: ",
              bottomSideLabel(part.bottomSide)
            ] }),
            part.weightKg > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              part.weightKg,
              " kg"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                onClick: () => setEditingPartId(part.id),
                "data-ocid": `edit-part-${part.id}`,
                "aria-label": "Уреди дел",
                className: "h-7 w-7",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                onClick: () => setConfirmDeleteId(part.id),
                "data-ocid": `delete-part-${part.id}`,
                "aria-label": "Избриши дел",
                className: "h-7 w-7 text-destructive hover:text-destructive",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] })
      },
      String(part.id)
    )),
    addingPart ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      PartEditor,
      {
        onSave: handleAddPart,
        onCancel: () => setAddingPart(false),
        isSaving: addPart.isPending
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        size: "sm",
        variant: "outline",
        onClick: () => setAddingPart(true),
        "data-ocid": `add-part-${product.id}`,
        className: "w-full border-dashed",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
          "Додај дел"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: !!confirmDeleteId,
        onClose: () => setConfirmDeleteId(null),
        title: "Избриши дел",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-destructive mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: "Дали сте сигурни дека сакате да го избришете овој дел? Оваа акција не може да се откаже." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => setConfirmDeleteId(null),
                children: "Откажи"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "destructive",
                size: "sm",
                onClick: () => confirmDeleteId !== null && handleDeletePart(confirmDeleteId),
                loading: deletePart.isPending,
                "data-ocid": "confirm-delete-part-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                  "Избриши"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function ModelRow({
  product,
  onEdit,
  onDelete
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card card-interactive overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-3 flex-1 min-w-0 text-left",
          onClick: () => setExpanded((v) => !v),
          "data-ocid": `expand-model-${product.id}`,
          "aria-expanded": expanded,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground truncate font-display", children: product.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                  product.parts.length,
                  " ",
                  product.parts.length === 1 ? "дел" : "дела"
                ] })
              ] }),
              product.parts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: product.parts.map(
                (p) => `${p.name} (${Number(p.lengthCm)}×${Number(p.widthCm)}×${Number(p.heightCm)} cm)`
              ).join(" · ") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground ml-1 shrink-0", children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "icon",
            variant: "ghost",
            onClick: () => onEdit(product),
            "data-ocid": `edit-model-${product.id}`,
            "aria-label": "Уреди модел",
            className: "h-8 w-8",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "icon",
            variant: "ghost",
            onClick: () => onDelete(product),
            "data-ocid": `delete-model-${product.id}`,
            "aria-label": "Деактивирај модел",
            className: "h-8 w-8 text-destructive hover:text-destructive",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border bg-background/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PartsPanel, { product }) })
  ] });
}
function ModelModal({
  open,
  onClose,
  product
}) {
  const uid = reactExports.useId();
  const [name, setName] = reactExports.useState((product == null ? void 0 : product.name) ?? "");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isPending = createProduct.isPending || updateProduct.isPending;
  const handleSave = async () => {
    if (!name.trim()) {
      ue.error("Внесете го името на моделот");
      return;
    }
    if (product) {
      await updateProduct.mutateAsync({
        id: product.id,
        name: name.trim(),
        active: true,
        parts: product.parts
      });
      ue.success("Моделот е ажуриран");
    } else {
      await createProduct.mutateAsync(name.trim());
      ue.success("Моделот е создаден");
    }
    onClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      open,
      onClose,
      title: product ? "Уреди модел" : "Нов модел",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: `${uid}-model-name`,
              className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
              children: "Назив на модел *"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: `${uid}-model-name`,
              className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
              placeholder: "пр. Кутна Гарнитура Луксуз",
              value: name,
              onChange: (e) => setName(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && void handleSave(),
              "data-ocid": "model-name-input"
            }
          )
        ] }),
        !product && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground bg-muted/30 rounded-md px-3 py-2 border border-border", children: "По создавањето, можете да додавате делови со нивните димензии и ориентација на дното." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: onClose, children: "Откажи" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "default",
              size: "sm",
              onClick: handleSave,
              loading: isPending,
              "data-ocid": "save-model-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
                product ? "Зачувај промени" : "Создај модел"
              ]
            }
          )
        ] })
      ] })
    }
  );
}
function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [search, setSearch] = reactExports.useState("");
  const [showCreateModal, setShowCreateModal] = reactExports.useState(false);
  const [editingProduct, setEditingProduct] = reactExports.useState(null);
  const [deletingProduct, setDeletingProduct] = reactExports.useState(null);
  const activeProducts = products.filter((p) => p.active !== false);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return activeProducts;
    return activeProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [activeProducts, search]);
  const handleDelete = async () => {
    if (!deletingProduct) return;
    await deleteProduct.mutateAsync(deletingProduct.id);
    ue.success(`„${deletingProduct.name}" е деактивиран`);
    setDeletingProduct(null);
  };
  const totalParts = activeProducts.reduce((sum, p) => sum + p.parts.length, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-header flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display text-foreground tracking-tight", children: "Модели" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          "Каталог на мебелски модели и нивните делови —",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: activeProducts.length }),
          " ",
          "модели,",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: totalParts }),
          " ",
          "делови вкупно"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "default",
          size: "sm",
          onClick: () => setShowCreateModal(true),
          "data-ocid": "add-model-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            "Нов модел"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          "aria-label": "Пребарај модели",
          className: "w-full rounded-md border border-input bg-card pl-9 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
          placeholder: "Пребарај модели по назив...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          "data-ocid": "models-search-input"
        }
      ),
      search && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "aria-label": "Исчисти пребарување",
          className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth",
          onClick: () => setSearch(""),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "md", label: "Се вчитуваат моделите..." }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-3 py-16 border border-dashed border-border rounded-lg text-center",
        "data-ocid": "models-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-xl bg-muted/40 border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-7 w-7 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: search ? "Нема модели кои одговараат" : "Нема модели" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: search ? "Обидете се со друг термин" : "Создајте го вашиот прв модел за да почнете" })
          ] }),
          !search && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setShowCreateModal(true),
              "data-ocid": "empty-add-model-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                "Нов модел"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "models-list", children: filtered.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModelRow,
      {
        product,
        onEdit: setEditingProduct,
        onDelete: setDeletingProduct
      },
      String(product.id)
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModelModal,
      {
        open: showCreateModal,
        onClose: () => setShowCreateModal(false)
      }
    ),
    editingProduct && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModelModal,
      {
        open: true,
        onClose: () => setEditingProduct(null),
        product: editingProduct
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Modal,
      {
        open: !!deletingProduct,
        onClose: () => setDeletingProduct(null),
        title: "Деактивирај модел",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-destructive mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
                "„",
                deletingProduct == null ? void 0 : deletingProduct.name,
                '"'
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Моделот ќе биде деактивиран. Постоечките нарачки нема да бидат засегнати." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => setDeletingProduct(null),
                children: "Откажи"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "destructive",
                size: "sm",
                onClick: handleDelete,
                loading: deleteProduct.isPending,
                "data-ocid": "confirm-delete-model-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
                  "Деактивирај"
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  ProductsPage as default
};
