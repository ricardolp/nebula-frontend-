import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createWorkflowRequest } from '@/api/workflow-requests'
import { getWorkflow } from '@/api/workflows'
import { getForm } from '@/api/forms'
import { useAuthStore } from '@/stores/auth-store'
import { ALL_FIELD_TEMPLATES } from '@/features/forms/data/field-templates'
import type { FormField } from '@/api/forms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function getInputTypeForCampo(campo: string): string {
  const t = ALL_FIELD_TEMPLATES.find((x) => x.campo === campo)
  return t?.inputType ?? 'text'
}

type NewRequestFormProps = {
  workflowId: string
  workflows: { id: string; name?: string; type: string; action: string }[]
}

export function NewRequestForm({ workflowId, workflows }: NewRequestFormProps) {
  const navigate = useNavigate()
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(workflowId)
  const [payload, setPayload] = useState<Record<string, unknown>>({})

  const { data: workflowData, isLoading: loadingWorkflow } = useQuery({
    queryKey: ['organization', organizationId, 'workflow', selectedWorkflowId],
    queryFn: () => getWorkflow(organizationId!, selectedWorkflowId, token),
    enabled: Boolean(organizationId && token && selectedWorkflowId),
  })

  const workflow = workflowData?.data?.workflow
  const firstStep = workflow?.steps?.sort((a, b) => a.order - b.order)[0]
  const formId = firstStep?.formId

  const { data: formData, isLoading: loadingForm } = useQuery({
    queryKey: ['organization', organizationId, 'form', formId],
    queryFn: () => getForm(organizationId!, formId!, token),
    enabled: Boolean(organizationId && token && formId),
  })

  const form = formData?.data?.form
  const fields = (form?.fields ?? []).sort((a, b) => a.sequencia - b.sequencia)

  useEffect(() => {
    if (workflowId) setSelectedWorkflowId(workflowId)
  }, [workflowId])

  useEffect(() => {
    if (form?.fields) {
      const initial: Record<string, unknown> = {}
      form.fields.forEach((f) => {
        initial[f.campo] = ''
      })
      setPayload((prev) => ({ ...initial, ...prev }))
    }
  }, [form?.id])

  const queryClient = useQueryClient()
  const createMutation = useMutation({
    mutationFn: (body: { workflowId: string; payload: Record<string, unknown> }) =>
      createWorkflowRequest(organizationId!, body, token),
    onSuccess: (data) => {
      const requestId = data.data?.request?.id
      queryClient.invalidateQueries({
        queryKey: ['organization', organizationId, 'workflow-requests'],
      })
      toast.success('Solicitação enviada.')
      if (requestId) {
        navigate({ to: '/workflow-requests/$requestId', params: { requestId } })
      } else {
        navigate({ to: '/workflow-requests' })
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const body = { workflowId: selectedWorkflowId, payload }
    createMutation.mutate(body)
  }

  const updatePayload = (campo: string, value: unknown) => {
    setPayload((prev) => ({ ...prev, [campo]: value }))
  }

  if (loadingWorkflow || !workflow) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!formId) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        Workflow sem passos configurados.
      </div>
    )
  }

  if (loadingForm || !form) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Workflow</Label>
        <Select
          value={selectedWorkflowId}
          onValueChange={setSelectedWorkflowId}
        >
          <SelectTrigger className="w-full max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {workflows.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name || `${w.type} / ${w.action}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Dados do formulário</h3>
        {fields.map((field) => (
          <FieldInput
            key={field.id}
            field={field}
            value={payload[field.campo]}
            onChange={(v) => updatePayload(field.campo, v)}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: '/workflow-requests' })}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}
          Enviar solicitação
        </Button>
      </div>
    </form>
  )
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FormField
  value: unknown
  onChange: (v: unknown) => void
}) {
  const inputType = getInputTypeForCampo(field.campo)
  const val = value ?? ''

  if (inputType === 'textarea') {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.id}>{field.campo}</Label>
        <Textarea
          id={field.id}
          value={String(val)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.tabela}
        />
      </div>
    )
  }

  if (inputType === 'checkbox') {
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id={field.id}
          checked={Boolean(val)}
          onCheckedChange={(checked) => onChange(checked)}
        />
        <Label htmlFor={field.id}>{field.campo}</Label>
      </div>
    )
  }

  if (inputType === 'number') {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.id}>{field.campo}</Label>
        <Input
          id={field.id}
          type="number"
          value={String(val)}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder={field.tabela}
        />
      </div>
    )
  }

  if (inputType === 'date') {
    return (
      <div className="space-y-2">
        <Label htmlFor={field.id}>{field.campo}</Label>
        <Input
          id={field.id}
          type="date"
          value={typeof val === 'string' ? val : ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>{field.campo}</Label>
      <Input
        id={field.id}
        type={inputType === 'email' ? 'email' : 'text'}
        value={String(val)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.tabela}
      />
    </div>
  )
}
