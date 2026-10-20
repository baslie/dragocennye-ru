import { useEffect, type MouseEvent as ReactMouseEvent } from 'react'
import type { InquiryModalProps } from './types'
import { InquiryDialog } from './InquiryDialog'

export function InquiryModal(props: InquiryModalProps) {
  const { isOpen, state, onClose } = props

  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state !== 'loading') {
        event.stopPropagation()
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, state, onClose])

  if (!isOpen) return null

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (state === 'loading') return
    onClose?.()
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 sm:items-center sm:p-8"
    >
      <InquiryDialog {...props} />
    </div>
  )
}
