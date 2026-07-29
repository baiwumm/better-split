'use client'

import { Button } from '@heroui/react'
import { Check, Trash2, X } from 'lucide-react'
import { useState } from 'react'

import type { FC } from 'react'

interface DeleteConfirmButtonProps {
  onRemove: () => void
}

const DeleteConfirmButton: FC<DeleteConfirmButtonProps> = ({ onRemove }) => {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleConfirmRemove = () => {
    onRemove?.()
    setShowConfirm(false)
  }
  return (
    <div className="flex items-center gap-1">
      {showConfirm
        ? (
            <>
              <Button
                isIconOnly
                className="text-success-soft-foreground hover:bg-success-soft"
                size="sm"
                variant="ghost"
                onPress={handleConfirmRemove}
              >
                <Check />
              </Button>
              <Button
                isIconOnlyonPress={() => setShowConfirm(false)}
                size="sm"
                variant="ghost"
              >
                <X />
              </Button>
            </>
          )
        : (
            <Button
              isIconOnly
              className="text-danger-soft-foreground hover:bg-danger-soft"
              size="sm"
              variant="ghost"
              onPress={() => setShowConfirm(true)}
            >
              <Trash2 />
            </Button>
          )}
    </div>
  )
}
export default DeleteConfirmButton
