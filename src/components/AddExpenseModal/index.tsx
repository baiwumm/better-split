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

const TITLE_MAX_LENGTH = 50
const DESCRIPTION_MAX_LENGTH = 100

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
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              id="group-form"
              ref={formRef}
              onSubmit={onSubmit}
            >
              <TextField isRequired defaultValue={expense?.title} name="title">
                <Label>消费项目</Label>
                <InputGroup variant="secondary">
                  <InputGroup.Input
                    aria-describedby="expense-title"
                    className="w-full"
                    maxLength={TITLE_MAX_LENGTH}
                    placeholder="例如：晚餐、打车费"
                    onChange={e => setTitleLength(e.target.value.length)}
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
                isRequired
                defaultValue={expense?.amount}
                maxValue={99999999.99}
                minValue={0.01}
                name="amount"
                variant="secondary"
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
                isRequired
                aria-label="付款人"
                defaultValue={expense?.payerId ?? ''}
                name="payerId"
                placeholder="请选择付款人"
                variant="secondary"
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
                            className="size-4"
                            color="accent"
                            size="sm"
                            variant="soft"
                          >
                            <Avatar.Fallback>
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
                      <ListBox.Item id={id} key={id} textValue={name}>
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
                defaultValue={expense?.category ?? '其他'}
                isRequired
                name="category"
                placeholder="请选择消费类别"
                variant="secondary"
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
                        className="gap-2"
                        id={value}
                        key={value}
                        textValue={label}
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
                  isIndeterminate={isIndeterminate}
                  isSelected={isAllSelected}
                  variant="secondary"
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
                isRequired
                className="col-span-2"
                name="participants"
                validate={(value) => {
                  if (value.length === 0) {
                    return '请选择参与分账人员'
                  }
                  return null
                }}
                value={selectedParticipants}
                onChange={setSelectedParticipants}
              >
                <div className="mb-2 grid gap-4 sm:grid-cols-2">
                  {peoples.map(({ id, name }) => (
                    <Checkbox
                      className="mt-0"
                      key={id}
                      value={id}
                      variant="secondary"
                    >
                      <Checkbox.Content
                        className={cn(
                          'group relative flex w-full flex-row items-start justify-between gap-2 rounded-3xl border p-3 transition-all',
                          'data-[selected=true]:bg-accent/10 data-[selected=true]:border-accent',
                        )}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <Avatar color="accent" variant="soft">
                            <Avatar.Fallback>{name.slice(-2).toUpperCase()}</Avatar.Fallback>
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
              <TextField className="col-span-2" defaultValue={expense?.description} name="description">
                <Label>备注（可选）</Label>
                <div className="flex flex-col gap-2">
                  <TextArea
                    aria-describedby="expense-description"
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    placeholder="添加备注信息"
                    rows={4}
                    variant="secondary"
                    onChange={e => setDescriptionLength(e.target.value.length)}
                  />
                  <Description className="self-end" id="expense-description">
                    {descriptionLength}
                    /
                    {DESCRIPTION_MAX_LENGTH}
                  </Description>
                </div>
              </TextField>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button slot="close" variant="secondary">
              取消
            </Button>
            <Button form="group-form" type="submit">
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
