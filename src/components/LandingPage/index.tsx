import type { FC, SVGProps } from 'react'
import { Calculator, Check, HouseFill, PaperPlane, Persons, Picture, Plus, Receipt, ShoppingCart } from '@gravity-ui/icons'
import { Button, Card, cn, Typography, useOverlayState } from '@heroui/react'
import NewGroupModal from '@/components/NewGroupModal'
import ThemeToggle from '@/components/ThemeToggle'

interface Option {
  title: string
  desc: string
  icon: FC<SVGProps<SVGSVGElement>>
  bgColor: string
  textColor: string
}

const features: Option[] = [
  {
    title: '智能成员管理',
    desc: '添加成员、自定义头像，智能保护有付款记录的成员数据',
    icon: Persons,
    bgColor: 'bg-accent-soft',
    textColor: 'text-accent',
  },
  {
    title: '自动分账计算',
    desc: '实时计算每个人的应付应收，使用贪心算法生成最优转账方案',
    icon: Calculator,
    bgColor: 'bg-success-soft',
    textColor: 'text-success',
  },
  {
    title: '一键生成海报',
    desc: '生成精美的分账结果海报，支持高清下载和分享',
    icon: Picture,
    bgColor: 'bg-info-soft',
    textColor: 'text-info',
  },
]

const scenes: Option[] = [
  {
    title: '聚餐聚会',
    desc: '朋友聚餐、生日聚会',
    icon: Picture,
    bgColor: 'bg-warning-soft',
    textColor: 'text-warning',
  },
  {
    title: '旅行出游',
    desc: '团队旅行、自驾游',
    icon: PaperPlane,
    bgColor: 'bg-info-soft',
    textColor: 'text-info',
  },
  {
    title: '团购拼单',
    desc: '合买物品、团购优惠',
    icon: ShoppingCart,
    bgColor: 'bg-success-soft',
    textColor: 'text-success',
  },
  {
    title: '室友生活',
    desc: '房租水电、日常开销',
    icon: HouseFill,
    bgColor: 'bg-accent-soft',
    textColor: 'text-accent',
  },
]

const LandingPage: FC = () => {
  const state = useOverlayState()
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
          {features.map(({ title, desc, icon: Icon, bgColor, textColor }, index) => (
            <Card key={index} className="backdrop-blur-sm">
              <div className={cn('size-12 rounded-xl flex items-center justify-center', bgColor)}>
                <Icon className={cn('size-6', textColor)} />
              </div>
              <Card.Header>
                <Card.Title className="font-bold text-base">{title}</Card.Title>
                <Card.Description>{desc}</Card.Description>
              </Card.Header>
            </Card>
          ))}
        </div>
        {/* 场景示例 */}
        <div className="p-8">
          <Typography type="h3" align="center">适用场景</Typography>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {scenes.map(({ title, desc, icon: Icon, bgColor, textColor }, index) => (
              <div key={index} className="text-center">
                <div className={cn('size-16 rounded-full flex items-center justify-center mx-auto', bgColor)}>
                  <Icon className={cn('size-8', textColor)} />
                </div>
                <Typography type="h5" weight="normal" align="center" className="mt-4">{title}</Typography>
                <Typography.Paragraph align="center" color="muted" size="sm">{desc}</Typography.Paragraph>
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
