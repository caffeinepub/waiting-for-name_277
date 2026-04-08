import { c as createLucideIcon, a as useProducts, q as useUpdateProduct, s as useDeleteProduct, r as reactExports, j as jsxRuntimeExports, B as Button, L as LoadingSpinner, t as useCreateProduct, w as useAddPart, x as useUpdatePart, y as useDeletePart, z as BottomSide } from "./index-U_sM6Rre.js";
import { B as Badge } from "./badge-D4KPQbH6.js";
import { P as Plus, a as Package, M as Modal } from "./Modal-BM6vQ565.js";
import { X, T as TriangleAlert, u as ue, C as ChevronDown } from "./index-D26s4j6Y.js";
import { S as Search, T as Trash2, P as Pencil } from "./trash-2-Dpat6YPL.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
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
const Layers = createLucideIcon("layers", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 2v10", key: "mnfbl" }],
  ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }]
];
const Power = createLucideIcon("power", __iconNode);
const BOTTOM_SIDE_OPTIONS = [
  { value: BottomSide.Bottom, label: "Дно" },
  { value: BottomSide.Top, label: "Врв" },
  { value: BottomSide.Front, label: "Предна" },
  { value: BottomSide.Back, label: "Задна" },
  { value: BottomSide.Left, label: "Лева" },
  { value: BottomSide.Right, label: "Десна" }
];
function bottomSideLabel(side) {
  var _a;
  return ((_a = BOTTOM_SIDE_OPTIONS.find((o) => o.value === side)) == null ? void 0 : _a.label) ?? String(side);
}
function emptyLocalPart(key) {
  return {
    key,
    status: "new",
    name: "",
    lengthCm: "",
    widthCm: "",
    heightCm: "",
    weightKg: "",
    bottomSide: BottomSide.Bottom
  };
}
function partToLocal(part) {
  return {
    key: String(part.id),
    id: part.id,
    status: "existing",
    name: part.name,
    lengthCm: String(Number(part.lengthCm)),
    widthCm: String(Number(part.widthCm)),
    heightCm: String(Number(part.heightCm)),
    weightKg: part.weightKg > 0 ? String(part.weightKg) : "",
    bottomSide: part.bottomSide
  };
}
function PartRow({ part, index, onChange, onRemove }) {
  const uid = reactExports.useId();
  if (part.status === "deleted") return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg border border-border bg-card/60 p-3 space-y-3",
      "data-ocid": `part-row-${part.key}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
            "Дел ",
            index + 1,
            part.status === "new" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-[10px] font-normal text-primary/70 normal-case tracking-normal", children: "нов" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Отстрани дел",
              className: "h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth",
              onClick: () => onRemove(part.key),
              "data-ocid": `remove-part-${part.key}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: `${uid}-name`,
              className: "text-xs text-muted-foreground",
              children: "Назив на дел *"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: `${uid}-name`,
              className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
              placeholder: "пр. Лева секција",
              value: part.name,
              onChange: (e) => onChange(part.key, { name: e.target.value }),
              "data-ocid": `part-name-${part.key}`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block", children: "Димензии: Должина × Ширина × Висина (cm) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: ["lengthCm", "widthCm", "heightCm"].map((dim) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                min: "0",
                className: "w-full rounded-md border border-input bg-background px-2 py-2 pr-7 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                placeholder: dim === "lengthCm" ? "Д" : dim === "widthCm" ? "Ш" : "В",
                value: part[dim],
                onChange: (e) => onChange(part.key, { [dim]: e.target.value }),
                "aria-label": dim === "lengthCm" ? "Должина" : dim === "widthCm" ? "Ширина" : "Висина",
                "data-ocid": `part-${dim}-${part.key}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none", children: "cm" })
          ] }, dim)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: `${uid}-weight`,
              className: "text-xs text-muted-foreground",
              children: "Тежина (kg) — незадолжително"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-36", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: `${uid}-weight`,
                type: "number",
                min: "0",
                className: "w-full rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                placeholder: "0",
                value: part.weightKg,
                onChange: (e) => onChange(part.key, { weightKg: e.target.value }),
                "data-ocid": `part-weight-${part.key}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none", children: "kg" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground block", children: "Страна надолу (ориентација)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: BOTTOM_SIDE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onChange(part.key, { bottomSide: opt.value }),
              "data-ocid": `bottom-side-${opt.value}-${part.key}`,
              className: [
                "px-3 py-1 rounded-md text-xs font-medium border transition-smooth",
                part.bottomSide === opt.value ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
              ].join(" "),
              children: opt.label
            },
            opt.value
          )) })
        ] })
      ]
    }
  );
}
function validateLocalParts(parts) {
  const activeParts = parts.filter((p) => p.status !== "deleted");
  if (activeParts.length === 0) return "Додајте барем еден дел";
  for (let i = 0; i < activeParts.length; i++) {
    const p = activeParts[i];
    if (!p.name.trim()) return `Дел ${i + 1}: внесете назив`;
    const l = Number.parseFloat(p.lengthCm);
    const w = Number.parseFloat(p.widthCm);
    const h = Number.parseFloat(p.heightCm);
    if (!l || !w || !h || l <= 0 || w <= 0 || h <= 0)
      return `Дел ${i + 1}: внесете валидни димензии`;
  }
  return null;
}
function ProductFormModal({ open, onClose, product }) {
  const uid = reactExports.useId();
  const isEdit = !!product;
  const [productName, setProductName] = reactExports.useState((product == null ? void 0 : product.name) ?? "");
  const [parts, setParts] = reactExports.useState(
    () => product ? product.parts.map(partToLocal) : []
  );
  const [counter, setCounter] = reactExports.useState(0);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const addPart = useAddPart();
  const updatePart = useUpdatePart();
  const deletePart = useDeletePart();
  const isSaving = createProduct.isPending || updateProduct.isPending || addPart.isPending || updatePart.isPending || deletePart.isPending;
  const activeParts = parts.filter((p) => p.status !== "deleted");
  function handleAddPart() {
    const key = `new-${counter}`;
    setCounter((c) => c + 1);
    setParts((prev) => [...prev, emptyLocalPart(key)]);
  }
  function handlePartChange(key, field) {
    setParts(
      (prev) => prev.map((p) => {
        if (p.key !== key) return p;
        return { ...p, ...field };
      })
    );
  }
  function handleRemovePart(key) {
    setParts(
      (prev) => prev.map((p) => {
        if (p.key !== key) return p;
        if (p.status === "new") return { ...p, status: "deleted" };
        return { ...p, status: "deleted" };
      })
    );
  }
  async function handleSave() {
    if (!productName.trim()) {
      ue.error("Внесете го името на производот");
      return;
    }
    const validationError = validateLocalParts(parts);
    if (validationError) {
      ue.error(validationError);
      return;
    }
    try {
      if (!isEdit) {
        const createdProduct = await createProduct.mutateAsync(
          productName.trim()
        );
        const newProductId = createdProduct.id;
        const activePts = parts.filter((p) => p.status !== "deleted");
        for (const p of activePts) {
          await addPart.mutateAsync({
            productId: newProductId,
            name: p.name.trim(),
            lengthCm: BigInt(Math.round(Number.parseFloat(p.lengthCm))),
            widthCm: BigInt(Math.round(Number.parseFloat(p.widthCm))),
            heightCm: BigInt(Math.round(Number.parseFloat(p.heightCm))),
            weightKg: p.weightKg ? Number.parseFloat(p.weightKg) : 0,
            bottomSide: p.bottomSide
          });
        }
        ue.success("Моделот е создаден");
      } else {
        if (productName.trim() !== product.name || product.active !== true) {
          await updateProduct.mutateAsync({
            id: product.id,
            name: productName.trim(),
            active: product.active,
            parts: product.parts
          });
        }
        const deletedParts = parts.filter(
          (p) => p.status === "deleted" && p.id !== void 0
        );
        for (const p of deletedParts) {
          if (p.id !== void 0) {
            await deletePart.mutateAsync({
              productId: product.id,
              partId: p.id
            });
          }
        }
        const newParts = parts.filter((p) => p.status === "new");
        for (const p of newParts) {
          await addPart.mutateAsync({
            productId: product.id,
            name: p.name.trim(),
            lengthCm: BigInt(Math.round(Number.parseFloat(p.lengthCm))),
            widthCm: BigInt(Math.round(Number.parseFloat(p.widthCm))),
            heightCm: BigInt(Math.round(Number.parseFloat(p.heightCm))),
            weightKg: p.weightKg ? Number.parseFloat(p.weightKg) : 0,
            bottomSide: p.bottomSide
          });
        }
        const modifiedParts = parts.filter(
          (p) => p.status === "existing" && p.id !== void 0
        );
        for (const p of modifiedParts) {
          const original = product.parts.find(
            (op) => String(op.id) === String(p.id)
          );
          if (!original) continue;
          const changed = p.name.trim() !== original.name || Number.parseFloat(p.lengthCm) !== Number(original.lengthCm) || Number.parseFloat(p.widthCm) !== Number(original.widthCm) || Number.parseFloat(p.heightCm) !== Number(original.heightCm) || (p.weightKg ? Number.parseFloat(p.weightKg) : 0) !== original.weightKg || p.bottomSide !== original.bottomSide;
          if (changed && p.id !== void 0) {
            await updatePart.mutateAsync({
              productId: product.id,
              partId: p.id,
              name: p.name.trim(),
              lengthCm: BigInt(Math.round(Number.parseFloat(p.lengthCm))),
              widthCm: BigInt(Math.round(Number.parseFloat(p.widthCm))),
              heightCm: BigInt(Math.round(Number.parseFloat(p.heightCm))),
              weightKg: p.weightKg ? Number.parseFloat(p.weightKg) : 0,
              bottomSide: p.bottomSide
            });
          }
        }
        ue.success("Промените се зачувани");
      }
      onClose();
    } catch {
      ue.error("Грешка при зачувување — обидете се повторно");
    }
  }
  const canSave = productName.trim().length > 0 && activeParts.length > 0 && !isSaving;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Modal,
    {
      open,
      onClose,
      title: isEdit ? `Уреди: ${product.name}` : "Нов модел",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 max-h-[70vh] overflow-y-auto pr-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: `${uid}-product-name`,
                className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
                children: "Назив на производ *"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: `${uid}-product-name`,
                className: "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                placeholder: "пр. Кутна Гарнитура Луксуз",
                value: productName,
                onChange: (e) => setProductName(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && !isSaving && void handleSave(),
                "data-ocid": "product-name-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground font-display", children: "Делови" }),
                activeParts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: activeParts.length })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: handleAddPart,
                  disabled: isSaving,
                  "data-ocid": "add-part-btn",
                  className: "border-dashed text-xs",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                    "Додај дел"
                  ]
                }
              )
            ] }),
            activeParts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 py-8 border border-dashed border-border rounded-lg text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-6 w-6 text-muted-foreground/40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: 'Нема делови — притиснете „Додај дел"' })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: parts.map(
              (part, idx) => part.status === "deleted" ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(
                PartRow,
                {
                  part,
                  index: idx - parts.slice(0, idx).filter((p) => p.status === "deleted").length,
                  onChange: handlePartChange,
                  onRemove: handleRemovePart
                },
                part.key
              )
            ) })
          ] }),
          activeParts.length === 0 && productName.trim().length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 text-center", children: "Додајте барем еден дел за да можете да зачувате" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end pt-4 border-t border-border mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: onClose, disabled: isSaving, children: "Откажи" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "default",
              size: "sm",
              onClick: () => void handleSave(),
              loading: isSaving,
              disabled: !canSave,
              "data-ocid": "save-product-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }),
                isEdit ? "Зачувај промени" : "Создај модел"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function ProductCard({
  product,
  onEdit,
  onToggleActive,
  onDelete
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const isActive = product.active !== false;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: [
        "rounded-lg border bg-card card-interactive overflow-hidden",
        isActive ? "border-border" : "border-border/50 opacity-70"
      ].join(" "),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-3 flex-1 min-w-0 text-left",
              onClick: () => setExpanded((v) => !v),
              "data-ocid": `expand-product-${product.id}`,
              "aria-expanded": expanded,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: [
                      "h-8 w-8 rounded-md flex items-center justify-center shrink-0 border",
                      isActive ? "bg-primary/10 border-primary/20" : "bg-muted/30 border-border"
                    ].join(" "),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Package,
                      {
                        className: [
                          "h-4 w-4",
                          isActive ? "text-primary" : "text-muted-foreground"
                        ].join(" ")
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground truncate font-display", children: product.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs shrink-0", children: [
                      product.parts.length,
                      " ",
                      product.parts.length === 1 ? "дел" : "дела"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: isActive ? "default" : "outline",
                        className: "text-xs shrink-0",
                        children: isActive ? "Активен" : "Неактивен"
                      }
                    )
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
                "data-ocid": `edit-product-${product.id}`,
                "aria-label": "Уреди производ",
                className: "h-8 w-8",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                onClick: () => onToggleActive(product),
                "data-ocid": `toggle-active-${product.id}`,
                "aria-label": isActive ? "Деактивирај" : "Активирај",
                className: [
                  "h-8 w-8",
                  isActive ? "text-muted-foreground hover:text-accent" : "text-muted-foreground hover:text-primary"
                ].join(" "),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                onClick: () => onDelete(product),
                "data-ocid": `delete-product-${product.id}`,
                "aria-label": "Избриши производ",
                className: "h-8 w-8 text-destructive/60 hover:text-destructive",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] })
        ] }),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border bg-background/50 px-4 pb-4 pt-3 space-y-2", children: [
          product.parts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 py-4 text-sm text-muted-foreground border border-dashed border-border rounded-lg justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4" }),
            "Нема делови — уредете го производот за да додадете"
          ] }) : product.parts.map((part) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card text-sm",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate", children: part.name }),
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
              ] }) })
            },
            String(part.id)
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "w-full border-dashed text-xs mt-1",
              onClick: () => {
                setExpanded(false);
              },
              "data-ocid": `edit-product-inline-${product.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
                "Уреди производ и делови"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const [search, setSearch] = reactExports.useState("");
  const [showCreateModal, setShowCreateModal] = reactExports.useState(false);
  const [editingProduct, setEditingProduct] = reactExports.useState(null);
  const [deletingProduct, setDeletingProduct] = reactExports.useState(null);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);
  const activeCount = products.filter((p) => p.active !== false).length;
  const totalParts = products.reduce((sum, p) => sum + p.parts.length, 0);
  const handleToggleActive = async (product) => {
    const isActive = product.active !== false;
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        name: product.name,
        active: !isActive,
        parts: product.parts
      });
      ue.success(
        isActive ? `„${product.name}" е деактивиран` : `„${product.name}" е активиран`
      );
    } catch {
      ue.error("Грешка при промена на статус");
    }
  };
  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct.mutateAsync(deletingProduct.id);
      ue.success(`„${deletingProduct.name}" е избришан`);
      setDeletingProduct(null);
    } catch {
      ue.error("Грешка при бришење");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-4xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-header flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold font-display text-foreground tracking-tight", children: "Модели" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          "Каталог на мебелски модели —",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: activeCount }),
          " ",
          "активни,",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: products.length }),
          " ",
          "вкупно,",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: totalParts }),
          " ",
          "дела"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "default",
          size: "sm",
          onClick: () => setShowCreateModal(true),
          "data-ocid": "add-product-btn",
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
          "data-ocid": "products-search-input"
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
        "data-ocid": "products-empty-state",
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
              "data-ocid": "empty-add-product-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                "Нов модел"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "products-list", children: filtered.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductCard,
      {
        product,
        onEdit: setEditingProduct,
        onToggleActive: handleToggleActive,
        onDelete: setDeletingProduct
      },
      String(product.id)
    )) }),
    showCreateModal && /* @__PURE__ */ jsxRuntimeExports.jsx(ProductFormModal, { open: true, onClose: () => setShowCreateModal(false) }),
    editingProduct && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductFormModal,
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
        title: "Избриши производ",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-destructive mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
                "„",
                deletingProduct == null ? void 0 : deletingProduct.name,
                '"'
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Производот и сите негови делови ќе бидат трајно избришани. Постоечките нарачки нема да бидат засегнати." })
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
                onClick: () => void handleDelete(),
                loading: deleteProduct.isPending,
                "data-ocid": "confirm-delete-product-btn",
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
export {
  ProductsPage as default
};
