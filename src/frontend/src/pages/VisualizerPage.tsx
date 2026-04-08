/**
 * VisualizerPage.tsx
 * 3Д Визуализација page.
 * - Persistent truck dimensions (localStorage).
 * - TruckLoad selector.
 * - Full 3D scene with draggable/rotatable cargo parts.
 */

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { BottomSidePanel } from "@/components/visualizer/BottomSidePanel";
import { TruckScene } from "@/components/visualizer/TruckScene";
import { VisualizerControls } from "@/components/visualizer/VisualizerControls";
import { BottomSide } from "@/hooks/useBackend";
import {
  useOptimizeTruckLoad,
  useOrders,
  useProducts,
  useTruckLoad,
  useTruckLoads,
  useUpdateTruckLoadPlacements,
} from "@/hooks/useBackend";
import type {
  Order,
  PartPlacement,
  Product,
  TruckLoad,
  TruckLoadId,
} from "@/types";
import {
  DEFAULT_TRUCK_DIMS,
  type ScenePart,
  TRUCK_DIMS_KEY,
  type TruckBounds,
} from "@/types/visualizer";
import { Box, Save, Truck } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Colors ───────────────────────────────────────────────────────────────────

const PART_COLORS = [
  "#22d3ee",
  "#a78bfa",
  "#34d399",
  "#fb923c",
  "#f472b6",
  "#facc15",
  "#60a5fa",
  "#e879f9",
];
function partColor(i: number) {
  return PART_COLORS[i % PART_COLORS.length];
}

// ─── Stacked initial layout ───────────────────────────────────────────────────

function stackedPosition(
  index: number,
  lCm: number,
  wCm: number,
  hCm: number,
  bounds: TruckBounds,
): [number, number, number] {
  // Place parts in a row along X, spaced by their width
  const spacing = 0.05; // 5cm gap in meters
  const bL = bounds.lengthCm / 100;
  const bW = bounds.widthCm / 100;

  const xM = lCm / 100 / 2 + index * (lCm / 100 + spacing);
  const yM = hCm / 100 / 2;
  const zM = wCm / 100 / 2;

  // Clamp within bounds
  return [
    Math.min(xM, bL - lCm / 100 / 2),
    Math.max(
      hCm / 100 / 2,
      Math.min(yM, bounds.heightCm / 100 - hCm / 100 / 2),
    ),
    Math.min(zM, bW - wCm / 100 / 2),
  ];
}

// ─── Build scene parts ────────────────────────────────────────────────────────

function buildSceneParts(
  truckLoad: TruckLoad,
  orders: Order[],
  products: Product[],
  bounds: TruckBounds,
): ScenePart[] {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const orderMap = new Map(orders.map((o) => [o.id, o]));
  const productColorMap = new Map<bigint, string>();
  let colorIdx = 0;
  const parts: ScenePart[] = [];

  for (const orderId of truckLoad.orderIds) {
    const order = orderMap.get(orderId);
    if (!order) continue;

    for (const item of order.items) {
      const product = productMap.get(item.productId);
      if (!product) continue;

      if (!productColorMap.has(product.id)) {
        productColorMap.set(product.id, partColor(colorIdx++));
      }
      const color = productColorMap.get(product.id) ?? "#22d3ee";

      for (let q = 0; q < Number(item.quantity); q++) {
        for (let pi = 0; pi < product.parts.length; pi++) {
          const part = product.parts[pi];
          const key = `${String(orderId)}__${String(product.id)}__${String(part.id)}__${q}__${pi}`;

          const lCm = Number(part.lengthCm);
          const wCm = Number(part.widthCm);
          const hCm = Number(part.heightCm);

          // Try to find an existing saved placement for this part
          const existing = truckLoad.loadingScheme.find(
            (pl) =>
              pl.partId === part.id &&
              pl.productId === product.id &&
              pl.orderId === orderId,
          );

          // Positions from backend are in cm; convert to meters for 3D
          const position: [number, number, number] = existing
            ? [existing.posX / 100, existing.posY / 100, existing.posZ / 100]
            : stackedPosition(parts.length, lCm, wCm, hCm, bounds);

          const rotation: [number, number, number] = [0, 0, 0];

          parts.push({
            key,
            orderId,
            productId: product.id,
            partId: part.id,
            label: `${product.name} — ${part.name}`,
            lengthCm: lCm,
            widthCm: wCm,
            heightCm: hCm,
            position,
            rotation,
            bottomSide: part.bottomSide ?? BottomSide.Bottom,
            color,
          });
        }
      }
    }
  }

  return parts;
}

// ─── Convert scene parts to PartPlacement[] ──────────────────────────────────

function toPlacements(parts: ScenePart[]): PartPlacement[] {
  return parts.map((p) => ({
    partId: p.partId,
    productId: p.productId,
    orderId: p.orderId,
    // Convert back to cm for backend storage
    posX: p.position[0] * 100,
    posY: p.position[1] * 100,
    posZ: p.position[2] * 100,
    rotX: p.rotation[0],
    rotY: p.rotation[1],
    rotZ: p.rotation[2],
    rotW: 1,
  }));
}

// ─── Truck Dimensions Panel ───────────────────────────────────────────────────

interface TruckDimsPanelProps {
  dims: TruckBounds;
  onSave: (dims: TruckBounds) => void;
}

function TruckDimsPanel({ dims, onSave }: TruckDimsPanelProps) {
  const [localDims, setLocalDims] = useState<TruckBounds>(dims);
  const dirty = useRef(false);

  // Sync when parent dims change (e.g. initial load)
  useEffect(() => {
    if (!dirty.current) setLocalDims(dims);
  }, [dims]);

  function handleChange(field: keyof TruckBounds, raw: string) {
    const v = Number.parseInt(raw, 10);
    if (!Number.isNaN(v) && v > 0) {
      dirty.current = true;
      setLocalDims((prev) => ({ ...prev, [field]: v }));
    }
  }

  function handleSave() {
    dirty.current = false;
    onSave(localDims);
    toast.success("Димензиите на камионот се зачувани");
  }

  return (
    <div className="bg-card border-b border-border px-5 py-3 flex flex-wrap items-end gap-4">
      <div className="flex items-center gap-2 shrink-0">
        <div className="h-7 w-7 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Truck className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-sm font-semibold text-foreground">
          Димензии на камион
        </span>
      </div>

      <div className="flex flex-wrap gap-3 items-end flex-1">
        {(
          [
            { field: "lengthCm" as const, label: "Должина (cm)" },
            { field: "widthCm" as const, label: "Ширина (cm)" },
            { field: "heightCm" as const, label: "Висина (cm)" },
          ] as { field: keyof TruckBounds; label: string }[]
        ).map(({ field, label }) => (
          <label key={field} className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{label}</span>
            <input
              type="number"
              min={50}
              max={2000}
              value={localDims[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-24 px-2.5 py-1.5 text-sm bg-muted/20 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 font-mono"
              data-ocid={`truck-dim-${field}`}
            />
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-sm text-primary font-semibold hover:bg-primary/20 transition-colors shrink-0"
        data-ocid="truck-dims-save-btn"
      >
        <Save className="h-3.5 w-3.5" />
        Зачувај димензии
      </button>
    </div>
  );
}

// ─── Load truck dimensions from localStorage ──────────────────────────────────

function loadTruckDims(): TruckBounds {
  try {
    const raw = localStorage.getItem(TRUCK_DIMS_KEY);
    if (!raw) return DEFAULT_TRUCK_DIMS;
    const parsed = JSON.parse(raw) as Partial<TruckBounds>;
    return {
      lengthCm: parsed.lengthCm ?? DEFAULT_TRUCK_DIMS.lengthCm,
      widthCm: parsed.widthCm ?? DEFAULT_TRUCK_DIMS.widthCm,
      heightCm: parsed.heightCm ?? DEFAULT_TRUCK_DIMS.heightCm,
    };
  } catch {
    return DEFAULT_TRUCK_DIMS;
  }
}

function saveTruckDims(dims: TruckBounds) {
  localStorage.setItem(TRUCK_DIMS_KEY, JSON.stringify(dims));
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function VisualizerPage() {
  const { data: truckLoads = [], isLoading: loadsLoading } = useTruckLoads();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  const [selectedLoadId, setSelectedLoadId] = useState<TruckLoadId | null>(
    null,
  );
  const { data: selectedLoad } = useTruckLoad(selectedLoadId);

  const savePlacements = useUpdateTruckLoadPlacements();
  const optimizeMutation = useOptimizeTruckLoad();

  const [sceneParts, setSceneParts] = useState<ScenePart[]>([]);
  const [savedSnapshot, setSavedSnapshot] = useState<ScenePart[]>([]);
  const [selectedPartKey, setSelectedPartKey] = useState<string | null>(null);

  // Persistent truck dimensions from localStorage
  const [truckDims, setTruckDims] = useState<TruckBounds>(loadTruckDims);

  function handleSaveTruckDims(dims: TruckBounds) {
    saveTruckDims(dims);
    setTruckDims(dims);
  }

  const isLoading = loadsLoading || ordersLoading || productsLoading;

  // Capture truckDims in a ref so buildSceneParts uses latest dims
  // without truckDims itself triggering a full scene rebuild (which resets positions)
  const truckDimsRef = useRef(truckDims);
  truckDimsRef.current = truckDims;

  // Build scene parts when load/orders/products change (NOT when dims change)
  useEffect(() => {
    if (!selectedLoad) {
      setSceneParts([]);
      setSavedSnapshot([]);
      return;
    }
    const built = buildSceneParts(
      selectedLoad,
      orders,
      products,
      truckDimsRef.current,
    );
    setSceneParts(built);
    setSavedSnapshot(built);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLoad, orders, products]);

  const allBottomsSet = useMemo(
    () => sceneParts.length > 0 && sceneParts.every((p) => !!p.bottomSide),
    [sceneParts],
  );

  const selectedPart =
    sceneParts.find((p) => p.key === selectedPartKey) ?? null;

  const handlePositionChange = useCallback(
    (key: string, pos: [number, number, number]) => {
      setSceneParts((prev) =>
        prev.map((p) => (p.key === key ? { ...p, position: pos } : p)),
      );
    },
    [],
  );

  const handleRotationChange = useCallback(
    (key: string, rot: [number, number, number]) => {
      setSceneParts((prev) =>
        prev.map((p) => (p.key === key ? { ...p, rotation: rot } : p)),
      );
    },
    [],
  );

  const handleBottomSideChange = useCallback(
    (side: BottomSide) => {
      if (!selectedPartKey) return;
      setSceneParts((prev) =>
        prev.map((p) =>
          p.key === selectedPartKey ? { ...p, bottomSide: side } : p,
        ),
      );
    },
    [selectedPartKey],
  );

  async function handleSave() {
    if (!selectedLoadId) return;
    try {
      await savePlacements.mutateAsync({
        id: selectedLoadId,
        placements: toPlacements(sceneParts),
      });
      setSavedSnapshot(sceneParts);
      toast.success("Распоредот е зачуван успешно");
    } catch {
      toast.error("Грешка при зачувување");
    }
  }

  async function handleOptimize() {
    if (!selectedLoadId) return;
    if (!allBottomsSet) {
      toast.warning("Прво поставете ги сите дна пред оптимизација");
      return;
    }
    try {
      await optimizeMutation.mutateAsync(selectedLoadId);
      toast.success("Оптимизацијата е завршена — деловите се преарангирани");
    } catch {
      toast.error("Грешка при оптимизација");
    }
  }

  function handleReset() {
    setSceneParts(savedSnapshot);
    toast.info("Распоредот е ресетиран на последно зачуваната верзија");
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" label="Се вчитува визуализаторот..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 64px)" }}>
      {/* Truck dimensions settings (persistent) */}
      <TruckDimsPanel dims={truckDims} onSave={handleSaveTruckDims} />

      {/* Visualizer controls bar */}
      <VisualizerControls
        truckLoads={truckLoads}
        selectedLoadId={selectedLoadId}
        onSelectLoad={(id) => {
          setSelectedLoadId(id);
          setSelectedPartKey(null);
        }}
        parts={sceneParts}
        allBottomsSet={allBottomsSet}
        isOptimizing={optimizeMutation.isPending}
        isSaving={savePlacements.isPending}
        onOptimize={handleOptimize}
        onSave={handleSave}
        onReset={handleReset}
      />

      {/* Active load dimension info banner */}
      {selectedLoadId && selectedLoad && (
        <div className="bg-card/40 border-b border-border px-5 py-2 flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Активен товар:
          </span>
          {[
            {
              label: "Должина",
              value: Number(selectedLoad.truckDimensions.lengthCm),
            },
            {
              label: "Ширина",
              value: Number(selectedLoad.truckDimensions.widthCm),
            },
            {
              label: "Висина",
              value: Number(selectedLoad.truckDimensions.heightCm),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center gap-1 bg-primary/8 border border-primary/20 rounded px-2 py-0.5"
            >
              <span className="text-xs text-muted-foreground">{label}:</span>
              <span className="text-xs font-bold font-mono text-primary">
                {value} cm
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 3D Canvas area */}
      <div className="flex-1 relative" style={{ minHeight: "500px" }}>
        {!selectedLoadId ? (
          /* Empty state: no load selected */
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center bg-background"
            data-ocid="empty-state-visualizer"
          >
            <div className="h-20 w-20 rounded-2xl border border-border bg-muted/10 flex items-center justify-center">
              <Box className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground/60">
                Изберете товар за да ги видите деловите
              </p>
              <p className="text-sm text-muted-foreground/40 mt-1">
                Употребете го паѓачкото мени погоре за да изберете товар
              </p>
            </div>
          </div>
        ) : sceneParts.length === 0 ? (
          /* Empty state: load selected but no parts */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center bg-background">
            <p className="text-sm text-muted-foreground/60">
              Во овој товар нема делови за прикажување
            </p>
          </div>
        ) : (
          /* 3D Scene */
          <TruckScene
            bounds={truckDims}
            parts={sceneParts}
            selectedKey={selectedPartKey}
            onSelectPart={setSelectedPartKey}
            onPartPositionChange={handlePositionChange}
            onPartRotationChange={handleRotationChange}
          />
        )}

        {/* Instructions overlay — shown when parts loaded but none selected */}
        {selectedLoadId && sceneParts.length > 0 && !selectedPartKey && (
          <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur border border-border/50 rounded-lg px-3 py-2 pointer-events-none z-10">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">Кликни</span> дел за
              избор · <span className="text-foreground font-medium">Влечи</span>{" "}
              за преместување ·{" "}
              <span className="text-foreground font-medium">R</span> за ротирање
              ·{" "}
              <span className="text-foreground font-medium">
                Десен клик + влечи
              </span>{" "}
              за орбита
            </p>
          </div>
        )}

        {/* Bottom side selection panel — shown when a part is selected */}
        {selectedPartKey && selectedPart && (
          <BottomSidePanel
            partLabel={selectedPart.label}
            currentSide={selectedPart.bottomSide}
            onSelect={handleBottomSideChange}
            onClose={() => setSelectedPartKey(null)}
          />
        )}
      </div>
    </div>
  );
}
