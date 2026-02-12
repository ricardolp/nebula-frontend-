import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getOrganizationIntegrationById } from '@/api/integrations'
import { useAuthStore } from '@/stores/auth-store'
import { IntegrationMappingPage } from '@/features/apps/components/integration-mapping-page'

export const Route = createFileRoute('/_authenticated/apps/$integrationId/mapping')({
  component: IntegrationMappingRoute,
})

function IntegrationMappingRoute() {
  const { integrationId } = Route.useParams()
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)

  const { data, isLoading } = useQuery({
    queryKey: ['organization', organizationId, 'integration', integrationId],
    queryFn: () =>
      getOrganizationIntegrationById(organizationId!, integrationId, token!),
    enabled: !!organizationId && !!integrationId && !!token,
  })

  const integration = data?.data?.integration ?? null

  return (
    <IntegrationMappingPage
      integration={integration}
      integrationId={integrationId}
      isLoading={isLoading}
    />
  )
}
