import { type Column, type Table } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className="text-muted-foreground">{title}</span>
  }

  const sorted = column.getIsSorted()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ms-2 data-[state=open]:bg-accent"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      <span>{title}</span>
      {sorted === 'asc' ? (
        <ArrowUp className="ms-2 size-4" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="ms-2 size-4" />
      ) : (
        <ArrowUpDown className="ms-2 size-4" />
      )}
    </Button>
  )
}

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filtrar...',
}: DataTableToolbarProps<TData>) {
  const value = (table.getState().globalFilter as string) ?? ''

  return (
    <div
      role="toolbar"
      className="flex flex-wrap items-center gap-2"
      aria-label="Ferramentas da tabela"
    >
      <Input
        placeholder={searchPlaceholder}
        value={value}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="h-8 w-full max-w-xs"
      />
    </div>
  )
}

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  className?: string
}

export function DataTablePagination<TData>({
  table,
  className,
}: DataTablePaginationProps<TData>) {
  const pageCount = table.getPageCount()
  const pageIndex = table.getState().pagination.pageIndex
  const pageSize = table.getState().pagination.pageSize

  if (pageCount <= 1 && table.getFilteredRowModel().rows.length <= 10) {
    return null
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 px-2 py-1',
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          Página {pageIndex + 1} de {pageCount || 1}
        </span>
        <Select
          value={`${pageSize}`}
          onValueChange={(v) => table.setPageSize(Number(v))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 50].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
  entityName: string
  children: React.ReactNode
}

export function DataTableBulkActions<TData>({
  table,
  entityName,
  children,
}: DataTableBulkActionsProps<TData>) {
  const selected = table.getFilteredSelectedRowModel().rows.length

  if (selected === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
      <span className="text-sm text-muted-foreground">
        {selected} {entityName}{selected === 1 ? '' : 's'} selecionado
        {selected > 1 ? 's' : ''}
      </span>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  )
}
