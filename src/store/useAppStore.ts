import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { calculateSettlement, generateId, storage } from '@/lib/utils'

import type { Expense, ExpenseFormData, Group, Person, SettlementResult } from '@/types'

interface AppState {
  // 状态
  currentGroup: Group | null
  groups: Group[]
  isLoading: boolean
  error: string | null

  // 操作方法
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // 分账组管理
  createGroup: (name: string, description?: string) => Group
  updateGroup: (groupId: string, name: string, description?: string) => Group | null
  removeGroup: (groupId: string) => { success: boolean, message: string }
  switchGroup: (groupId: string) => void

  // 成员管理
  addPerson: (name: string, avatar?: string) => Person | null
  removePerson: (personId: string) => { success: boolean, message: string }

  // 消费记录管理
  addExpense: (formData: ExpenseFormData) => Expense | null
  updateExpense: (formData: ExpenseFormData) => Expense | null
  removeExpense: (expenseId: string) => void

  // 分账计算
  getSettlementResult: () => SettlementResult | null

  // 数据初始化
  initializeData: () => void
  saveToStorage: () => void
  clearAllData: () => void
}

export const useAppStore = create<AppState>()(devtools((set, get) => ({
  // 初始状态
  currentGroup: null,
  groups: [],
  isLoading: true,
  error: null,

  // 基础操作
  setLoading: (loading) => {
    set({ isLoading: loading })
  },

  setError: error => set({ error }),

  // 保存到本地存储
  saveToStorage: () => {
    const { groups, currentGroup } = get()
    storage.saveGroups(groups)
    if (currentGroup) {
      storage.setCurrentGroupId(currentGroup.id)
    }
  },

  // 分账组管理
  createGroup: (name, description) => {
    const newGroup: Group = {
      id: generateId(),
      name,
      description,
      members: [],
      expenses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    set((state) => {
      const newState = {
        groups: [...state.groups, newGroup],
        currentGroup: newGroup,
      }
      return newState
    })

    // 保存到localStorage
    const { saveToStorage } = get()
    saveToStorage()

    return newGroup
  },

  updateGroup: (groupId, name, description) => {
    const { groups, currentGroup, saveToStorage } = get()

    const updatedGroups = groups.map(group =>
      group.id === groupId
        ? { ...group, name, description, updatedAt: new Date() }
        : group,
    )

    const updatedGroup = updatedGroups.find(g => g.id === groupId) || null
    const newCurrentGroup = currentGroup?.id === groupId ? updatedGroup : currentGroup

    set({
      groups: updatedGroups,
      currentGroup: newCurrentGroup,
    })

    saveToStorage()
    return updatedGroup
  },

  removeGroup: (groupId) => {
    const { groups, currentGroup, saveToStorage } = get()

    // 检查是否是最后一个分账组
    if (groups.length <= 1) {
      return { success: false, message: '至少要保留一个分账组' }
    }

    // 获取要删除的分账组
    const groupToDelete = groups.find(g => g.id === groupId)
    if (!groupToDelete) {
      return { success: false, message: '未找到指定的分账组' }
    }

    // 删除分账组
    const updatedGroups = groups.filter(g => g.id !== groupId)

    // 如果删除的是当前分账组，则切换到第一个分账组
    let newCurrentGroup = currentGroup
    if (currentGroup?.id === groupId) {
      newCurrentGroup = updatedGroups[0] || null
    }

    set({
      groups: updatedGroups,
      currentGroup: newCurrentGroup,
    })

    saveToStorage()
    return { success: true, message: '分账组删除成功' }
  },

  switchGroup: (groupId) => {
    const { groups } = get()
    const group = groups.find(g => g.id === groupId) || null
    set({ currentGroup: group })
    if (group) {
      storage.setCurrentGroupId(groupId)
    }
  },

  // 成员管理
  addPerson: (name, avatar) => {
    const { currentGroup, groups, saveToStorage } = get()
    if (!currentGroup)
      return null

    const newPerson: Person = {
      id: generateId(),
      name,
      avatar,
      createdAt: new Date(),
    }

    const updatedGroup = {
      ...currentGroup,
      members: [...currentGroup.members, newPerson],
      updatedAt: new Date(),
    }

    const updatedGroups = groups.map(g =>
      g.id === currentGroup.id ? updatedGroup : g,
    )

    set({
      currentGroup: updatedGroup,
      groups: updatedGroups,
    })

    saveToStorage()
    return newPerson
  },

  removePerson: (personId) => {
    const { currentGroup, groups, saveToStorage } = get()
    if (!currentGroup)
      return { success: false, message: '未找到当前分账组' }

    // 检查该人员是否有付款记录
    const hasPaymentRecords = currentGroup.expenses.some(expense => expense.payerId === personId)

    if (hasPaymentRecords) {
      return { success: false, message: '该成员有付款记录，不能删除' }
    }

    // 将人员标记为已删除，而不是真正删除
    const updatedMembers = currentGroup.members.map(member =>
      member.id === personId
        ? { ...member, isDeleted: true }
        : member,
    )

    const updatedGroup = {
      ...currentGroup,
      members: updatedMembers,
      updatedAt: new Date(),
    }

    const updatedGroups = groups.map(g =>
      g.id === currentGroup.id ? updatedGroup : g,
    )

    set({
      currentGroup: updatedGroup,
      groups: updatedGroups,
    })

    saveToStorage()
    return { success: true, message: '成员删除成功' }
  },

  // 消费记录管理
  addExpense: (formData) => {
    const { currentGroup, groups, saveToStorage } = get()
    if (!currentGroup)
      return null

    const newExpense: Expense = {
      ...formData,
      id: generateId(),
      createdAt: new Date(),
    }

    const updatedGroup = {
      ...currentGroup,
      expenses: [...currentGroup.expenses, newExpense],
      updatedAt: new Date(),
    }

    const updatedGroups = groups.map(g =>
      g.id === currentGroup.id ? updatedGroup : g,
    )

    set({
      currentGroup: updatedGroup,
      groups: updatedGroups,
    })

    saveToStorage()
    return newExpense
  },

  updateExpense: ({ id: expenseId, ...formData }) => {
    const { currentGroup, groups, saveToStorage } = get()
    if (!currentGroup)
      return null

    const updatedExpenses = currentGroup.expenses.map(expense =>
      expense.id === expenseId
        ? { ...expense, ...formData }
        : expense,
    )

    const updatedGroup = {
      ...currentGroup,
      expenses: updatedExpenses,
      updatedAt: new Date(),
    }

    const updatedGroups = groups.map(g =>
      g.id === currentGroup.id ? updatedGroup : g,
    )

    set({
      currentGroup: updatedGroup,
      groups: updatedGroups,
    })

    saveToStorage()
    return updatedExpenses.find(e => e.id === expenseId) || null
  },

  removeExpense: (expenseId) => {
    const { currentGroup, groups, saveToStorage } = get()
    if (!currentGroup)
      return

    const updatedGroup = {
      ...currentGroup,
      expenses: currentGroup.expenses.filter(e => e.id !== expenseId),
      updatedAt: new Date(),
    }

    const updatedGroups = groups.map(g =>
      g.id === currentGroup.id ? updatedGroup : g,
    )

    set({
      currentGroup: updatedGroup,
      groups: updatedGroups,
    })

    saveToStorage()
  },

  // 分账计算
  getSettlementResult: () => {
    const { currentGroup } = get()
    if (!currentGroup || currentGroup.expenses.length === 0) {
      return null
    }

    const { personBalances, optimalTransfers } = calculateSettlement(
      currentGroup.expenses,
      currentGroup.members,
    )

    const totalAmount = currentGroup.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    )

    return {
      groupId: currentGroup.id,
      personBalances,
      optimalTransfers,
      totalAmount,
      calculatedAt: new Date(),
    }
  },

  // 数据初始化
  initializeData: () => {
    try {
      const groups = storage.getGroups()
      const currentGroupId = storage.getCurrentGroupId()
      const currentGroup = groups.find((g: Group) => g.id === currentGroupId) || null

      set({
        groups,
        currentGroup,
        isLoading: false,
        error: null,
      })
    }
    catch {
      set({
        isLoading: false,
        error: '加载数据失败',
      })
    }
  },

  clearAllData: () => {
    // 清空 localStorage
    localStorage.removeItem('split-bill-groups')
    localStorage.removeItem('split-bill-current-group')

    // 重置状态到初始状态
    set({
      currentGroup: null,
      groups: [],
      isLoading: false,
      error: null,
    })
  },
}), {
  name: 'split-bill-store',
}))
