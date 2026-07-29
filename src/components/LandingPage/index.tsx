import { Button, Card, cn, Typography, useOverlayState } from '@heroui/react'
import {
  Calculator,
  Check,
  HouseHeart,
  Image,
  Plane,
  Plus,
  ReceiptJapaneseYen,
  ShoppingCart,
  Users,
  Utensils,
} from 'lucide-react'

import NewGroupModal from '@/components/NewGroupModal'
import ThemeToggle from '@/components/ThemeToggle'

import type { FC, SVGProps } from 'react'

interface Option {
  id: string
  title: string
  desc: string
  icon: FC<SVGProps<SVGSVGElement>>
  bgColor: string
  textColor: string
  isFill?: boolean
}

const features: Option[] = [
  {
    id: 'users',
    title: '智能成员管理',
    desc: '添加成员、自定义头像，智能保护有付款记录的成员数据',
    icon: Users,
    bgColor: 'bg-accent-soft',
    textColor: 'text-accent',
  },
  {
    id: 'calculator',
    title: '自动分账计算',
    desc: '实时计算每个人的应付应收，使用贪心算法生成最优转账方案',
    icon: Calculator,
    bgColor: 'bg-success-soft',
    textColor: 'text-success',
  },
  {
    id: 'image',
    title: '一键生成海报',
    desc: '生成精美的分账结果海报，支持高清下载和分享',
    icon: Image,
    bgColor: 'bg-info-soft',
    textColor: 'text-info',
  },
]

const scenes: Option[] = [
  {
    id: 'utensils',
    title: '聚餐聚会',
    desc: '朋友聚餐、生日聚会',
    icon: Utensils,
    bgColor: 'bg-warning-soft',
    textColor: 'text-warning',
  },
  {
    id: 'plane',
    title: '旅行出游',
    desc: '团队旅行、自驾游',
    icon: Plane,
    bgColor: 'bg-info-soft',
    textColor: 'text-info',
    isFill: true,
  },
  {
    id: 'shopping-cart',
    title: '团购拼单',
    desc: '合买物品、团购优惠',
    icon: ShoppingCart,
    bgColor: 'bg-success-soft',
    textColor: 'text-success',
    isFill: true,
  },
  {
    id: 'house-heart',
    title: '室友生活',
    desc: '房租水电、日常开销',
    icon: HouseHeart,
    bgColor: 'bg-accent-soft',
    textColor: 'text-accent',
  },
]

const LandingPage: FC = () => {
  const state = useOverlayState()
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* 主标题区域 */}
        <div className="mb-16 text-center">
          <div className="relative mb-4 inline-block">
            <div className="bg-accent mx-auto mb-6 flex size-20 transform items-center justify-center rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105">
              <ReceiptJapaneseYen className="text-accent-foreground size-10" />
            </div>
            <div className="bg-success absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full">
              <Check className="text-success-foreground size-4" />
            </div>
          </div>
          <div className="space-y-4 text-center">
            <Typography align="center" type="h1">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </Typography>
            <Typography
              align="center"
              className="text-accent"
              type="h2"
              weight="normal"
            >
              {process.env.NEXT_PUBLIC_APP_TITLE}
            </Typography>
            <Typography.Paragraph align="center" className="mx-auto mt-4 max-w-2xl text-xl">
              {process.env.NEXT_PUBLIC_APP_DESC}
            </Typography.Paragraph>
          </div>
          <Button className="mt-8" size="lg" onPress={() => state.open()}>
            <Plus />
            开始创建分账组
          </Button>
        </div>
        {/* 功能特性展示 */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {features.map(({ id, title, desc, icon: Icon, bgColor, textColor }) => (
            <Card className="backdrop-blur-sm" key={id}>
              <div className={cn('flex size-12 items-center justify-center rounded-xl', bgColor)}>
                <Icon className={cn('size-6', textColor)} />
              </div>
              <Card.Header>
                <Card.Title className="text-base font-bold">{title}</Card.Title>
                <Card.Description>{desc}</Card.Description>
              </Card.Header>
            </Card>
          ))}
        </div>
        {/* 场景示例 */}
        <div className="p-8">
          <Typography align="center" type="h3">
            适用场景
          </Typography>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {scenes.map(({ id, title, desc, icon: Icon, bgColor, textColor, isFill }) => (
              <div className="text-center" key={id}>
                <div
                  className={cn(
                    'mx-auto flex size-16 items-center justify-center rounded-full',
                    bgColor,
                  )}
                >
                  <Icon
                    className={cn('size-8', textColor)}
                    fill={isFill ? 'currentColor' : 'none'}
                  />
                </div>
                <Typography align="center" className="mt-4" type="h6">
                  {title}
                </Typography>
                <Typography.Paragraph align="center" color="muted" size="sm">
                  {desc}
                </Typography.Paragraph>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 弹窗 */}
      <NewGroupModal state={state} />
    </div>
  )
}
export default LandingPage
