import { apiBaseUrl } from '@/config/api'

/** Notification as returned by the API */
export interface Notification {
  id: string
  userId: string
  organizationId: string
  title: string
  body: string
  readAt: string | null
  relatedType: string
  relatedId: string
  createdAt: string
}

export interface ListNotificationsParams {
  organizationId?: string
  unreadOnly?: boolean
  skip?: number
  take?: number
}

export interface ListNotificationsResponse {
  success: true
  data: {
    notifications: Notification[]
    total?: number
  }
}

export interface GetNotificationResponse {
  success: true
  data: {
    notification: Notification
  }
}

export interface UpdateNotificationPayload {
  read?: boolean
}

function getError(data: unknown): string {
  const obj = data as { error?: { message?: string }; message?: string }
  return obj?.error?.message ?? obj?.message ?? 'Request failed'
}

/**
 * GET /api/notifications
 */
export async function getNotifications(
  params: ListNotificationsParams,
  token: string
): Promise<ListNotificationsResponse> {
  const url = new URL(`${apiBaseUrl}/api/notifications`)
  if (params.organizationId) url.searchParams.set('organizationId', params.organizationId)
  if (params.unreadOnly != null) url.searchParams.set('unreadOnly', String(params.unreadOnly))
  if (params.skip != null) url.searchParams.set('skip', String(params.skip))
  if (params.take != null) url.searchParams.set('take', String(params.take))

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(getError(data))
  }

  if (!(data as ListNotificationsResponse)?.success || !(data as ListNotificationsResponse)?.data?.notifications) {
    throw new Error('Invalid notifications response')
  }

  return data as ListNotificationsResponse
}

/**
 * GET /api/notifications/:notificationId
 */
export async function getNotification(
  notificationId: string,
  token: string
): Promise<GetNotificationResponse> {
  const res = await fetch(
    `${apiBaseUrl}/api/notifications/${notificationId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(getError(data))
  }

  if (!(data as GetNotificationResponse)?.success || !(data as GetNotificationResponse)?.data?.notification) {
    throw new Error('Invalid notification response')
  }

  return data as GetNotificationResponse
}

/**
 * PATCH /api/notifications/:notificationId
 */
export async function patchNotification(
  notificationId: string,
  payload: UpdateNotificationPayload,
  token: string
): Promise<{ success: boolean }> {
  const res = await fetch(
    `${apiBaseUrl}/api/notifications/${notificationId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(getError(data))
  }

  return data as { success: boolean }
}
