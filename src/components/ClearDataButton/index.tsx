import { AlertDialog, Button, Surface, Typography } from '@heroui/react'
import { Eraser } from 'lucide-react'

import { useAppStore } from '@/store/useAppStore'

import type { FC } from 'react'

const ClearDataButton: FC = () => {
  const { clearAllData } = useAppStore()
  return (
    <AlertDialog>
      <Button size="sm" variant="danger" className="hidden sm:flex">
        <Eraser />
        清空数据
      </Button>
      <Button
        aria-label="清空数据"
        size="sm"
        variant="danger"
        isIconOnly
        className="sm:hidden"
      >
        <Eraser />
      </Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container size="lg">
          <AlertDialog.Dialog>
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>确认清空所有数据？</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body className="space-y-4">
              <p>此操作无法撤销</p>
              <Surface variant="transparent" className="bg-warning-soft border-warning text-warning rounded-3xl p-4">
                <Typography type="h6" className="text-warning-soft-foreground mb-1">以下数据将被永久删除：</Typography>
                <ul className="text-sm text-warning-soft-foreground space-y-1 list-inside list-disc">
                  <li>所有分账组信息</li>
                  <li>所有成员信息</li>
                  <li>所有消费记录</li>
                  <li>所有分账结算数据</li>
                </ul>
              </Surface>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button variant="tertiary" slot="close">取消</Button>
              <Button variant="danger" slot="close" onPress={clearAllData}>
                确认删除
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  )
}
export default ClearDataButton
