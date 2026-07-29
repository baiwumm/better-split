'use client'

import { Button, Description, FieldError, Form, InputGroup, Label, Modal, TextArea, TextField, toast } from '@heroui/react'
import { ReceiptJapaneseYen, Save } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useAppStore } from '@/store/useAppStore'

import type { Group } from '@/types'
import type { UseOverlayStateReturn } from '@heroui/react'
import type { FC, FormEvent } from 'react'

const NAME_MAX_LENGTH = 50
const DESCRIPTION_MAX_LENGTH = 100

interface NewGroupModalProps {
  state: UseOverlayStateReturn
  group?: Group | null
  onClose?: VoidFunction
}

const NewGroupModal: FC<NewGroupModalProps> = ({ state, group, onClose }) => {
  const formRef = useRef<HTMLFormElement>(null)
  const { groups, createGroup, updateGroup } = useAppStore()
  const [nameLength, setNameLength] = useState(0)
  const [descriptionLength, setDescriptionLength] = useState(0)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Record<string, string> = {}
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })
    const isExist = groups.some(g => g.name === data.name && g.id !== group?.id)
    if (isExist) {
      return toast.danger('分账组已存在')
    }
    if (group) {
      updateGroup(group.id, data.name, data.description)
    }
    else {
      createGroup(data.name, data.description)
    }
    state.close()
  }

  useEffect(() => {
    if (!state.isOpen && formRef.current) {
      formRef.current.reset()
      setNameLength(0)
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
      <Modal.Container size="lg">
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <ReceiptJapaneseYen className="size-5" />
            </Modal.Icon>
            <Modal.Heading className="font-bold text-lg">{group ? '编辑分账组' : '创建新分账组'}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <Form
              className="flex flex-col gap-4"
              id="group-form"
              ref={formRef}
              onSubmit={onSubmit}
            >
              <TextField isRequired defaultValue={group?.name} name="name">
                <Label>分账组名称</Label>
                <InputGroup variant="secondary">
                  <InputGroup.Input
                    aria-describedby="group-name"
                    maxLength={NAME_MAX_LENGTH}
                    placeholder="例如：三亚旅行、聚餐AA"
                    onChange={e => setNameLength(e.target.value.length)}
                  />
                  <InputGroup.Suffix className="pr-2">
                    <Description id="group-name">
                      {nameLength}
                      /
                      {NAME_MAX_LENGTH}
                    </Description>
                  </InputGroup.Suffix>
                </InputGroup>
                <FieldError />
              </TextField>
              <TextField defaultValue={group?.description} name="description">
                <Label>描述</Label>
                <div className="flex flex-col gap-2">
                  <TextArea
                    aria-describedby="group-description"
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    placeholder="添加一些描述信息"
                    rows={4}
                    variant="secondary"
                    onChange={e => setDescriptionLength(e.target.value.length)}
                  />
                  <Description className="self-end" id="group-description">
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
            <Button form="group-form" type="submit">
              <Save />
              {group ? '保存修改' : '创建'}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
export default NewGroupModal
