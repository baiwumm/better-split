import type { Expense, Person, PersonBalance, Transfer } from '../types'

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 格式化金额显示
export function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`
}

// 计算分账结果
export function calculateSettlement(expenses: Expense[], people: Person[]): { personBalances: PersonBalance[], optimalTransfers: Transfer[] } {
  // 只为活跃用户（未删除）创建余额记录
  const activePeople = people.filter(person => !person.isDeleted)
  const personBalances: PersonBalance[] = activePeople.map(person => ({
    personId: person.id,
    balance: 0,
    totalPaid: 0,
    totalShare: 0,
  }))

  // 计算每个人的支付和应分摊金额
  expenses.forEach((expense) => {
    // 只计算当前活跃参与者的分摊
    const activeParticipants = expense.participants.filter(participantId =>
      activePeople.some(person => person.id === participantId),
    )

    if (activeParticipants.length === 0) {
      // 如果所有参与者都已删除，跳过这条记录
      return
    }

    const sharePerPerson = expense.amount / activeParticipants.length

    // 记录付款人的支付金额（如果付款人仍然活跃）
    const payerBalance = personBalances.find(p => p.personId === expense.payerId)
    if (payerBalance) {
      payerBalance.totalPaid += expense.amount
    }

    // 记录每个活跃参与者的应分摊金额
    activeParticipants.forEach((participantId) => {
      const participantBalance = personBalances.find(p => p.personId === participantId)
      if (participantBalance) {
        participantBalance.totalShare += sharePerPerson
      }
    })
  })

  // 计算净余额（正数表示应收，负数表示应付）
  personBalances.forEach((balance) => {
    balance.balance = balance.totalPaid - balance.totalShare
    // 保留两位小数精度
    balance.balance = Math.round(balance.balance * 100) / 100
  })

  // 生成最优转账方案
  const optimalTransfers = generateOptimalTransfers(personBalances)

  return { personBalances, optimalTransfers }
}

// 生成最优转账方案（贪心算法）
function generateOptimalTransfers(balances: PersonBalance[]): Transfer[] {
  const transfers: Transfer[] = []

  // 创建副本避免修改原始数据
  const balancesCopy = balances.map(b => ({ ...b }))

  const creditors = balancesCopy.filter(b => b.balance > 0.01).sort((a, b) => b.balance - a.balance)
  const debtors = balancesCopy.filter(b => b.balance < -0.01).sort((a, b) => a.balance - b.balance)

  let i = 0
  let j = 0

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i]
    const debtor = debtors[j]

    const transferAmount = Math.min(creditor.balance, Math.abs(debtor.balance))

    if (transferAmount > 0.01) {
      transfers.push({
        fromPersonId: debtor.personId,
        toPersonId: creditor.personId,
        amount: Number(transferAmount.toFixed(2)),
      })

      creditor.balance -= transferAmount
      debtor.balance += transferAmount
    }

    if (Math.abs(creditor.balance) < 0.01)
      i++
    if (Math.abs(debtor.balance) < 0.01)
      j++
  }

  return transfers
}

// 本地存储工具
export const storage = {
  getGroups: () => {
    try {
      const data = localStorage.getItem('split-bill-groups')
      if (!data)
        return []

      const groups = JSON.parse(data)
      // 恢复日期对象
      return groups.map((group: any) => ({
        ...group,
        createdAt: new Date(group.createdAt),
        updatedAt: new Date(group.updatedAt),
        members: group.members.map((member: any) => ({
          ...member,
          createdAt: new Date(member.createdAt),
        })),
        expenses: group.expenses.map((expense: any) => ({
          ...expense,
          createdAt: new Date(expense.createdAt),
        })),
      }))
    }
    catch (error) {
      console.error('Failed to load groups:', error)
      return []
    }
  },

  saveGroups: (groups: any[]) => {
    try {
      localStorage.setItem('split-bill-groups', JSON.stringify(groups))
    }
    catch (error) {
      console.error('Failed to save groups:', error)
    }
  },

  getCurrentGroupId: (): string | null => {
    return localStorage.getItem('split-bill-current-group')
  },

  setCurrentGroupId: (groupId: string) => {
    localStorage.setItem('split-bill-current-group', groupId)
  },
}

// 日期格式化
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// 验证表单数据
export function validateExpenseForm(data: any): string[] {
  const errors: string[] = []

  if (!data.title?.trim()) {
    errors.push('请输入消费项目名称')
  }

  if (!data.amount || Number.isNaN(Number(data.amount)) || Number(data.amount) <= 0) {
    errors.push('请输入有效的金额')
  }

  if (!data.payerId) {
    errors.push('请选择付款人')
  }

  if (!data.participants?.length) {
    errors.push('请选择至少一个参与者')
  }

  return errors
}

export function validatePersonForm(data: any, existingNames: string[]): string[] {
  const errors: string[] = []

  if (!data.name?.trim()) {
    errors.push('请输入姓名')
  }
  else if (existingNames.includes(data.name.trim())) {
    errors.push('该姓名已存在')
  }

  return errors
}
