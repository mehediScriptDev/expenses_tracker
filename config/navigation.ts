export interface NavItem {
  href: string
  label: string
  icon: string
  /** When true, renders as the centre FAB rather than a normal link */
  fab?: boolean
}

export const MAIN_NAV: NavItem[] = [
  { href: "/dashboard",    label: "Dashboard",    icon: "layout-dashboard" },
  { href: "/transactions", label: "Transactions", icon: "receipt-text"     },
  { href: "/budgets",      label: "Budgets",      icon: "target"           },
  { href: "/goals",        label: "Goals",        icon: "trophy"           },
  { href: "/borrowed",     label: "Borrowed",     icon: "hand-coins"       },
  { href: "/insights",     label: "Insights",     icon: "sparkles"         },
  { href: "/categories",   label: "Categories",   icon: "shapes"           },
  { href: "/settings",     label: "Settings",     icon: "settings"         },
]


export const MOBILE_NAV: NavItem[] = [
  { href: "/dashboard",    label: "Dashboard",    icon: "layout-dashboard" },
  { href: "/transactions", label: "Transactions", icon: "receipt-text"     },
  { href: "#add",          label: "Add",          icon: "plus",  fab: true },
  { href: "/budgets",      label: "Budgets",      icon: "target"           },
  { href: "/insights",     label: "Insights",     icon: "sparkles"         },
]
