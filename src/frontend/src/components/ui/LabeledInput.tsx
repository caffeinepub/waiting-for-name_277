import { cn } from "@/lib/utils";
/**
 * Input.tsx — extends shadcn input with label/error/hint support
 */
import { forwardRef } from "react";
import type { ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground dark:bg-input/30 border-input",
            "flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs",
            "transition-[color,box-shadow] outline-none",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            error && "border-destructive focus-visible:ring-destructive/20",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
