/**
 * BottomSidePanel.tsx
 * Side panel for selecting the "bottom face" of a cargo part.
 */

import { Button } from "@/components/ui/AppButton";
import { BottomSide } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const SIDES: { value: BottomSide; label: string; desc: string }[] = [
  { value: BottomSide.Bottom, label: "Дно", desc: "Стандардно — дното надолу" },
  { value: BottomSide.Top, label: "Горе", desc: "Врвот надолу" },
  { value: BottomSide.Front, label: "Напред", desc: "Предната страна надолу" },
  { value: BottomSide.Back, label: "Назад", desc: "Задната страна надолу" },
  { value: BottomSide.Left, label: "Лево", desc: "Левата страна надолу" },
  { value: BottomSide.Right, label: "Десно", desc: "Десната страна надолу" },
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
      className="absolute top-4 right-4 w-64 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
      data-ocid="bottom-side-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Избери дно
          </span>
          <span className="text-xs text-muted-foreground truncate mt-0.5">
            {partLabel}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Затвори"
          className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Side buttons */}
      <div className="p-3 flex flex-col gap-1.5">
        {SIDES.map((side) => {
          const isActive = currentSide === side.value;
          return (
            <button
              key={side.value}
              type="button"
              onClick={() => onSelect(side.value)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-smooth",
                isActive
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border bg-muted/10 text-muted-foreground hover:border-primary/30 hover:bg-muted/30 hover:text-foreground",
              )}
              data-ocid={`bottom-side-btn-${side.value.toLowerCase()}`}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-md border-2 shrink-0 flex items-center justify-center",
                  isActive ? "border-primary bg-primary/20" : "border-border",
                )}
                aria-hidden="true"
              >
                <BottomSideIcon side={side.value} active={isActive} />
              </div>
              <div className="flex flex-col min-w-0">
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
                <span className="ml-auto h-2 w-2 rounded-full bg-primary shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <div className="px-3 pb-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="w-full"
        >
          Затвори
        </Button>
      </div>
    </div>
  );
}

// ── Side icons ────────────────────────────────────────────────────────────────

function BottomSideIcon({
  side,
  active,
}: { side: BottomSide; active: boolean }) {
  const base = "rounded-sm shrink-0";
  const clr = active ? "bg-primary" : "bg-muted-foreground";

  const icons: Record<BottomSide, React.ReactNode> = {
    [BottomSide.Bottom]: (
      <div className="flex flex-col gap-px">
        <div className={cn(base, "h-3.5 w-5 opacity-30", clr)} />
        <div className={cn(base, "h-1 w-5", clr)} />
      </div>
    ),
    [BottomSide.Top]: (
      <div className="flex flex-col gap-px">
        <div className={cn(base, "h-1 w-5", clr)} />
        <div className={cn(base, "h-3.5 w-5 opacity-30", clr)} />
      </div>
    ),
    [BottomSide.Front]: (
      <div className="flex flex-row gap-px">
        <div className={cn(base, "h-5 w-3.5 opacity-30", clr)} />
        <div className={cn(base, "h-5 w-1", clr)} />
      </div>
    ),
    [BottomSide.Back]: (
      <div className="flex flex-row gap-px">
        <div className={cn(base, "h-5 w-1", clr)} />
        <div className={cn(base, "h-5 w-3.5 opacity-30", clr)} />
      </div>
    ),
    [BottomSide.Left]: (
      <div className="flex flex-row gap-px items-center">
        <div className={cn(base, "h-2 w-1", clr)} />
        <div className={cn(base, "h-5 w-3.5 opacity-30", clr)} />
      </div>
    ),
    [BottomSide.Right]: (
      <div className="flex flex-row gap-px items-center">
        <div className={cn(base, "h-5 w-3.5 opacity-30", clr)} />
        <div className={cn(base, "h-2 w-1", clr)} />
      </div>
    ),
  };
  return <>{icons[side]}</>;
}
