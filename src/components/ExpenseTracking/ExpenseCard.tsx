import { Avatar, Button, Card, Description, Label, Separator, Typography } from '@heroui/react'
import { PenLine, ReceiptJapaneseYen } from 'lucide-react'

import DeleteConfirmButton from '@/components/DeleteConfirmButton'
import { categories } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'

import type { Expense, Person } from '@/types'
import type { FC } from 'react'

const MAX_PEOPLE_TO_SHOW = 3

interface ExpenseCardProps {
  peoples: Person[]
  expense: Expense
  onEdit: (expense: Expense) => void
}

const ExpenseCard: FC<ExpenseCardProps> = ({ peoples = [], expense, onEdit }) => {
  const { removeExpense } = useAppStore()
  const Icon = categories.find(c => c.label === expense.category)?.icon ?? ReceiptJapaneseYen
  const payer = peoples.find(p => p.id === expense.payerId)
  const participants = peoples.filter(p => expense.participants.includes(p.id))
  const amountPerPerson = expense.amount / expense.participants.length

  const handleConfirmRemove = () => {
    removeExpense(expense.id)
  }
  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="min-w-0 flex items-center gap-4 sm:flex-1">
          <div className="size-10 rounded-xl flex items-center justify-center bg-accent shrink-0">
            <Icon className="size-5 text-accent-foreground" />
          </div>
          <Card.Header className="min-w-0">
            <Card.Title className="truncate">
              {expense.title}
            </Card.Title>
            <Card.Description>
              {formatDate(expense.createdAt)}
            </Card.Description>
          </Card.Header>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Typography type="h5">
            {formatCurrency(expense.amount)}
          </Typography>
          <Button
            isIconOnly
            className="shrink-0"
            size="sm"
            variant="ghost"
            onPress={() => onEdit(expense)}
          >
            <PenLine />
          </Button>
          <DeleteConfirmButton onRemove={handleConfirmRemove} />
        </div>
      </div>
      <Card.Content className="space-y-3">
        {/* 付款人信息 */}
        <div className="flex items-center gap-4">
          <Label>付款人:</Label>
          <Avatar color="success" variant="soft">
            <Avatar.Fallback>
              {payer?.name.slice(-2).toUpperCase()}
            </Avatar.Fallback>
          </Avatar>
        </div>
        {/* 参与者信息 */}
        <div className="flex items-center gap-4">
          <Label>参与者:</Label>
          <div className="flex -space-x-1">
            {participants.slice(0, MAX_PEOPLE_TO_SHOW).map(participant => (
              <Avatar className="ring-2 ring-background" key={participant.id}>
                <Avatar.Fallback>
                  {participant.name.slice(-2).toUpperCase()}
                </Avatar.Fallback>
              </Avatar>
            ))}
            {participants.length > MAX_PEOPLE_TO_SHOW && (
              <Avatar className="ring-2 ring-background">
                <Avatar.Fallback className="text-xs">
                  +
                  {participants.length - MAX_PEOPLE_TO_SHOW}
                </Avatar.Fallback>
              </Avatar>
            )}
          </div>
        </div>
      </Card.Content>
      <Separator />
      <Card.Footer className="flex-col gap-3 items-start">
        {/* 分摊信息 */}
        <div className="flex items-center justify-between gap-4 w-full">
          <Description>
            人均分摊：
            {formatCurrency(amountPerPerson)}
          </Description>
          <Description>
            {participants.length}
            {' '}
            人参与
          </Description>
        </div>
        {expense.description && (
          <Description>
            备注:
            {' '}
            {expense.description}
          </Description>
        )}
      </Card.Footer>
    </Card>
  )
}
export default ExpenseCard
