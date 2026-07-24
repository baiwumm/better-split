'use client'

import type { FC, FormEvent, SVGProps } from 'react'
import { Calculator, Check, Persons, Picture, Plus, Receipt } from '@gravity-ui/icons'
import { Button, Card, cn, FieldError, Form, Input, Label, Modal, TextArea, TextField, Typography, useOverlayState } from '@heroui/react'
import { useEffect, useRef } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import { useAppStore } from '@/store/useAppStore'

interface Feature {
  title: string
  desc: string
  icon: FC<SVGProps<SVGSVGElement>>
  color: string
}

const features: Feature[] = [
  {
    title: '智能成员管理',
    desc: '添加成员、自定义头像，智能保护有付款记录的成员数据',
    icon: Persons,
    color: 'accent',
  },
  {
    title: '自动分账计算',
    desc: '实时计算每个人的应付应收，使用贪心算法生成最优转账方案',
    icon: Calculator,
    color: 'success',
  },
  {
    title: '一键生成海报',
    desc: '生成精美的分账结果海报，支持高清下载和分享',
    icon: Picture,
    color: 'info',
  },
]

const LandingPage: FC = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const state = useOverlayState()
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
    <div className="min-h-screen">
      <ThemeToggle />
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* 主标题区域 */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-4">
            <div className="bg-accent size-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Receipt className="size-10 text-accent-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <Check className="text-success-foreground" />
            </div>
          </div>
          <div className="space-y-4 text-center">
            <Typography type="h1" align="center">{process.env.NEXT_PUBLIC_APP_NAME}</Typography>
            <Typography type="h2" align="center" weight="normal" className="text-accent">{process.env.NEXT_PUBLIC_APP_TITLE}</Typography>
            <Typography.Paragraph align="center" className="max-w-2xl mx-auto text-xl mt-4">{process.env.NEXT_PUBLIC_APP_DESC}</Typography.Paragraph>
          </div>
          <Button size="lg" className="mt-8" onPress={() => state.open()}>
            <Plus />
            开始创建分账组
          </Button>
        </div>
        {/* 功能特性展示 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map(({ title, desc, icon: Icon, color }, index) => (
            <Card key={index} className="backdrop-blur-sm">
              <div className={cn('size-12 rounded-xl flex items-center justify-center', `bg-${color}-soft`)}>
                <Icon className={cn('size-6', `text-${color}`)} />
              </div>
            </Card>
          ))}
        </div>
      </div>
      {/* 弹窗 */}
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <Receipt className="size-5" />
              </Modal.Icon>
              <Modal.Heading>创建分账组</Modal.Heading>
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
              <Button type="submit" form="group-form">创建</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  )
}
export default LandingPage
