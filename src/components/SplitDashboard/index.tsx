import type { FC } from 'react'
import type { Group } from '@/types'
import DashboardHeader from '@/components/DashboardHeader'
import ExpenseTracking from '@/components/ExpenseTracking'
import PersonManagement from '@/components/PersonManagement'
import ThemeToggle from '@/components/ThemeToggle'

interface SplitDashboardProps {
  currentGroup: Group
}

const SplitDashboard: FC<SplitDashboardProps> = ({ currentGroup }) => {
  // 过滤掉已删除的成员
  const peoples = currentGroup.members.filter(member => !member.isDeleted)
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      {/* 导航栏 */}
      <DashboardHeader currentGroup={currentGroup} />
      {/* 内容区域 */}
      <div className="p-4 max-w-5xl mx-auto space-y-8 mb-8">
        {/* 成员管理 */}
        <PersonManagement peoples={peoples} />
        {/* 消费记录 */}
        <ExpenseTracking currentGroup={currentGroup} peoples={peoples} />
      </div>
    </div>
  )
}
export default SplitDashboard
