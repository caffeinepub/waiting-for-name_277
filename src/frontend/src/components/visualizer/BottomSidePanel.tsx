/**
 * BottomSidePanel.tsx
 * Floating panel (absolute top-right over the 3D canvas) for selecting
 * the "bottom face" of the currently selected cargo part.
 * Labels are in Macedonian.
 */

import { BottomSide } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const SIDES: { value: BottomSide; label: string; desc: string }[] = [
  { value: BottomSide.Bottom, label: "Дно", desc: "Стандардно дно надолу" },
  { value: BottomSide.Top, label: "Врв", desc: "Врвот надолу" },
  { value: BottomSide.Front, label: "Предна", desc: "Предната страна надолу" },
  { value: BottomSide.Back, label: "Задна", desc: "Задната страна надолу" },
  { value: BottomSide.Left, label: "Лева", desc: "Левата страна надолу" },
  { value: BottomSide.Right, label: "Десна", desc: "Десната страна надолу" },
];

interface BottomSidePanelProps {
  partLabel: string;
  currentSide: BottomSide | null;
  onSelect: (side: BottomSide) => void;
  onClose: () => void;
}

export function BottomSidePanel({
  partLabel,
  currentSide,
  onSelect,
  onClose,
}: BottomSidePanelProps) {
  return (
    <div
      className="absolute top-4 right-4 w-60 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
      data-ocid="bottom-side-panel"
      // Prevent pointer events from reaching the canvas below (stops orbit)
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-muted/30">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Избери страна — дно
          </span>
          <span className="text-xs text-muted-foreground truncate mt-0.5">
            {partLabel}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Затвори"
          className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Side buttons */}
      <div className="p-2 flex flex-col gap-1">
        {SIDES.map((side) => {
          const isActive = currentSide === side.value;
          return (
            <button
              key={side.value}
              type="button"
              onClick={() => onSelect(side.value)}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg border text-left transition-colors",
                isActive
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border bg-muted/10 text-muted-foreground hover:border-primary/30 hover:bg-muted/30 hover:text-foreground",
              )}
              data-ocid={`bottom-side-btn-${side.value.toLowerCase()}`}
            >
              <SideIcon side={side.value} active={isActive} />
              <div className="flex flex-col min-w-0 flex-1">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    isActive ? "text-primary" : "text-foreground",
                  )}
                >
                  {side.label}
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  {side.desc}
                </span>
              </div>
              {isActive && (
                <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <div className="px-2 pb-2">
        <button
          type="button"
          onClick={onClose}
          className="w-full text-xs text-muted-foreground hover:text-foreground py-1.5 rounded-md hover:bg-muted/30 transition-colors"
        >
          Затвори
        </button>
      </div>
    </div>
  );
}

// ── Side icon mini-graphic ────────────────────────────────────────────────────

function SideIcon({ side, active }: { side: BottomSide; active: boolean }) {
  const clr = active ? "bg-primary" : "bg-muted-foreground/60";

  const icons: Record<BottomSide, React.ReactNode> = {
    [BottomSide.Bottom]: (
      <div className="flex flex-col gap-0.5 h-6 w-6 items-center justify-center shrink-0">
        <div className={cn("rounded-sm h-3 w-5 opacity-40", clr)} />
        <div className={cn("rounded-sm h-1 w-5", clr)} />
      </div>
    ),
    [BottomSide.Top]: (
      <div className="flex flex-col gap-0.5 h-6 w-6 items-center justify-center shrink-0">
        <div className={cn("rounded-sm h-1 w-5", clr)} />
        <div className={cn("rounded-sm h-3 w-5 opacity-40", clr)} />
      </div>
    ),
    [BottomSide.Front]: (
      <div className="flex flex-row gap-0.5 h-6 w-6 items-center justify-center shrink-0">
        <div className={cn("rounded-sm h-5 w-3 opacity-40", clr)} />
        <div className={cn("rounded-sm h-5 w-1", clr)} />
      </div>
    ),
    [BottomSide.Back]: (
      <div className="flex flex-row gap-0.5 h-6 w-6 items-center justify-center shrink-0">
        <div className={cn("rounded-sm h-5 w-1", clr)} />
        <div className={cn("rounded-sm h-5 w-3 opacity-40", clr)} />
      </div>
    ),
    [BottomSide.Left]: (
      <div className="flex flex-row gap-0.5 h-6 w-6 items-center justify-center shrink-0">
        <div className={cn("rounded-sm h-2 w-1", clr)} />
        <div className={cn("rounded-sm h-5 w-3 opacity-40", clr)} />
      </div>
    ),
    [BottomSide.Right]: (
      <div className="flex flex-row gap-0.5 h-6 w-6 items-center justify-center shrink-0">
        <div className={cn("rounded-sm h-5 w-3 opacity-40", clr)} />
        <div className={cn("rounded-sm h-2 w-1", clr)} />
      </div>
    ),
  };
  return <>{icons[side]}</>;
}
