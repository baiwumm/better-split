'use client'

import {
  Avatar,
  Button,
  Checkbox,
  CheckboxGroup,
  cn,
  Description,
  FieldError,
  Form,
  InputGroup,
  Label,
  ListBox,
  Modal,
  NumberField,
  Select,
  TextArea,
  TextField,
} from '@heroui/react'
import { ReceiptJapaneseYen, Save } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { categories } from '@/lib/constants'
import { useAppStore } from '@/store/useAppStore'

import type { Expense, ExpenseFormData, Person } from '@/types'
import type { UseOverlayStateReturn } from '@heroui/react'
import type { FC, FormEvent } from 'react'

const TITLE_MAX_LENGTH = 20
const DESCRIPTION_MAX_LENGTH = 50

interface AddExpenseModalProps {
  state: UseOverlayStateReturn
  peoples: Person[]
  onClose: VoidFunction
  expense?: Expense | null
}

const AddExpenseModal: FC<AddExpenseModalProps> = ({ state, peoples = [], onClose, expense }) => {
  const formRef = useRef<HTMLFormElement>(null)
  const { addExpense, updateExpense } = useAppStore()
  const [titleLength, setTitleLength] = useState(0)
  const [descriptionLength, setDescriptionLength] = useState(0)

  const allParticipantIds = useMemo(() => peoples.map(person => person.id), [peoples])
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    () => expense?.participants ?? allParticipantIds,
  )
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
      participants: formData.getAll('participants').map(item => item.toString()),
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
      formRef?.current.reset()
      setTitleLength(0)
      setDescriptionLength(0)
    }
  }, [state.isOpen])

  useEffect(() => {
    if (!state.isOpen) {
      onClose?.()
    }
  }, [state.isOpen, onClose])
  return (
    <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-150">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="text-accent-soft-foreground bg-accent-soft">
              <ReceiptJapaneseYen className="size-5" />
            </Modal.Icon>
            <Modal.Heading className="text-lg font-bold">
              {expense ? '编辑' : '添加'}
              消费记录
            </Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <Form
              ref={formRef}
              id="group-form"
              onSubmit={onSubmit}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <TextField name="title" isRequired defaultValue={expense?.title}>
                <Label>消费项目</Label>
                <InputGroup variant="secondary">
                  <InputGroup.Input
                    aria-describedby="expense-title"
                    maxLength={TITLE_MAX_LENGTH}
                    placeholder="例如：晚餐、打车费"
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
              <NumberField
                name="amount"
                variant="secondary"
                isRequired
                defaultValue={expense?.amount}
                maxValue={99999999.99}
                minValue={0.01}
              >
                <Label>金额</Label>
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input placeholder="请输入金额" />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <FieldError />
              </NumberField>
              <Select
                aria-label="付款人"
                name="payerId"
                variant="secondary"
                isRequired
                defaultValue={expense?.payerId ?? ''}
                placeholder="请选择付款人"
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
                          <Avatar
                            color="accent"
                            size="sm"
                            variant="soft"
                            className="size-4"
                          >
                            <Avatar.Fallback className="text-xs">
                              {selectedItem.name.slice(-1).toUpperCase()}
                            </Avatar.Fallback>
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
                        <Avatar color="accent" size="sm" variant="soft">
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
                aria-label="消费类别"
                name="category"
                variant="secondary"
                isRequired
                defaultValue={expense?.category ?? '其他'}
                placeholder="请选择消费类别"
              >
                <Label>消费类别</Label>
                <Select.Trigger>
                  <Select.Value>
                    {({ defaultChildren, state }) => {
                      const selectedItems = state.selectedItems
                      const selectedItem = categories.find(
                        categorie => categorie.value === selectedItems[0]?.key,
                      )
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
                      <ListBox.Item
                        key={value}
                        id={value}
                        textValue={label}
                        className="gap-2"
                      >
                        <Icon className="size-4.5" />
                        <Label>{label}</Label>
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                <FieldError />
              </Select>
              <div className="col-span-2 -mb-2 flex items-center justify-between">
                <Label isRequired>参与分账的人员</Label>
                <Checkbox
                  variant="secondary"
                  isIndeterminate={isIndeterminate}
                  isSelected={isAllSelected}
                  onChange={(isSelected: boolean) =>
                    setSelectedParticipants(isSelected ? allParticipantIds : [])}
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
                name="participants"
                isRequired
                validate={(value) => {
                  if (value.length === 0) {
                    return '请选择参与分账人员'
                  }
                  return null
                }}
                value={selectedParticipants}
                onChange={setSelectedParticipants}
                className="col-span-2"
              >
                <div className="mb-2 grid gap-4 sm:grid-cols-2">
                  {peoples.map(({ id, name }) => (
                    <Checkbox
                      key={id}
                      variant="secondary"
                      value={id}
                      className="mt-0"
                    >
                      <Checkbox.Content
                        className={cn(
                          'group relative flex w-full flex-row items-start justify-between gap-2 rounded-3xl border p-3 transition-all',
                          'data-[selected=true]:bg-accent/10 data-[selected=true]:border-accent',
                        )}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <Avatar color="accent" variant="soft">
                            <Avatar.Fallback>{name.slice(-1).toUpperCase()}</Avatar.Fallback>
                          </Avatar>
                          <Label className="truncate">{name}</Label>
                        </div>
                        <Checkbox.Control className="size-5 shrink-0 rounded-full before:rounded-full">
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
                    variant="secondary"
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    placeholder="添加备注信息"
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
            <Button variant="secondary" slot="close">
              取消
            </Button>
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
