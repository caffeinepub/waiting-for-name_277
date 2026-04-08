import { Badge } from "@/components/ui/AppBadge";
import { Button } from "@/components/ui/AppButton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Modal } from "@/components/ui/Modal";
import { BottomSide } from "@/hooks/useBackend";
import {
  useAddPart,
  useCreateProduct,
  useDeletePart,
  useDeleteProduct,
  useProducts,
  useUpdatePart,
  useUpdateProduct,
} from "@/hooks/useBackend";
import type { Part, PartId, Product, ProductId } from "@/types";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  Layers,
  Package,
  Pencil,
  Plus,
  Power,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const BOTTOM_SIDE_OPTIONS: { value: BottomSide; label: string }[] = [
  { value: BottomSide.Bottom, label: "Дно" },
  { value: BottomSide.Top, label: "Врв" },
  { value: BottomSide.Front, label: "Предна" },
  { value: BottomSide.Back, label: "Задна" },
  { value: BottomSide.Left, label: "Лева" },
  { value: BottomSide.Right, label: "Десна" },
];

function bottomSideLabel(side: BottomSide): string {
  return (
    BOTTOM_SIDE_OPTIONS.find((o) => o.value === side)?.label ?? String(side)
  );
}

// ─── Types for in-form part editing ──────────────────────────────────────────

type LocalPartStatus = "existing" | "new" | "deleted";

interface LocalPart {
  /** undefined for new parts not yet persisted */
  id?: PartId;
  status: LocalPartStatus;
  name: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  weightKg: string;
  bottomSide: BottomSide;
  /** unique key used for React rendering */
  key: string;
}

function emptyLocalPart(key: string): LocalPart {
  return {
    key,
    status: "new",
    name: "",
    lengthCm: "",
    widthCm: "",
    heightCm: "",
    weightKg: "",
    bottomSide: BottomSide.Bottom,
  };
}

function partToLocal(part: Part): LocalPart {
  return {
    key: String(part.id),
    id: part.id,
    status: "existing",
    name: part.name,
    lengthCm: String(Number(part.lengthCm)),
    widthCm: String(Number(part.widthCm)),
    heightCm: String(Number(part.heightCm)),
    weightKg: part.weightKg > 0 ? String(part.weightKg) : "",
    bottomSide: part.bottomSide,
  };
}

// ─── Single Part Row Editor ───────────────────────────────────────────────────

interface PartRowProps {
  part: LocalPart;
  index: number;
  onChange: (key: string, field: Partial<LocalPart>) => void;
  onRemove: (key: string) => void;
}

function PartRow({ part, index, onChange, onRemove }: PartRowProps) {
  const uid = useId();

  if (part.status === "deleted") return null;

  return (
    <div
      className="rounded-lg border border-border bg-card/60 p-3 space-y-3"
      data-ocid={`part-row-${part.key}`}
    >
      {/* Row header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Дел {index + 1}
          {part.status === "new" && (
            <span className="ml-2 text-[10px] font-normal text-primary/70 normal-case tracking-normal">
              нов
            </span>
          )}
        </span>
        <button
          type="button"
          aria-label="Отстрани дел"
          className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
          onClick={() => onRemove(part.key)}
          data-ocid={`remove-part-${part.key}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Name */}
      <div className="space-y-1">
        <label
          htmlFor={`${uid}-name`}
          className="text-xs text-muted-foreground"
        >
          Назив на дел *
        </label>
        <input
          id={`${uid}-name`}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="пр. Лева секција"
          value={part.name}
          onChange={(e) => onChange(part.key, { name: e.target.value })}
          data-ocid={`part-name-${part.key}`}
        />
      </div>

      {/* Dimensions */}
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground block">
          Димензии: Должина × Ширина × Висина (cm) *
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(["lengthCm", "widthCm", "heightCm"] as const).map((dim) => (
            <div key={dim} className="relative">
              <input
                type="number"
                min="0"
                className="w-full rounded-md border border-input bg-background px-2 py-2 pr-7 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={
                  dim === "lengthCm" ? "Д" : dim === "widthCm" ? "Ш" : "В"
                }
                value={part[dim]}
                onChange={(e) => onChange(part.key, { [dim]: e.target.value })}
                aria-label={
                  dim === "lengthCm"
                    ? "Должина"
                    : dim === "widthCm"
                      ? "Ширина"
                      : "Висина"
                }
                data-ocid={`part-${dim}-${part.key}`}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                cm
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div className="space-y-1">
        <label
          htmlFor={`${uid}-weight`}
          className="text-xs text-muted-foreground"
        >
          Тежина (kg) — незадолжително
        </label>
        <div className="relative w-36">
          <input
            id={`${uid}-weight`}
            type="number"
            min="0"
            className="w-full rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="0"
            value={part.weightKg}
            onChange={(e) => onChange(part.key, { weightKg: e.target.value })}
            data-ocid={`part-weight-${part.key}`}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            kg
          </span>
        </div>
      </div>

      {/* Bottom side */}
      <div className="space-y-1.5">
        <span className="text-xs text-muted-foreground block">
          Страна надолу (ориентација)
        </span>
        <div className="flex flex-wrap gap-1.5">
          {BOTTOM_SIDE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(part.key, { bottomSide: opt.value })}
              data-ocid={`bottom-side-${opt.value}-${part.key}`}
              className={[
                "px-3 py-1 rounded-md text-xs font-medium border transition-smooth",
                part.bottomSide === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Validation helper ────────────────────────────────────────────────────────

function validateLocalParts(parts: LocalPart[]): string | null {
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

// ─── Product Form Modal (Create & Edit) ───────────────────────────────────────

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
}

function ProductFormModal({ open, onClose, product }: ProductFormModalProps) {
  const uid = useId();
  const isEdit = !!product;

  const [productName, setProductName] = useState(product?.name ?? "");
  const [parts, setParts] = useState<LocalPart[]>(() =>
    product ? product.parts.map(partToLocal) : [],
  );
  const [counter, setCounter] = useState(0);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const addPart = useAddPart();
  const updatePart = useUpdatePart();
  const deletePart = useDeletePart();

  const isSaving =
    createProduct.isPending ||
    updateProduct.isPending ||
    addPart.isPending ||
    updatePart.isPending ||
    deletePart.isPending;

  const activeParts = parts.filter((p) => p.status !== "deleted");

  function handleAddPart() {
    const key = `new-${counter}`;
    setCounter((c) => c + 1);
    setParts((prev) => [...prev, emptyLocalPart(key)]);
  }

  function handlePartChange(key: string, field: Partial<LocalPart>) {
    setParts((prev) =>
      prev.map((p) => {
        if (p.key !== key) return p;
        // If editing an existing part, mark as modified (still "existing", backend handles diff)
        return { ...p, ...field };
      }),
    );
  }

  function handleRemovePart(key: string) {
    setParts((prev) =>
      prev.map((p) => {
        if (p.key !== key) return p;
        if (p.status === "new") return { ...p, status: "deleted" as const };
        return { ...p, status: "deleted" as const };
      }),
    );
  }

  async function handleSave() {
    if (!productName.trim()) {
      toast.error("Внесете го името на производот");
      return;
    }
    const validationError = validateLocalParts(parts);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      if (!isEdit) {
        // CREATE: create product then add all parts
        const createdProduct = await createProduct.mutateAsync(
          productName.trim(),
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
            bottomSide: p.bottomSide,
          });
        }
        toast.success("Моделот е создаден");
      } else {
        // EDIT: update product name if changed, then sync parts
        if (productName.trim() !== product.name || product.active !== true) {
          await updateProduct.mutateAsync({
            id: product.id,
            name: productName.trim(),
            active: product.active,
            parts: product.parts,
          });
        }
        // Handle deleted parts
        const deletedParts = parts.filter(
          (p) => p.status === "deleted" && p.id !== undefined,
        );
        for (const p of deletedParts) {
          if (p.id !== undefined) {
            await deletePart.mutateAsync({
              productId: product.id,
              partId: p.id,
            });
          }
        }
        // Handle new parts
        const newParts = parts.filter((p) => p.status === "new");
        for (const p of newParts) {
          await addPart.mutateAsync({
            productId: product.id,
            name: p.name.trim(),
            lengthCm: BigInt(Math.round(Number.parseFloat(p.lengthCm))),
            widthCm: BigInt(Math.round(Number.parseFloat(p.widthCm))),
            heightCm: BigInt(Math.round(Number.parseFloat(p.heightCm))),
            weightKg: p.weightKg ? Number.parseFloat(p.weightKg) : 0,
            bottomSide: p.bottomSide,
          });
        }
        // Handle modified existing parts
        const modifiedParts = parts.filter(
          (p) => p.status === "existing" && p.id !== undefined,
        );
        for (const p of modifiedParts) {
          const original = product.parts.find(
            (op) => String(op.id) === String(p.id),
          );
          if (!original) continue;
          const changed =
            p.name.trim() !== original.name ||
            Number.parseFloat(p.lengthCm) !== Number(original.lengthCm) ||
            Number.parseFloat(p.widthCm) !== Number(original.widthCm) ||
            Number.parseFloat(p.heightCm) !== Number(original.heightCm) ||
            (p.weightKg ? Number.parseFloat(p.weightKg) : 0) !==
              original.weightKg ||
            p.bottomSide !== original.bottomSide;
          if (changed && p.id !== undefined) {
            await updatePart.mutateAsync({
              productId: product.id,
              partId: p.id,
              name: p.name.trim(),
              lengthCm: BigInt(Math.round(Number.parseFloat(p.lengthCm))),
              widthCm: BigInt(Math.round(Number.parseFloat(p.widthCm))),
              heightCm: BigInt(Math.round(Number.parseFloat(p.heightCm))),
              weightKg: p.weightKg ? Number.parseFloat(p.weightKg) : 0,
              bottomSide: p.bottomSide,
            });
          }
        }
        toast.success("Промените се зачувани");
      }
      onClose();
    } catch {
      toast.error("Грешка при зачувување — обидете се повторно");
    }
  }

  const canSave =
    productName.trim().length > 0 && activeParts.length > 0 && !isSaving;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Уреди: ${product.name}` : "Нов модел"}
    >
      <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
        {/* Product name */}
        <div className="space-y-1.5">
          <label
            htmlFor={`${uid}-product-name`}
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            Назив на производ *
          </label>
          <input
            id={`${uid}-product-name`}
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="пр. Кутна Гарнитура Луксуз"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !isSaving && void handleSave()
            }
            data-ocid="product-name-input"
          />
        </div>

        {/* Parts section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground font-display">
                Делови
              </span>
              {activeParts.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeParts.length}
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddPart}
              disabled={isSaving}
              data-ocid="add-part-btn"
              className="border-dashed text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Додај дел
            </Button>
          </div>

          {activeParts.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 border border-dashed border-border rounded-lg text-center">
              <Layers className="h-6 w-6 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Нема делови — притиснете „Додај дел"
              </p>
            </div>
          )}

          <div className="space-y-2">
            {parts.map((part, idx) =>
              part.status === "deleted" ? null : (
                <PartRow
                  key={part.key}
                  part={part}
                  index={
                    idx -
                    parts.slice(0, idx).filter((p) => p.status === "deleted")
                      .length
                  }
                  onChange={handlePartChange}
                  onRemove={handleRemovePart}
                />
              ),
            )}
          </div>
        </div>

        {/* Save requirement hint */}
        {activeParts.length === 0 && productName.trim().length > 0 && (
          <p className="text-xs text-muted-foreground/70 text-center">
            Додајте барем еден дел за да можете да зачувате
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-4 border-t border-border mt-4">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={isSaving}>
          Откажи
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => void handleSave()}
          loading={isSaving}
          disabled={!canSave}
          data-ocid="save-product-btn"
        >
          <Check className="h-3.5 w-3.5" />
          {isEdit ? "Зачувај промени" : "Создај модел"}
        </Button>
      </div>
    </Modal>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onToggleActive: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isActive = product.active !== false;

  return (
    <div
      className={[
        "rounded-lg border bg-card card-interactive overflow-hidden",
        isActive ? "border-border" : "border-border/50 opacity-70",
      ].join(" ")}
    >
      {/* Card header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          className="flex items-center gap-3 flex-1 min-w-0 text-left"
          onClick={() => setExpanded((v) => !v)}
          data-ocid={`expand-product-${product.id}`}
          aria-expanded={expanded}
        >
          <div
            className={[
              "h-8 w-8 rounded-md flex items-center justify-center shrink-0 border",
              isActive
                ? "bg-primary/10 border-primary/20"
                : "bg-muted/30 border-border",
            ].join(" ")}
          >
            <Package
              className={[
                "h-4 w-4",
                isActive ? "text-primary" : "text-muted-foreground",
              ].join(" ")}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground truncate font-display">
                {product.name}
              </span>
              <Badge variant="secondary" className="text-xs shrink-0">
                {product.parts.length}{" "}
                {product.parts.length === 1 ? "дел" : "дела"}
              </Badge>
              <Badge
                variant={isActive ? "default" : "outline"}
                className="text-xs shrink-0"
              >
                {isActive ? "Активен" : "Неактивен"}
              </Badge>
            </div>
            {product.parts.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {product.parts
                  .map(
                    (p) =>
                      `${p.name} (${Number(p.lengthCm)}×${Number(p.widthCm)}×${Number(p.heightCm)} cm)`,
                  )
                  .join(" · ")}
              </p>
            )}
          </div>

          <span className="text-muted-foreground ml-1 shrink-0">
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        </button>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(product)}
            data-ocid={`edit-product-${product.id}`}
            aria-label="Уреди производ"
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onToggleActive(product)}
            data-ocid={`toggle-active-${product.id}`}
            aria-label={isActive ? "Деактивирај" : "Активирај"}
            className={[
              "h-8 w-8",
              isActive
                ? "text-muted-foreground hover:text-accent"
                : "text-muted-foreground hover:text-primary",
            ].join(" ")}
          >
            <Power className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(product)}
            data-ocid={`delete-product-${product.id}`}
            aria-label="Избриши производ"
            className="h-8 w-8 text-destructive/60 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Expanded parts list (read-only overview) */}
      {expanded && (
        <div className="border-t border-border bg-background/50 px-4 pb-4 pt-3 space-y-2">
          {product.parts.length === 0 ? (
            <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground border border-dashed border-border rounded-lg justify-center">
              <Layers className="h-4 w-4" />
              Нема делови — уредете го производот за да додадете
            </div>
          ) : (
            product.parts.map((part) => (
              <div
                key={String(part.id)}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card text-sm"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground truncate">
                      {part.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono bg-muted/40 px-2 py-0.5 rounded">
                      {Number(part.lengthCm)}×{Number(part.widthCm)}×
                      {Number(part.heightCm)} cm
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      Дно: {bottomSideLabel(part.bottomSide)}
                    </Badge>
                    {part.weightKg > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {part.weightKg} kg
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <Button
            size="sm"
            variant="outline"
            className="w-full border-dashed text-xs mt-1"
            onClick={() => {
              setExpanded(false);
            }}
            data-ocid={`edit-product-inline-${product.id}`}
          >
            <Pencil className="h-3.5 w-3.5" />
            Уреди производ и делови
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  const activeCount = products.filter((p) => p.active !== false).length;
  const totalParts = products.reduce((sum, p) => sum + p.parts.length, 0);

  const handleToggleActive = async (product: Product) => {
    const isActive = product.active !== false;
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        name: product.name,
        active: !isActive,
        parts: product.parts,
      });
      toast.success(
        isActive
          ? `„${product.name}" е деактивиран`
          : `„${product.name}" е активиран`,
      );
    } catch {
      toast.error("Грешка при промена на статус");
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct.mutateAsync(deletingProduct.id);
      toast.success(`„${deletingProduct.name}" е избришан`);
      setDeletingProduct(null);
    } catch {
      toast.error("Грешка при бришење");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Page header */}
      <div className="section-header flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground tracking-tight">
            Модели
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Каталог на мебелски модели —{" "}
            <span className="text-foreground font-medium">{activeCount}</span>{" "}
            активни,{" "}
            <span className="text-foreground font-medium">
              {products.length}
            </span>{" "}
            вкупно,{" "}
            <span className="text-foreground font-medium">{totalParts}</span>{" "}
            дела
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowCreateModal(true)}
          data-ocid="add-product-btn"
        >
          <Plus className="h-4 w-4" />
          Нов модел
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          aria-label="Пребарај модели"
          className="w-full rounded-md border border-input bg-card pl-9 pr-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Пребарај модели по назив..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="products-search-input"
        />
        {search && (
          <button
            type="button"
            aria-label="Исчисти пребарување"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
            onClick={() => setSearch("")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner size="md" label="Се вчитуваат моделите..." />
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-3 py-16 border border-dashed border-border rounded-lg text-center"
          data-ocid="products-empty-state"
        >
          <div className="h-14 w-14 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
            <Package className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {search ? "Нема модели кои одговараат" : "Нема модели"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {search
                ? "Обидете се со друг термин"
                : "Создајте го вашиот прв модел за да почнете"}
            </p>
          </div>
          {!search && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              data-ocid="empty-add-product-btn"
            >
              <Plus className="h-4 w-4" />
              Нов модел
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3" data-ocid="products-list">
          {filtered.map((product) => (
            <ProductCard
              key={String(product.id)}
              product={product}
              onEdit={setEditingProduct}
              onToggleActive={handleToggleActive}
              onDelete={setDeletingProduct}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreateModal && (
        <ProductFormModal open onClose={() => setShowCreateModal(false)} />
      )}

      {/* Edit modal */}
      {editingProduct && (
        <ProductFormModal
          open
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
        />
      )}

      {/* Delete confirmation */}
      <Modal
        open={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        title="Избриши производ"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                „{deletingProduct?.name}"
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Производот и сите негови делови ќе бидат трајно избришани.
                Постоечките нарачки нема да бидат засегнати.
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeletingProduct(null)}
            >
              Откажи
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => void handleDelete()}
              loading={deleteProduct.isPending}
              data-ocid="confirm-delete-product-btn"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Избриши
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
