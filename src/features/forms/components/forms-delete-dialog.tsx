import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { deleteForm } from '@/api/forms'
import { useAuthStore } from '@/stores/auth-store'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { Form } from '@/api/forms'

type FormsDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  form: Form | null
}

export function FormsDeleteDialog({
  open,
  onOpenChange,
  form,
}: FormsDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ['organization', organizationId, 'forms'],
    })
  }

  const handleDelete = async () => {
    if (!organizationId || !token || !form) return

    setIsDeleting(true)
    try {
      await deleteForm(organizationId, form.id, token)
      onOpenChange(false)
      invalidate()
      navigate({ to: '/forms' })
      toast.success('Formulário excluído')
    } catch (err) {
      toast.error((err as Error).message)
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  if (!form) return null

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      isLoading={isDeleting}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="me-1 inline-block stroke-destructive"
            size={18}
          />{' '}
          Excluir formulário
        </span>
      }
      desc={
        <p>
          Tem certeza que deseja excluir o formulário{' '}
          <span className="font-bold">{form.name}</span>? Esta ação não pode ser
          desfeita.
        </p>
      }
      confirmText="Excluir"
      destructive
    />
  )
}
