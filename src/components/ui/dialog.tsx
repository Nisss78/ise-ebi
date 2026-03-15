"use client";

import * as React from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const value = React.useContext(DialogContext);
  if (!value) {
    throw new Error("Dialog components must be used within <Dialog>.");
  }
  return value;
}

function Dialog({
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

  return (
    <DialogContext.Provider value={{ open: value, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({
  children,
  render,
}: {
  children: React.ReactNode;
  render?: React.ReactElement;
}) {
  const { setOpen } = useDialogContext();
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

function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DialogOverlay({ className }: { className?: string }) {
  const { open, setOpen } = useDialogContext();
  if (!open) return null;

  return (
    <div
      className={cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-sm", className)}
      onClick={() => setOpen(false)}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
}: {
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}) {
  const { open, setOpen } = useDialogContext();
  if (!open) return null;

  return (
    <DialogPortal>
      <DialogOverlay />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full max-w-[calc(100%-2rem)] rounded-xl bg-background p-4 text-sm shadow-xl ring-1 ring-foreground/10 sm:max-w-sm",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
          {showCloseButton && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute right-2 top-2"
              onClick={() => setOpen(false)}
            >
              <XIcon className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </div>
      </div>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "-mx-4 -mb-4 mt-2 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-base font-medium", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function DialogClose({
  children,
  render,
}: {
  children: React.ReactNode;
  render?: React.ReactElement;
}) {
  const { setOpen } = useDialogContext();
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

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
