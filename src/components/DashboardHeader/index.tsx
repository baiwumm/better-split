'use client'
import { Button, Typography, useOverlayState } from '@heroui/react'
import { PenLine, Plus, ReceiptJapaneseYen, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

import ClearDataButton from '@/components/ClearDataButton'
import DeleteGroupDialog from '@/components/DeleteGroupDialog'
import NewGroupModal from '@/components/NewGroupModal'
import SwitchGroupButton from '@/components/SwitchGroupButton'
import { useAppStore } from '@/store/useAppStore'

import type { Group } from '@/types'
import type { FC } from 'react'

interface DashboardHeaderProps {
  currentGroup: Group
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ currentGroup }) => {
  const { groups } = useAppStore()
  const groupState = useOverlayState()
  const deleteState = useOverlayState()
  const [editGroup, setEditGroup] = useState<Group | null>(null)

  const handleEditGroup = (group: Group) => {
    setEditGroup(group)
    groupState.open()
  }
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
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-0"
              exit={{ opacity: 0, y: -6 }}
              initial={{ opacity: 0, y: 6 }}
              key={currentGroup.id}
              transition={{
                duration: 0.2,
              }}
            >
              <Typography truncate type="h6">
                {currentGroup.name}
              </Typography>

              {currentGroup.description && (
                <Typography.Paragraph
                  truncate
                  color="muted"
                  size="xs"
                >
                  {currentGroup.description}
                </Typography.Paragraph>
              )}
            </motion.div>
          </AnimatePresence>

          <Button
            isIconOnly
            className="shrink-0"
            size="sm"
            variant="ghost"
            onPress={() => handleEditGroup(currentGroup)}
          >
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
            <Button
              className="hidden sm:flex"
              size="sm"
              variant="danger-soft"
              onPress={() => deleteState.open()}
            >
              <Trash2 />
              删除当前组
            </Button>
            <Button
              isIconOnly
              className="sm:hidden"
              size="sm"
              variant="danger-soft"
              onPress={() => deleteState.open()}
            >
              <Trash2 />
            </Button>
            {/* 切换组 */}
            <SwitchGroupButton currentGroup={currentGroup} />
          </>
        )}
        <Button className="hidden sm:flex" size="sm" onPress={() => groupState.open()}>
          <Plus />
          新建组
        </Button>
        <Button
          isIconOnly
          className="sm:hidden"
          size="sm"
          onPress={() => groupState.open()}
        >
          <Plus />
        </Button>
      </div>
      {/* 分账组弹窗 */}
      <NewGroupModal group={editGroup} state={groupState} onClose={() => setEditGroup(null)} />
      {/* 删除组弹窗 */}
      <DeleteGroupDialog group={currentGroup} state={deleteState} />
    </div>
  )
}
export default DashboardHeader
