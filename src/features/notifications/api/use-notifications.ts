import { useQuery } from '@tanstack/react-query'
import { getNotifications } from '@/api/notifications'
import { useAuthStore } from '@/stores/auth-store'

export type NotificationsFilters = {
  organizationId?: string
  unreadOnly?: boolean
  skip?: number
  take?: number
}

export function useNotifications(filters: NotificationsFilters = {}) {
  const token = useAuthStore((s) => s.auth.token)
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const {
    organizationId: filterOrgId,
    unreadOnly,
    skip = 0,
    take = 20,
  } = filters

  const query = useQuery({
    queryKey: [
      'notifications',
      { organizationId: filterOrgId ?? organizationId, unreadOnly, skip, take },
    ],
    queryFn: () =>
      getNotifications(
        {
          organizationId: filterOrgId ?? organizationId ?? undefined,
          unreadOnly,
          skip,
          take,
        },
        token
      ),
    enabled: Boolean(token),
  })

  const notifications = query.data?.data.notifications ?? []

  return {
    notifications,
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}
