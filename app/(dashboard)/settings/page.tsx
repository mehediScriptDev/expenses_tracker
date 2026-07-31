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
} from "@/dashboard/shared"
import { QuickAddPresetsManager } from "@/dashboard/quick-add-presets-manager"
import { useStore } from "@/lib/store"
import { useAuth } from "@/lib/auth"
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
  title,
  description,
  children,
  className,
}: {
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
    >
      {children}
    </DashboardCard>
  )
}

export default function SettingsPage() {
  const { data, updateSettings, replaceAll, resetAll, loadDemo } = useStore()
  const { user } = useAuth()

  // Financial profile state
  const [salary, setSalary] = React.useState<string>(String(data.settings.salary))
  const [salaryDate, setSalaryDate] = React.useState<string>(String(data.settings.salaryDate))
  const [currencySymbol, setCurrencySymbol] = React.useState<string>(data.settings.currencySymbol)
  const [currency, setCurrency] = React.useState<string>(data.settings.currency)

  // Password change state
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)

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

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      toast.error("Please enter your current password.")
      return
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.")
      return
    }
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    toast.success("Password updated successfully!")
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

  return (
    <DashPage>
      <PageHeader
        title="Settings"
        description="Configure account security, financial profile, quick-add shortcuts, and data backups."
      />

      {/* 1. Account & Password Security */}
      <SettingsSection
        title="Account & Security"
        description="User profile details and password authentication."
      >
        <div className="space-y-5">
          {/* User Information Summary */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl border border-(--dash-border) bg-(--dash-muted)">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--dash-accent-soft) font-mono font-black text-sm text-(--dash-accent)">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "ME"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-(--dash-text) text-sm truncate">
                {user?.name || "Mehedi Hasan"}
              </p>
              <p className="text-xs text-(--dash-text-muted) truncate">
                {user?.email || "mehedi@dev.com"}
              </p>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-(--dash-success-soft) text-(--dash-income) border border-(--dash-border)">
              Active
            </span>
          </div>

          {/* Change Password Form */}
          <form onSubmit={handleUpdatePassword} className="space-y-4 pt-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-(--dash-text-muted)">
              Change Password
            </h4>

            <div className="space-y-1.5 max-w-md">
              <label className={dashLabel}>Current Password</label>
              <div className="relative">
                <Input
                  className={cn(dashInput, "pr-10")}
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--dash-text-faint) hover:text-(--dash-text) cursor-pointer"
                  aria-label="Toggle current password visibility"
                >
                  <Icon name={showCurrentPassword ? "eye-off" : "eye"} className="size-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
              <div className="space-y-1.5">
                <label className={dashLabel}>New Password</label>
                <div className="relative">
                  <Input
                    className={cn(dashInput, "pr-10")}
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--dash-text-faint) hover:text-(--dash-text) cursor-pointer"
                    aria-label="Toggle new password visibility"
                  >
                    <Icon name={showNewPassword ? "eye-off" : "eye"} className="size-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={dashLabel}>Confirm New Password</label>
                <Input
                  className={dashInput}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            <Button variant="dash" type="submit" className="gap-1.5 mt-2">
              <Icon name="key-round" className="size-4" />
              Update password
            </Button>
          </form>
        </div>
      </SettingsSection>

      {/* 2. Financial Profile & Currency */}
      <SettingsSection
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

      {/* 3. Quick Add Presets */}
      <QuickAddPresetsManager />

      {/* 4. Data Backup & Management */}
      <SettingsSection
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
