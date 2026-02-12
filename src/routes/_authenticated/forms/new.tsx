import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { FormBuilderPage } from '@/features/forms/components/form-builder-page'

export const Route = createFileRoute('/_authenticated/forms/new')({
  validateSearch: (search: Record<string, unknown>): { type?: 'material' | 'partner' } => ({
    type: search.type as 'material' | 'partner' | undefined,
  }),
  component: FormsNewPage,
})

function FormsNewPage() {
  const { type } = Route.useSearch()

  return (
    <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Novo formulário
        </h2>
        <p className="text-muted-foreground">
          Crie um novo formulário e defina os campos.
        </p>
      </div>
      <div className="dark h-full min-h-0 flex-1">
        <FormBuilderPage
          formId={undefined}
          initialForm={null}
          initialFields={[]}
          formName=""
          isNew
          formType={type ?? 'material'}
        />
      </div>
    </Main>
  )
}
