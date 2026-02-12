import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Loader2, Trash2, Power, PowerOff, RefreshCw } from 'lucide-react'
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
import {
  deleteOrganizationIntegration,
  syncIntegration,
  updateIntegrationStatus,
  type OrganizationIntegration,
} from '@/api/integrations'
import { useAuthStore } from '@/stores/auth-store'

type AppsBulkActionsProps<TData> = {
  table: Table<TData>
}

export function AppsBulkActions<TData>({
  table,
}: AppsBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [statusLoading, setStatusLoading] = useState<
    'active' | 'inactive' | null
  >(null)
  const [syncLoading, setSyncLoading] = useState(false)
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)
  const queryClient = useQueryClient()

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIntegrations = selectedRows.map(
    (row) => row.original as OrganizationIntegration
  )
  const count = selectedIntegrations.length

  const invalidateIntegrations = () => {
    queryClient.invalidateQueries({
      queryKey: ['organization', organizationId, 'integrations'],
    })
  }

  const handleBulkStatusChange = async (status: 'active' | 'inactive') => {
    if (!organizationId || !token) return
    setStatusLoading(status)
    try {
      await Promise.all(
        selectedIntegrations.map((i) =>
          updateIntegrationStatus(organizationId, i.id, status, token)
        )
      )
      table.resetRowSelection()
      invalidateIntegrations()
      toast.success(
        `${status === 'active' ? 'Ativadas' : 'Desativadas'} ${count} integração${count > 1 ? 'ões' : ''}`
      )
    } catch {
      toast.error(
        `Erro ao ${status === 'active' ? 'ativar' : 'desativar'} integrações`
      )
    } finally {
      setStatusLoading(null)
    }
  }

  const isStatusLoading = statusLoading !== null
  const hasInactiveSelected = selectedIntegrations.some(
    (i) => (i.status ?? 'active') === 'inactive'
  )

  const handleBulkSync = async () => {
    if (!organizationId || !token) return
    setSyncLoading(true)
    try {
      await Promise.all(
        selectedIntegrations.map((i) =>
          syncIntegration(organizationId, i.id, token)
        )
      )
      table.resetRowSelection()
      invalidateIntegrations()
      toast.success(
        `Sincronização iniciada para ${count} integração${count > 1 ? 'ões' : ''}`
      )
    } catch {
      toast.error('Erro ao sincronizar integrações')
    } finally {
      setSyncLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (!organizationId || !token) return
    setIsDeleting(true)
    try {
      await Promise.all(
        selectedIntegrations.map((i) =>
          deleteOrganizationIntegration(organizationId, i.id, token)
        )
      )
      table.resetRowSelection()
      setShowDeleteConfirm(false)
      invalidateIntegrations()
      toast.success(
        `${count} integração${count > 1 ? 'ões excluídas' : ' excluída'}`
      )
    } catch {
      toast.error('Erro ao excluir integrações')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='integração'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              disabled={isStatusLoading}
              className='size-8'
              aria-label='Ativar integrações selecionadas'
              title='Ativar integrações selecionadas'
            >
              {statusLoading === 'active' ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Power />
              )}
              <span className='sr-only'>Ativar integrações selecionadas</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {statusLoading === 'active'
                ? 'Ativando...'
                : 'Ativar integrações selecionadas'}
            </p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              disabled={isStatusLoading}
              className='size-8'
              aria-label='Desativar integrações selecionadas'
              title='Desativar integrações selecionadas'
            >
              {statusLoading === 'inactive' ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <PowerOff />
              )}
              <span className='sr-only'>
                Desativar integrações selecionadas
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {statusLoading === 'inactive'
                ? 'Desativando...'
                : 'Desativar integrações selecionadas'}
            </p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleBulkSync}
              disabled={syncLoading || hasInactiveSelected}
              className='size-8'
              aria-label='Sincronizar integrações selecionadas'
              title={
                hasInactiveSelected
                  ? 'Sincronização disponível apenas para integrações ativas'
                  : 'Sincronizar integrações selecionadas'
              }
            >
              {syncLoading ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <RefreshCw />
              )}
              <span className='sr-only'>Sincronizar integrações selecionadas</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {syncLoading
                ? 'Sincronizando...'
                : hasInactiveSelected
                  ? 'Sincronização disponível apenas para integrações ativas'
                  : 'Sincronizar integrações selecionadas'}
            </p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Excluir integrações selecionadas'
              title='Excluir integrações selecionadas'
            >
              <Trash2 />
              <span className='sr-only'>Excluir integrações selecionadas</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Excluir integrações selecionadas</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        handleConfirm={handleBulkDelete}
        title='Excluir integrações'
        desc={
          <p>
            Tem certeza que deseja excluir {count}{' '}
            {count > 1 ? 'integrações' : 'integração'}? Esta ação não pode ser
            desfeita.
          </p>
        }
        confirmText='Excluir'
        destructive
        isLoading={isDeleting}
      />
    </>
  )
}
