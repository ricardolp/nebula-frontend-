import { type ColumnDef, type Row } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useWorkflowRequestsRouter } from '../workflow-requests-router-context'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import type { WorkflowRequest } from '@/api/workflow-requests'

function statusVariant(
  status: WorkflowRequest['status']
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'approved':
      return 'default'
    case 'rejected':
      return 'destructive'
    default:
      return 'secondary'
  }
}

function prioridadeLabel(prioridade?: string): string {
  if (!prioridade) return '—'
  const map: Record<string, string> = {
    urgente: 'Urgente',
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa',
  }
  return map[prioridade] ?? prioridade
}

export const workflowRequestsColumns: ColumnDef<WorkflowRequest>[] = [
  {
    accessorKey: 'titulo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Título" />
    ),
    cell: ({ row }) => (
      <span className="font-medium max-w-[200px] truncate block" title={row.original.titulo ?? row.original.descricao ?? ''}>
        {row.original.titulo || row.original.descricao || '—'}
      </span>
    ),
  },
  {
    id: 'workflow',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Workflow" />
    ),
    accessorFn: (row) => row.workflow?.name ?? row.workflowId,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.workflow?.name || row.original.workflowId?.slice(0, 8) || '—'}
      </span>
    ),
  },
  {
    id: 'submittedBy',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Solicitante" />
    ),
    accessorFn: (row) => row.submittedByUser?.name ?? row.submittedByUser?.email,
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.submittedByUser?.name || row.original.submittedByUser?.email || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant={statusVariant(row.original.status)}>
        {row.original.status === 'pending'
          ? 'Pendente'
          : row.original.status === 'approved'
            ? 'Aprovado'
            : 'Rejeitado'}
      </Badge>
    ),
  },
  {
    accessorKey: 'prioridade',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridade" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm capitalize">
        {prioridadeLabel(row.original.prioridade)}
      </span>
    ),
  },
  {
    id: 'slaDueAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SLA" />
    ),
    accessorFn: (row) => row.slaDueAt ?? '',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.slaDueAt
          ? format(new Date(row.original.slaDueAt), 'dd/MM/yyyy HH:mm')
          : '—'}
      </span>
    ),
  },
  {
    id: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    accessorFn: (row) => row.createdAt ?? '',
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.createdAt
          ? format(new Date(row.original.createdAt), 'dd/MM/yyyy HH:mm')
          : '—'}
      </span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: WorkflowRequestsRowAction,
  },
]

function WorkflowRequestsRowAction({ row }: { row: Row<WorkflowRequest> }) {
  const { goToRequest } = useWorkflowRequestsRouter()
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => goToRequest(row.original.id)}
    >
      Ver
    </Button>
  )
}
