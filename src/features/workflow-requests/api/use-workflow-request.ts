import { useQuery } from '@tanstack/react-query'
import { getWorkflowRequest } from '@/api/workflow-requests'
import { useAuthStore } from '@/stores/auth-store'

export function useWorkflowRequest(
  requestId: string | undefined,
  enabled: boolean
) {
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)

  const query = useQuery({
    queryKey: [
      'organization',
      organizationId,
      'workflow-request',
      requestId,
    ],
    queryFn: () =>
      getWorkflowRequest(organizationId!, requestId!, token),
    enabled: Boolean(organizationId && token && requestId && enabled),
  })

  const request = query.data?.data.request

  return {
    request,
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}
