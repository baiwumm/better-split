'use client'

import type { UseOverlayStateReturn } from '@heroui/react'
import type { FC, FormEvent } from 'react'
import type { Group } from '@/types'
import { Button, Description, FieldError, Form, InputGroup, Label, Modal, TextArea, TextField } from '@heroui/react'
import { ReceiptJapaneseYen, Save } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'

const NAME_MAX_LENGTH = 50
const DESCRIPTION_MAX_LENGTH = 100

interface NewGroupModalProps {
  state: UseOverlayStateReturn
  group: Group | null
}

const NewGroupModal: FC<NewGroupModalProps> = ({ state, group }) => {
  const formRef = useRef<HTMLFormElement>(null)
  const { createGroup, updateGroup } = useAppStore()
  const [nameLength, setNameLength] = useState(0)
  const [descriptionLength, setDescriptionLength] = useState(0)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Record<string, string> = {}
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })
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
            <Form ref={formRef} id="group-form" className="flex flex-col gap-4" onSubmit={onSubmit}>
              <TextField isRequired name="name" defaultValue={group?.name}>
                <Label>分账组名称</Label>
                <InputGroup variant="secondary">
                  <InputGroup.Input
                    aria-describedby="group-name"
                    placeholder="例如：三亚旅行、聚餐AA"
                    maxLength={NAME_MAX_LENGTH}
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
              <TextField name="description" defaultValue={group?.description}>
                <Label>描述</Label>
                <div className="flex flex-col gap-2">
                  <TextArea
                    aria-describedby="group-description"
                    placeholder="添加一些描述信息"
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    variant="secondary"
                    rows={4}
                    onChange={e => setDescriptionLength(e.target.value.length)}
                  />
                  <Description id="group-description" className="self-end">
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
              {group ? '保存修改' : '创建'}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
export default NewGroupModal
