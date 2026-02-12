import { useNavigate } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { DomainsGrid } from './components/domains-grid'
import { DomainsGridSkeleton } from './components/domains-grid-skeleton'
import { useGroupedDomains } from './api/use-grouped-domains'
import type { GroupedDomain } from '@/api/domains'

export function Domains() {
  const navigate = useNavigate()
  const { groupedDomains, isLoading } = useGroupedDomains()

  const handleManage = (domain: GroupedDomain) => {
    navigate({ to: '/domains/$tabela', params: { tabela: domain.tabela } })
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Catálogos do Sistema
          </h2>
          <p className='text-muted-foreground'>
            Gerencie os domínios agrupados da organização.
          </p>
        </div>

        {isLoading ? (
          <DomainsGridSkeleton />
        ) : (
          <DomainsGrid domains={groupedDomains} onManage={handleManage} />
        )}
    </Main>
  )
}
