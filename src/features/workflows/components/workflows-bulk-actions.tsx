import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { deleteWorkflow, type Workflow } from '@/api/workflows'
import { useAuthStore } from '@/stores/auth-store'

type WorkflowsBulkActionsProps = {
  table: Table<Workflow>
}

export function WorkflowsBulkActions({ table }: WorkflowsBulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)
  const queryClient = useQueryClient()
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedWorkflows = selectedRows.map((row) => row.original)
  const count = selectedWorkflows.length

  const invalidateWorkflows = () => {
    queryClient.invalidateQueries({
      queryKey: ['organization', organizationId, 'workflows'],
    })
  }

  const handleBulkDelete = async () => {
    if (!organizationId || !token) return
    setIsDeleting(true)
    try {
      await Promise.all(
        selectedWorkflows.map((w) =>
          deleteWorkflow(organizationId, w.id, token)
        )
      )
      table.resetRowSelection()
      setShowDeleteConfirm(false)
      invalidateWorkflows()
      toast.success(
        `${count} workflow${count > 1 ? 's' : ''} excluído${count > 1 ? 's' : ''}`
      )
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName="workflow">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="size-8"
              aria-label="Excluir workflows selecionados"
              title="Excluir workflows selecionados"
            >
              <Trash2 />
              <span className="sr-only">Excluir workflows selecionados</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Excluir workflows selecionados</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        handleConfirm={handleBulkDelete}
        title="Excluir workflows"
        desc={
          <p>
            Tem certeza que deseja excluir {count}{' '}
            {count > 1 ? 'workflows' : 'workflow'}? Esta ação não pode ser
            desfeita.
          </p>
        }
        confirmText="Excluir"
        destructive
        isLoading={isDeleting}
      />
    </>
  )
}
