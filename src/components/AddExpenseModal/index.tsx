'use client'

import type { UseOverlayStateReturn } from '@heroui/react'
import type { FC, FormEvent } from 'react'
import type { Expense, ExpenseFormData, Person } from '@/types'
import { Avatar, Button, Checkbox, CheckboxGroup, cn, Description, FieldError, Form, InputGroup, Label, ListBox, Modal, NumberField, Select, TextArea, TextField } from '@heroui/react'
import { CarTaxiFront, Ellipsis, Gamepad2, Hotel, ReceiptJapaneseYen, Save, ShoppingCart, Utensils } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'

const TITLE_MAX_LENGTH = 50
const DESCRIPTION_MAX_LENGTH = 100

export const categories = [
  { value: '餐饮', label: '餐饮', icon: Utensils },
  { value: '交通', label: '交通', icon: CarTaxiFront },
  { value: '住宿', label: '住宿', icon: Hotel },
  { value: '娱乐', label: '娱乐', icon: Gamepad2 },
  { value: '购物', label: '购物', icon: ShoppingCart },
  { value: '其他', label: '其他', icon: Ellipsis },
]

interface AddExpenseModalProps {
  state: UseOverlayStateReturn
  peoples: Person[]
  expense?: Expense | null
}

const AddExpenseModal: FC<AddExpenseModalProps> = ({ state, peoples = [], expense }) => {
  const formRef = useRef<HTMLFormElement>(null)
  const { addExpense, updateExpense } = useAppStore()
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    expense?.participants ?? [],
  )
  const [titleLength, setTitleLength] = useState(0)
  const [descriptionLength, setDescriptionLength] = useState(0)

  const allParticipantIds = useMemo(() => peoples.map(person => person.id), [peoples])
  const isAllSelected = peoples.length > 0 && selectedParticipants.length === peoples.length
  const isIndeterminate = selectedParticipants.length > 0 && !isAllSelected

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: ExpenseFormData = {
      id: expense?.id,
      title: formData.get('title')?.toString() ?? '',
      amount: Number(formData.get('amount')),
      payerId: formData.get('payerId')?.toString() ?? '',
      category: formData.get('category')?.toString() ?? '',
      participants: formData
        .getAll('participants')
        .map(item => item.toString()),
      description: formData.get('description')?.toString() || undefined,
    }
    if (data.id) {
      updateExpense(data)
    }
    else {
      addExpense(data)
    }
    state.close()
  }

  useEffect(() => {
    if (!state.isOpen && formRef.current) {
      formRef.current.reset()
      setTitleLength(0)
      setDescriptionLength(0)
      setSelectedParticipants([])
    }
  }, [state.isOpen])

  useEffect(() => {
    if (state.isOpen && !expense && allParticipantIds.length) {
      setSelectedParticipants(allParticipantIds)
    }
  }, [state.isOpen, expense, allParticipantIds.join(',')])

  useEffect(() => {
    if (state.isOpen && expense) {
      setSelectedParticipants(expense.participants)
    }
  }, [state.isOpen, expense])
  return (
    <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-150">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <ReceiptJapaneseYen className="size-5" />
            </Modal.Icon>
            <Modal.Heading className="font-bold text-lg">
              {expense ? '编辑' : '添加'}
              消费记录
            </Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <Form ref={formRef} id="group-form" className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={onSubmit}>
              <TextField isRequired name="title" defaultValue={expense?.title}>
                <Label>消费项目</Label>
                <InputGroup variant="secondary">
                  <InputGroup.Input
                    aria-describedby="expense-title"
                    placeholder="例如：晚餐、打车费"
                    maxLength={TITLE_MAX_LENGTH}
                    onChange={e => setTitleLength(e.target.value.length)}
                    className="w-full"
                  />
                  <InputGroup.Suffix className="pr-2">
                    <Description id="expense-title">
                      {titleLength}
                      /
                      {TITLE_MAX_LENGTH}
                    </Description>
                  </InputGroup.Suffix>
                </InputGroup>
                <FieldError />
              </TextField>
              <NumberField isRequired minValue={0.01} maxValue={99999999.99} name="amount" defaultValue={expense?.amount} variant="secondary">
                <Label>金额</Label>
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input placeholder="请输入金额" />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <FieldError />
              </NumberField>
              <Select
                name="payerId"
                isRequired
                aria-label="付款人"
                placeholder="请选择付款人"
                variant="secondary"
                defaultValue={expense?.payerId ?? ''}
              >
                <Label>付款人</Label>
                <Select.Trigger>
                  <Select.Value>
                    {({ defaultChildren, state }) => {
                      const selectedItems = state.selectedItems
                      const selectedItem = peoples.find(({ id }) => id === selectedItems[0]?.key)
                      if (!selectedItem) {
                        return defaultChildren
                      }
                      return (
                        <div className="flex items-center gap-2">
                          <Avatar size="sm" color="accent" variant="soft" className="size-4">
                            <Avatar.Fallback>{selectedItem.name.slice(-1).toUpperCase()}</Avatar.Fallback>
                          </Avatar>
                          <Label>{selectedItem.name}</Label>
                        </div>
                      )
                    }}
                  </Select.Value>
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {peoples?.map(({ id, name }) => (
                      <ListBox.Item key={id} id={id} textValue={name}>
                        <Avatar size="sm" color="accent" variant="soft">
                          <Avatar.Fallback>{name.slice(-1).toUpperCase()}</Avatar.Fallback>
                        </Avatar>
                        <Label>{name}</Label>
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                <FieldError />
              </Select>
              <Select
                name="category"
                isRequired
                aria-label="消费类别"
                placeholder="请选择消费类别"
                variant="secondary"
                defaultValue={expense?.category ?? '其他'}
              >
                <Label>消费类别</Label>
                <Select.Trigger>
                  <Select.Value>
                    {({ defaultChildren, state }) => {
                      const selectedItems = state.selectedItems
                      const selectedItem = categories.find(categorie => categorie.value === selectedItems[0]?.key)
                      if (!selectedItem) {
                        return defaultChildren
                      }
                      const Icon = selectedItem.icon
                      return (
                        <div className="flex items-center gap-2">
                          <Icon className="size-4.5" />
                          <Label>{selectedItem.label}</Label>
                        </div>
                      )
                    }}
                  </Select.Value>
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {categories?.map(({ value, label, icon: Icon }) => (
                      <ListBox.Item key={value} id={value} textValue={label} className="gap-2">
                        <Icon className="size-4.5" />
                        <Label>{label}</Label>
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                <FieldError />
              </Select>
              <div className="flex items-center justify-between col-span-2 -mb-2">
                <Label isRequired>参与分账的人员</Label>
                <Checkbox
                  isIndeterminate={isIndeterminate}
                  isSelected={isAllSelected}
                  variant="secondary"
                  onChange={(isSelected: boolean) => setSelectedParticipants(isSelected ? allParticipantIds : [])}
                >
                  <Checkbox.Content>
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    全选
                  </Checkbox.Content>
                </Checkbox>
              </div>
              <CheckboxGroup
                isRequired
                name="participants"
                className="col-span-2"
                value={selectedParticipants}
                onChange={setSelectedParticipants}
                validate={(value) => {
                  if (value.length === 0) {
                    return '请选择参与分账人员'
                  }
                  return null
                }}
              >
                <div className="grid sm:grid-cols-2 gap-4 mb-2">
                  {peoples.map(({ id, name }) => (
                    <Checkbox key={id} value={id} variant="secondary" className="mt-0">
                      <Checkbox.Content
                        className={cn(
                          'group relative flex w-full flex-row items-start justify-between gap-2 rounded-3xl p-3 transition-all border',
                          'data-[selected=true]:bg-accent/10 data-[selected=true]:border-accent',
                        )}
                      >
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <Avatar color="accent" variant="soft">
                            <Avatar.Fallback>{name.slice(-2).toUpperCase()}</Avatar.Fallback>
                          </Avatar>
                          <Label className="truncate">{name}</Label>
                        </div>
                        <Checkbox.Control className="shrink-0 size-5 rounded-full before:rounded-full">
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox.Content>
                    </Checkbox>
                  ))}
                </div>
                <FieldError />
              </CheckboxGroup>
              <TextField name="description" defaultValue={expense?.description} className="col-span-2">
                <Label>备注（可选）</Label>
                <div className="flex flex-col gap-2">
                  <TextArea
                    aria-describedby="expense-description"
                    placeholder="添加备注信息"
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    variant="secondary"
                    rows={4}
                    onChange={e => setDescriptionLength(e.target.value.length)}
                  />
                  <Description id="expense-description" className="self-end">
                    {descriptionLength}
                    /
                    {DESCRIPTION_MAX_LENGTH}
                  </Description>
                </div>
              </TextField>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button slot="close" variant="secondary">取消</Button>
            <Button type="submit" form="group-form">
              <Save />
              {expense ? '保存修改' : '添加记录'}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
export default AddExpenseModal
