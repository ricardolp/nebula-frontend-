import { useQuery } from '@tanstack/react-query'
import {
  getWorkflowRequests,
  type WorkflowRequestsListFilter,
} from '@/api/workflow-requests'
import { useAuthStore } from '@/stores/auth-store'

export type WorkflowRequestsFilters = {
  filter?: WorkflowRequestsListFilter
  workflowId?: string
  status?: 'pending' | 'approved' | 'rejected'
  page?: number
  pageSize?: number
}

export function useWorkflowRequests(filters: WorkflowRequestsFilters = {}) {
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)
  const {
    filter = 'all',
    workflowId,
    status,
    page = 1,
    pageSize = 20,
  } = filters
  const skip = (page - 1) * pageSize

  const query = useQuery({
    queryKey: [
      'organization',
      organizationId,
      'workflow-requests',
      { filter, workflowId, status, skip, take: pageSize },
    ],
    queryFn: () =>
      getWorkflowRequests(
        organizationId!,
        { filter, workflowId, status, skip, take: pageSize },
        token
      ),
    enabled: Boolean(organizationId && token),
  })

  const requests = query.data?.data.requests ?? []
  const total = query.data?.data.total ?? requests.length

  return {
    requests,
    total,
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}
