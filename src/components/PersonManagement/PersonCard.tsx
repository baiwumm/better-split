'use client'

import type { FC } from 'react'
import type { Person } from '@/types'
import { Avatar, Button, Card, toast } from '@heroui/react'
import { Check, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'

interface PersonCardProps {
  person: Person
}

const PersonCard: FC<PersonCardProps> = ({ person }) => {
  const { removePerson } = useAppStore()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleConfirmRemove = () => {
    const result = removePerson(person.id)
    toast[result.success ? 'success' : 'danger'](result.message)
    setShowConfirm(false)
  }
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <Avatar color="accent" variant="soft" className="shrink-0">
            <Avatar.Fallback>{person.name.slice(-2).toUpperCase()}</Avatar.Fallback>
          </Avatar>
          <Card.Header className="flex-1 min-w-0">
            <Card.Title className="truncate">{person.name}</Card.Title>
            <Card.Description className="truncate">
              {new Date(person.createdAt).toLocaleDateString('zh-CN')}
            </Card.Description>
          </Card.Header>
        </div>
        <div className="flex items-center gap-1">
          {showConfirm
            ? (
              <>
                <Button size="sm" variant="ghost" isIconOnly className="text-success-soft-foreground hover:bg-success-soft" onPress={handleConfirmRemove}>
                  <Check />
                </Button>
                <Button size="sm" variant="ghost" isIconOnly onPress={() => setShowConfirm(false)}>
                  <X />
                </Button>
              </>
            )
            : (
              <Button
                size="sm"
                variant="ghost"
                isIconOnly
                className="text-danger-soft-foreground hover:bg-danger-soft"
                onPress={() => setShowConfirm(true)}
              >
                <Trash2 />
              </Button>
            )}
        </div>
      </div>
    </Card>
  )
}
export default PersonCard
