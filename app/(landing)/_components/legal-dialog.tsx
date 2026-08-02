"use client"

import type { LegalDocument } from "../_data/legal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface LegalDialogProps {
  document: LegalDocument | null
  onClose: () => void
}

export function LegalDialog({ document, onClose }: LegalDialogProps) {
  return (
    <Dialog open={Boolean(document)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] sm:max-w-lg md:max-w-xl overflow-y-auto">
        <DialogHeader className="pb-3 border-b border-neutral-200/70 dark:border-neutral-800">
          <DialogTitle className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-foreground">
            {document?.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500 font-medium mt-1">
            Last updated: July 2026
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed py-2">
          {document?.sections.map((section, index) => (
            <div key={section.title} className="space-y-1">
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm tracking-tight flex items-center gap-2">
                <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-[#FFC700] text-[11px] font-black text-neutral-900">
                  {index + 1}
                </span>
                {section.title}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pl-7">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <DialogFooter className="pt-3 border-t border-neutral-200/70 dark:border-neutral-800">
          <Button onClick={onClose} size="lg" className="font-semibold px-7 cursor-pointer">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
