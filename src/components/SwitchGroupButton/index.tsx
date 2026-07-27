import type { FC } from 'react'
import type { Group } from '@/types'
import { Button, Description, Header, Label, ListBox, Popover, useOverlayState } from '@heroui/react'
import { ArrowLeftRight, Trash2 } from 'lucide-react'
import { useState } from 'react'
import DeleteGroupDialog from '@/components/DeleteGroupDialog'
import { useAppStore } from '@/store/useAppStore'

const SwitchGroupButton: FC = () => {
  const { currentGroup, groups, switchGroup } = useAppStore()
  const state = useOverlayState()
  const [deleteGroup, setDeleteGroup] = useState<Group | null>(null)
  const deleteState = useOverlayState()

  if (!groups.length) {
    return null
  }

  // 切换分账组
  const handleSwitchGroup = (groupId: string) => {
    state.close()
    setTimeout(() => {
      switchGroup(groupId)
    }, 100)
  }

  // 删除分账组
  const handleDeleteGroup = (group: Group) => {
    setDeleteGroup(group)
    deleteState.open()
    state.close()
  }
  return (
    <>
      <Popover isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <ArrowLeftRight />
          切换组
        </Button>
        <Button variant="outline" size="sm" isIconOnly className="sm:hidden">
          <ArrowLeftRight />
        </Button>
        <Popover.Content className="min-w-64 max-w-md">
          <Popover.Dialog>
            <Popover.Arrow />
            <ListBox aria-label="分账组" selectionMode="none" onAction={key => handleSwitchGroup(key as string)}>
              <ListBox.Section>
                <Header>切换到其他分账组</Header>
                {groups.filter(g => g.id !== currentGroup?.id).map(group => (
                  <ListBox.Item key={group.id} id={group.id} textValue={group.name}>
                    <div className="flex flex-col gap-1">
                      <Label>{group.name}</Label>
                      <Description>
                        {group.members.filter(m => !m.isDeleted).length}
                        {' '}
                        人 ·
                        {' '}
                        {group.expenses.length}
                        {' '}
                        条记录
                      </Description>
                    </div>
                    {groups.length > 1 && (
                      <Button variant="danger-soft" size="sm" isIconOnly className="ms-auto shrink-0" onPress={() => handleDeleteGroup(group)}>
                        <Trash2 />
                      </Button>
                    )}
                  </ListBox.Item>
                ))}
              </ListBox.Section>
            </ListBox>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
      {/* 删除组弹窗 */}
      <DeleteGroupDialog state={deleteState} group={deleteGroup} />
    </>
  )
}
export default SwitchGroupButton
