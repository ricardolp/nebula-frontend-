import { useCallback, useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { Iconify } from '@/components/iconify'
import { toast } from 'sonner'
import {
  createForm,
  createFormField,
  deleteFormField,
  patchForm,
  patchFormField,
  type Form,
  type FormField,
} from '@/api/forms'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FormBuilderFieldLibraryItem } from './form-builder-field-library'
import { FormBuilderCanvasItem } from './form-builder-canvas-item'
import { FormBuilderEditFieldDialog } from './form-builder-edit-field-dialog'
import {
  getMaterialTemplates,
  MATERIAL_LIBRARY_GROUPS,
} from '../data/field-templates'
import { PARTNER_FIELD_GROUPS } from '../data/partner-field-templates'
import type { FieldTemplate } from '../data/field-templates'
import type { CanvasFormField } from '../types'
import { LIBRARY_DRAG_TYPE } from '../types'

function generateTempId() {
  return `temp-${crypto.randomUUID()}`
}

function canvasFieldFromTemplate(template: { campo: string; tabela: string }, sequencia: number): CanvasFormField {
  return {
    tempId: generateTempId(),
    campo: template.campo,
    tabela: template.tabela,
    sequencia,
  }
}

function canvasFieldFromApiField(f: FormField): CanvasFormField {
  return {
    id: f.id,
    formId: f.formId,
    campo: f.campo,
    tabela: f.tabela,
    sequencia: f.sequencia,
  }
}

type FormType = 'material' | 'partner'

type FormBuilderPageInnerProps = FormBuilderPagePropsBase & { goBack: () => void }

type FormBuilderPagePropsBase = {
  formId: string | undefined
  initialForm: Form | null
  initialFields: FormField[]
  formName: string
  isNew: boolean
  formType?: FormType
}

export type FormBuilderPageProps = FormBuilderPagePropsBase & {
  /** Called when user cancels or after save; e.g. () => navigate(paths.dashboard.forms.root) */
  onBackToList: () => void
}

function CanvasDropZone({
  children,
  id,
}: {
  id: string
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[320px] w-full rounded-lg border-2 border-dashed p-4 transition-colors ${
        isOver ? 'border-primary bg-primary/5' : 'border-muted'
      }`}
    >
      {children}
    </div>
  )
}

function FormBuilderPageInner({
  formId,
  initialForm,
  initialFields,
  formName: initialFormName,
  isNew,
  formType = 'material',
  goBack,
}: FormBuilderPageInnerProps) {
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)

  const [formName, setFormName] = useState(initialFormName || '')
  const [fields, setFields] = useState<CanvasFormField[]>(() =>
    initialFields.length > 0
      ? initialFields.map(canvasFieldFromApiField).sort((a, b) => a.sequencia - b.sequencia)
      : []
  )
  const [editField, setEditField] = useState<CanvasFormField | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [activeLibraryTemplate, setActiveLibraryTemplate] = useState<FieldTemplate | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  /** Id do draggable ativo (ex: "form-field-library-p-cod_antigo") para esconder o item na biblioteca. */
  const [activeDragId, setActiveDragId] = useState<string | null>(null)

  const libraryTemplates: FieldTemplate[] =
    formType === 'partner'
      ? PARTNER_FIELD_GROUPS.flatMap((g) => g.templates)
      : getMaterialTemplates()
  const libraryGroups =
    formType === 'partner'
      ? PARTNER_FIELD_GROUPS.map((g) => ({ key: g.key, title: g.title }))
      : MATERIAL_LIBRARY_GROUPS.map((g) => ({ key: g.key, title: g.title }))
  const getTemplatesForGroup = (key: string): FieldTemplate[] =>
    formType === 'partner'
      ? PARTNER_FIELD_GROUPS.find((g) => g.key === key)?.templates ?? []
      : (key === 'generic'
          ? getMaterialTemplates().filter((t) => t.group === 'generic')
          : getMaterialTemplates().filter((t) => t.group === 'sap-material'))

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const sortableIds = fields.map((f) => `canvas-${f.id ?? f.tempId}`)
  const currentFormId = isNew ? undefined : formId

  /** Chaves (campo-tabela) já usadas no canvas para desabilitar na biblioteca e evitar duplicidade. */
  const usedFieldKeys = useMemo(
    () => new Set(fields.map((f) => `${f.campo}-${f.tabela}`)),
    [fields]
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const id = String(event.active.id)
      setActiveDragId(id)
      if (id.startsWith(LIBRARY_DRAG_TYPE)) {
        const template = libraryTemplates.find((t) => `${LIBRARY_DRAG_TYPE}-${t.id}` === id)
        if (template) setActiveLibraryTemplate(template)
      }
    },
    [libraryTemplates]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveLibraryTemplate(null)
      setActiveDragId(null)
      const { active, over } = event
      const activeId = String(active.id)
      const overId = over ? String(over.id) : null

      if (activeId.startsWith(LIBRARY_DRAG_TYPE)) {
        const template = libraryTemplates.find(
          (t) => `${LIBRARY_DRAG_TYPE}-${t.id}` === activeId
        )
        if (template) {
          setFields((prev) => {
            const sequencia = prev.length
            return [...prev, canvasFieldFromTemplate(template, sequencia)]
          })
        }
        return
      }

      if (overId && activeId.startsWith('canvas-') && overId.startsWith('canvas-')) {
        const oldIndex = fields.findIndex(
          (f) => `canvas-${f.id ?? f.tempId}` === activeId
        )
        const newIndex = fields.findIndex(
          (f) => `canvas-${f.id ?? f.tempId}` === overId
        )
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          setFields((prev) => {
            const reordered = arrayMove(prev, oldIndex, newIndex)
            return reordered.map((f: CanvasFormField, i: number) => ({ ...f, sequencia: i }))
          })
        }
      }
    },
    [fields, libraryTemplates]
  )

  const handleEditField = useCallback((field: CanvasFormField) => {
    setEditField(field)
    setEditDialogOpen(true)
  }, [])

  const handleSaveEditField = useCallback(
    (field: CanvasFormField, values: { campo: string; tabela: string }) => {
      setFields((prev) =>
        prev.map((f) =>
          (f.id && f.id === field.id) || (f.tempId && f.tempId === field.tempId)
            ? { ...f, campo: values.campo, tabela: values.tabela }
            : f
        )
      )
      setEditField(null)
    },
    []
  )

  const handleRemoveField = useCallback((field: CanvasFormField) => {
    setFields((prev) => prev.filter((f) => (f.id && f.id === field.id) || (f.tempId && f.tempId === field.tempId)))
  }, [])

  const handleSave = useCallback(async () => {
    if (!formName.trim()) {
      toast.error('Informe o nome do formulário.')
      return
    }

    setIsSaving(true)
    try {
      let targetFormId = currentFormId

      if (isNew) {
        const result = await createForm(organizationId!, { name: formName.trim() }, token) as { data?: { form?: { id: string } } }
        targetFormId = result?.data?.form?.id
        if (!targetFormId) {
          toast.error('Falha ao criar formulário.')
          return
        }
        toast.success('Formulário criado.')
      } else if (initialForm && formName.trim() !== initialForm.name) {
        await patchForm(organizationId!, formId!, { name: formName.trim() }, token)
        toast.success('Formulário atualizado.')
      }

      if (!targetFormId) {
        if (!isNew) goBack()
        return
      }

      const originalIds = new Set(initialFields.map((f) => f.id))
      const currentIds = new Set(fields.filter((f) => f.id).map((f) => f.id!))

      for (const field of fields) {
        const sequencia = fields.indexOf(field)
        if (field.id) {
          const orig = initialFields.find((f) => f.id === field.id)
          if (
            orig &&
            (orig.campo !== field.campo ||
              orig.tabela !== field.tabela ||
              orig.sequencia !== sequencia)
          ) {
            await patchFormField(organizationId!, targetFormId, field.id, { campo: field.campo, tabela: field.tabela, sequencia }, token)
          }
        } else {
          await createFormField(organizationId!, targetFormId, { campo: field.campo, tabela: field.tabela, sequencia }, token)
        }
      }

      for (const id of originalIds) {
        if (!currentIds.has(id)) {
          await deleteFormField(organizationId!, targetFormId, id, token)
        }
      }

      toast.success(isNew ? 'Campos salvos.' : 'Formulário e campos atualizados.')
      goBack()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setIsSaving(false)
    }
  }, [
    formName,
    isNew,
    currentFormId,
    initialForm,
    initialFields,
    formId,
    fields,
    organizationId,
    token,
    goBack,
  ])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-4 border-b px-4 py-3">
        <Input
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="Nome do formulário"
          className="max-w-md text-lg font-semibold"
        />
        <div className="flex gap-2">
          <Button variant="outline" onClick={goBack}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && (
              <Iconify
                icon="eva:loading-outline"
                width={16}
                className="mr-2 animate-spin"
                sx={{ flexShrink: 0 }}
              />
            )}
            Salvar
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <aside className="flex min-h-0 w-[360px] shrink-0 flex-col overflow-hidden border-r bg-muted/30 dark:bg-muted/20">
            <div className="shrink-0 border-b p-3">
              <h3 className="font-semibold">Biblioteca de campos</h3>
            </div>
            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-1 p-3">
                {libraryGroups.map((group) => (
                  <Collapsible key={group.key} defaultOpen={false}>
                    <CollapsibleTrigger className="flex w-full items-center gap-1.5 rounded-md py-2 pr-2 text-left text-xs font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground [&[data-state=open]>.collapse-chevron]:rotate-90">
                      <Iconify
                        icon="eva:arrow-ios-forward-fill"
                        width={16}
                        className="collapse-chevron shrink-0 transition-transform"
                        sx={{ flexShrink: 0 }}
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {group.title}
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="space-y-1 pl-5 pb-2">
                        {getTemplatesForGroup(group.key).map((template) => (
                          <FormBuilderFieldLibraryItem
                            key={template.id}
                            template={template}
                            isDraggingFromLibrary={
                              activeDragId === `${LIBRARY_DRAG_TYPE}-${template.id}`
                            }
                            disabled={usedFieldKeys.has(
                              `${template.campo}-${template.tabela}`
                            )}
                          />
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          </aside>

          <main className="flex flex-1 flex-col overflow-hidden p-4">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">
              Campos do formulário (arraste da esquerda ou reordene)
            </h2>
            <CanvasDropZone id="canvas-drop">
              <SortableContext
                items={sortableIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {fields.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      Arraste campos da biblioteca para cá.
                    </p>
                  )}
                  {fields.map((field) => (
                    <FormBuilderCanvasItem
                      key={field.id ?? field.tempId}
                      field={field}
                      onEdit={handleEditField}
                      onRemove={handleRemoveField}
                    />
                  ))}
                </div>
              </SortableContext>
            </CanvasDropZone>
          </main>
        </div>

        <DragOverlay>
          {activeLibraryTemplate ? (
            <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
              <span className="font-medium">{activeLibraryTemplate.label}</span>
              {activeLibraryTemplate.tabela !== 'CUSTOM' && (
                <span className="ml-1 text-xs text-muted-foreground">
                  ({activeLibraryTemplate.tabela})
                </span>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <FormBuilderEditFieldDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        field={editField}
        onSave={handleSaveEditField}
      />
    </div>
  )
}

export function FormBuilderPage(props: FormBuilderPageProps) {
  const { onBackToList, ...rest } = props
  if (!onBackToList) {
    throw new Error('FormBuilderPage requires onBackToList (e.g. from React Router: () => navigate(paths.dashboard.forms.root))')
  }
  return <FormBuilderPageInner {...rest} goBack={onBackToList} />
}
