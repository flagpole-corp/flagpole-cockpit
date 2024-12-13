import { useState, useCallback } from 'react'

interface UseModalResult {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useModal = (): UseModalResult => {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback((): void => {
    setIsOpen(true)
  }, [])

  const closeModal = useCallback((): void => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    openModal,
    closeModal,
  }
}
