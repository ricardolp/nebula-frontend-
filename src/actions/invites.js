import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

/**
 * GET /api/invite/organization/:organizationId/pending
 * Resposta: array de convites pendentes
 */
export async function getPendingInvites(organizationId) {
  if (!organizationId) {
    return [];
  }

  const res = await axios.get(endpoints.inviteOrganization.pending(organizationId));

  const data = res.data;

  // Resposta: { success: true, data: { invites: [...] } }
  if (data?.success && data?.data?.invites && Array.isArray(data.data.invites)) {
    return data.data.invites;
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (data?.data !== undefined) {
    const inner = data.data;
    if (Array.isArray(inner)) return inner;
    if (inner?.invites && Array.isArray(inner.invites)) return inner.invites;
  }

  return [];
}

// ----------------------------------------------------------------------

/**
 * DELETE /api/invite/organization/:organizationId/:inviteId
 */
export async function deleteInvite(organizationId, inviteId) {
  if (!organizationId || !inviteId) {
    throw new Error('organizationId e inviteId são obrigatórios');
  }

  await axios.delete(endpoints.inviteOrganization.delete(organizationId, inviteId));
}
