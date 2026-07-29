"use client"

import * as React from "react"
import {
  PageHeader,
  dashCard,
  dashLabel,
  dashCaption,
  dashInput,
  DashPage,
  DashboardCard,
  SummaryBar,
} from "@/dashboard/shared"
import { QuickAddPresetsManager } from "@/dashboard/quick-add-presets-manager"
import { useStore } from "@/lib/store"
import { Icon } from "@/lib/icon"
import type { AppData } from "@/types"
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
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const CURRENCIES = [
  { symbol: "৳", name: "BDT — Bangladeshi Taka" },
  { symbol: "$", name: "USD — US Dollar" },
  { symbol: "€", name: "EUR — Euro" },
  { symbol: "£", name: "GBP — British Pound" },
  { symbol: "₹", name: "INR — Indian Rupee" },
  { symbol: "¥", name: "JPY / CNY — Yen / Yuan" },
  { symbol: "R$", name: "BRL — Brazilian Real" },
  { symbol: "AED", name: "AED — UAE Dirham" },
  { symbol: "SAR", name: "SAR — Saudi Riyal" },
]

function SettingsSection({
  icon,
  title,
  description,
  children,
  className,
}: {
  icon: string
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <DashboardCard
      title={title}
      description={description}
      className={className}
      action={
        <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--dash-accent-soft)] text-[var(--dash-accent)]">
          <Icon name={icon} className="size-4" aria-hidden />
        </span>
      }
    >
      {children}
    </DashboardCard>
  )
}

export default function SettingsPage() {
  const { data, updateSettings, replaceAll, resetAll, loadDemo } = useStore()

  const [salary, setSalary] = React.useState<string>(String(data.settings.salary))
  const [salaryDate, setSalaryDate] = React.useState<string>(String(data.settings.salaryDate))
  const [currencySymbol, setCurrencySymbol] = React.useState<string>(data.settings.currencySymbol)
  const [currency, setCurrency] = React.useState<string>(data.settings.currency)

  const [resetConfirmOpen, setResetConfirmOpen] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    setSalary(String(data.settings.salary))
    setSalaryDate(String(data.settings.salaryDate))
    setCurrencySymbol(data.settings.currencySymbol)
    setCurrency(data.settings.currency)
  }, [data.settings])

  const handleSaveFinancialProfile = (e: React.FormEvent) => {
    e.preventDefault()
    const numSalary = parseFloat(salary) || 0
    const numDate = parseInt(salaryDate, 10) || 1
    updateSettings({
      salary: Math.max(0, numSalary),
      salaryDate: Math.min(28, Math.max(1, numDate)),
      currencySymbol,
      currency,
    })
    toast.success("Financial profile saved!")
  }

  const handleExportData = () => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `gorib-manush-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Backup downloaded!")
    } catch {
      toast.error("Failed to export backup.")
    }
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string) as AppData
        if (parsed && Array.isArray(parsed.transactions) && Array.isArray(parsed.categories)) {
          replaceAll(parsed)
          toast.success("Data imported successfully!")
        } else {
          toast.error("Invalid backup file format.")
        }
      } catch {
        toast.error("Failed to parse JSON file.")
      }
    }
    reader.readAsText(file)
  }

  const stats = [
    { label: "Transactions", value: data.transactions.length },
    { label: "Categories", value: data.categories.length },
    { label: "Budgets", value: Object.keys(data.budgets).length },
    { label: "Loans", value: data.loans.length },
  ]

  return (
    <DashPage>
      <PageHeader
        title="Settings"
        description="Configure your financial profile, quick-add shortcuts, and data backup."
      />

      <SummaryBar items={stats.map((s) => ({ label: s.label, value: s.value }))} />

      <SettingsSection
        icon="zap"
        title="Quick add presets"
        description="Customize the one-tap expense buttons on your dashboard."
      >
        <QuickAddPresetsManager />
      </SettingsSection>

      <SettingsSection
        icon="wallet"
        title="Financial profile & currency"
        description="Monthly salary, payday date, and preferred currency."
      >
        <form onSubmit={handleSaveFinancialProfile} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={dashLabel}>Monthly salary</label>
              <Input
                className={dashInput}
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. 50000"
                required
              />
              <p className={dashCaption}>Used for safe daily spending limits and cycle pacing.</p>
            </div>

            <div className="space-y-1.5">
              <label className={dashLabel}>Payday date (1–28)</label>
              <Input
                className={dashInput}
                type="number"
                min={1}
                max={28}
                value={salaryDate}
                onChange={(e) => setSalaryDate(e.target.value)}
                required
              />
              <p className={dashCaption}>Day of month your salary arrives to reset cycles.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={dashLabel}>Currency preset</label>
              <select
                value={currencySymbol}
                onChange={(e) => {
                  const sel = CURRENCIES.find((c) => c.symbol === e.target.value)
                  if (sel) {
                    setCurrencySymbol(sel.symbol)
                    setCurrency(sel.name.split(" — ")[0])
                  }
                }}
                className="dash-input w-full px-3 text-sm"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.symbol} value={c.symbol}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={dashLabel}>Custom currency symbol</label>
              <Input
                className={dashInput}
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                placeholder="e.g. ৳ or $"
                required
              />
            </div>
          </div>

          <Button variant="dash" type="submit" className="gap-1.5">
            <Icon name="check" className="size-4" />
            Save profile
          </Button>
        </form>
      </SettingsSection>

      <SettingsSection
        icon="database"
        title="Data backup & management"
        description="Export, import, or reset your local financial data."
      >
        <div className="space-y-5">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleExportData} className="gap-1.5">
              <Icon name="download" className="size-4" />
              Export JSON
            </Button>

            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-1.5">
              <Icon name="upload" className="size-4" />
              Import backup
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />

            <Button
              variant="dash"
              onClick={() => {
                loadDemo()
                toast.success("Loaded demo dataset!")
              }}
              className="gap-1.5"
            >
              <Icon name="sparkles" className="size-4" />
              Load demo data
            </Button>
          </div>

          <div className={cn(dashCard, "border border-destructive/20 bg-(--dash-danger-soft)/40 p-4 sm:p-5")}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
                  <Icon name="triangle-alert" className="size-4" />
                  Danger zone
                </p>
                <p className={dashCaption}>
                  Permanently clear all transactions, categories, budgets, and loan records.
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => setResetConfirmOpen(true)} className="gap-1.5 shrink-0">
                <Icon name="trash-2" className="size-4" />
                Reset all data
              </Button>
            </div>
          </div>
        </div>
      </SettingsSection>

      <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Reset all data?</DialogTitle>
            <DialogDescription>
              This will delete all local transactions, budgets, categories, and loan records. This cannot be undone
              unless you have an exported backup.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setResetConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetAll()
                setResetConfirmOpen(false)
                toast.success("All data has been reset.")
              }}
            >
              Yes, reset everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashPage>
  )
}
