import { createFileRoute } from '@tanstack/react-router'
import { DomainTablePage } from '@/features/domains/components/domain-table-page'

export const Route = createFileRoute('/_authenticated/domains/$tabela')({
  component: DomainTablePageWrapper,
})

function DomainTablePageWrapper() {
  const { tabela } = Route.useParams()
  return <DomainTablePage tabela={tabela} />
}
