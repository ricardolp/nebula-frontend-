import { useQuery } from '@tanstack/react-query'
import { getDomainsByTable } from '@/api/domains'
import { useAuthStore } from '@/stores/auth-store'

export function useDomainsByTable(tabela: string) {
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)

  const query = useQuery({
    queryKey: ['organization', organizationId, 'domains', 'table', tabela],
    queryFn: () => getDomainsByTable(organizationId!, tabela, token!),
    enabled: Boolean(organizationId && token && tabela),
  })

  const domains = query.data?.data.domains ?? []

  return {
    domains,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
