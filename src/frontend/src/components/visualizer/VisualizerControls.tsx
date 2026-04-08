/**
 * VisualizerControls.tsx
 * Top control bar for the 3D visualizer.
 */

import { Button } from "@/components/ui/AppButton";
import { cn } from "@/lib/utils";
import type { TruckLoad, TruckLoadId } from "@/types";
import type { ScenePart } from "@/types/visualizer";
import {
  AlertTriangle,
  Box,
  ChevronDown,
  RotateCcw,
  Save,
  Sparkles,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VisualizerControlsProps {
  truckLoads: TruckLoad[];
  selectedLoadId: TruckLoadId | null;
  onSelectLoad: (id: TruckLoadId) => void;
  parts: ScenePart[];
  allBottomsSet: boolean;
  isOptimizing: boolean;
  isSaving: boolean;
  onOptimize: () => void;
  onSave: () => void;
  onReset: () => void;
}

export function VisualizerControls({
  truckLoads,
  selectedLoadId,
  onSelectLoad,
  parts,
  allBottomsSet,
  isOptimizing,
  isSaving,
  onOptimize,
  onSave,
  onReset,
}: VisualizerControlsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLoad = truckLoads.find(
    (l) => selectedLoadId !== null && l.id === selectedLoadId,
  );

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const notAllBottoms = parts.length > 0 && !allBottomsSet;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-card/90 backdrop-blur border-b border-border flex-wrap">
      {/* Title */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="h-7 w-7 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Box className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-sm font-bold font-display text-foreground">
          3Д Визуализација
        </span>
      </div>

      <div className="h-4 w-px bg-border shrink-0" />

      {/* Load selector */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-smooth min-w-[200px]",
            "bg-muted/20 border-border hover:border-primary/40 hover:bg-muted/30 text-foreground",
          )}
          data-ocid="load-selector"
        >
          <Truck className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="flex-1 text-left truncate">
            {selectedLoad
              ? `Товар #${String(selectedLoad.id)}`
              : "Избери товар..."}
          </span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform",
              dropdownOpen && "rotate-180",
            )}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-full min-w-[240px] bg-popover border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
            {truckLoads.length === 0 ? (
              <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                Нема достапни товари
              </div>
            ) : (
              <div className="max-h-52 overflow-y-auto">
                {truckLoads.map((load) => (
                  <button
                    type="button"
                    key={String(load.id)}
                    onClick={() => {
                      onSelectLoad(load.id);
                      setDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-muted/40 transition-smooth",
                      selectedLoadId !== null && load.id === selectedLoadId
                        ? "bg-primary/10 text-primary"
                        : "text-foreground",
                    )}
                    data-ocid={`select-load-${load.id}`}
                  >
                    <Truck className="h-3.5 w-3.5 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate font-medium">
                        Товар #{String(load.id)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {Number(load.truckDimensions.lengthCm)}×
                        {Number(load.truckDimensions.widthCm)}×
                        {Number(load.truckDimensions.heightCm)} cm ·{" "}
                        {load.orderIds.length} нарачки
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Parts count */}
      {parts.length > 0 && (
        <span className="text-xs text-muted-foreground shrink-0">
          {parts.length} {parts.length === 1 ? "дел" : "делови"}
        </span>
      )}

      {/* Warning */}
      {notAllBottoms && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent/10 border border-accent/30 text-xs text-accent shrink-0">
          <AlertTriangle className="h-3.5 w-3.5" />
          Ги нема сите дна поставени
        </div>
      )}

      <div className="flex-1" />

      {/* Action buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {selectedLoadId !== null && parts.length > 0 && (
          <span className="hidden lg:block text-xs text-muted-foreground/60">
            R = ротирај
          </span>
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          disabled={selectedLoadId === null}
          data-ocid="visualizer-reset-btn"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Ресет
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOptimize}
          disabled={selectedLoadId === null || !allBottomsSet || isOptimizing}
          loading={isOptimizing}
          title={notAllBottoms ? "Прво поставете ги сите дна" : undefined}
          data-ocid="visualizer-optimize-btn"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Оптимизирај
        </Button>

        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={onSave}
          disabled={selectedLoadId === null || isSaving}
          loading={isSaving}
          data-ocid="visualizer-save-btn"
        >
          <Save className="h-3.5 w-3.5" />
          Зачувај
        </Button>
      </div>
    </div>
  );
}
