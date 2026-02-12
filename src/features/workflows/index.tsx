import { Main } from '@/components/layout/main'
import { WorkflowsDialogs } from './components/workflows-dialogs'
import { WorkflowsPrimaryButtons } from './components/workflows-primary-buttons'
import { WorkflowsProvider } from './components/workflows-provider'
import { WorkflowsTable } from './components/workflows-table'
import { WorkflowsTableSkeleton } from './components/workflows-table-skeleton'
import { useOrganizationWorkflows } from './api/use-organization-workflows'

export function Workflows() {
  const { workflows, isLoading, error, refetch } = useOrganizationWorkflows()

  return (
    <WorkflowsProvider>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Workflows
            </h2>
            <p className="text-muted-foreground">
              Configure workflows de material e partner (criação e atualização).
            </p>
          </div>
          <WorkflowsPrimaryButtons />
        </div>
        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {(error as Error).message}
            <button
              type="button"
              onClick={() => refetch()}
              className="ml-2 underline"
            >
              Tentar novamente
            </button>
          </div>
        )}
        {isLoading ? (
          <WorkflowsTableSkeleton />
        ) : (
          <WorkflowsTable data={workflows} />
        )}
      </Main>

      <WorkflowsDialogs />
    </WorkflowsProvider>
  )
}
