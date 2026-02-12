import { useState } from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Loader2, Power, PowerOff } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  updateDomainStatus,
  type OrganizationDomain,
  type DomainStatus,
} from '@/api/domains'
import { useAuthStore } from '@/stores/auth-store'

type DomainItemsRowActionsProps = {
  row: Row<OrganizationDomain>
}

export function DomainItemsRowActions({ row }: DomainItemsRowActionsProps) {
  const [statusLoading, setStatusLoading] = useState<DomainStatus | null>(null)
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)
  const queryClient = useQueryClient()
  const domain = row.original
  const status = (domain.status ?? 'active') as DomainStatus
  const tabela = domain.tabela

  const invalidateDomains = () => {
    queryClient.invalidateQueries({
      queryKey: ['organization', organizationId, 'domains', 'table', tabela],
    })
  }

  const handleStatusChange = async (newStatus: DomainStatus) => {
    if (!organizationId || !token) return
    setStatusLoading(newStatus)
    try {
      await updateDomainStatus(organizationId, domain.id, newStatus, token)
      invalidateDomains()
      toast.success(
        `Domínio ${newStatus === 'active' ? 'ativado' : 'desativado'}`
      )
    } catch {
      toast.error(
        `Erro ao ${newStatus === 'active' ? 'ativar' : 'desativar'} domínio`
      )
    } finally {
      setStatusLoading(null)
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          disabled={statusLoading !== null}
        >
          {statusLoading ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <DotsHorizontalIcon className='h-4 w-4' />
          )}
          <span className='sr-only'>Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        {status === 'inactive' ? (
          <DropdownMenuItem
            onClick={() => handleStatusChange('active')}
            disabled={statusLoading !== null}
          >
            Ativar
            <DropdownMenuShortcut>
              <Power size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => handleStatusChange('inactive')}
            disabled={statusLoading !== null}
          >
            Desativar
            <DropdownMenuShortcut>
              <PowerOff size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
