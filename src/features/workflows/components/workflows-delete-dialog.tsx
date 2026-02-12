import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { deleteWorkflow } from '@/api/workflows'
import { useAuthStore } from '@/stores/auth-store'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { Workflow } from '@/api/workflows'

type WorkflowsDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflow: Workflow | null
}

export function WorkflowsDeleteDialog({
  open,
  onOpenChange,
  workflow,
}: WorkflowsDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ['organization', organizationId, 'workflows'],
    })
  }

  const handleDelete = async () => {
    if (!organizationId || !token || !workflow) return

    setIsDeleting(true)
    try {
      await deleteWorkflow(organizationId, workflow.id, token)
      onOpenChange(false)
      invalidate()
      navigate({ to: '/workflows' })
      toast.success('Workflow excluído')
    } catch (err) {
      toast.error((err as Error).message)
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  if (!workflow) return null

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
          Excluir workflow
        </span>
      }
      desc={
        <p>
          Tem certeza que deseja excluir o workflow{' '}
          <span className="font-bold">
            {workflow.name || `${workflow.type} / ${workflow.action}`}
          </span>
          ? Esta ação não pode ser desfeita.
        </p>
      }
      confirmText="Excluir"
      destructive
    />
  )
}
