import * as React from "react"
import { cn } from "@/lib/utils"

export const modalOverlayClass = cn(
  "fixed inset-0 bg-black/45 supports-backdrop-filter:backdrop-blur-xs",
)

type ModalBackdropProps = React.ComponentProps<"div"> & {
  onDismiss?: () => void
}

export function ModalBackdrop({ className, onDismiss, onClick, ...props }: ModalBackdropProps) {
  return (
    <div
      aria-hidden
      onClick={(e) => {
        onClick?.(e)
        if (onDismiss && e.target === e.currentTarget) onDismiss()
      }}
      className={cn(modalOverlayClass, className)}
      {...props}
    />
  )
}
