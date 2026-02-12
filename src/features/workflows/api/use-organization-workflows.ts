import { useQuery } from '@tanstack/react-query'
import { getWorkflows } from '@/api/workflows'
import { useAuthStore } from '@/stores/auth-store'

export function useOrganizationWorkflows() {
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)

  const query = useQuery({
    queryKey: ['organization', organizationId, 'workflows'],
    queryFn: () => getWorkflows(organizationId!, token),
    enabled: Boolean(organizationId && token),
  })

  const workflows = query.data?.data.workflows ?? []

  return {
    workflows,
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}
