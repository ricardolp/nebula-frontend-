import { createFileRoute } from '@tanstack/react-router'
import { RequestDetailPage } from '@/features/workflow-requests/components/request-detail-page'
import { useWorkflowRequest } from '@/features/workflow-requests/api/use-workflow-request'

export const Route = createFileRoute('/_authenticated/workflow-requests/$requestId')({
  component: WorkflowRequestDetailPage,
})

function WorkflowRequestDetailPage() {
  const { requestId } = Route.useParams()
  const { request, isLoading, error } = useWorkflowRequest(requestId, true)

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-destructive">
        {(error as Error).message}
      </div>
    )
  }

  if (isLoading || !request) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando solicitação…</div>
      </div>
    )
  }

  return <RequestDetailPage request={request} />
}
