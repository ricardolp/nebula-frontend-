import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import {
  type OrganizationIntegration,
  type IntegrationStatus,
} from '@/api/integrations'
import { integrationStatusStyles } from '../data/data'
import { AppsRowActions } from './apps-row-actions'

const AUTH_TYPE_LABELS: Record<string, string> = {
  NO_AUTH: 'Sem autenticação',
  BEARER_TOKEN: 'Bearer Token',
  BASIC: 'Basic',
  JWT_BEARER: 'JWT Bearer',
  API_KEY: 'API Key',
}

export const appsColumns: ColumnDef<OrganizationIntegration>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nome' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <div className='flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted px-2'>
          <span className='text-xs font-semibold text-muted-foreground'>
            {row.original.name.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <span className='font-medium'>{row.getValue('name')}</span>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='URL' />
    ),
    cell: ({ row }) => (
      <span className='max-w-md truncate font-mono text-sm text-muted-foreground'>
        {row.getValue('url')}
      </span>
    ),
  },
  {
    accessorKey: 'process',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Processo' />
    ),
    cell: ({ row }) => (
      <Badge variant='secondary' className='capitalize'>
        {row.getValue('process')}
      </Badge>
    ),
  },
  {
    accessorKey: 'lastSync',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Última sincronização' />
    ),
    cell: ({ row }) => {
      const lastSync = row.original.lastSync
      if (!lastSync || lastSync === 'never') {
        return (
          <span className='text-sm text-muted-foreground'>Nunca</span>
        )
      }
      try {
        const date = new Date(lastSync)
        return (
          <span className='text-sm text-muted-foreground' title={date.toISOString()}>
            {date.toLocaleString('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'short',
            })}
          </span>
        )
      } catch {
        return (
          <span className='text-sm text-muted-foreground'>{lastSync}</span>
        )
      }
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = (row.original.status ?? 'active') as IntegrationStatus
      const badgeClass = integrationStatusStyles.get(status)
      return (
        <Badge variant='outline' className={cn('capitalize', badgeClass)}>
          {status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    },
    filterFn: (row, _id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true
      const status = row.original.status ?? 'active'
      return value.includes(status)
    },
  },
  {
    accessorKey: 'authType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Auth' />
    ),
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {AUTH_TYPE_LABELS[row.original.authType] ?? row.original.authType}
      </span>
    ),
    filterFn: (row, _id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true
      return value.includes(row.original.authType)
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <AppsRowActions row={row} />,
  },
]
