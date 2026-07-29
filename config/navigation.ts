export interface NavItem {
  href: string
  label: string
  icon: string
}

export const MAIN_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { href: "/transactions", label: "Transactions", icon: "receipt-text" },
  { href: "/budgets", label: "Budgets", icon: "target" },
  { href: "/goals", label: "Savings Goals", icon: "trophy" },
  { href: "/borrowed", label: "Borrowed", icon: "hand-coins" },
  { href: "/insights", label: "Insights", icon: "sparkles" },
  { href: "/categories", label: "Categories", icon: "shapes" },
  { href: "/settings", label: "Settings", icon: "settings" },
]

export const MOBILE_NAV = MAIN_NAV.slice(0, 5)
