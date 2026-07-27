'use client'
import type { FC } from 'react'
import type { Group } from '@/types'
import { Button, Typography, useOverlayState } from '@heroui/react'
import { PenLine, Plus, ReceiptJapaneseYen, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import ClearDataButton from '@/components/ClearDataButton'
import DeleteGroupDialog from '@/components/DeleteGroupDialog'
import NewGroupModal from '@/components/NewGroupModal'
import SwitchGroupButton from '@/components/SwitchGroupButton'
import { useAppStore } from '@/store/useAppStore'

const DashboardHeader: FC = () => {
  const { currentGroup, groups } = useAppStore()
  const groupState = useOverlayState()
  const deleteState = useOverlayState()
  const [editGroup, setEditGroup] = useState<Group | null>(null)

  if (!currentGroup) {
    return null
  }

  const handleEditGroup = (group: Group) => {
    setEditGroup(group)
    groupState.open()
  }

  useEffect(() => {
    if (!groupState.isOpen) {
      setEditGroup(null)
    }
  }, [groupState.isOpen])
  return (
    <div className="sticky top-0 z-20 backdrop-blur-sm p-4 max-w-5xl mx-auto flex justify-between items-center gap-4" id="header">
      {/* 左侧：当前分账组 */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <div className="bg-accent size-11 rounded-lg flex items-center justify-center shrink-0">
          <ReceiptJapaneseYen className="size-5 text-accent-foreground" />
        </div>
        <div className="flex items-start gap-2 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGroup.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{
                duration: 0.2,
              }}
              className="flex-1 min-w-0"
            >
              <Typography type="h6" truncate>
                {currentGroup.name}
              </Typography>

              {currentGroup.description && (
                <Typography.Paragraph
                  color="muted"
                  size="xs"
                  truncate
                >
                  {currentGroup.description}
                </Typography.Paragraph>
              )}
            </motion.div>
          </AnimatePresence>

          <Button size="sm" isIconOnly variant="ghost" className="shrink-0" onPress={() => handleEditGroup(currentGroup)}>
            <PenLine />
          </Button>
        </div>
      </div>
      {/* 右侧：操作按钮 */}
      <div className="shrink-0 flex items-center gap-1">
        {/* 清空数据 */}
        <ClearDataButton />
        {groups.length > 1 && (
          <>
            {/* 删除当前分账组 */}
            <Button variant="danger-soft" size="sm" className="hidden sm:flex" onPress={() => deleteState.open()}>
              <Trash2 />
              删除当前组
            </Button>
            <Button variant="danger-soft" size="sm" isIconOnly className="sm:hidden" onPress={() => deleteState.open()}>
              <Trash2 />
            </Button>
            {/* 切换组 */}
            <SwitchGroupButton />
          </>
        )}
        <Button size="sm" className="hidden sm:flex" onPress={() => groupState.open()}>
          <Plus />
          新建组
        </Button>
        <Button size="sm" isIconOnly className="sm:hidden" onPress={() => groupState.open()}>
          <Plus />
        </Button>
      </div>
      {/* 分账组弹窗 */}
      <NewGroupModal state={groupState} group={editGroup} />
      {/* 删除组弹窗 */}
      <DeleteGroupDialog state={deleteState} group={currentGroup} />
    </div>
  )
}
export default DashboardHeader
