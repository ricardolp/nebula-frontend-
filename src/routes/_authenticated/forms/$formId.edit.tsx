import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { Skeleton } from '@/components/ui/skeleton'
import { FormBuilderPage } from '@/features/forms/components/form-builder-page'
import { useForm } from '@/features/forms/api/use-form'

export const Route = createFileRoute('/_authenticated/forms/$formId/edit')({
  component: FormsEditPage,
})

function FormsEditPage() {
  const { formId } = Route.useParams()
  const { form, isLoading, error } = useForm(formId, true)
  const initialFields = form?.fields ?? []

  if (error) {
    return (
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {(error as Error).message}
        </div>
      </Main>
    )
  }

  if (isLoading) {
    return (
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar formulário</h2>
          <Skeleton className="mt-2 h-5 w-64" />
        </div>
        <div className="dark flex min-h-[560px] flex-1 gap-4">
          <Skeleton className="h-[520px] w-[280px] shrink-0 rounded-lg" />
          <Skeleton className="min-h-[520px] flex-1 rounded-lg" />
        </div>
      </Main>
    )
  }

  if (!form) {
    return (
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="rounded-md border border-muted bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
          Formulário indisponível. A API de formulários está temporariamente desativada.
        </div>
      </Main>
    )
  }

  return (
    <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Editar formulário
        </h2>
        <p className="text-muted-foreground">
          Edite os campos do formulário {form.name}.
        </p>
      </div>
      <div className="dark h-full min-h-0 flex-1">
        <FormBuilderPage
          formId={formId}
          initialForm={form}
          initialFields={initialFields}
          formName={form.name}
          isNew={false}
        />
      </div>
    </Main>
  )
}
