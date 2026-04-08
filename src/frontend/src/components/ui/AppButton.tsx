import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";
/**
 * Button.tsx — re-exports shadcn button with loading support added
 */
import { forwardRef } from "react";
import type { ComponentProps } from "react";
import { buttonVariants } from "./button";

export { buttonVariants } from "./button";

interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant,
      size,
      loading = false,
      className,
      disabled,
      asChild: _asChild,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading && (
          <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
