import { apiBaseUrl } from '@/config/api'

/** Grouped domain item from API */
export interface GroupedDomain {
  tabela: string
  descricaoCampo: string
}

/** Domain status */
export type DomainStatus = 'active' | 'inactive'

/** Domain item from list-by-table API */
export interface OrganizationDomain {
  id: string
  organizationId: string
  tabela: string
  campo: string
  descricaoCampo: string
  valor: string
  headers: Record<string, string> | null
  queryParams: Record<string, string> | null
  createdAt: string
  updatedAt: string
  status?: DomainStatus
}

export interface ListDomainsByTableResponse {
  success: true
  data: {
    domains: OrganizationDomain[]
  }
}

export interface ListGroupedDomainsResponse {
  success: true
  data: {
    groupedDomains: GroupedDomain[]
  }
}

/**
 * Fetches grouped domains for an organization.
 * GET /api/organizations/:organizationId/domains/grouped
 */
export async function getGroupedDomains(
  organizationId: string,
  token: string
): Promise<ListGroupedDomainsResponse> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/domains/grouped`,
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
    throw new Error(
      (data as { message?: string; title?: string })?.message ??
        (data as { message?: string; title?: string })?.title ??
        'Falha ao carregar domínios'
    )
  }

  if (
    !(data as ListGroupedDomainsResponse)?.success ||
    !(data as ListGroupedDomainsResponse)?.data?.groupedDomains
  ) {
    throw new Error('Resposta de domínios inválida')
  }

  return data as ListGroupedDomainsResponse
}

/**
 * Fetches domains for an organization filtered by table.
 * GET /api/organizations/:organizationId/domains?tabela=:tabela
 */
export async function getDomainsByTable(
  organizationId: string,
  tabela: string,
  token: string
): Promise<ListDomainsByTableResponse> {
  const params = new URLSearchParams({ tabela })
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/domains?${params}`,
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
    throw new Error(
      (data as { message?: string; title?: string })?.message ??
        (data as { message?: string; title?: string })?.title ??
        'Falha ao carregar itens da tabela'
    )
  }

  if (
    !(data as ListDomainsByTableResponse)?.success ||
    !(data as ListDomainsByTableResponse)?.data?.domains
  ) {
    throw new Error('Resposta de domínios inválida')
  }

  return data as ListDomainsByTableResponse
}

/**
 * Updates a domain's status in the organization.
 * PATCH /api/organizations/:organizationId/domains/:domainId
 */
export async function updateDomainStatus(
  organizationId: string,
  domainId: string,
  status: DomainStatus,
  token: string
): Promise<{ success: boolean }> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/domains/${domainId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(
      (data as { message?: string; title?: string })?.message ??
        (data as { message?: string; title?: string })?.title ??
        'Falha ao atualizar domínio'
    )
  }

  return data as { success: boolean }
}
