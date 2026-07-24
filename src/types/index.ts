// 人员信息
export interface Person {
  id: string
  name: string
  avatar?: string
  isDeleted?: boolean // 标记是否已删除
  createdAt: Date
}

// 消费项目
export interface Expense {
  id: string
  title: string
  amount: number
  payerId: string // 付款人ID
  participants: string[] // 参与分账的人员ID列表
  description?: string
  category?: string
  createdAt: Date
}

// 分账结果 - 每个人的应付/应收明细
export interface PersonBalance {
  personId: string
  balance: number // 正数表示应收，负数表示应付
  totalPaid: number // 总共支付的金额
  totalShare: number // 总共应分摊的金额
}

// 转账记录
export interface Transfer {
  fromPersonId: string
  toPersonId: string
  amount: number
}

// 分账组信息
export interface Group {
  id: string
  name: string
  description?: string
  members: Person[]
  expenses: Expense[]
  createdAt: Date
  updatedAt: Date
}

// 分账计算结果
export interface SettlementResult {
  groupId: string
  personBalances: PersonBalance[]
  optimalTransfers: Transfer[]
  totalAmount: number
  calculatedAt: Date
}

// 应用状态
export interface AppState {
  currentGroup: Group | null
  groups: Group[]
  isLoading: boolean
  error: string | null
}

// 表单状态
export interface PersonFormData {
  name: string
  avatar?: string
}

export interface ExpenseFormData {
  title: string
  amount: string
  payerId: string
  participants: string[]
  description?: string
  category?: string
}

export interface GroupFormData {
  name: string
  description?: string
}
