export interface MethodStep {
  badge: string
  badgeClass: string
  detail: string
  quote: string
}

export const METHOD_STEPS: MethodStep[] = [
  {
    badge: "NOW",
    badgeClass: "bg-[#F7B897] text-neutral-900 rounded-[55%_45%_62%_38%/45%_58%_42%_55%]",
    detail: "The mid-month panic. The worries. The questions.",
    quote: '"Where did my money go?"',
  },
  {
    badge: "SOON",
    badgeClass: "bg-[#F9CFB5] text-neutral-900 rounded-[45%_55%_40%_60%/55%_45%_58%_42%]",
    detail: "Impulse spending. Category limits. Instant alerts.",
    quote: '"Am I spending within my safe daily limit?"',
  },
  {
    badge: "LATER",
    badgeClass: "bg-[#F7B897] text-neutral-900 rounded-[60%_40%_55%_45%/48%_52%_45%_55%]",
    detail: "Savings targets. Debt clearance. Goal tracking.",
    quote: '"Why did budgeting used to feel so overwhelming?"',
  },
  {
    badge: "ALWAYS",
    badgeClass: "bg-[#E67E51] text-white rounded-[48%_52%_45%_55%/58%_42%_56%_44%]",
    detail: "100% browser privacy. Complete financial confidence.",
    quote: '"With Gorib Manush, I trust myself with my money."',
  },
]

export interface ChangeStep {
  number: string
  title: string
  description: string
  label: string
  cardClass: string
  numberClass: string
  titleClass: string
  descriptionClass: string
  labelClass: string
  arrowClass?: string
}

export const WHAT_CHANGES_STEPS: ChangeStep[] = [
  {
    number: "01",
    title: "The unexpected expenses don't make you spiral",
    description:
      "You have a real-time spending pace — not a guesswork budget. When surprise costs hit, you know what to do next.",
    label: "The Beginning",
    cardClass: "bg-[#FAF6EE]",
    numberClass: "text-neutral-300/80",
    titleClass: "text-neutral-900",
    descriptionClass: "text-neutral-600",
    labelClass: "text-neutral-400",
    arrowClass: "border-l-[#FAF6EE]",
  },
  {
    number: "02",
    title: "You start building daily spending habits",
    description:
      "Daily limits, category tracking, loan alerts — not because you stopped enjoying life, but because you spend with intention.",
    label: "The Shift",
    cardClass: "bg-[#F3EAD5]",
    numberClass: "text-neutral-400/50",
    titleClass: "text-neutral-900",
    descriptionClass: "text-neutral-700",
    labelClass: "text-neutral-500",
    arrowClass: "border-l-[#F3EAD5]",
  },
  {
    number: "03",
    title: "You trust yourself with your money",
    description: "Not because budgeting got easy. Because you stopped worrying about payday.",
    label: "The Arrival",
    cardClass: "bg-[#FFC700]",
    numberClass: "text-black/20",
    titleClass: "text-black",
    descriptionClass: "text-black/80 font-medium",
    labelClass: "text-black/60 font-bold",
  },
]

export interface FinancialStage {
  id: string
  title: string
  bannerClass: string
  pillClass: string
  buttonClass: string
  image: string
  quote: string
  tags: string[]
}

export const FINANCIAL_STAGES: FinancialStage[] = [
  {
    id: "daily-trackers",
    title: "Daily Expense Trackers",
    bannerClass: "bg-[#F5A882]",
    pillClass: "bg-[#FCE4D6]",
    buttonClass: "bg-[#F5A882]",
    image: "/first.svg",
    quote: '"I want to stop overspending on daily food, transport, and quick bKash payments."',
    tags: ["Daily Pacing", "Impulse Control", "Cash & bKash", "Payday Limits", "Instant Log"],
  },
  {
    id: "goal-seekers",
    title: "Goal Seekers & Savers",
    bannerClass: "bg-[#96DAA9]",
    pillClass: "bg-[#E2F5E8]",
    buttonClass: "bg-[#96DAA9]",
    image: "/growing.svg",
    quote: '"I want to set monthly category budgets, track loans, and save for my future goals."',
    tags: ["Category Limits", "Savings Goals", "Borrowed & Lent", "Budget Alerts", "Monthly Insights"],
  },
  {
    id: "smart-planners",
    title: "Smart Money Planners",
    bannerClass: "bg-[#89C4FD]",
    pillClass: "bg-[#E1EFFD]",
    buttonClass: "bg-[#89C4FD]",
    image: "/freedom.svg",
    quote: '"I want a complete financial health score, net worth control, and 100% data privacy."',
    tags: ["Health Score", "Debt Tracking", "CSV Backup", "Smart Analytics", "Total Privacy"],
  },
]
