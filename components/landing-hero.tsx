"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Icon } from "@/lib/icon"
import { Button } from "@/components/ui/button"

interface LandingHeroProps {
  onOpenDashboard?: () => void
}

export function LandingHero({ onOpenDashboard }: LandingHeroProps) {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0)

  const testimonialsRow1 = [
    {
      name: "David James Lee",
      role: "Fitness Trainer",
      avatar: "👨‍💼",
      quote: "FinBuddy provides a flawless budgeting experience every time. I highly recommend it to everyone looking for clarity!",
    },
    {
      name: "Emily Anne Roberts",
      role: "Marketing Manager",
      avatar: "👩‍💼",
      quote: "FinBuddy helped me track daily expenses quickly and set realistic limits easily. I love how user-friendly the app is!",
    },
    {
      name: "John Michael Mitchell",
      role: "Software Engineer",
      avatar: "👨‍💻",
      quote: "The app's financial health score and payday pacing system is insanely smart and secure. The best finance platform I've used!",
    },
    {
      name: "Sarah Jenkins",
      role: "Product Designer",
      avatar: "👩‍🎨",
      quote: "Tracking daily expenses has never been this effortless, clear, and visually satisfying.",
    },
  ]

  const testimonialsRow2 = [
    {
      name: "Anthony Johnson",
      role: "Freelancer",
      avatar: "👨‍🎨",
      quote: "FinBuddy keeps me organized and completely focused on my monthly savings targets without any stress!",
    },
    {
      name: "Alexander John Parker",
      role: "Photographer",
      avatar: "📷",
      quote: "With FinBuddy, I can easily track my borrowed money and savings goals, saving both time and mental energy!",
    },
    {
      name: "Michael Edward Brooks",
      role: "Entrepreneur",
      avatar: "👔",
      quote: "I love how FinBuddy provides personalized insights, always showing me spending habits I should adjust.",
    },
    {
      name: "Maria Garcia",
      role: "Financial Advisor",
      avatar: "👩‍💼",
      quote: "A genuine game-changer for personal budgeting, payday pacing, and financial peace of mind.",
    },
  ]

  const faqsCol1 = [
    {
      id: 0,
      q: "How do I track daily expenses on FinBuddy?",
      a: "Simply tap 'Add Expense' or use the quick preset chips (Food, Transport, Groceries) to log any purchase in seconds. FinBuddy automatically calculates your daily spending pace.",
    },
    {
      id: 1,
      q: "What payment methods and currencies are supported?",
      a: "FinBuddy supports BDT (৳), USD ($), EUR (€), GBP (£), INR (₹), and all major world currencies with customizable currency symbols.",
    },
    {
      id: 2,
      q: "How does the safe daily spending limit work?",
      a: "FinBuddy divides your remaining salary for the cycle by the number of days left until payday, giving you a clear, safe daily limit.",
    },
  ]

  const faqsCol2 = [
    {
      id: 3,
      q: "Will I receive reminders for upcoming loan payments?",
      a: "Yes! FinBuddy flags overdue and upcoming loan due dates right on your dashboard so you never miss a repayment.",
    },
    {
      id: 4,
      q: "Can I export my transaction reports?",
      a: "Absolutely. You can export all your financial transactions to CSV or JSON format anytime from the Settings page.",
    },
    {
      id: 5,
      q: "Is my financial data stored privately?",
      a: "100% yes. All your financial data stays encrypted directly inside your local browser storage. No server uploads or tracking.",
    },
  ]

  return (
    <div className="relative min-h-screen bg-[#FAF8F3] text-neutral-900 overflow-hidden font-sans">
      {/* Background blueprint grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Top Navbar */}
      <header className="relative z-10 mx-auto container px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={240}
            height={64}
            className="h-14 sm:h-16 w-auto object-contain"
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="lg" asChild>
            <Link href="/settings">Contact Us</Link>
          </Button>
          <Button size="lg" asChild>
            <Link href="/dashboard">Dashboard →</Link>
          </Button>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="relative z-10 mx-auto container px-6 pt-12 pb-20 text-center flex flex-col items-center">
        
        {/* Top Pill Tag */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs mb-8 transition-all cursor-pointer">
          <span className="size-2 rounded-full bg-[#00A86B] animate-pulse" />
          <span>#1 Personal Finance & Expense App</span>
          <Icon name="arrow-right" className="size-3.5 text-neutral-400" />
        </div>

        {/* Hero Title */}
        <h1 className="font-serif text-4xl sm:text-6xl font-black text-neutral-900 tracking-tight leading-[1.15] max-w-3xl text-balance">
          Take Control of Your Finances All in One App
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-neutral-600 max-w-2xl text-pretty leading-relaxed">
          Say goodbye to financial stress with FinBuddy, your all-in-one money management solution. Whether you&apos;re budgeting, tracking expenses, or saving for the future, we make it simple and stress-free.
        </p>

        {/* Hero Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button variant="outline" size="lg" asChild>
            <a href="#features">Learn More</a>
          </Button>
          <Button size="lg" className="whitespace-nowrap" asChild>
            <Link href="/dashboard" className="inline-flex items-center gap-2 whitespace-nowrap">
              <span>Get Started</span>
              <Icon name="arrow-right" className="size-4 shrink-0" />
            </Link>
          </Button>
        </div>

        {/* 3 Staggered Phone Screen Mockups */}
        <div className="relative mt-16 w-full max-w-4xl flex justify-center items-end min-h-115 sm:min-h-130">
          
          {/* Left Phone Mockup */}
          <div className="absolute left-[2%] sm:left-[8%] bottom-0 w-55 sm:w-65 rounded-[36px] border-[6px] border-neutral-900 bg-white p-3 shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-10 hidden sm:block">
            <div className="mx-auto h-3.5 w-20 rounded-full bg-neutral-900 mb-3" />
            <div className="space-y-3 rounded-2xl bg-neutral-50 p-3 text-left">
              <div className="relative h-28 rounded-xl bg-linear-to-tr from-amber-400 to-amber-200 p-3 text-neutral-900 flex flex-col justify-between overflow-hidden">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-full w-max">Trip to Cox's Bazar</span>
                <div>
                  <p className="text-[10px] font-medium opacity-80">Saved Target</p>
                  <p className="font-mono text-base font-black">৳ 45,000</p>
                </div>
              </div>
              <div className="rounded-xl bg-white p-3 space-y-2 shadow-2xs">
                <p className="text-xs font-bold text-neutral-800">Monthly Contribution</p>
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-neutral-500">December 2026</span>
                  <span className="font-bold text-[#00A86B]">85%</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00A86B] w-[85%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Center Main Phone Mockup */}
          <div className="relative w-70 sm:w-[320px] rounded-[44px] border-8 border-neutral-900 bg-white p-4 shadow-2xl z-20 hover:scale-[1.02] transition-transform duration-300">
            <div className="mx-auto h-4 w-28 rounded-full bg-neutral-900 mb-4" />
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
                    JD
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-neutral-400">Good Morning</p>
                    <p className="text-xs font-black text-neutral-900">John Doe</p>
                  </div>
                </div>
                <span className="flex size-7 items-center justify-center rounded-full bg-neutral-100">
                  <Icon name="more-horizontal" className="size-4 text-neutral-600" />
                </span>
              </div>

              <div className="rounded-2xl bg-neutral-900 p-5 text-white shadow-md space-y-3">
                <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-mono">Our Balance</p>
                <p className="font-mono text-3xl font-black text-[#FFC700]">৳ 1,320.00</p>
                
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-800 text-center">
                  {[
                    { label: "Add", icon: "plus" },
                    { label: "Goal", icon: "target" },
                    { label: "Budget", icon: "pie-chart" },
                    { label: "History", icon: "receipt" }
                  ].map((act) => (
                    <div key={act.label} className="flex flex-col items-center gap-1">
                      <span className="flex size-8 items-center justify-center rounded-full bg-neutral-800 text-[#FFC700]">
                        <Icon name={act.icon} className="size-4" />
                      </span>
                      <span className="text-[9px] font-medium text-neutral-300">{act.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center rounded-xl bg-green-50/80 p-2.5">
                  <span className="text-xs font-bold text-green-900">Income</span>
                  <span className="font-mono text-xs font-black text-[#00A86B]">৳ 16,000</span>
                </div>
                <div className="flex justify-between items-center rounded-xl bg-amber-50/80 p-2.5">
                  <span className="text-xs font-bold text-amber-900">Expenses</span>
                  <span className="font-mono text-xs font-black text-amber-800">৳ 4,800</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-neutral-900">Most Recent</span>
                  <span className="text-[10px] font-bold text-neutral-400">See All</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-2">
                  <div className="flex items-center gap-2">
                    <span className="size-7 rounded-lg bg-white flex items-center justify-center text-xs shadow-2xs">🍔</span>
                    <div>
                      <p className="text-[11px] font-bold text-neutral-800">Grocery Market</p>
                      <p className="text-[9px] text-neutral-400">Today, 2:40 PM</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-red-600">- ৳ 120</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Phone Mockup */}
          <div className="absolute right-[2%] sm:right-[8%] bottom-0 w-55 sm:w-65 rounded-[36px] border-[6px] border-neutral-900 bg-white p-3 shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-500 z-10 hidden sm:block">
            <div className="mx-auto h-3.5 w-20 rounded-full bg-neutral-900 mb-3" />
            <div className="space-y-3 rounded-2xl bg-neutral-50 p-3 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-200/50">
                <span className="text-xs font-extrabold text-neutral-800">Linked Accounts</span>
                <span className="text-[10px] font-bold text-[#00A86B]">+ Connect</span>
              </div>
              <div className="space-y-2">
                <div className="rounded-xl bg-white p-2.5 space-y-1 shadow-2xs">
                  <p className="text-[10px] font-bold text-neutral-500">bKash Mobile Wallet</p>
                  <p className="font-mono text-sm font-black text-neutral-900">৳ 8,450.00</p>
                </div>
                <div className="rounded-xl bg-white p-2.5 space-y-1 shadow-2xs">
                  <p className="text-[10px] font-bold text-neutral-500">City Bank Savings</p>
                  <p className="font-mono text-sm font-black text-neutral-900">৳ 125,000.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof / Partner Logos */}
        <div className="mt-20 border-t border-neutral-200/60 pt-10 w-full max-w-4xl space-y-6 overflow-hidden">
          <p className="text-xs font-extrabold uppercase tracking-widest text-neutral-400">
            Trusted by the top companies in the world
          </p>
          <div className="relative overflow-hidden w-full py-2">
            <div className="animate-marquee-right flex gap-12 sm:gap-16 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all text-neutral-700 font-serif font-black text-lg sm:text-xl items-center">
              {["Evernote", "amazon", "Airtable", "gumroad", "Notion", "Evernote", "amazon", "Airtable", "gumroad", "Notion", "Evernote", "amazon", "Airtable", "gumroad", "Notion"].map((logo, idx) => (
                <span key={idx} className="shrink-0 hover:text-neutral-900 transition-colors">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 1: Features — "The all-in-one money platform" */}
        <section id="features" className="mt-28 w-full container space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-neutral-700 shadow-2xs">
              <Icon name="shapes" className="size-3.5 text-[#00A86B]" />
              <span>Features</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              The all-in-one money platform
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto text-pretty">
              Experience the convenience of managing your money on the go with FinBuddy. Whether it&apos;s tracking expenses, setting budgets, or planning goals, we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 text-left">
            <div className="group rounded-3xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-6">
              <div className="rounded-2xl bg-linear-to-br from-[#E2F7E7] to-white p-5 shadow-2xs">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#00A86B] text-white font-bold">
                    <Icon name="wallet" className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-black text-neutral-900">Category Budgets & Limits</p>
                    <p className="text-[11px] text-neutral-500">Encrypted & auto-tracked in browser storage</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-neutral-200/50 pt-3 text-[11px] font-mono text-neutral-600">
                  <span>6 Active Budgets</span>
                  <span className="font-bold text-[#00A86B]">Safe Pace</span>
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900">Flexible budgeting tools & limits</h3>
                <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                  Create monthly budgets with custom categories and instant warnings to ensure you stay safely on track.
                </p>
              </div>
            </div>

            <div className="group rounded-3xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-6">
              <div className="rounded-2xl bg-neutral-50 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-neutral-900">Cash Flow Trends</p>
                  <span className="text-[10px] font-mono text-neutral-400">100%</span>
                </div>
                <div className="h-20 w-full flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60">
                    <path d="M 0 40 Q 40 10 80 30 T 160 15 T 200 35" fill="none" stroke="#00A86B" strokeWidth="3" />
                    <path d="M 0 20 Q 50 50 100 25 T 180 45 T 200 20" fill="none" stroke="#FFC700" strokeWidth="3" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900">See exactly where your money is going</h3>
                <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                  Our diagrams and category breakdowns make it effortless to see where every taka of your money flows.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 text-left">
            <div className="group rounded-3xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-6">
              <div className="rounded-2xl bg-neutral-50 p-4 shadow-2xs space-y-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Investment</p>
                  <p className="font-mono text-lg font-black text-neutral-900">৳ 150,000</p>
                </div>
                <div className="space-y-1 border-t border-neutral-200/50 pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Cash Reserve</p>
                  <p className="font-mono text-sm font-black text-[#00A86B]">৳ 20,000</p>
                </div>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">Manage money in one place</h3>
                <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                  Know exactly what you have saved, invested, or borrowed in real-time.
                </p>
              </div>
            </div>

            <div className="group rounded-3xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-6">
              <div className="rounded-2xl bg-neutral-50 p-4 shadow-2xs space-y-3">
                <div className="h-20 rounded-xl bg-linear-to-r from-amber-400 to-amber-200 p-3 text-neutral-900 flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-full w-max">Hiking & Goal</span>
                  <p className="font-mono text-sm font-black">৳ 50,000</p>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00A86B] w-[75%]" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">Track your financial progress</h3>
                <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                  Track all of your savings goals and create a clear plan to achieve them.
                </p>
              </div>
            </div>

            <div className="group rounded-3xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-6">
              <div className="rounded-2xl bg-neutral-50 p-4 shadow-2xs flex items-end justify-between h-28">
                {[40, 65, 30, 90, 50, 75].map((h, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                    <div
                      className={`w-3.5 rounded-t-md ${idx === 3 ? 'bg-[#FFC700]' : 'bg-neutral-200'}`}
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[9px] font-mono text-neutral-400">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][idx]}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">Custom dashboard & reports</h3>
                <p className="mt-1.5 text-xs text-neutral-600 leading-relaxed">
                  Insights and daily pacing reports customized to fit your financial habits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Top Featured — Smart Features for Effortless Manage money */}
        <section className="mt-28 w-full container space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-neutral-700 shadow-2xs">
              <Icon name="sparkles" className="size-3.5 text-[#00A86B]" />
              <span>Top Featured</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Smart Features for Effortless Manage money
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto text-pretty">
              Enjoy seamless money management with our integrated tracking tools and continuous expert assistance.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 items-center">
            {/* Left 2 Cards */}
            <div className="space-y-6 text-left">
              <div className="rounded-2xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all space-y-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold">
                  <Icon name="shield-check" className="size-5" />
                </span>
                <h3 className="font-serif text-lg font-bold text-neutral-900">Personalized Insights</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Get actionable tips based on your daily spending habits to save more and spend wisely.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all space-y-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold">
                  <Icon name="file-text" className="size-5" />
                </span>
                <h3 className="font-serif text-lg font-bold text-neutral-900">Investment Tracker</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Monitor your investments and grow your wealth effortlessly with automatic tracking.
                </p>
              </div>
            </div>

            {/* Center Phone Mockup */}
            <div className="relative mx-auto w-65 sm:w-72.5 rounded-[40px] border-[7px] border-neutral-900 bg-white p-3 shadow-2xl z-10">
              <div className="mx-auto h-3.5 w-24 rounded-full bg-neutral-900 mb-3" />
              
              <div className="space-y-4 text-left">
                {/* Purple Wallet Hero Header */}
                <div className="rounded-2xl bg-[#7C3AED] p-4 text-white space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold">Wallet</span>
                    <span className="flex size-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">+</span>
                  </div>
                  
                  {/* Conic Ring */}
                  <div className="relative mx-auto size-28 rounded-full border-4 border-amber-300 bg-white text-neutral-900 flex flex-col items-center justify-center">
                    <span className="font-mono text-base font-black">৳ 120.00</span>
                    <span className="text-[9px] font-bold text-neutral-400">Assets</span>
                  </div>

                  <div className="space-y-1 pt-1 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span>● Cash</span>
                      <span className="font-bold">৳ 90.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>● Investment</span>
                      <span className="font-bold">৳ 40.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>● Loan</span>
                      <span className="font-bold">৳ 10.00</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="rounded-xl bg-neutral-50 p-2.5 flex justify-between items-center shadow-2xs">
                    <div>
                      <p className="text-[11px] font-bold text-neutral-800">Februari Salary</p>
                      <p className="text-[9px] text-neutral-400">1 Day ago</p>
                    </div>
                    <span className="font-mono text-xs font-black text-[#00A86B]">৳ 20.00</span>
                  </div>
                  <div className="rounded-xl bg-neutral-50 p-2.5 flex justify-between items-center shadow-2xs">
                    <div>
                      <p className="text-[11px] font-bold text-neutral-800">Retirement Reserve</p>
                      <p className="text-[9px] text-neutral-400">1 Day ago</p>
                    </div>
                    <span className="font-mono text-xs font-black text-purple-700">৳ 20.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 2 Cards */}
            <div className="space-y-6 text-left">
              <div className="rounded-2xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all space-y-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold">
                  <Icon name="scan" className="size-5" />
                </span>
                <h3 className="font-serif text-lg font-bold text-neutral-900">Customizable Alerts</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Receive notifications for bill due dates, category spending limits, and loan repayments.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-2xs hover:shadow-xs transition-all space-y-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold">
                  <Icon name="bell" className="size-5" />
                </span>
                <h3 className="font-serif text-lg font-bold text-neutral-900">Expense Tracking</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Automatically categorize your spending for better financial clarity and total budget control.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Testimonial Section with GSAP Marquee (Row 1 Left->Right, Row 2 Right->Left) */}
        <section className="mt-28 w-full space-y-12 overflow-hidden py-4">
          <div className="text-center space-y-3 max-w-2xl mx-auto px-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-neutral-700 shadow-2xs">
              <Icon name="feather" className="size-3.5 text-[#00A86B]" />
              <span>Testimonial</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Real Stories from Our App Users
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 text-pretty">
              Read how FinBuddy has transformed the event and money management experiences of our users through convenience and ease of use.
            </p>
          </div>

          {/* Continuous Smooth Scrolling Marquee Rows */}
          <div className="space-y-6 w-full">
            
            {/* Row 1: Left to Right Marquee */}
            <div className="relative overflow-hidden w-full py-2">
              <div className="animate-marquee-right flex gap-6">
                {[...testimonialsRow1, ...testimonialsRow1, ...testimonialsRow1].map((t, idx) => (
                  <div
                    key={idx}
                    className="w-[320px] shrink-0 rounded-2xl bg-white p-6 shadow-xs text-left space-y-4 hover:shadow-md transition-all"
                  >
                    <p className="text-xs text-neutral-600 leading-relaxed italic">&quot;{t.quote}&quot;</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
                      <span className="flex size-9 items-center justify-center rounded-full bg-amber-100 text-lg">
                        {t.avatar}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-neutral-900">{t.name}</p>
                        <p className="text-[10px] text-neutral-400">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Right to Left Marquee */}
            <div className="relative overflow-hidden w-full py-2">
              <div className="animate-marquee-left flex gap-6">
                {[...testimonialsRow2, ...testimonialsRow2, ...testimonialsRow2].map((t, idx) => (
                  <div
                    key={idx}
                    className="w-[320px] shrink-0 rounded-2xl bg-white p-6 shadow-xs text-left space-y-4 hover:shadow-md transition-all"
                  >
                    <p className="text-xs text-neutral-600 leading-relaxed italic">&quot;{t.quote}&quot;</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
                      <span className="flex size-9 items-center justify-center rounded-full bg-green-100 text-lg">
                        {t.avatar}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-neutral-900">{t.name}</p>
                        <p className="text-[10px] text-neutral-400">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Section 4: Frequently Asked Question Accordion */}
        <section className="mt-28 w-full container space-y-12 text-left">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-neutral-700 shadow-2xs">
              <Icon name="book-open" className="size-3.5 text-[#00A86B]" />
              <span>FAQ</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Frequently Asked Question
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 text-pretty">
              These are some frequently asked questions we&apos;ve answered to help new users getting started.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-start">
            {/* Column 1 */}
            <div className="space-y-4">
              {faqsCol1.map((faq) => {
                const isOpen = openFaq === faq.id
                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl bg-white p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-serif text-sm font-bold text-neutral-900">{faq.q}</h3>
                      <span className="font-mono text-sm font-bold text-neutral-400">{isOpen ? "∧" : "∨"}</span>
                    </div>
                    {isOpen && (
                      <p className="mt-3 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 animate-in fade-in duration-200">
                        {faq.a}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              {faqsCol2.map((faq) => {
                const isOpen = openFaq === faq.id
                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl bg-white p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-serif text-sm font-bold text-neutral-900">{faq.q}</h3>
                      <span className="font-mono text-sm font-bold text-neutral-400">{isOpen ? "∧" : "∨"}</span>
                    </div>
                    {isOpen && (
                      <p className="mt-3 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3 animate-in fade-in duration-200">
                        {faq.a}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Section 5: Footer */}
        <footer className="mt-32 w-full container border-t border-neutral-200/50 pt-16 pb-12 space-y-12 text-left">
          <div className="grid gap-8 sm:grid-cols-5">
            {/* Logo & Socials */}
            <div className="sm:col-span-2 space-y-5">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={200}
                  height={50}
                  className="h-12 w-auto object-contain"
                />
              </Link>
              <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                FinBuddy helps you take complete control of your finances with daily spending limits, budget tracking, and savings goals.
              </p>
              <div className="flex items-center gap-3 pt-1">
                {["facebook", "instagram", "twitter", "linkedin"].map((soc) => (
                  <span
                    key={soc}
                    className="flex size-9 items-center justify-center rounded-full bg-white text-neutral-600 hover:text-neutral-900 shadow-2xs transition-all cursor-pointer"
                  >
                    <Icon name={soc} className="size-4" />
                  </span>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">Support</p>
              <ul className="space-y-2 text-xs text-neutral-500 font-medium">
                <li><a href="#faq" className="hover:text-neutral-900">Help Center</a></li>
                <li><Link href="/settings" className="hover:text-neutral-900">Contact Us</Link></li>
                <li><a href="#faq" className="hover:text-neutral-900">FAQ</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">Resources</p>
              <ul className="space-y-2 text-xs text-neutral-500 font-medium">
                <li><a href="#features" className="hover:text-neutral-900">Tips & Articles</a></li>
                <li><Link href="/insights" className="hover:text-neutral-900">Knowledge</Link></li>
                <li><a href="#blog" className="hover:text-neutral-900">Blog</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">Legal</p>
              <ul className="space-y-2 text-xs text-neutral-500 font-medium">
                <li><a href="#" className="hover:text-neutral-900">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-neutral-900">Terms of Service</a></li>
                <li><a href="#" className="hover:text-neutral-900">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-200/50 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-400">
            <p>© 2026 FinBuddy. All rights reserved.</p>
            <p>Built with intentionality & precision.</p>
          </div>
        </footer>

      </main>
    </div>
  )
}
