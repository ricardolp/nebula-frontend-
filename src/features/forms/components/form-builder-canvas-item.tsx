import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CanvasFormField } from '../types'

type FormBuilderCanvasItemProps = {
  field: CanvasFormField
  onEdit: (field: CanvasFormField) => void
  onRemove: (field: CanvasFormField) => void
}

export function FormBuilderCanvasItem({
  field,
  onEdit,
  onRemove,
}: FormBuilderCanvasItemProps) {
  const id = field.id ?? field.tempId ?? ''
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `canvas-${id}`,
    data: { type: 'canvas-field', field },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm',
        isDragging && 'opacity-50 shadow-md'
      )}
    >
      <button
        type="button"
        className="touch-none cursor-grab text-muted-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Reordenar"
      >
        <GripVertical className="size-4" />
      </button>
      <div className="min-w-0 flex-1">
        <span className="font-mono text-muted-foreground">{field.campo}</span>
        <span className="mx-1 text-muted-foreground">·</span>
        <span className="text-muted-foreground">{field.tabela}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => onEdit(field)}
        aria-label="Editar campo"
      >
        <Pencil className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 text-destructive hover:text-destructive"
        onClick={() => onRemove(field)}
        aria-label="Remover"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}
