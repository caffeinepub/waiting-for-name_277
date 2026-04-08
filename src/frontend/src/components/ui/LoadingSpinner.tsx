import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
  fullPage?: boolean;
}

const sizeMap: Record<NonNullable<LoadingSpinnerProps["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export function LoadingSpinner({
  size = "md",
  label = "Се вчитува...",
  className,
  fullPage = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn("flex flex-col items-center gap-3", className)}
      aria-label={label}
      aria-live="polite"
    >
      <div
        className={cn(
          "rounded-full border-primary/30 border-t-primary animate-spin",
          sizeMap[size],
        )}
      />
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        {spinner}
      </div>
    );
  }

  return spinner;
}
