"use client"

import * as Lucide from "lucide-react"
import type { LucideProps } from "lucide-react"

function toPascal(key: string) {
  return key
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("")
}

/**
 * Renders a lucide icon from a kebab-case key (e.g. "hand-coins").
 * Falls back to a neutral circle if the key is unknown.
 */
export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const Comp =
    (Lucide as unknown as Record<string, React.ComponentType<LucideProps>>)[
      toPascal(name)
    ] ?? Lucide.Circle
  return <Comp {...props} />
}
