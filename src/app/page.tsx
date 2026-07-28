'use client'

import { useEffect } from 'react'
import LandingPage from '@/components/LandingPage'
import SplitDashboard from '@/components/SplitDashboard'
import { useAppStore } from '@/store/useAppStore'

export default function Home() {
  const { currentGroup, initializeData } = useAppStore()

  // 初始化数据
  useEffect(() => {
    initializeData()
  }, [initializeData])

  if (!currentGroup) {
    return <LandingPage />
  }
  return <SplitDashboard currentGroup={currentGroup} />
}
