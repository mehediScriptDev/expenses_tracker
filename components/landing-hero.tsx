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
      name: "Asif Faiyaaz Saran",
      role: "Network & Systems Engineer",
      avatar: "/review/asif_faiyaaz_saran.webp",
      quote: "good app",
    },
    {
      name: "Bablu Mia",
      role: "Full Stack Developer",
      avatar: "/review/bablu_mia.webp",
      quote: "vloi features ase. recommend",
    },
    {
      name: "Kamrul",
      role: "Sr.Frontend Engineer",
      avatar: "/review/kamrul.webp",
      quote: "good work",
    },
    {
      name: "Mehedi",
      role: "Student",
      avatar: "/review/mehedi.webp",
      quote: "helped me a lot, recommend",
    },
    {
      name: "Naim Islam",
      role: "Teacher",
      avatar: "/review/naim_islam.webp",
      quote: "recommend",
    },
    {
      name: "Rakibul Hasan",
      role: "Backend Developer",
      avatar: "/review/rakibul_hasan.webp",
      quote: "sei jinis vai, use korte paren",
    },
  ]

  const testimonialsRow2 = [
    {
      name: "Saifuzzaman",
      role: "AI Engineer",
      avatar: "/review/saifuzzaman.webp",
      quote: "thanks to him who built this",
    },
    {
      name: "Sajeeb Roy",
      role: "Student",
      avatar: "/review/sajeeb_roy.webp",
      quote: "helpful app, thanks team",
    },
    {
      name: "Shahariar Sanny",
      role: "Software Engineer",
      avatar: "/review/shahariar_sanny.webp",
      quote: "definitely recommended",
    },
    {
      name: "Talha Alif",
      role: "Backend Developer",
      avatar: "/review/talha_alif.webp",
      quote: "good ui, i loved it",
    },
    {
      name: "Wasif Ahmed",
      role: "Student",
      avatar: "/review/wasif_ahmed.webp",
      quote: "really nice app and easy to use",
    },
  ]

  const faqs = [
    {
      id: 0,
      q: "How do I track daily expenses on Gorib Manush?",
      a: "Simply tap 'Add Expense' or use the quick preset chips (Food, Transport, Groceries) to log any purchase in seconds. Gorib Manush automatically calculates your daily spending pace.",
    },
    {
      id: 1,
      q: "What payment methods and currencies are supported?",
      a: "Gorib Manush supports BDT (৳), USD ($), EUR (€), GBP (£), INR (₹), and all major world currencies with customizable currency symbols.",
    },
    {
      id: 2,
      q: "How does the safe daily spending limit work?",
      a: "Gorib Manush divides your remaining salary for the cycle by the number of days left until payday, giving you a clear, safe daily limit.",
    },
    {
      id: 3,
      q: "Will I receive reminders for upcoming loan payments?",
      a: "Yes! Gorib Manush flags overdue and upcoming loan due dates right on your dashboard so you never miss a repayment.",
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
            <Link href="/settings">About us</Link>
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
          Say goodbye to financial stress with Gorib Manush, your all-in-one money management solution. Whether you&apos;re budgeting, tracking expenses, or saving for the future, we make it simple and stress-free.
        </p>

        {/* Hero Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button variant="outline" size="lg" asChild>
            <a href="#features">Learn More</a>
          </Button>
          <Button size="lg" className="whitespace-nowrap" asChild>
            <Link href="/dashboard" className="inline-flex items-center gap-2 whitespace-nowrap">
              <span>Start Tracking</span>
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
              Experience the convenience of managing your money on the go with Gorib Manush. Whether it&apos;s tracking expenses, setting budgets, or planning goals, we&apos;ve got you covered.
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
              Read how Gorib Manush has transformed the event and money management experiences of our users through convenience and ease of use.
            </p>
          </div>

          {/* Continuous Smooth Scrolling Marquee Rows */}
          <div className="space-y-3 w-full">
            
            {/* Row 1: Left to Right Marquee */}
            <div className="relative overflow-hidden w-full py-2">
              <div className="animate-marquee-right flex gap-4">
                {[...testimonialsRow1, ...testimonialsRow1, ...testimonialsRow1].map((t, idx) => (
                  <div
                    key={idx}
                    className="w-[320px] shrink-0 rounded-xl border border-neutral-200/80 bg-white p-5  transition-all text-left space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Icon key={i} name="star" className="size-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <p className="text-sm text-neutral-800 leading-relaxed font-medium">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                      {t.avatar.startsWith("/") ? (
                        <Image
                          src={t.avatar}
                          alt={t.name}
                          width={44}
                          height={44}
                          className="size-11 rounded-full object-cover shrink-0 ring-2 ring-neutral-200/70 shadow-2xs"
                        />
                      ) : (
                        <span className="flex size-11 items-center justify-center rounded-full bg-amber-100 text-xl ring-2 ring-neutral-200/70">
                          {t.avatar}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-neutral-900 truncate tracking-tight">{t.name}</h4>
                        <p className="text-xs text-neutral-500 truncate font-normal">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Right to Left Marquee */}
            <div className="relative overflow-hidden w-full py-2">
              <div className="animate-marquee-left flex gap-4">
                {[...testimonialsRow2, ...testimonialsRow2, ...testimonialsRow2].map((t, idx) => (
                  <div
                    key={idx}
                    className="w-[320px] shrink-0 rounded-2xl border border-neutral-200/80 bg-white p-5  transition-all text-left space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Icon key={i} name="star" className="size-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <p className="text-sm text-neutral-800 leading-relaxed font-medium">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                      {t.avatar.startsWith("/") ? (
                        <Image
                          src={t.avatar}
                          alt={t.name}
                          width={44}
                          height={44}
                          className="size-11 rounded-full object-cover shrink-0 ring-2 ring-neutral-200/70 shadow-2xs"
                        />
                      ) : (
                        <span className="flex size-11 items-center justify-center rounded-full bg-emerald-100 text-xl ring-2 ring-neutral-200/70">
                          {t.avatar}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-neutral-900 truncate tracking-tight">{t.name}</h4>
                        <p className="text-xs text-neutral-500 truncate font-normal">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Section 4: Frequently Asked Question Accordion */}
        <section className="mt-28 w-full max-w-4xl mx-auto px-6 space-y-10 text-left" id="faq">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-neutral-700 shadow-2xs">
              <Icon name="book-open" className="size-3.5 text-[#00A86B]" />
              <span>FAQ</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Common Questions
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 text-pretty">
              These are some frequently asked questions we&apos;ve answered to help new users get started.
            </p>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id
              return (
                <div
                  key={faq.id}
                  className="border-b border-neutral-200 dark:border-neutral-800 py-6 cursor-pointer transition-colors group"
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-foreground tracking-tight group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
                      {faq.q}
                    </h3>
                    <span className="text-2xl font-light text-neutral-900 dark:text-foreground shrink-0 select-none">
                      {isOpen ? "−" : "+"}
                    </span>
                  </div>
                  {isOpen && (
                    <p className="mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-3xl animate-in fade-in duration-200">
                      {faq.a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Section 5: Footer */}
        <footer className="mt-32 w-full container border-t border-neutral-200/60 pt-12 pb-10 text-left space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Logo & Description */}
            <div className="space-y-3">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="Gorib Manush Logo"
                  width={180}
                  height={45}
                  className="h-10 w-auto object-contain"
                />
              </Link>
              <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
                Gorib Manush helps you take complete control of your finances with daily spending limits, budget tracking, and savings goals.
              </p>
            </div>

            {/* Simple Page Links */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-600 font-medium">
              <a href="#faq" className="hover:text-neutral-900 transition-colors">Privacy Policy</a>
              <a href="#faq" className="hover:text-neutral-900 transition-colors">Legal Terms</a>
              <Link href="/dashboard" className="hover:text-neutral-900 transition-colors">Dashboard</Link>
            </div>
          </div>

          <div className="border-t border-neutral-200/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-neutral-500">
            <p>© 2026 Gorib Manush. All rights reserved.</p>
            <p>
              Developed by{" "}
              <a
                href="https://mehediscriptdev.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-neutral-800 hover:text-black underline underline-offset-2 transition-colors"
              >
                Mehedi
              </a>
            </p>
          </div>
        </footer>

      </main>
    </div>
  )
}
