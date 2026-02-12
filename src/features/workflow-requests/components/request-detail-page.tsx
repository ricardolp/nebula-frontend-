import { useState } from 'react'
import { useOptionalWorkflowRequestsRouter } from '../workflow-requests-router-context'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { approveWorkflowRequest } from '@/api/workflow-requests'
import { getWorkflow } from '@/api/workflows'
import { useAuthStore } from '@/stores/auth-store'
import type { WorkflowRequest } from '@/api/workflow-requests'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

type RequestDetailPageProps = {
  request: WorkflowRequest
}

export function RequestDetailPage({ request }: RequestDetailPageProps) {
  const routerContext = useOptionalWorkflowRequestsRouter()
  const handleBack = () => {
    if (routerContext?.goToList) routerContext.goToList()
    else window.history.back()
  }
  const queryClient = useQueryClient()
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)
  const [comments, setComments] = useState('')

  const { data: workflowData } = useQuery({
    queryKey: ['organization', organizationId, 'workflow', request.workflowId],
    queryFn: () => getWorkflow(organizationId!, request.workflowId, token),
    enabled: Boolean(organizationId && token && request.workflowId),
  })

  const workflow = workflowData?.data?.workflow
  const currentWorkflowStep = workflow?.steps?.find(
    (s) => s.order === request.currentStepOrder
  )
  const pendingStepRecord = request.steps?.find(
    (s) => s.workflowStep?.order === request.currentStepOrder
  )
  const canApprove =
    request.status === 'pending' &&
    currentWorkflowStep != null &&
    pendingStepRecord == null

  const approveMutation = useMutation({
    mutationFn: (payload: {
      workflowStepId: string
      status: 'approved' | 'rejected'
      comments?: string
    }) =>
      approveWorkflowRequest(organizationId!, request.id, payload, token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organization', organizationId, 'workflow-request', request.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['organization', organizationId, 'workflow-requests'],
      })
      toast.success('Solicitação atualizada.')
      setComments('')
    },
  })

  const handleApprove = () => {
    if (!currentWorkflowStep) return
    approveMutation.mutate({
      workflowStepId: currentWorkflowStep.id,
      status: 'approved',
      comments: comments || undefined,
    })
  }

  const handleReject = () => {
    if (!currentWorkflowStep) return
    approveMutation.mutate({
      workflowStepId: currentWorkflowStep.id,
      status: 'rejected',
      comments: comments || undefined,
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Detalhe da solicitação
          </h2>
          <p className="text-muted-foreground">
            Visualize e aprove ou rejeite a solicitação de workflow.
          </p>
        </div>
        <Button variant="outline" onClick={handleBack}>
          Voltar
        </Button>
      </div>
      <div className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <span className="text-muted-foreground">Workflow:</span>
            <span className="font-medium">
              {request.workflow?.name || request.workflowId}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-muted-foreground">Solicitante:</span>
            <span>
              {request.submittedByUser?.name || request.submittedByUser?.email || request.submittedBy}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-muted-foreground">Status:</span>
            <Badge
              variant={
                request.status === 'approved'
                  ? 'default'
                  : request.status === 'rejected'
                    ? 'destructive'
                    : 'secondary'
              }
            >
              {request.status === 'pending'
                ? 'Pendente'
                : request.status === 'approved'
                  ? 'Aprovado'
                  : 'Rejeitado'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados enviados (payload)</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-2 sm:grid-cols-2">
            {request.payload &&
              Object.entries(request.payload).map(([key, value]) => (
                <div key={key} className="rounded border p-2">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {key}
                  </dt>
                  <dd className="mt-0.5 font-mono text-sm">
                    {String(value ?? '')}
                  </dd>
                </div>
              ))}
            {(!request.payload || Object.keys(request.payload).length === 0) && (
              <p className="text-muted-foreground text-sm">Nenhum dado.</p>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de passos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {request.steps?.map((step) => (
            <div
              key={step.id}
              className="flex flex-wrap items-center gap-2 rounded border p-3"
            >
              <span className="font-medium">
                Passo {step.workflowStep?.order ?? '?'}
              </span>
              <span className="text-muted-foreground">
                {step.workflowStep?.form?.name} – {step.workflowStep?.organizationRole?.name}
              </span>
              <Badge
                variant={
                  step.status === 'approved' ? 'default' : 'destructive'
                }
              >
                {step.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
              </Badge>
              {step.approvedAt && (
                <span className="text-muted-foreground text-sm">
                  {format(new Date(step.approvedAt), 'dd/MM/yyyy HH:mm')}
                </span>
              )}
              {step.comments && (
                <p className="w-full text-sm text-muted-foreground">
                  {step.comments}
                </p>
              )}
            </div>
          ))}
          {canApprove && currentWorkflowStep && (
            <div className="rounded border border-dashed p-3">
              <p className="text-muted-foreground text-sm">
                Passo atual: {currentWorkflowStep.form?.name} –{' '}
                {currentWorkflowStep.organizationRole?.name}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {canApprove && (
        <Card>
          <CardHeader>
            <CardTitle>Aprovar ou rejeitar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comments">Comentários (opcional)</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Comentários para o solicitante"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={handleApprove}
                disabled={approveMutation.isPending}
              >
                {approveMutation.isPending && (
                  <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                Aprovar
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={approveMutation.isPending}
              >
                Rejeitar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  )
}
