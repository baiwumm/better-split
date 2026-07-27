import type { FC } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import ThemeToggle from '@/components/ThemeToggle'

const SplitDashboard: FC = () => {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      {/* 导航栏 */}
      <DashboardHeader />
    </div>
  )
}
export default SplitDashboard
