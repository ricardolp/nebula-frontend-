import { useDraggable } from '@dnd-kit/core'
import { GripVertical, Type } from 'lucide-react'
import type { FieldTemplate } from '../data/field-templates'
import { LIBRARY_DRAG_TYPE } from '../types'
import { cn } from '@/lib/utils'

type FormBuilderFieldLibraryProps = {
  template: FieldTemplate
  /** Quando true, este item está sendo arrastado (estado vindo do pai). */
  isDraggingFromLibrary?: boolean
  /** Quando true, o campo já está no canvas — desabilita arraste para evitar duplicidade. */
  disabled?: boolean
}

export function FormBuilderFieldLibraryItem({
  template,
  isDraggingFromLibrary = false,
  disabled = false,
}: FormBuilderFieldLibraryProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${LIBRARY_DRAG_TYPE}-${template.id}`,
    data: { type: LIBRARY_DRAG_TYPE, template },
  })

  const hideWhileDragging = isDragging || isDraggingFromLibrary

  return (
    <div
      ref={setNodeRef}
      {...(disabled ? {} : listeners)}
      {...(disabled ? {} : attributes)}
      title={disabled ? 'Campo já adicionado ao formulário' : undefined}
      className={cn(
        'flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-shadow',
        hideWhileDragging && 'invisible pointer-events-none',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-grab active:cursor-grabbing'
      )}
    >
      <GripVertical className="size-4 shrink-0 text-muted-foreground" />
      <Type className="size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1 break-words">
        <span className="font-medium">{template.label}</span>
        {template.tabela !== 'CUSTOM' && (
          <span className="ml-1 text-xs text-muted-foreground">
            ({template.tabela})
          </span>
        )}
      </div>
    </div>
  )
}
