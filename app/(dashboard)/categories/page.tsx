"use client"

import * as React from "react"
import {
  PageHeader,
  EmptyState,
  CategoryBadge,
  dashSegment,
  dashSegmentItem,
  dashSegmentItemActive,
  dashInput,
  DashPage,
  SummaryBar,
  FilterToolbar,
  StatusBadge,
} from "@/dashboard/shared"
import { useStore } from "@/lib/store"
import { formatMoney } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { CATEGORY_COLOR_CHOICES, CATEGORY_ICON_CHOICES } from "@/lib/constants"
import type { Category, CategoryKind } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function CategoriesPage() {
  const { data, addCategory, updateCategory, deleteCategory } = useStore()

  const [kindFilter, setKindFilter] = React.useState<CategoryKind | "all">("expense")
  const [search, setSearch] = React.useState("")

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null)

  const categoryStats = React.useMemo(() => {
    const stats: Record<string, { total: number; count: number }> = {}
    for (const tx of data.transactions) {
      if (!stats[tx.categoryId]) stats[tx.categoryId] = { total: 0, count: 0 }
      stats[tx.categoryId].total += tx.amount
      stats[tx.categoryId].count += 1
    }
    return stats
  }, [data.transactions])

  const filteredCategories = React.useMemo(() => {
    return data.categories.filter((cat) => {
      if (kindFilter !== "all" && cat.kind !== kindFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        if (!cat.name.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [data.categories, kindFilter, search])

  const expenseCount = data.categories.filter((c) => c.kind === "expense").length
  const incomeCount = data.categories.filter((c) => c.kind === "income").length
  const filteredTotal = filteredCategories.reduce(
    (sum, cat) => sum + (categoryStats[cat.id]?.total ?? 0),
    0,
  )
  const budgetedCount = filteredCategories.filter((c) => Boolean(data.budgets[c.id])).length

  const handleOpenAdd = () => {
    setEditingCategory(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat)
    setDialogOpen(true)
  }

  return (
    <DashPage>
      <PageHeader
        title="Categories"
        description="Organize spending and income with custom icons, colors, and labels."
      >
        <Button variant="dash" onClick={handleOpenAdd} className="h-11 w-full gap-1.5 px-5 sm:w-auto">
          <Icon name="plus" className="size-4" />
          Add category
        </Button>
      </PageHeader>

      <SummaryBar
        items={[
          { label: "Expense", value: expenseCount },
          { label: "Income", value: incomeCount, tone: "success" },
          {
            label: "Activity",
            value: formatMoney(filteredTotal, { symbol: data.settings.currencySymbol, compact: true }),
          },
          { label: "Budgeted", value: budgetedCount, tone: "accent" },
        ]}
      />

      <FilterToolbar>
        <div className={cn(dashSegment, "w-full bg-[var(--dash-surface)] sm:w-auto")}>
          <button
            type="button"
            onClick={() => setKindFilter("expense")}
            className={cn(
              dashSegmentItem,
              kindFilter === "expense" ? dashSegmentItemActive : "hover:text-[var(--dash-text)]",
            )}
          >
            Expense ({expenseCount})
          </button>
          <button
            type="button"
            onClick={() => setKindFilter("income")}
            className={cn(
              dashSegmentItem,
              kindFilter === "income" ? dashSegmentItemActive : "hover:text-[var(--dash-text)]",
            )}
          >
            Income ({incomeCount})
          </button>
          <button
            type="button"
            onClick={() => setKindFilter("all")}
            className={cn(
              dashSegmentItem,
              kindFilter === "all" ? dashSegmentItemActive : "hover:text-[var(--dash-text)]",
            )}
          >
            All
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Icon
            name="search"
            className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--dash-text-faint)]"
          />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(dashInput, "border-0 bg-[var(--dash-surface)] pl-10 shadow-none")}
          />
        </div>
      </FilterToolbar>

      {filteredCategories.length === 0 ? (
        <EmptyState
          icon="shapes"
          title="No categories found"
          message="Adjust your filters or create a new category to get started."
          action={<Button variant="dash" onClick={handleOpenAdd}>Add category</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((cat) => {
            const stat = categoryStats[cat.id] ?? { total: 0, count: 0 }
            const isBudgeted = Boolean(data.budgets[cat.id])

            return (
              <article
                key={cat.id}
                className="dash-card group relative overflow-hidden transition-shadow hover:shadow-md"
              >
                <div
                  className="absolute inset-y-0 left-0 w-1.5"
                  style={{ backgroundColor: cat.color }}
                  aria-hidden
                />

                <div className="flex items-start justify-between gap-3 p-4 pl-5 sm:p-5 sm:pl-6">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <CategoryBadge icon={cat.icon} color={cat.color} size="md" />
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-(--dash-text)">{cat.name}</h3>
                        {cat.isCustom ? <StatusBadge tone="accent">Custom</StatusBadge> : null}
                        {isBudgeted ? <StatusBadge tone="neutral">Budgeted</StatusBadge> : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--dash-text-muted)]">
                        <span className="inline-flex items-center gap-1">
                          <Icon name="receipt-text" className="size-3.5" />
                          {stat.count} tx
                        </span>
                        <span className="font-mono font-semibold text-(--dash-text)">
                          {formatMoney(stat.total, { symbol: data.settings.currencySymbol })}
                        </span>
                        <span className="capitalize">{cat.kind}</span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0 text-[var(--dash-text-muted)] opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                          aria-label={`Actions for ${cat.name}`}
                        >
                          <Icon name="ellipsis-vertical" className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenEdit(cat)}>
                        <Icon name="pencil" className="size-4" />
                        Edit category
                      </DropdownMenuItem>
                      {cat.isCustom ? (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onClick={() => deleteCategory(cat.id)}>
                            <Icon name="trash-2" className="size-4" />
                            Delete category
                          </DropdownMenuItem>
                        </>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <CategoryModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingCategory={editingCategory}
        onSave={(catData) => {
          if (editingCategory) {
            updateCategory(editingCategory.id, catData)
          } else {
            addCategory(catData)
          }
          setDialogOpen(false)
        }}
      />
    </DashPage>
  )
}

function CategoryModal({
  open,
  onOpenChange,
  editingCategory,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingCategory: Category | null
  onSave: (cat: Omit<Category, "id" | "isCustom">) => void
}) {
  const [name, setName] = React.useState("")
  const [kind, setKind] = React.useState<CategoryKind>("expense")
  const [icon, setIcon] = React.useState("shapes")
  const [color, setColor] = React.useState("var(--chart-4)")

  React.useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name)
      setKind(editingCategory.kind)
      setIcon(editingCategory.icon)
      setColor(editingCategory.color)
    } else {
      setName("")
      setKind("expense")
      setIcon("shapes")
      setColor("var(--chart-4)")
    }
  }, [editingCategory, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      kind,
      icon,
      color,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCategory ? "Edit category" : "Add custom category"}</DialogTitle>
          <DialogDescription>Customize name, type, icon, and color.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className={cn(dashSegment, "grid grid-cols-2 gap-1 p-1")}>
            <button
              type="button"
              onClick={() => setKind("expense")}
              className={cn(
                dashSegmentItem,
                "w-full",
                kind === "expense" ? dashSegmentItemActive : "hover:text-[var(--dash-text)]",
              )}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setKind("income")}
              className={cn(
                dashSegmentItem,
                "w-full",
                kind === "income" ? dashSegmentItemActive : "hover:text-[var(--dash-text)]",
              )}
            >
              Income
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="dash-label">Category name</label>
            <Input
              placeholder="e.g. Subscriptions, Groceries, Freelance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={dashInput}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="dash-label">Color</label>
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORY_COLOR_CHOICES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "size-8 rounded-full transition-transform",
                    color === c ? "scale-110 ring-2 ring-ring ring-offset-2 ring-offset-background" : "",
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="dash-label">Icon</label>
            <div className="grid max-h-40 grid-cols-6 gap-2 overflow-y-auto rounded-xl bg-[var(--dash-muted)] p-2">
              {CATEGORY_ICON_CHOICES.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg transition-colors",
                    icon === ic
                      ? "bg-neutral-900 text-white"
                      : "bg-[var(--dash-surface)] text-[var(--dash-text)] hover:bg-white",
                  )}
                  aria-label={`Select icon ${ic}`}
                >
                  <Icon name={ic} className="size-4" />
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="dash" type="submit">
              {editingCategory ? "Save category" : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
