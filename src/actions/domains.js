import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

/**
 * Busca domínios da organização por tabela e parâmetros adicionais.
 * GET /api/organizations/:organizationId/domains?skip=0&take=20&tabela=TB002&status=active&...
 *
 * @param {string} organizationId - ID da organização
 * @param {Object} params - Parâmetros da query
 * @param {string} params.tabela - Nome da tabela (ex: TB002)
 * @param {number} [params.skip=0] - Registros a pular
 * @param {number} [params.take=20] - Quantidade de registros
 * @param {string} [params.status='active'] - Status dos domínios
 * @param {Object} [params.extra] - Campos extras para a query (campo, etc.)
 * @returns {Promise<{ domains: Array }>} - Lista de domínios
 */
export async function getOrganizationDomains(organizationId, params = {}) {
  if (!organizationId) {
    return { domains: [] };
  }

  const { tabela, skip = 0, take = 20, status = 'active', ...extraParams } = params;

  const query = new URLSearchParams({ skip, take, status });
  if (tabela) query.set('tabela', tabela);

  Object.entries(extraParams).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.set(key, String(val));
    }
  });

  const url = `${endpoints.organization.domains(organizationId)}?${query.toString()}`;
  const res = await axios.get(url);
  const data = res.data;

  if (data?.success && data?.data?.domains) {
    return { domains: data.data.domains };
  }

  return { domains: [] };
}

// ----------------------------------------------------------------------

/**
 * Busca domínios da organização agrupados por tabela.
 * GET /api/organizations/:organizationId/domains/grouped
 *
 * @param {string} organizationId - ID da organização
 * @returns {Promise<{ groupedDomains: Array<{ tabela: string, count: number }> }>}
 */
export async function getOrganizationDomainsGrouped(organizationId) {
  if (!organizationId) {
    return { groupedDomains: [] };
  }

  const url = endpoints.organization.domainsGrouped(organizationId);
  const res = await axios.get(url);
  const data = res.data;

  if (data?.success && data?.data?.groupedDomains) {
    return { groupedDomains: data.data.groupedDomains };
  }

  return { groupedDomains: [] };
}
