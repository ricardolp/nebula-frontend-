import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { type Table } from '@tanstack/react-table'
import { Loader2, Power, PowerOff } from 'lucide-react'
import { toast } from 'sonner'
import { updateDomainStatus, type OrganizationDomain, type DomainStatus } from '@/api/domains'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'

type DomainItemsBulkActionsProps = {
  table: Table<OrganizationDomain>
  tabela: string
}

export function DomainItemsBulkActions({
  table,
  tabela,
}: DomainItemsBulkActionsProps) {
  const [statusLoading, setStatusLoading] = useState<DomainStatus | null>(null)
  const queryClient = useQueryClient()
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const invalidateDomains = () => {
    queryClient.invalidateQueries({
      queryKey: ['organization', organizationId, 'domains', 'table', tabela],
    })
  }

  const handleBulkStatusChange = async (status: DomainStatus) => {
    if (!organizationId || !token) return
    const selectedDomains = selectedRows.map((row) => row.original)
    const count = selectedDomains.length

    setStatusLoading(status)
    try {
      await Promise.all(
        selectedDomains.map((d) =>
          updateDomainStatus(organizationId, d.id, status, token)
        )
      )
      table.resetRowSelection()
      invalidateDomains()
      toast.success(
        `${status === 'active' ? 'Ativados' : 'Desativados'} ${count} domínio${count > 1 ? 's' : ''}`
      )
    } catch {
      toast.error(
        `Erro ao ${status === 'active' ? 'ativar' : 'desativar'} domínios`
      )
    } finally {
      setStatusLoading(null)
    }
  }

  const isStatusLoading = statusLoading !== null

  return (
    <BulkActionsToolbar table={table} entityName='domínio'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            onClick={() => handleBulkStatusChange('active')}
            disabled={isStatusLoading}
            className='size-8'
            aria-label='Ativar domínios selecionados'
            title='Ativar domínios selecionados'
          >
            {statusLoading === 'active' ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Power />
            )}
            <span className='sr-only'>Ativar domínios selecionados</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {statusLoading === 'active'
              ? 'Ativando...'
              : 'Ativar domínios selecionados'}
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
            aria-label='Desativar domínios selecionados'
            title='Desativar domínios selecionados'
          >
            {statusLoading === 'inactive' ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <PowerOff />
            )}
            <span className='sr-only'>Desativar domínios selecionados</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {statusLoading === 'inactive'
              ? 'Desativando...'
              : 'Desativar domínios selecionados'}
          </p>
        </TooltipContent>
      </Tooltip>
    </BulkActionsToolbar>
  )
}
