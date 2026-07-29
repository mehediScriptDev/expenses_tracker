"use client"

import * as React from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/shared"
import { useStore } from "@/lib/store"
import { useTheme } from "@/components/theme-provider"
import { Icon } from "@/lib/icon"
import type { AppData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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

export default function SettingsPage() {
  const { data, updateSettings, replaceAll, resetAll, loadDemo } = useStore()
  const { theme, setTheme, resolved } = useTheme()

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
    toast.success("Financial profile settings saved!")
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
      toast.success("Backup downloaded successfully!")
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

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl">
        <PageHeader
          title="Settings"
          description="Manage financial setup, currency, theme preferences, and data backup & restore."
        />

        {/* Financial Setup Card */}
        <Card className="border-border/60 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Financial Profile & Currency</CardTitle>
            <CardDescription>
              Configure your monthly salary, payday date, and preferred currency unit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveFinancialProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Monthly Salary</label>
                  <Input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. 50000"
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Used to calculate safe daily spending limits and pacing.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Payday Date (1-28)</label>
                  <Input
                    type="number"
                    min={1}
                    max={28}
                    value={salaryDate}
                    onChange={(e) => setSalaryDate(e.target.value)}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Day of month salary lands to reset payday cycles.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Currency Preset</label>
                  <select
                    value={currencySymbol}
                    onChange={(e) => {
                      const sel = CURRENCIES.find((c) => c.symbol === e.target.value)
                      if (sel) {
                        setCurrencySymbol(sel.symbol)
                        setCurrency(sel.name.split(" — ")[0])
                      }
                    }}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.symbol} value={c.symbol}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Custom Currency Symbol</label>
                  <Input
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    placeholder="e.g. ৳ or $"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" className="gap-1.5">
                  <Icon name="check" className="size-4" />
                  Save Profile Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>


        {/* Data Backup & Management Card */}
        <Card className="border-border/60 shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Data Backup & Management</CardTitle>
            <CardDescription>
              Export your data for safekeeping, import from a JSON file, or load demo dataset.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleExportData} className="gap-1.5">
                <Icon name="download" className="size-4" />
                Export Data (JSON)
              </Button>

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-1.5"
              >
                <Icon name="upload" className="size-4" />
                Import Backup (JSON)
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />

              <Button
                variant="secondary"
                onClick={() => {
                  loadDemo()
                  toast.success("Loaded demo dataset!")
                }}
                className="gap-1.5"
              >
                <Icon name="sparkles" className="size-4" />
                Load Demo Sample Data
              </Button>
            </div>

            <div className="border-t border-border/60 pt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-destructive">Danger Zone</p>
                <p className="text-xs text-muted-foreground">
                  Permanently clear all transactions, custom categories, budgets, and loans.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setResetConfirmOpen(true)}
                className="gap-1.5"
              >
                <Icon name="trash-2" className="size-4" />
                Reset All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stored Stats Summary */}
        <div className="rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">Storage Statistics</p>
          <p>
            {data.transactions.length} Transactions · {data.categories.length} Categories ·{" "}
            {Object.keys(data.budgets).length} Budgets · {data.loans.length} Loan/Debt Records
          </p>
        </div>

        {/* Reset Confirmation Dialog */}
        <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive">Reset All Data?</DialogTitle>
              <DialogDescription>
                This action will delete all your local transactions, budgets, categories, and loan records. This action cannot be undone unless you have an exported backup file.
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
                Yes, Reset Everything
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  )
}
