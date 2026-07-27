'use client'

import type { UseOverlayStateReturn } from '@heroui/react'
import type { FC, FormEvent } from 'react'
import { FloppyDisk, Receipt } from '@gravity-ui/icons'
import { Button, FieldError, Form, Input, Label, Modal, TextArea, TextField } from '@heroui/react'
import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'

interface NewGroupModalProps {
  state: UseOverlayStateReturn
}

const NewGroupModal: FC<NewGroupModalProps> = ({ state }) => {
  const formRef = useRef<HTMLFormElement>(null)
  const { createGroup } = useAppStore()

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Record<string, string> = {}
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })
    createGroup(data.name, data.description)
    state.close()
  }

  useEffect(() => {
    if (!state.isOpen && formRef.current) {
      formRef.current.reset()
    }
  }, [state.isOpen])
  return (
    <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <Modal.Container size="lg">
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <Receipt className="size-5" />
            </Modal.Icon>
            <Modal.Heading className="font-bold text-lg">创建新分账组</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <Form ref={formRef} id="group-form" className="flex flex-col gap-4" onSubmit={onSubmit}>
              <TextField isRequired name="name">
                <Label>分账组名称</Label>
                <Input placeholder="例如：三亚旅行、聚餐AA" maxLength={50} variant="secondary" />
                <FieldError />
              </TextField>
              <TextField name="description">
                <Label>描述</Label>
                <TextArea placeholder="添加一些描述信息" maxLength={100} variant="secondary" rows={4} />
              </TextField>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button slot="close" variant="secondary">取消</Button>
            <Button type="submit" form="group-form">
              <FloppyDisk />
              创建
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}
export default NewGroupModal
