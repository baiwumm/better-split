'use client'

import { Alert, Button, Description, Typography, useOverlayState } from '@heroui/react'
import { Plus, ReceiptJapaneseYen } from 'lucide-react'
import { useState } from 'react'

import AddExpenseModal from '@/components/AddExpenseModal'
import { formatCurrency } from '@/lib/utils'

import ExpenseCard from './ExpenseCard'

import type { Expense, Group, Person } from '@/types'
import type { FC } from 'react'

interface ExpenseTrackingProps {
  currentGroup: Group
  peoples: Person[]
}

const ExpenseTracking: FC<ExpenseTrackingProps> = ({ currentGroup, peoples = [] }) => {
  const state = useOverlayState()
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  const totalAmount = currentGroup.expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const canAddExpense = peoples.length >= 2

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    state.open()
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography type="h5">消费记录</Typography>
          <Description>
            共
            {' '}
            {currentGroup.expenses.length}
            {' '}
            条记录，总计
            {' '}
            {formatCurrency(totalAmount)}
          </Description>
        </div>
        <Button isDisabled={!canAddExpense} size="sm" onPress={() => state.open()}>
          <Plus />
          添加消费
        </Button>
      </div>
      {/* 提示信息 */}
      {!canAddExpense && (
        <Alert status="warning">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>至少需要添加 2 个成员才能记录消费</Alert.Title>
          </Alert.Content>
        </Alert>
      )}
      {/* 消费记录列表 */}
      {currentGroup.expenses.length === 0
        ? (
            <div className="flex flex-col gap-2 justify-center items-center text-muted py-20">
              <ReceiptJapaneseYen className="size-15" />
              <Typography type="h5" weight="normal">还没有消费记录</Typography>
              <Typography.Paragraph color="muted">开始记录你们的消费吧</Typography.Paragraph>
              {canAddExpense && (
                <Button size="sm" onPress={() => state.open()}>
                  <Plus />
                  添加第一条记录
                </Button>
              )}
            </div>
          )
        : (
            <div className="space-y-4">
              {currentGroup.expenses.map(expense => (
                <ExpenseCard
                  expense={expense}
                  key={expense.id}
                  peoples={peoples}
                  onEdit={handleEditExpense}
                />
              ))}
            </div>
          )}
      {/* 消费表单 */}
      <AddExpenseModal
        expense={editingExpense}
        key={editingExpense?.id ?? 'create'}
        peoples={peoples}
        state={state}
        onClose={() => setEditingExpense(null)}
      />
    </div>
  )
}
export default ExpenseTracking
