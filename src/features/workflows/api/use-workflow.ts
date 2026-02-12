import { useQuery } from '@tanstack/react-query'
import { getWorkflow } from '@/api/workflows'
import { useAuthStore } from '@/stores/auth-store'

export function useWorkflow(workflowId: string | undefined, enabled: boolean) {
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)

  const query = useQuery({
    queryKey: ['organization', organizationId, 'workflow', workflowId],
    queryFn: () => getWorkflow(organizationId!, workflowId!, token),
    enabled: Boolean(organizationId && token && workflowId && enabled),
  })

  const workflow = query.data?.data.workflow

  return {
    workflow,
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}
