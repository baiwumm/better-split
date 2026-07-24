'use client'

import LandingPage from '@/components/LandingPage'
import SplitDashboard from '@/components/SplitDashboard'
import { useAppStore } from '@/store/useAppStore'

export default function Home() {
  const { currentGroup } = useAppStore()

  if (!currentGroup) {
    return <LandingPage />
  }
  return <SplitDashboard />
}
