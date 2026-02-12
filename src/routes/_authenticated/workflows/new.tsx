import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { WorkflowWizardPage } from '@/features/workflows/components/workflow-wizard-page'

export const Route = createFileRoute('/_authenticated/workflows/new')({
  component: WorkflowsNewPage,
})

function WorkflowsNewPage() {
  return (
    <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Novo workflow
        </h2>
        <p className="text-muted-foreground">
          Defina tipo e ação. Após criar, você será redirecionado para configurar os passos.
        </p>
      </div>
      <WorkflowWizardPage
        workflowId={undefined}
        initialWorkflow={null}
        isNew
      />
    </Main>
  )
}
