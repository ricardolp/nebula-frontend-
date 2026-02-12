import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { Skeleton } from '@/components/ui/skeleton'
import { WorkflowWizardPage } from '@/features/workflows/components/workflow-wizard-page'
import { useWorkflow } from '@/features/workflows/api/use-workflow'

export const Route = createFileRoute('/_authenticated/workflows/$workflowId/edit')({
  component: WorkflowsEditPage,
})

function WorkflowsEditPage() {
  const { workflowId } = Route.useParams()
  const { workflow, isLoading, error } = useWorkflow(workflowId, true)

  if (error) {
    return (
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {(error as Error).message}
        </div>
      </Main>
    )
  }

  if (isLoading || !workflow) {
    return (
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar workflow</h2>
          <Skeleton className="mt-2 h-5 w-72" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </Main>
    )
  }

  return (
    <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Editar workflow
        </h2>
        <p className="text-muted-foreground">
          Configure tipo, ação e passos do workflow.
        </p>
      </div>
      <WorkflowWizardPage
        workflowId={workflowId}
        initialWorkflow={workflow}
        isNew={false}
      />
    </Main>
  )
}
