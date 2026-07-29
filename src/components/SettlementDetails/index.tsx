import { Alert, Avatar, Button, Card, cn, Description, Surface, Tabs, Typography } from '@heroui/react'
import { ArrowRight, Calculator, Check, Image } from 'lucide-react'

import { formatCurrency } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'

import type { Person } from '@/types'
import type { FC } from 'react'

interface SettlementDetailsProps {
  peoples: Person[]
}

const SettlementDetails: FC<SettlementDetailsProps> = ({ peoples = [] }) => {
  const { getSettlementResult } = useAppStore()
  const settlementResult = getSettlementResult()

  const getPersonName = (personId: string) => {
    const person = peoples.find(p => p.id === personId)
    if (!person) {
      return '已删除用户'
    }
    return person.isDeleted ? `${person.name}（已删除）` : person.name
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography type="h5">分账结算</Typography>
          <Description>
            总消费
            {formatCurrency(settlementResult?.totalAmount ?? 0)}
          </Description>
        </div>
        <Button size="sm">
          <Image />
          生成海报
        </Button>
      </div>
      {!settlementResult
        ? (
            <div className="flex flex-col gap-2 justify-center items-center text-muted py-20">
              <Calculator className="size-15" />
              <Typography type="h5" weight="normal">暂无分账数据</Typography>
              <Typography.Paragraph color="muted">添加消费记录后即可查看分账结果</Typography.Paragraph>
            </div>
          )
        : (
            <Tabs>
              <Tabs.ListContainer>
                <Tabs.List aria-label="Options">
                  <Tabs.Tab id="balances">
                    个人明细
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="transfers">
                    转账分案
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
              <Tabs.Panel id="balances">
                <div className="grid gap-4">
                  {settlementResult.personBalances.map((balance) => {
                    // 使用严格的数值比较，考虑浮点数精度问题
                    let status: string
                    let colorClass: string
                    let displayAmount: string

                    if (balance.balance > 0.01) {
                      status = '应收'
                      colorClass = 'text-success'
                      displayAmount = `+${formatCurrency(balance.balance)}`
                    }
                    else if (balance.balance < -0.01) {
                      status = '应付'
                      colorClass = 'text-danger'
                      displayAmount = formatCurrency(Math.abs(balance.balance))
                    }
                    else {
                      status = '已结清'
                      colorClass = 'text-muted'
                      displayAmount = formatCurrency(0)
                    }

                    return (
                      <Card key={balance.personId}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <Avatar className="shrink-0" color="accent" variant="soft">
                              <Avatar.Fallback>{getPersonName(balance.personId).slice(-1).toUpperCase()}</Avatar.Fallback>
                            </Avatar>
                            <Card.Header className="flex-1 min-w-0">
                              <Card.Title className="truncate text-base">{getPersonName(balance.personId)}</Card.Title>
                              <Card.Description className={cn('truncate', colorClass)}>
                                {status}
                              </Card.Description>
                            </Card.Header>
                          </div>
                          <Typography type="h5" className={colorClass}>
                            {displayAmount}
                          </Typography>
                        </div>
                        <Card.Content>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <Surface className="bg-info-soft border border-info rounded-lg px-3 py-2">
                              <div className="flex items-center justify-between">
                                <Typography type="body-sm" className="text-info-soft-foreground">总支付</Typography>
                                <Typography type="body" className="text-info-soft-foreground font-bold">{formatCurrency(balance.totalPaid)}</Typography>
                              </div>
                            </Surface>
                            <Surface className="bg-warning-soft border border-warning rounded-lg px-3 py-2">
                              <div className="flex items-center justify-between">
                                <Typography type="body-sm" className="text-warning-soft-foreground">应分摊</Typography>
                                <Typography type="body" className="text-warning-soft-foreground font-bold">{formatCurrency(balance.totalShare)}</Typography>
                              </div>
                            </Surface>
                          </div>
                        </Card.Content>
                      </Card>
                    )
                  })}
                </div>
              </Tabs.Panel>
              <Tabs.Panel id="transfers">
                <div className="space-y-4">
                  {settlementResult.optimalTransfers.length === 0
                    ? (
                        <div className="flex flex-col gap-2 justify-center items-center py-20">
                          <div className="bg-success flex size-10 items-center justify-center rounded-full">
                            <Check className="text-success-foreground size-8" />
                          </div>
                          <Typography type="h5" weight="normal">账目已平衡</Typography>
                          <Typography.Paragraph color="muted">所有人的账目都已平衡，无需转账</Typography.Paragraph>
                        </div>
                      )
                    : (
                        <>
                          <Alert status="accent">
                            <Alert.Indicator />
                            <Alert.Content>
                              <Alert.Title>
                                共需
                                {' '}
                                {settlementResult.optimalTransfers.length}
                                {' '}
                                笔转账完成结算
                              </Alert.Title>
                            </Alert.Content>
                          </Alert>
                          {settlementResult.optimalTransfers.map(transfer => (
                            <Surface key={`${transfer.fromPersonId}-${transfer.toPersonId}`} className="rounded-lg px-3 py-2">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <Avatar color="accent" variant="soft">
                                      <Avatar.Fallback>{getPersonName(transfer.fromPersonId).slice(-1).toUpperCase()}</Avatar.Fallback>
                                    </Avatar>
                                    <Typography type="body-sm">{getPersonName(transfer.fromPersonId)}</Typography>
                                  </div>
                                  <ArrowRight className="text-muted size-6" />
                                  <div className="flex items-center gap-2">
                                    <Avatar color="accent" variant="soft">
                                      <Avatar.Fallback>{getPersonName(transfer.toPersonId).slice(-1).toUpperCase()}</Avatar.Fallback>
                                    </Avatar>
                                    <Typography type="body-sm">{getPersonName(transfer.toPersonId)}</Typography>
                                  </div>
                                </div>
                                <Typography type="h5" className="text-danger">
                                  {formatCurrency(transfer.amount)}
                                </Typography>
                              </div>
                            </Surface>
                          ))}
                        </>
                      )}
                </div>
              </Tabs.Panel>
            </Tabs>
          )}
    </div>
  )
}
export default SettlementDetails
