import { AlertDialog, Button, Surface, toast, Typography } from '@heroui/react'

import { useAppStore } from '@/store/useAppStore'

import type { Group } from '@/types'
import type { UseOverlayStateReturn } from '@heroui/react'
import type { FC } from 'react'

interface GroupInfo {
  id: string
  label: string
  value?: string | number
  suffix?: string
}

interface DeleteGroupDialogProps {
  state: UseOverlayStateReturn
  group: Group | null
}

const DeleteGroupDialog: FC<DeleteGroupDialogProps> = ({ state, group }) => {
  const { removeGroup } = useAppStore()

  if (!group) {
    return null
  }

  const activeMemberCount = group.members.filter(m => !m.isDeleted).length
  const expenseCount = group.expenses.length

  const groupInfo: GroupInfo[] = [
    { id: 'name', label: '分账组名称', value: group.name },
    { id: 'description', label: '描述', value: group.description },
    { id: 'activeMemberCount', label: '成员数量', value: activeMemberCount, suffix: '人' },
    { id: 'expenseCount', label: '消费记录', value: expenseCount, suffix: '条' },
  ]

  const onConfirm = () => {
    const result = removeGroup(group.id)
    toast[result.success ? 'success' : 'danger'](result.message)
  }
  return (
    <AlertDialog.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <AlertDialog.Container size="lg">
        <AlertDialog.Dialog>
          <AlertDialog.CloseTrigger />
          <AlertDialog.Header>
            <AlertDialog.Icon status="danger" />
            <AlertDialog.Heading>确认删除该分账组？</AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body className="space-y-4">
            <p>
              删除后，该分账组及其关联的数据将被
              <strong>永久移除</strong>
              ，且无法恢复。
            </p>
            {/* 分账组信息 */}
            <Surface className="bg-danger-soft border-danger text-danger rounded-3xl p-4" variant="transparent">
              <Typography className="text-danger-soft-foreground mb-1" type="h6">即将删除的分账组：</Typography>
              <div className="space-y-1">
                {groupInfo.map(({ id, label, value, suffix }) => (
                  <Typography.Paragraph className="text-danger-soft-foreground" key={id} size="sm">
                    {label}
                    ：
                    {value}
                    {suffix && ` ${suffix}`}
                  </Typography.Paragraph>
                ))}
              </div>
            </Surface>

            {/* 详细说明 */}
            <Surface className="bg-warning-soft border-warning text-warning rounded-3xl p-4" variant="transparent">
              <Typography className="text-warning-soft-foreground mb-1" type="h6">删除后将丢失：</Typography>
              <ul className="text-sm text-warning-soft-foreground space-y-1 list-inside list-disc">
                <li>所有成员信息</li>
                <li>所有消费记录</li>
                <li>分账计算结果</li>
                <li>相关的历史数据</li>
              </ul>
            </Surface>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button slot="close" variant="tertiary">取消</Button>
            <Button slot="close" variant="danger" onPress={onConfirm}>
              确认删除
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  )
}
export default DeleteGroupDialog
