"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
};

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { checked, defaultChecked, onCheckedChange, disabled, id, className, ...props },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
    const isControlled = checked !== undefined;
    const value = isControlled ? checked : internalChecked;

    function toggle() {
      if (disabled) return;
      const next = !value;
      if (!isControlled) setInternalChecked(next);
      onCheckedChange?.(next);
    }

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          value ? "bg-primary" : "bg-input",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform",
            value ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
