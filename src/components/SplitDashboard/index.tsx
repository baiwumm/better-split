import type { FC } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import PersonManagement from '@/components/PersonManagement'
import ThemeToggle from '@/components/ThemeToggle'

const SplitDashboard: FC = () => {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      {/* 导航栏 */}
      <DashboardHeader />
      {/* 内容区域 */}
      <div className="p-4 max-w-5xl mx-auto space-y-4">
        {/* 成员管理 */}
        <PersonManagement />
      </div>
    </div>
  )
}
export default SplitDashboard
