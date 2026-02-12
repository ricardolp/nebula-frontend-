import { type ColumnDef } from '@tanstack/react-table'
import { type Form } from '@/api/forms'
import { FormsRowActions } from './forms-row-actions'

export const formsColumns: ColumnDef<Form>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('name')}</span>
    ),
  },
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.id.slice(0, 8)}…
      </span>
    ),
  },
  {
    id: 'actions',
    cell: FormsRowActions,
  },
]
