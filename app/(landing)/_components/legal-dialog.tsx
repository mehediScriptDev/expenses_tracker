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
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{document?.title}</DialogTitle>
          <DialogDescription>Last updated: July 2026</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
          {document?.sections.map((section, index) => (
            <div key={section.title}>
              <h4 className="font-bold text-neutral-900 mb-1">
                {index + 1}. {section.title}
              </h4>
              <p>{section.body}</p>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
