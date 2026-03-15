"use client";

import * as React from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SheetContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheetContext() {
  const value = React.useContext(SheetContext);
  if (!value) {
    throw new Error("Sheet components must be used within <Sheet>.");
  }
  return value;
}

function Sheet({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const value = isControlled ? open : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  return <SheetContext.Provider value={{ open: value, setOpen }}>{children}</SheetContext.Provider>;
}

function SheetTrigger({
  children,
  render,
}: {
  children: React.ReactNode;
  render?: React.ReactElement;
}) {
  const { setOpen } = useSheetContext();
  const element = render ?? <button type="button" />;

  return React.cloneElement(element, {
    ...element.props,
    onClick: (event: React.MouseEvent) => {
      element.props.onClick?.(event);
      if (!event.defaultPrevented) setOpen(true);
    },
    children,
  });
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
}: {
  className?: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}) {
  const { open, setOpen } = useSheetContext();
  if (!open) return null;

  const sideClasses = {
    top: "inset-x-0 top-0",
    right: "inset-y-0 right-0 h-full w-3/4 max-w-sm",
    bottom: "inset-x-0 bottom-0",
    left: "inset-y-0 left-0 h-full w-3/4 max-w-sm",
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className={cn("fixed z-50 bg-background shadow-xl", sideClasses[side], className)}>
        {children}
        {showCloseButton && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-3 top-3"
            onClick={() => setOpen(false)}
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
    </>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-0.5 p-4", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-base font-medium", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function SheetClose({
  children,
  render,
}: {
  children: React.ReactNode;
  render?: React.ReactElement;
}) {
  const { setOpen } = useSheetContext();
  const element = render ?? <button type="button" />;

  return React.cloneElement(element, {
    ...element.props,
    onClick: (event: React.MouseEvent) => {
      element.props.onClick?.(event);
      if (!event.defaultPrevented) setOpen(false);
    },
    children,
  });
}

function SheetPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function SheetOverlay({ className }: { className?: string }) {
  const { open } = useSheetContext();
  if (!open) return null;
  return <div className={cn("fixed inset-0 z-50 bg-black/40", className)} />;
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetPortal,
  SheetOverlay,
};
