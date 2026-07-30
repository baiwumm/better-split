'use client'

import { Button, Card, Chip, Modal, Separator, Spinner, Surface, toast, Typography } from '@heroui/react'
import { snapdom } from '@zumer/snapdom'
import { ArrowRight, Calculator, Download, Image, ReceiptJapaneseYen } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'

import { formatCurrency, formatDate } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'

import type { Group, Person } from '@/types'
import type { FC } from 'react'

const MotionCard = motion.create(Card)

interface PosterGeneratorProps {
  group: Group
  peoples: Person[]
}

const PosterGenerator: FC<PosterGeneratorProps> = ({ group, peoples = [] }) => {
  const [currentDate] = useState(() => new Date())
  const posterRef = useRef<HTMLDivElement | null>(null)
  const { getSettlementResult } = useAppStore()
  const settlementResult = getSettlementResult()
  const [loading, setLoading] = useState(false)

  if (!settlementResult || !group) {
    return null
  }

  const getPersonName = (personId: string) => {
    const person = peoples.find(p => p.id === personId)
    if (!person) {
      return '已删除用户'
    }
    return person.isDeleted ? `${person.name}（已删除）` : person.name
  }

  const handleCapture = async () => {
    if (!posterRef.current) {
      toast.danger('海报元素未找到,截图失败')
      return
    }
    const element = posterRef.current
    try {
      setLoading(true)
      await document.fonts.ready
      // 等待 motion 动画完成
      await new Promise(resolve => requestAnimationFrame(resolve))
      const result = await snapdom(element, {
        scale: 3,
        embedFonts: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
      })
      await result.download({
        format: 'png',
        filename: `分账结果-${formatDate(new Date())}`,
      })
    }
    catch {
      toast.danger('海报生成失败，请重试')
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <Modal>
      <Button size="sm">
        <Image />
        生成海报
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:min-w-150">
            <Modal.CloseTrigger />
            <Modal.Header className="flex flex-row items-center">
              <Modal.Icon className="bg-default text-foreground">
                <Calculator className="size-5" />
              </Modal.Icon>
              <Modal.Heading className="text-lg font-bold">
                分账结果海报
              </Modal.Heading>
            </Modal.Header>
            <Separator className="mt-4" />
            <Modal.Body>
              <Surface ref={posterRef} variant="secondary" className="p-4 my-6 space-y-6 rounded-3xl">
                {/* 标题 */}
                <div className="space-y-2">
                  <div className="bg-accent mx-auto flex size-16 transform items-center justify-center rounded-full">
                    <ReceiptJapaneseYen className="text-accent-foreground size-6" />
                  </div>
                  <Typography align="center" type="h3">分账结果</Typography>
                  <Typography align="center" type="body">{group.name}</Typography>
                  <Typography align="center" type="body-sm" color="muted">{formatDate(settlementResult.calculatedAt)}</Typography>
                </div>
                {/* 总览 */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <Card>
                    <Card.Header className="text-center">
                      <Card.Description>
                        总消费
                      </Card.Description>
                      <Card.Title className="text-xl font-bold">
                        {formatCurrency(settlementResult?.totalAmount ?? 0)}
                      </Card.Title>
                    </Card.Header>
                  </Card>
                  <Card>
                    <Card.Header className="text-center">
                      <Card.Description>
                        参与人数
                      </Card.Description>
                      <Card.Title className="text-xl font-bold">
                        {peoples.length}
                      </Card.Title>
                    </Card.Header>
                  </Card>
                </div>
                {/* 个人明细 */}
                <div className="space-y-4">
                  <Typography type="h5">个人明细</Typography>
                  <motion.div layout className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {settlementResult.personBalances.map((balance, index) => {
                        const isCreditor = balance.balance > 0.01
                        const isDebtor = balance.balance < -0.01
                        const color = isCreditor ? 'text-success' : isDebtor ? 'text-danger' : 'text-muted'
                        return (
                          <MotionCard
                            key={balance.personId}
                            layout
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
                            initial={{
                              opacity: 0,
                              y: 10,
                              filter: 'blur(8px)',
                            }}
                            transition={{ duration: 0.5, delay: 0.1 * index, ease: 'easeOut' }}
                          >
                            <div className="flex items-center justify-between gap-2 flex-col sm:flex-row">
                              <Card.Header className="w-full sm:flex-1 min-w-0">
                                <Card.Title className="truncate text-base">{getPersonName(balance.personId)}</Card.Title>
                                <Card.Description className="text-xs">
                                  支付
                                  {' '}
                                  {formatCurrency(balance.totalPaid)}
                                  {' '}
                                  · 分摊
                                  {' '}
                                  {formatCurrency(balance.totalShare)}
                                </Card.Description>
                              </Card.Header>
                              <div className="flex items-center gap-2 sm:gap-0 flex-row sm:flex-col shrink-0">
                                <Typography type="body" align="end" className={color}>
                                  {isCreditor && '应收'}
                                  {isDebtor && '应付'}
                                  {!isCreditor && !isDebtor && '已结清'}
                                </Typography>
                                <Typography type="h6" align="end" className={color}>
                                  {isCreditor && '+'}
                                  {formatCurrency(Math.abs(balance.balance))}
                                </Typography>
                              </div>
                            </div>
                          </MotionCard>
                        )
                      })}
                    </AnimatePresence>
                  </motion.div>
                </div>
                {/* 转账方案 */}
                {settlementResult.optimalTransfers.length > 0
                  ? (
                      <div className="space-y-4">
                        <Typography type="h5">转账方案</Typography>
                        <motion.div layout className="space-y-3">
                          <AnimatePresence mode="popLayout">
                            {settlementResult.optimalTransfers.map((transfer, index) => (
                              <MotionCard
                                key={`${transfer.fromPersonId}-${transfer.toPersonId}`}
                                layout
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
                                initial={{
                                  opacity: 0,
                                  y: 10,
                                  filter: 'blur(8px)',
                                }}
                                transition={{ duration: 0.5, delay: 0.1 * index, ease: 'easeOut' }}
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex-1 min-w-0 flex items-center gap-2">
                                    <Chip className="min-w-0 max-w-[45%]">
                                      <Chip.Label className="truncate">
                                        {getPersonName(transfer.fromPersonId)}
                                      </Chip.Label>
                                    </Chip>
                                    <ArrowRight className="text-muted size-5 shrink-0" />
                                    <Chip className="min-w-0 max-w-[45%]">
                                      <Chip.Label className="truncate">
                                        {getPersonName(transfer.toPersonId)}
                                      </Chip.Label>
                                    </Chip>
                                  </div>
                                  <Typography type="h6" className="text-danger shrink-0">
                                    {formatCurrency(transfer.amount)}
                                  </Typography>
                                </div>
                              </MotionCard>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    )
                  : null}
                <Separator className="my-4" />
                <Typography.Paragraph align="center" color="muted" className="text-xs">
                  由
                  {' '}
                  <b>{process.env.NEXT_PUBLIC_APP_NAME}</b>
                  {' '}
                  人均分账应用生成 ·
                  {' '}
                  {formatDate(currentDate)}
                </Typography.Paragraph>
              </Surface>
            </Modal.Body>
            <Modal.Footer>
              <Button className="w-full" isPending={loading} onPress={handleCapture}>
                {({ isPending }) => (
                  <>
                    {isPending ? <Spinner color="current" size="sm" /> : <Download />}
                    {isPending ? '正在下载...' : '下载海报'}
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
export default PosterGenerator
