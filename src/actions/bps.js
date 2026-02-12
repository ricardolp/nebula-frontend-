import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/bps
 * Resposta: { success, data: { bps: [...] } }
 */
export async function getOrganizationBps(organizationId) {
  if (!organizationId) {
    return [];
  }

  const res = await axios.get(endpoints.organization.bps(organizationId));
  const data = res.data;

  if (data?.success && data?.data?.bps && Array.isArray(data.data.bps)) {
    return data.data.bps;
  }

  if (Array.isArray(data?.data?.bps)) {
    return data.data.bps;
  }

  return [];
}

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/bps/:bpId
 * Resposta: { success, data: { bp: { ... } } }
 */
export async function getOrganizationBp(organizationId, bpId) {
  if (!organizationId || !bpId) {
    throw new Error('organizationId e bpId são obrigatórios');
  }

  const res = await axios.get(endpoints.organization.bp(organizationId, bpId));
  const data = res.data;

  if (data?.success && data?.data?.bp) {
    return data.data.bp;
  }

  if (data?.data?.bp) {
    return data.data.bp;
  }

  throw new Error(data?.message || 'BP não encontrado');
}
