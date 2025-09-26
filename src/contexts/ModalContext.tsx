import type { ComponentProps, ReactNode } from 'react'
import { createContext, useCallback, useContext, useState } from 'react'
import { Modal } from '~/components/Modal'
import { useModal } from '~/hooks/ui/useModal'

type ModalProps = Omit<ComponentProps<typeof Modal>, 'open' | 'onClose'>

interface ModalContextType {
  showModal: (props: ModalProps) => void
  hideModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const { isOpen, openModal, closeModal } = useModal()
  const [modalProps, setModalProps] = useState<ModalProps | null>(null)

  const showModal = useCallback(
    (props: ModalProps): void => {
      setModalProps(props)
      openModal()
    },
    [openModal]
  )

  const hideModal = useCallback((): void => {
    closeModal()
    setModalProps(null)
  }, [closeModal])

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalProps && <Modal {...modalProps} open={isOpen} onClose={hideModal} />}
    </ModalContext.Provider>
  )
}

export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider')
  }
  return context
}
