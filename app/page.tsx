"use client"

import { useState } from "react"
import { LandingPage } from "@/components/air-dj/landing-page"
import { AirDJDashboard } from "@/components/air-dj/dashboard"

export default function Page() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [dashboardEntering, setDashboardEntering] = useState(true)

  const handleLaunch = () => {
    setShowDashboard(true)
    // Briefly show the dashboard in its entering state, then animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDashboardEntering(false)
      })
    })
  }

  if (!showDashboard) {
    return <LandingPage onLaunch={handleLaunch} />
  }

  return <AirDJDashboard isEntering={dashboardEntering} />
}
