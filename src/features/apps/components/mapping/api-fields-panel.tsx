'use client'

import { forwardRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ApiFieldNode } from '../../data/domain-schema'

type ApiFieldsPanelProps = {
  title?: string
  nodes: ApiFieldNode[] | null
  isLoading?: boolean
  onTest?: () => void
  selectedPath: string | null
  onSelectPath: (path: string) => void
  search?: string
  onSearchChange?: (value: string) => void
  /** Ref callback per path for line start points (left edge of row) */
  registerSourceRef: (path: string, el: HTMLDivElement | null) => void
}

function FieldRow({
  node,
  depth,
  selectedPath,
  onSelect,
  registerRef,
  search,
}: {
  node: ApiFieldNode
  depth: number
  selectedPath: string | null
  onSelect: (path: string) => void
  registerRef: (path: string, el: HTMLDivElement | null) => void
  search?: string
}) {
  const isSelected = selectedPath === node.path
  const hasChildren = node.children && node.children.length > 0
  const labelMatch = !search || node.label.toLowerCase().includes(search.toLowerCase())
  const childrenMatch = Boolean(
    search &&
      node.children?.some((c) =>
        c.label.toLowerCase().includes(search.toLowerCase())
      )
  )
  const show = labelMatch || childrenMatch

  if (search && !show) return null

  return (
    <div className='min-w-0'>
      <div
        className={cn(
          'flex cursor-pointer items-center gap-1 rounded py-1.5 pr-1 text-sm transition-colors hover:bg-muted/50',
          isSelected && 'bg-primary/15'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => onSelect(node.path)}
      >
        <div
          className='h-4 w-4 shrink-0'
          ref={(el) => registerRef(node.path, el)}
          aria-hidden
        />
        {hasChildren ? (
          <ChevronRight className='size-4 shrink-0 text-muted-foreground' />
        ) : (
          <span className='w-4 shrink-0' />
        )}
        <span className='min-w-0 truncate font-medium'>{node.label}</span>
        <span className='ml-auto shrink-0 text-xs text-muted-foreground'>
          {node.occurrence ?? '1.1'}
        </span>
      </div>
      {hasChildren &&
        node.children!.map((child) => (
          <FieldRow
            key={child.id}
            node={child}
            depth={depth + 1}
            selectedPath={selectedPath}
            onSelect={onSelect}
            registerRef={registerRef}
            search={search}
          />
        ))}
    </div>
  )
}

export const ApiFieldsPanel = forwardRef<HTMLDivElement, ApiFieldsPanelProps>(
  function ApiFieldsPanel(
    {
      title = 'API da integração',
      nodes,
      isLoading,
      onTest,
      selectedPath,
      onSelectPath,
      search = '',
      onSearchChange,
      registerSourceRef,
    },
    ref
  ) {
    return (
      <div ref={ref} className='flex h-full flex-col rounded-lg border bg-card'>
        <div className='border-b px-3 py-2'>
          <h3 className='font-semibold text-foreground'>{title}</h3>
          <div className='mt-2 flex gap-2'>
            {onSearchChange && (
              <Input
                placeholder='Pesquisar'
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className='h-8 flex-1 text-sm'
              />
            )}
            {onTest && (
              <Button
                type='button'
                size='sm'
                onClick={onTest}
                disabled={isLoading}
                className='shrink-0'
              >
                {isLoading ? 'Testando...' : 'Testar'}
              </Button>
            )}
          </div>
        </div>
        <div className='grid grid-cols-[1fr_auto] gap-2 px-2 py-1 text-xs text-muted-foreground'>
          <span>Estrutura</span>
          <span className='w-12 text-right'>Ocorr.</span>
        </div>
        <ScrollArea className='flex-1'>
          <div className='px-2 pb-4'>
            {nodes === null && !isLoading && (
              <p className='py-4 text-center text-sm text-muted-foreground'>
                Clique em &quot;Testar&quot; para buscar os campos da API.
              </p>
            )}
            {isLoading && (
              <p className='py-4 text-center text-sm text-muted-foreground'>
                Carregando...
              </p>
            )}
            {nodes && nodes.length === 0 && !isLoading && (
              <p className='py-4 text-center text-sm text-muted-foreground'>
                Nenhum campo retornado.
              </p>
            )}
            {nodes &&
              nodes.length > 0 &&
              nodes.map((node) => (
                <FieldRow
                  key={node.id}
                  node={node}
                  depth={0}
                  selectedPath={selectedPath}
                  onSelect={onSelectPath}
                  registerRef={registerSourceRef}
                  search={search}
                />
              ))}
          </div>
        </ScrollArea>
      </div>
    )
  }
)
