import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { patchNotification } from '@/api/notifications'
import { useAuthStore } from '@/stores/auth-store'
import { useNotifications } from '../api/use-notifications'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

export function NotificationsBell() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)
  const { notifications, isLoading } = useNotifications({
    organizationId: organizationId ?? undefined,
    unreadOnly: false,
    take: 15,
  })

  const markReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      patchNotification(notificationId, { read: true }, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const unreadCount = notifications.filter((n) => !n.readAt).length

  const handleNotificationClick = (notification: {
    id: string
    relatedType: string
    relatedId: string
    readAt: string | null
  }) => {
    if (!notification.readAt) {
      markReadMutation.mutate(notification.id)
    }
    if (!notification.relatedId) return
    const { relatedType, relatedId } = notification
    if (relatedType === 'workflow_request') {
      navigate({ to: '/workflow-requests/$requestId', params: { requestId: relatedId } })
    } else if (relatedType === 'form') {
      navigate({ to: '/forms/$formId/edit', params: { formId: relatedId } })
    } else if (relatedType === 'workflow') {
      navigate({ to: '/workflows/$workflowId/edit', params: { workflowId: relatedId } })
    } else if (relatedType === 'app' || relatedType === 'integration') {
      navigate({ to: '/apps/$integrationId/mapping', params: { integrationId: relatedId } })
    } else if (relatedType === 'domain') {
      navigate({ to: '/domains/$tabela', params: { tabela: relatedId } })
    } else if (relatedType === 'business_partner' || relatedType === 'partner') {
      window.location.href = `/dashboard/business-partners/${relatedId}/edit`
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Notificações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Carregando…
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação.
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  'cursor-pointer flex-col items-start gap-0.5 py-3',
                  !notification.readAt && 'bg-muted/50'
                )}
                onSelect={() => handleNotificationClick(notification)}
              >
                <span className="font-medium">{notification.title}</span>
                {notification.body && (
                  <span className="line-clamp-2 text-xs text-muted-foreground">
                    {notification.body}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {notification.createdAt
                    ? format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm')
                    : ''}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
