import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { NewRequestForm } from '@/features/workflow-requests/components/new-request-form'
import { useOrganizationWorkflows } from '@/features/workflows/api/use-organization-workflows'

export const Route = createFileRoute('/_authenticated/workflow-requests/new')({
  validateSearch: (search: Record<string, unknown>): { workflowId?: string } => ({
    workflowId: search.workflowId as string | undefined,
  }),
  component: WorkflowRequestsNewPage,
})

function WorkflowRequestsNewPage() {
  const { workflows } = useOrganizationWorkflows()
  const { workflowId } = Route.useSearch()

  return (
    <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Nova solicitação
        </h2>
        <p className="text-muted-foreground">
          Selecione o workflow e preencha os dados do formulário.
        </p>
      </div>
      <NewRequestForm
        workflowId={workflowId ?? workflows[0]?.id ?? ''}
        workflows={workflows}
      />
    </Main>
  )
}
