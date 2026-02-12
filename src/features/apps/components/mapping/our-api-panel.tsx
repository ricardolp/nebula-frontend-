'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DOMAIN_SCHEMA_FIELDS, type DomainFieldId } from '../../data/domain-schema'
import type { FieldMapping } from '../../data/domain-schema'

type OurApiPanelProps = {
  title?: string
  mappings: FieldMapping
  selectedFieldId: DomainFieldId | null
  onSelectField: (id: DomainFieldId) => void
  search?: string
  onSearchChange?: (value: string) => void
  /** Ref callback per field for line endpoints (right edge of row) */
  registerTargetRef: (fieldId: DomainFieldId, el: HTMLDivElement | null) => void
}

export const OurApiPanel = forwardRef<HTMLDivElement, OurApiPanelProps>(
  function OurApiPanel(
    {
      title = 'Nossa API (Domain)',
      mappings,
      selectedFieldId,
      onSelectField,
      search = '',
      onSearchChange,
      registerTargetRef,
    },
    ref
  ) {
    const filtered = DOMAIN_SCHEMA_FIELDS.filter(
      (f) =>
        !search ||
        f.label.toLowerCase().includes(search.toLowerCase()) ||
        f.id.toLowerCase().includes(search.toLowerCase())
    )

    return (
      <div ref={ref} className='flex h-full flex-col rounded-lg border bg-card'>
        <div className='border-b px-3 py-2'>
          <h3 className='font-semibold text-foreground'>{title}</h3>
          {onSearchChange && (
            <div className='mt-2'>
              <Input
                placeholder='Pesquisar'
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className='h-8 text-sm'
              />
            </div>
          )}
        </div>
        <div className='grid grid-cols-[1fr_auto] gap-2 px-2 py-1 text-xs text-muted-foreground'>
          <span>Estrutura</span>
          <span className='w-12 text-right'>Ocorr.</span>
        </div>
        <ScrollArea className='flex-1'>
          <div className='px-2 pb-4'>
            {filtered.map((field) => {
              const isMapped = !!mappings[field.id]?.sourcePath
              const isSelected = selectedFieldId === field.id
              return (
                <div
                  key={field.id}
                  className={cn(
                    'flex items-center gap-2 rounded py-1.5 pr-1 text-sm transition-colors',
                    isSelected && 'bg-primary/15',
                    isMapped && !isSelected && 'bg-muted/50',
                    'hover:bg-muted/50 cursor-pointer'
                  )}
                  onClick={() => onSelectField(field.id)}
                >
                  <div className='min-w-0 flex-1 truncate font-medium' title={field.descricao}>
                    {field.label}
                  </div>
                  <span className='w-8 shrink-0 text-right text-xs text-muted-foreground'>1.1</span>
                  <div
                    className='h-4 w-4 shrink-0'
                    ref={(el) => registerTargetRef(field.id, el)}
                    aria-hidden
                  />
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    )
  }
)
