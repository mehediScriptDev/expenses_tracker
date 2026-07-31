"use client"

import * as React from "react"
import { Icon } from "@/lib/icon"
import { cn } from "@/lib/utils"

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  pageSize?: number
  pageSizeOptions?: number[]
  onPageSizeChange?: (pageSize: number) => void
  className?: string
  compact?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  className,
  compact = false,
}: PaginationProps) {
  if (totalPages <= 1 && !totalItems) return null

  const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null
  const endItem = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : null

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | "ellipsis")[] = []
    pages.push(1)

    if (currentPage > 3) {
      pages.push("ellipsis")
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis")
    }

    pages.push(totalPages)

    return pages
  }

  const pages = getPageNumbers()

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl bg-white dark:bg-card border border-neutral-200/60 dark:border-neutral-800 p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3",
        className
      )}
    >
      {/* Item info & Page Size selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 sm:justify-start">
        {totalItems && startItem && endItem ? (
          <p>
            Showing <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{startItem}</span> -{" "}
            <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{endItem}</span> of{" "}
            <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{totalItems}</span> items
          </p>
        ) : (
          <p>
            Page <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{currentPage}</span> of{" "}
            <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{totalPages}</span>
          </p>
        )}

        {pageSize && onPageSizeChange && pageSizeOptions.length > 0 ? (
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 dark:text-neutral-500">|</span>
            <label htmlFor="pagination-page-size" className="sr-only">
              Items per page
            </label>
            <select
              id="pagination-page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none transition-colors focus:border-amber-400"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-1.5">
        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          className="flex h-8 items-center justify-center gap-1 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <Icon name="chevron-left" className="size-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Numeric Page Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="flex size-8 items-center justify-center text-xs text-neutral-400 dark:text-neutral-500"
                >
                  •••
                </span>
              )
            }

            const isActive = p === currentPage
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer",
                  isActive
                    ? "bg-[#171717] dark:bg-[#FFC700] text-white dark:text-black shadow-2xs"
                    : "border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
              >
                {p}
              </button>
            )
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="flex h-8 items-center justify-center gap-1 rounded-lg border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <Icon name="chevron-right" className="size-4" />
        </button>
      </div>
    </div>
  )
}
