/**
 * VisualizerPage.tsx
 * 3Д Визуализација — full 3D truck loading view.
 * Shows truck dimensions prominently at top, then the 3D canvas.
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
import type { ScenePart, TruckBounds } from "@/types/visualizer";
import { Box } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Colour palette ───────────────────────────────────────────────────────────

const PRODUCT_COLORS = [
  "#22d3ee",
  "#a78bfa",
  "#34d399",
  "#fb923c",
  "#f472b6",
  "#facc15",
  "#60a5fa",
  "#e879f9",
];

function productColor(index: number): string {
  return PRODUCT_COLORS[index % PRODUCT_COLORS.length];
}

// ─── Build scene parts from truck load ───────────────────────────────────────

function buildSceneParts(
  truckLoad: TruckLoad,
  orders: Order[],
  products: Product[],
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
        productColorMap.set(product.id, productColor(colorIdx++));
      }
      const color = productColorMap.get(product.id) ?? "#22d3ee";

      for (let q = 0; q < Number(item.quantity); q++) {
        for (let pi = 0; pi < product.parts.length; pi++) {
          const part = product.parts[pi];
          const key = `${String(orderId)}__${String(product.id)}__${String(part.id)}__${q}__${pi}`;

          // Find existing placement
          const existing = truckLoad.loadingScheme.find(
            (pl) =>
              pl.partId === part.id &&
              pl.productId === product.id &&
              pl.orderId === orderId,
          );

          const lCm = Number(part.lengthCm);
          const wCm = Number(part.widthCm);
          const hCm = Number(part.heightCm);

          const position: [number, number, number] = existing
            ? [existing.posX, existing.posY, existing.posZ]
            : [50 + parts.length * 30, hCm / 2, 50];

          // Convert quaternion rot to euler (simplified – use stored euler if available)
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
    posX: p.position[0],
    posY: p.position[1],
    posZ: p.position[2],
    rotX: p.rotation[0],
    rotY: p.rotation[1],
    rotZ: p.rotation[2],
    rotW: 1,
  }));
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

  const isLoading = loadsLoading || ordersLoading || productsLoading;

  useEffect(() => {
    if (!selectedLoad) {
      setSceneParts([]);
      setSavedSnapshot([]);
      return;
    }
    const built = buildSceneParts(selectedLoad, orders, products);
    setSceneParts(built);
    setSavedSnapshot(built);
  }, [selectedLoad, orders, products]);

  const truckBounds = useMemo<TruckBounds>(() => {
    if (!selectedLoad) return { lengthCm: 620, widthCm: 240, heightCm: 250 };
    return {
      lengthCm: Number(selectedLoad.truckDimensions.lengthCm),
      widthCm: Number(selectedLoad.truckDimensions.widthCm),
      heightCm: Number(selectedLoad.truckDimensions.heightCm),
    };
  }, [selectedLoad]);

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
    <div
      className="flex flex-col h-full"
      style={{ minHeight: "calc(100vh - 120px)" }}
    >
      {/* Controls bar with load selector */}
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

      {/* Truck dimension banner — shown when a load is selected */}
      {selectedLoadId && selectedLoad && (
        <div className="bg-card/60 border-b border-border px-6 py-2.5 flex items-center gap-4 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Камион:
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
              className="flex items-center gap-1.5 bg-primary/8 border border-primary/20 rounded-md px-3 py-1"
            >
              <span className="text-xs text-muted-foreground">{label}:</span>
              <span className="text-sm font-bold font-mono text-primary">
                {value} cm
              </span>
            </div>
          ))}
          <span className="text-xs font-mono text-primary/70 ml-auto hidden sm:block">
            {Number(selectedLoad.truckDimensions.lengthCm)} ×{" "}
            {Number(selectedLoad.truckDimensions.widthCm)} ×{" "}
            {Number(selectedLoad.truckDimensions.heightCm)} cm
          </span>
        </div>
      )}

      {/* 3D Canvas area */}
      <div className="flex-1 relative bg-background">
        {!selectedLoadId ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center"
            data-ocid="empty-state-visualizer"
          >
            <div className="h-20 w-20 rounded-2xl border border-border bg-muted/10 flex items-center justify-center">
              <Box className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground/60">
                Изберете товар за визуализација
              </p>
              <p className="text-sm text-muted-foreground/40 mt-1">
                Употребете го паѓачкото мени погоре за да изберете товар
              </p>
            </div>
          </div>
        ) : sceneParts.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-muted-foreground/60">
              Во овој товар нема делови за прикажување
            </p>
          </div>
        ) : (
          <TruckScene
            bounds={truckBounds}
            parts={sceneParts}
            selectedKey={selectedPartKey}
            onSelectPart={setSelectedPartKey}
            onPartPositionChange={handlePositionChange}
            onPartRotationChange={handleRotationChange}
          />
        )}

        {/* Instructions overlay */}
        {selectedLoadId && sceneParts.length > 0 && !selectedPartKey && (
          <div className="absolute top-4 left-4 bg-card/70 backdrop-blur border border-border/50 rounded-lg px-3 py-2 pointer-events-none">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">Кликни</span> дел за
              избор · <span className="text-foreground font-medium">Влечи</span>{" "}
              за преместување ·{" "}
              <span className="text-foreground font-medium">R</span> за ротирање
            </p>
          </div>
        )}

        {/* Bottom side panel */}
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
