'use client'

import type { FC, FormEvent } from 'react'
import { Button, Description, FieldError, Form, InputGroup, Label, Modal, TextField, Typography, useOverlayState } from '@heroui/react'
import { CircleUserRound, UserRoundPlus, Users } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'
import PersonCard from './PersonCard'

const PersonManagement: FC = () => {
  const { currentGroup, addPerson } = useAppStore()
  const state = useOverlayState()
  const formRef = useRef<HTMLFormElement>(null)

  // 过滤掉已删除的成员
  const peoples = currentGroup ? currentGroup.members.filter(member => !member.isDeleted) : []
  const existingNames = peoples.map(p => p.name)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Record<string, string> = {}
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })
    addPerson(data.name)
    state.close()
  }

  useEffect(() => {
    if (!state.isOpen && formRef.current) {
      formRef.current.reset()
    }
  }, [state.isOpen])
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography type="h5">成员管理</Typography>
          <Description>
            添加参与分账的成员（
            {peoples.length}
            人）
          </Description>
        </div>
        <Button size="sm" onPress={() => state.open()}>
          <UserRoundPlus />
          添加成员
        </Button>
      </div>
      {/* 成员列表 */}
      {peoples.length === 0
        ? (
          <div className="flex flex-col gap-2 justify-center items-center text-muted py-20">
            <Users className="size-15" />
            <Typography type="h5" weight="normal">还没有成员</Typography>
            <Typography.Paragraph color="muted">开始添加参与分账的成员吧</Typography.Paragraph>
            <Button size="sm" onPress={() => state.open()}>
              <UserRoundPlus />
              添加第一个成员
            </Button>
          </div>
        )
        : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {peoples.map(person => (
                <motion.div
                  key={person.id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 10,
                    filter: 'blur(8px)',
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    filter: 'blur(8px)',
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <PersonCard person={person} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      {/* 添加成员弹窗 */}
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <CircleUserRound className="size-5" />
              </Modal.Icon>
              <Modal.Heading className="font-bold text-lg">添加成员</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Form ref={formRef} id="person-form" className="flex flex-col gap-4" onSubmit={onSubmit}>
                <TextField
                  isRequired
                  name="name"
                  validate={(value) => {
                    if (existingNames.includes(value)) {
                      return '该姓名已存在'
                    }
                    return null
                  }}
                >
                  <Label>姓名</Label>
                  <InputGroup variant="secondary">
                    <InputGroup.Input aria-describedby="成员姓名" placeholder="输入成员姓名" maxLength={20} />
                  </InputGroup>
                  <FieldError />
                </TextField>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="secondary">取消</Button>
              <Button type="submit" form="person-form">
                添加
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  )
}
export default PersonManagement
