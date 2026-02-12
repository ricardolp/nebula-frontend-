import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/workflow-slas
 * Resposta: { success, data: { slas: [...] } }
 */
export async function getOrganizationWorkflowSlas(organizationId) {
  if (!organizationId) {
    return [];
  }

  const res = await axios.get(endpoints.organization.workflowSlas(organizationId));

  const { success, data } = res.data ?? {};

  if (!success || !data) {
    throw new Error(res.data?.error?.message || res.data?.message || 'Erro ao carregar SLAs');
  }

  return data.slas ?? [];
}

// ----------------------------------------------------------------------

/**
 * POST /api/organizations/:organizationId/workflow-slas
 * Payload: { workflowType: 'material'|'partner', priority: 'baixa'|'media'|'alta'|'urgente', hours: number }
 * Resposta: { success, data: { sla } }
 */
export async function createOrganizationWorkflowSla(organizationId, payload) {
  if (!organizationId) {
    throw new Error('Organização não informada');
  }

  const res = await axios.post(endpoints.organization.workflowSlas(organizationId), payload);

  const { success, data } = res.data ?? {};

  if (!success || !data) {
    throw new Error(res.data?.error?.message || res.data?.message || 'Erro ao criar SLA');
  }

  return data.sla ?? data;
}
