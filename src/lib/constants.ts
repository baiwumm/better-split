import {
  CarTaxiFront,
  Ellipsis,
  Gamepad2,
  Hotel,
  ShoppingCart,
  Utensils,
} from 'lucide-react'

export const categories = [
  { value: '餐饮', label: '餐饮', icon: Utensils },
  { value: '交通', label: '交通', icon: CarTaxiFront },
  { value: '住宿', label: '住宿', icon: Hotel },
  { value: '娱乐', label: '娱乐', icon: Gamepad2 },
  { value: '购物', label: '购物', icon: ShoppingCart },
  { value: '其他', label: '其他', icon: Ellipsis },
]
