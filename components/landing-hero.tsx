"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Icon } from "@/lib/icon"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <div className="relative min-h-screen bg-[#FAF8F3] text-neutral-900 overflow-hidden font-sans">
      {/* Background grid lines (subtle blueprint background matching reference image) */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Top Navbar */}
      <header className="relative z-10 mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
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
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings">Contact Us</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/transactions">Dashboard →</Link>
          </Button>
        </div>
      </header>

      {/* Main Hero Content Container */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-12 pb-20 text-center flex flex-col items-center">
        
        {/* Top Pill Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs mb-8 hover:border-neutral-400 transition-all cursor-pointer">
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
          <Button size="lg" asChild>
            <Link href="/transactions">
              Get Started <Icon name="arrow-right" className="size-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* 3 Staggered Phone Screen Mockups */}
        <div className="relative mt-16 w-full max-w-4xl flex justify-center items-end min-h-[460px] sm:min-h-[520px]">
          
          {/* Left Phone Mockup (Trip/Goal) */}
          <div className="absolute left-[2%] sm:left-[8%] bottom-0 w-[220px] sm:w-[260px] rounded-[36px] border-[6px] border-neutral-900 bg-white p-3 shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-10 hidden sm:block">
            {/* Camera notch */}
            <div className="mx-auto h-3.5 w-20 rounded-full bg-neutral-900 mb-3" />
            
            {/* Phone Screen Content */}
            <div className="space-y-3 rounded-2xl bg-neutral-50 p-3 text-left">
              <div className="relative h-28 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 p-3 text-neutral-900 flex flex-col justify-between overflow-hidden">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-full w-max">Trip to Cox's Bazar</span>
                <div>
                  <p className="text-[10px] font-medium opacity-80">Saved Target</p>
                  <p className="font-mono text-base font-black">৳ 45,000</p>
                </div>
              </div>

              <div className="rounded-xl bg-white border border-neutral-200 p-3 space-y-2">
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

          {/* Center Main Phone Mockup (Dashboard) */}
          <div className="relative w-[280px] sm:w-[320px] rounded-[44px] border-[8px] border-neutral-900 bg-white p-4 shadow-2xl z-20 hover:scale-[1.02] transition-transform duration-300">
            {/* Dynamic Island / Speaker */}
            <div className="mx-auto h-4 w-28 rounded-full bg-neutral-900 mb-4" />

            {/* App Screen Content */}
            <div className="space-y-4 text-left">
              
              {/* Header profile */}
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
                <span className="flex size-7 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200">
                  <Icon name="more-horizontal" className="size-4 text-neutral-600" />
                </span>
              </div>

              {/* Purple / Gold Balance Hero Box */}
              <div className="rounded-2xl bg-neutral-900 p-5 text-white shadow-md space-y-3">
                <p className="text-[11px] text-neutral-400 uppercase tracking-widest font-mono">Our Balance</p>
                <p className="font-mono text-3xl font-black text-[#FFC700]">৳ 1,320.00</p>
                
                {/* 4 Quick Action Chips */}
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

              {/* Income vs Expenses Cards */}
              <div className="space-y-2">
                <div className="flex justify-between items-center rounded-xl bg-green-50 border border-green-200 p-2.5">
                  <span className="text-xs font-bold text-green-900">Income</span>
                  <span className="font-mono text-xs font-black text-[#00A86B]">৳ 16,000</span>
                </div>
                <div className="flex justify-between items-center rounded-xl bg-amber-50 border border-amber-200 p-2.5">
                  <span className="text-xs font-bold text-amber-900">Expenses</span>
                  <span className="font-mono text-xs font-black text-amber-800">৳ 4,800</span>
                </div>
              </div>

              {/* Most Recent Activity */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-neutral-900">Most Recent</span>
                  <span className="text-[10px] font-bold text-neutral-400">See All</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-2 border border-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className="size-7 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-xs">🍔</span>
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

          {/* Right Phone Mockup (Add Account / Bank) */}
          <div className="absolute right-[2%] sm:right-[8%] bottom-0 w-[220px] sm:w-[260px] rounded-[36px] border-[6px] border-neutral-900 bg-white p-3 shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-500 z-10 hidden sm:block">
            {/* Camera notch */}
            <div className="mx-auto h-3.5 w-20 rounded-full bg-neutral-900 mb-3" />

            <div className="space-y-3 rounded-2xl bg-neutral-50 p-3 text-left">
              <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                <span className="text-xs font-extrabold text-neutral-800">Linked Accounts</span>
                <span className="text-[10px] font-bold text-[#00A86B]">+ Connect</span>
              </div>

              <div className="space-y-2">
                <div className="rounded-xl bg-white border border-neutral-200 p-2.5 space-y-1">
                  <p className="text-[10px] font-bold text-neutral-500">bKash Mobile Wallet</p>
                  <p className="font-mono text-sm font-black text-neutral-900">৳ 8,450.00</p>
                </div>
                <div className="rounded-xl bg-white border border-neutral-200 p-2.5 space-y-1">
                  <p className="text-[10px] font-bold text-neutral-500">City Bank Savings</p>
                  <p className="font-mono text-sm font-black text-neutral-900">৳ 125,000.00</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Social Proof / Partner Logos */}
        <div className="mt-20 border-t border-neutral-200 pt-10 w-full max-w-4xl space-y-6">
          <p className="text-xs font-extrabold uppercase tracking-widest text-neutral-400">
            Trusted by the top companies in the world
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all text-neutral-700 font-serif font-black text-lg">
            <span>Evernote</span>
            <span>amazon</span>
            <span>Airtable</span>
            <span>gumroad</span>
            <span>Notion</span>
          </div>
        </div>

        {/* Features Section — "The all-in-one money platform" */}
        <section className="mt-28 w-full max-w-5xl space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-3.5 py-1 text-xs font-bold text-neutral-700 shadow-2xs">
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

          {/* Top Row: 2 Large Cards */}
          <div className="grid gap-6 md:grid-cols-2 text-left">
            
            {/* Card 1: Flexible budgeting */}
            <div className="group rounded-3xl border border-neutral-200 bg-neutral-100/60 p-6 shadow-2xs hover:border-neutral-300 transition-all flex flex-col justify-between space-y-6">
              {/* Mockup Box */}
              <div className="rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-[#E2F7E7] to-white p-5 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#00A86B] text-white font-bold">
                    <Icon name="wallet" className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-black text-neutral-900">Category Budgets & Limits</p>
                    <p className="text-[11px] text-neutral-500">Encrypted & auto-tracked in browser storage</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-neutral-200/60 pt-3 text-[11px] font-mono text-neutral-600">
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

            {/* Card 2: Cash Flow Trends */}
            <div className="group rounded-3xl border border-neutral-200 bg-neutral-100/60 p-6 shadow-2xs hover:border-neutral-300 transition-all flex flex-col justify-between space-y-6">
              {/* Mockup Box */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-neutral-900">Cash Flow Trends</p>
                  <span className="text-[10px] font-mono text-neutral-400">100%</span>
                </div>
                {/* SVG Mini Line Chart */}
                <div className="h-20 w-full flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60">
                    <path
                      d="M 0 40 Q 40 10 80 30 T 160 15 T 200 35"
                      fill="none"
                      stroke="#00A86B"
                      strokeWidth="3"
                    />
                    <path
                      d="M 0 20 Q 50 50 100 25 T 180 45 T 200 20"
                      fill="none"
                      stroke="#FFC700"
                      strokeWidth="3"
                    />
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

          {/* Bottom Row: 3 Feature Cards */}
          <div className="grid gap-6 md:grid-cols-3 text-left">

            {/* Card 1: Manage money in one place */}
            <div className="group rounded-3xl border border-neutral-200 bg-neutral-100/60 p-6 shadow-2xs hover:border-neutral-300 transition-all flex flex-col justify-between space-y-6">
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs space-y-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Investment</p>
                  <p className="font-mono text-lg font-black text-neutral-900">৳ 150,000</p>
                </div>
                <div className="space-y-1 border-t border-neutral-100 pt-2">
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

            {/* Card 2: Track your progress financial */}
            <div className="group rounded-3xl border border-neutral-200 bg-neutral-100/60 p-6 shadow-2xs hover:border-neutral-300 transition-all flex flex-col justify-between space-y-6">
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs space-y-3">
                <div className="h-20 rounded-xl bg-gradient-to-r from-amber-400 to-amber-200 p-3 text-neutral-900 flex flex-col justify-between">
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

            {/* Card 3: Custom dashboard & reports */}
            <div className="group rounded-3xl border border-neutral-200 bg-neutral-100/60 p-6 shadow-2xs hover:border-neutral-300 transition-all flex flex-col justify-between space-y-6">
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs flex items-end justify-between h-28">
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

      </main>
    </div>
  )
}
