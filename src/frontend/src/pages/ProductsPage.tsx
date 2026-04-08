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
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Bottom Side Options ──────────────────────────────────────────────────────

const BOTTOM_SIDE_OPTIONS: { value: BottomSide; label: string }[] = [
  { value: BottomSide.Bottom, label: "Дно" },
  { value: BottomSide.Top, label: "Горе" },
  { value: BottomSide.Front, label: "Напред" },
  { value: BottomSide.Back, label: "Назад" },
  { value: BottomSide.Left, label: "Лево" },
  { value: BottomSide.Right, label: "Десно" },
];

function bottomSideLabel(side: BottomSide): string {
  return (
    BOTTOM_SIDE_OPTIONS.find((o) => o.value === side)?.label ?? String(side)
  );
}

// ─── Part Form ────────────────────────────────────────────────────────────────

interface PartFormData {
  name: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  weightKg: string;
  bottomSide: BottomSide;
}

interface PartEditorProps {
  part?: Part;
  onSave: (data: {
    name: string;
    lengthCm: bigint;
    widthCm: bigint;
    heightCm: bigint;
    weightKg: number;
    bottomSide: BottomSide;
  }) => void;
  onCancel: () => void;
  isSaving: boolean;
}

function PartEditor({ part, onSave, onCancel, isSaving }: PartEditorProps) {
  const uid = useId();
  const [form, setForm] = useState<PartFormData>(() => ({
    name: part?.name ?? "",
    lengthCm: part ? String(Number(part.lengthCm)) : "",
    widthCm: part ? String(Number(part.widthCm)) : "",
    heightCm: part ? String(Number(part.heightCm)) : "",
    weightKg: part ? String(part.weightKg) : "",
    bottomSide: part?.bottomSide ?? BottomSide.Bottom,
  }));

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Внесете го името на делот");
      return;
    }
    const l = Number.parseFloat(form.lengthCm);
    const w = Number.parseFloat(form.widthCm);
    const h = Number.parseFloat(form.heightCm);
    if (!l || !w || !h || l <= 0 || w <= 0 || h <= 0) {
      toast.error("Внесете валидни димензии");
      return;
    }
    onSave({
      name: form.name.trim(),
      lengthCm: BigInt(Math.round(l)),
      widthCm: BigInt(Math.round(w)),
      heightCm: BigInt(Math.round(h)),
      weightKg: form.weightKg ? Number.parseFloat(form.weightKg) : 0,
      bottomSide: form.bottomSide,
    });
  };

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-4">
      <div className="space-y-1">
        <label
          htmlFor={`${uid}-part-name`}
          className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
        >
          Назив на дел
        </label>
        <input
          id={`${uid}-part-name`}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="пр. Лева секција"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          data-ocid="part-name-input"
        />
      </div>

      {/* Dimensions */}
      <div className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">
          Димензии (Д×Ш×В во cm)
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(["lengthCm", "widthCm", "heightCm"] as const).map((dim) => (
            <div key={dim} className="relative">
              <label htmlFor={`${uid}-dim-${dim}`} className="sr-only">
                {dim === "lengthCm"
                  ? "Должина"
                  : dim === "widthCm"
                    ? "Ширина"
                    : "Висина"}
              </label>
              <input
                id={`${uid}-dim-${dim}`}
                type="number"
                min="0"
                className="w-full rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={
                  dim === "lengthCm" ? "Д" : dim === "widthCm" ? "Ш" : "В"
                }
                value={form[dim]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [dim]: e.target.value }))
                }
                data-ocid={`part-dim-${dim}`}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                cm
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom side */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">
          Дно (страна која е надолу)
        </span>
        <div className="flex flex-wrap gap-2">
          {BOTTOM_SIDE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, bottomSide: opt.value }))}
              data-ocid={`bottom-side-${opt.value}`}
              className={[
                "px-3 py-1.5 rounded-md text-xs font-medium border transition-smooth",
                form.bottomSide === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div className="space-y-1">
        <label
          htmlFor={`${uid}-part-weight`}
          className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
        >
          Тежина (kg) — незадолжително
        </label>
        <div className="relative w-32">
          <input
            id={`${uid}-part-weight`}
            type="number"
            min="0"
            className="w-full rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="0"
            value={form.weightKg}
            onChange={(e) =>
              setForm((f) => ({ ...f, weightKg: e.target.value }))
            }
            data-ocid="part-weight-input"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            kg
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          variant="default"
          onClick={handleSave}
          loading={isSaving}
          data-ocid="save-part-btn"
        >
          <Check className="h-3.5 w-3.5" />
          Зачувај дел
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          <X className="h-3.5 w-3.5" />
          Откажи
        </Button>
      </div>
    </div>
  );
}

// ─── Parts Panel ──────────────────────────────────────────────────────────────

function PartsPanel({ product }: { product: Product }) {
  const [addingPart, setAddingPart] = useState(false);
  const [editingPartId, setEditingPartId] = useState<PartId | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<PartId | null>(null);

  const addPart = useAddPart();
  const updatePart = useUpdatePart();
  const deletePart = useDeletePart();

  const handleAddPart = async (data: {
    name: string;
    lengthCm: bigint;
    widthCm: bigint;
    heightCm: bigint;
    weightKg: number;
    bottomSide: BottomSide;
  }) => {
    await addPart.mutateAsync({ productId: product.id, ...data });
    toast.success("Делот е додаден");
    setAddingPart(false);
  };

  const handleUpdatePart = async (
    partId: PartId,
    data: {
      name: string;
      lengthCm: bigint;
      widthCm: bigint;
      heightCm: bigint;
      weightKg: number;
      bottomSide: BottomSide;
    },
  ) => {
    await updatePart.mutateAsync({ productId: product.id, partId, ...data });
    toast.success("Делот е ажуриран");
    setEditingPartId(null);
  };

  const handleDeletePart = async (partId: PartId) => {
    await deletePart.mutateAsync({ productId: product.id, partId });
    toast.success("Делот е избришан");
    setConfirmDeleteId(null);
  };

  return (
    <div className="px-4 pb-4 pt-3 space-y-3">
      {product.parts.length === 0 && !addingPart && (
        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground border border-dashed border-border rounded-lg justify-center">
          <Layers className="h-4 w-4" />
          Нема додадени делови
        </div>
      )}

      {product.parts.map((part) => (
        <div
          key={String(part.id)}
          className="rounded-lg border border-border bg-card"
        >
          {editingPartId === part.id ? (
            <div className="p-3">
              <PartEditor
                part={part}
                onSave={(data) => handleUpdatePart(part.id, data)}
                onCancel={() => setEditingPartId(null)}
                isSaving={updatePart.isPending}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground truncate">
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
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingPartId(part.id)}
                  data-ocid={`edit-part-${part.id}`}
                  aria-label="Уреди дел"
                  className="h-7 w-7"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setConfirmDeleteId(part.id)}
                  data-ocid={`delete-part-${part.id}`}
                  aria-label="Избриши дел"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      {addingPart ? (
        <PartEditor
          onSave={handleAddPart}
          onCancel={() => setAddingPart(false)}
          isSaving={addPart.isPending}
        />
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setAddingPart(true)}
          data-ocid={`add-part-${product.id}`}
          className="w-full border-dashed"
        >
          <Plus className="h-3.5 w-3.5" />
          Додај дел
        </Button>
      )}

      <Modal
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        title="Избриши дел"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">
              Дали сте сигурни дека сакате да го избришете овој дел? Оваа акција
              не може да се откаже.
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmDeleteId(null)}
            >
              Откажи
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                confirmDeleteId !== null && handleDeletePart(confirmDeleteId)
              }
              loading={deletePart.isPending}
              data-ocid="confirm-delete-part-btn"
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

// ─── Model Row ────────────────────────────────────────────────────────────────

function ModelRow({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card card-interactive overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          className="flex items-center gap-3 flex-1 min-w-0 text-left"
          onClick={() => setExpanded((v) => !v)}
          data-ocid={`expand-model-${product.id}`}
          aria-expanded={expanded}
        >
          <div className="h-8 w-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground truncate font-display">
                {product.name}
              </span>
              <Badge variant="secondary" className="text-xs">
                {product.parts.length}{" "}
                {product.parts.length === 1 ? "дел" : "дела"}
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

        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(product)}
            data-ocid={`edit-model-${product.id}`}
            aria-label="Уреди модел"
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(product)}
            data-ocid={`delete-model-${product.id}`}
            aria-label="Деактивирај модел"
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border bg-background/50">
          <PartsPanel product={product} />
        </div>
      )}
    </div>
  );
}

// ─── Create / Edit Model Modal ────────────────────────────────────────────────

function ModelModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product?: Product;
}) {
  const uid = useId();
  const [name, setName] = useState(product?.name ?? "");

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isPending = createProduct.isPending || updateProduct.isPending;

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Внесете го името на моделот");
      return;
    }
    if (product) {
      await updateProduct.mutateAsync({
        id: product.id,
        name: name.trim(),
        active: true,
        parts: product.parts,
      });
      toast.success("Моделот е ажуриран");
    } else {
      await createProduct.mutateAsync(name.trim());
      toast.success("Моделот е создаден");
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? "Уреди модел" : "Нов модел"}
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor={`${uid}-model-name`}
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            Назив на модел *
          </label>
          <input
            id={`${uid}-model-name`}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="пр. Кутна Гарнитура Луксуз"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void handleSave()}
            data-ocid="model-name-input"
          />
        </div>

        {!product && (
          <p className="text-xs text-muted-foreground bg-muted/30 rounded-md px-3 py-2 border border-border">
            По создавањето, можете да додавате делови со нивните димензии и
            ориентација на дното.
          </p>
        )}

        <div className="flex gap-2 justify-end pt-1">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Откажи
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            loading={isPending}
            data-ocid="save-model-btn"
          >
            <Check className="h-3.5 w-3.5" />
            {product ? "Зачувај промени" : "Создај модел"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const activeProducts = products.filter((p) => p.active !== false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return activeProducts;
    return activeProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [activeProducts, search]);

  const handleDelete = async () => {
    if (!deletingProduct) return;
    await deleteProduct.mutateAsync(deletingProduct.id);
    toast.success(`„${deletingProduct.name}" е деактивиран`);
    setDeletingProduct(null);
  };

  const totalParts = activeProducts.reduce((sum, p) => sum + p.parts.length, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Page header */}
      <div className="section-header flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground tracking-tight">
            Модели
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Каталог на мебелски модели и нивните делови —{" "}
            <span className="text-foreground font-medium">
              {activeProducts.length}
            </span>{" "}
            модели,{" "}
            <span className="text-foreground font-medium">{totalParts}</span>{" "}
            делови вкупно
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowCreateModal(true)}
          data-ocid="add-model-btn"
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
          data-ocid="models-search-input"
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
          data-ocid="models-empty-state"
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
              data-ocid="empty-add-model-btn"
            >
              <Plus className="h-4 w-4" />
              Нов модел
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3" data-ocid="models-list">
          {filtered.map((product) => (
            <ModelRow
              key={String(product.id)}
              product={product}
              onEdit={setEditingProduct}
              onDelete={setDeletingProduct}
            />
          ))}
        </div>
      )}

      <ModelModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {editingProduct && (
        <ModelModal
          open
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
        />
      )}

      <Modal
        open={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        title="Деактивирај модел"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                „{deletingProduct?.name}"
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Моделот ќе биде деактивиран. Постоечките нарачки нема да бидат
                засегнати.
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
              onClick={handleDelete}
              loading={deleteProduct.isPending}
              data-ocid="confirm-delete-model-btn"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Деактивирај
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
