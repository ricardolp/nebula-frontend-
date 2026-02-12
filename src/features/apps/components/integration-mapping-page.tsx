import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MappingPanel } from './mapping'
import { useAuthStore } from '@/stores/auth-store'
import type { OrganizationIntegration } from '@/api/integrations'

type IntegrationMappingPageProps = {
  integration: OrganizationIntegration | null
  integrationId: string
  isLoading?: boolean
}

export function IntegrationMappingPage({
  integration,
  integrationId,
  isLoading,
}: IntegrationMappingPageProps) {
  const organizationId = useAuthStore((s) => s.auth.organizationId)
  const token = useAuthStore((s) => s.auth.token)

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='icon' asChild>
              <Link to='/apps'>
                <ArrowLeft className='size-4' />
                <span className='sr-only'>Voltar para integrações</span>
              </Link>
            </Button>
            <div>
              <h1 className='text-2xl font-bold tracking-tight'>
                Mapeamento de campos
              </h1>
              <p className='text-muted-foreground'>
                {integration
                  ? `Configure o mapeamento de campos para ${integration.name}`
                  : 'Integração'}
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle>Carregando...</CardTitle>
              <CardDescription>
                Buscando dados da integração.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : integration ? (
          integration.process === 'domain' ? (
            <>
              <p className='text-sm text-muted-foreground'>
                Esquerda: campos da nossa API (domain). Direita: campos da API da
                integração. Clique em &quot;Testar&quot; para buscar os campos
                disponíveis. Selecione um campo da direita e depois um da
                esquerda para criar o mapeamento.
              </p>
              <MappingPanel
                organizationId={organizationId ?? ''}
                integrationId={integrationId}
                token={token ?? ''}
              />
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Mapeamento não disponível</CardTitle>
                <CardDescription>
                  O mapeamento para integrações do tipo &quot;{integration.process}&quot; não
                  está disponível no momento. Atualmente apenas integrações do tipo
                  &quot;domain&quot; suportam mapeamento de campos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant='outline'>
                  <Link to='/apps'>Voltar para integrações</Link>
                </Button>
              </CardContent>
            </Card>
          )
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Integração não encontrada</CardTitle>
              <CardDescription>
                A integração com ID {integrationId} não foi encontrada ou você
                não tem permissão para acessá-la.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant='outline'>
                <Link to='/apps'>Voltar para integrações</Link>
              </Button>
            </CardContent>
          </Card>
        )}
    </Main>
  )
}
