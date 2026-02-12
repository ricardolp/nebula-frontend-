import { Main } from '@/components/layout/main'
import { FormsDialogs } from './components/forms-dialogs'
import { FormsPrimaryButtons } from './components/forms-primary-buttons'
import { FormsProvider } from './components/forms-provider'
import { FormsTable } from './components/forms-table'
import { FormsTableSkeleton } from './components/forms-table-skeleton'
import { useOrganizationForms } from './api/use-organization-forms'

export function Forms() {
  const { forms, isLoading, error, refetch } = useOrganizationForms()

  return (
    <FormsProvider>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Formulários
            </h2>
            <p className="text-muted-foreground">
              Crie e edite formulários para uso nos workflows.
            </p>
          </div>
          <FormsPrimaryButtons />
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
          <FormsTableSkeleton />
        ) : (
          <FormsTable data={forms} />
        )}
      </Main>

      <FormsDialogs />
    </FormsProvider>
  )
}
