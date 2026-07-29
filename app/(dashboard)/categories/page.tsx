"use client"

import * as React from "react"
import { PageHeader, EmptyState, CategoryBadge } from "@/dashboard/shared"
import { useStore } from "@/lib/store"
import { formatMoney } from "@/lib/format"
import { Icon } from "@/lib/icon"
import { CATEGORY_COLOR_CHOICES, CATEGORY_ICON_CHOICES } from "@/lib/constants"
import type { Category, CategoryKind } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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

  // Compute spend / income per category this month
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

  const handleOpenAdd = () => {
    setEditingCategory(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
        <PageHeader
          title="Categories"
          description="Organize your expenses and income with custom icons, colors, and classifications."
        >
          <Button onClick={handleOpenAdd} className="gap-1.5">
            <Icon name="plus" className="size-4" />
            Add Category
          </Button>
        </PageHeader>

        {/* Filter and Search Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1 text-xs">
            <button
              onClick={() => setKindFilter("expense")}
              className={`rounded-md px-3 py-1.5 font-medium transition-all ${
                kindFilter === "expense"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Expense Categories ({data.categories.filter((c) => c.kind === "expense").length})
            </button>
            <button
              onClick={() => setKindFilter("income")}
              className={`rounded-md px-3 py-1.5 font-medium transition-all ${
                kindFilter === "income"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Income Categories ({data.categories.filter((c) => c.kind === "income").length})
            </button>
            <button
              onClick={() => setKindFilter("all")}
              className={`rounded-md px-3 py-1.5 font-medium transition-all ${
                kindFilter === "all"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
          </div>

          <div className="relative sm:w-64">
            <Icon name="search" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search category name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        {/* Category Cards Grid */}
        {filteredCategories.length === 0 ? (
          <EmptyState
            icon="shapes"
            title="No categories found"
            message="No categories matched your search criteria."
            action={<Button onClick={handleOpenAdd}>Add Category</Button>}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((cat) => {
              const stat = categoryStats[cat.id] ?? { total: 0, count: 0 }
              const isBudgeted = Boolean(data.budgets[cat.id])

              return (
                <Card key={cat.id} className="border-border/60 shadow-none hover:border-border transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <CategoryBadge icon={cat.icon} color={cat.color} size="md" />
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-semibold truncate">{cat.name}</h4>
                          {cat.isCustom && (
                            <span className="rounded bg-primary/10 px-1.5 py-0.2 text-[10px] font-medium text-primary">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{stat.count} tx</span>
                          <span>·</span>
                          <span className="font-mono">
                            {formatMoney(stat.total, { symbol: data.settings.currencySymbol })}
                          </span>
                          {isBudgeted && (
                            <>
                              <span>·</span>
                              <span className="text-primary font-medium">Budgeted</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground shrink-0">
                            <Icon name="ellipsis-vertical" className="size-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEdit(cat)}>
                          <Icon name="pencil" className="size-4" />
                          Edit Category
                        </DropdownMenuItem>
                        {cat.isCustom && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => deleteCategory(cat.id)}
                            >
                              <Icon name="trash-2" className="size-4" />
                              Delete Category
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Add/Edit Modal */}
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
    </div>
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
  const [color, setColor] = React.useState("var(--chart-1)")

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
      setColor("var(--chart-1)")
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
          <DialogTitle>{editingCategory ? "Edit Category" : "Add Custom Category"}</DialogTitle>
          <DialogDescription>
            Customize category name, type, icon, and color theme.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Kind toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1 text-xs">
            <button
              type="button"
              onClick={() => setKind("expense")}
              className={`rounded-md py-1.5 font-medium transition-all ${
                kind === "expense"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setKind("income")}
              className={`rounded-md py-1.5 font-medium transition-all ${
                kind === "income"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Income
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Category Name</label>
            <Input
              placeholder="e.g. Subscriptions, Groceries, Freelance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Color Theme</label>
            <div className="flex items-center gap-2">
              {CATEGORY_COLOR_CHOICES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`size-7 rounded-full transition-transform ${
                    color === c ? "scale-110 ring-2 ring-ring ring-offset-2 ring-offset-background" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Icon</label>
            <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1 rounded-lg border border-border/60">
              {CATEGORY_ICON_CHOICES.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`flex size-9 items-center justify-center rounded-lg transition-colors ${
                    icon === ic
                      ? "bg-primary text-primary-foreground font-bold"
                      : "bg-muted/40 hover:bg-muted text-foreground"
                  }`}
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
            <Button type="submit">{editingCategory ? "Save Category" : "Create Category"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
