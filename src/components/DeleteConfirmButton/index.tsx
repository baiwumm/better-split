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
                size="sm"
                variant="ghost"
                isIconOnly
                onPress={handleConfirmRemove}
                className="text-success-soft-foreground hover:bg-success-soft"
              >
                <Check />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                isIconOnly
                onPress={() => setShowConfirm(false)}
              >
                <X />
              </Button>
            </>
          )
        : (
            <Button
              size="sm"
              variant="ghost"
              isIconOnly
              onPress={() => setShowConfirm(true)}
              className="text-danger-soft-foreground hover:bg-danger-soft"
            >
              <Trash2 />
            </Button>
          )}
    </div>
  )
}
export default DeleteConfirmButton
