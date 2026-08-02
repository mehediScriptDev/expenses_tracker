"use client"

import { BrandSpinner } from "@/app/loading"

export default function DashboardLoading() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <BrandSpinner />
    </div>
  )
}
