import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/integration
 * Resposta: { success, data: { integrations: [...] } }
 */
export async function getOrganizationIntegrations(organizationId) {
  if (!organizationId) {
    return [];
  }

  const res = await axios.get(endpoints.organization.integrations(organizationId));

  const { success, data } = res.data;

  if (!success || !data) {
    throw new Error(data?.message || 'Erro ao carregar integrações');
  }

  return data.integrations ?? [];
}

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/integration/:integrationId
 */
export async function getOrganizationIntegration(organizationId, integrationId) {
  if (!organizationId || !integrationId) {
    throw new Error('organizationId e integrationId são obrigatórios');
  }

  const res = await axios.get(
    endpoints.organization.integration(organizationId, integrationId)
  );

  const { success, data } = res.data ?? {};

  if (success === false) {
    throw new Error(res.data?.error?.message || 'Erro ao carregar integração');
  }

  return data?.integration ?? data;
}

// ----------------------------------------------------------------------

/**
 * POST /api/organizations/:organizationId/integration
 * Payload: { type, process, url, name, authType, authConfig?, headers?, queryParams? }
 */
export async function createOrganizationIntegration(organizationId, payload) {
  if (!organizationId) {
    throw new Error('organizationId é obrigatório');
  }

  const res = await axios.post(
    endpoints.organization.integrations(organizationId),
    payload
  );

  const { success, data, message } = res.data ?? {};

  if (success === false && message) {
    throw new Error(message);
  }

  return data?.integration ?? data ?? res.data;
}

// ----------------------------------------------------------------------

/**
 * PATCH /api/organizations/:organizationId/integration/:integrationId
 * Payload: { name?, url?, status?, authType?, authConfig?, headers?, queryParams? }
 */
export async function updateOrganizationIntegration(
  organizationId,
  integrationId,
  payload
) {
  if (!organizationId || !integrationId) {
    throw new Error('organizationId e integrationId são obrigatórios');
  }

  const res = await axios.patch(
    endpoints.organization.integration(organizationId, integrationId),
    payload
  );

  const { success, data, message } = res.data ?? {};

  if (success === false && message) {
    throw new Error(message);
  }

  return data?.integration ?? data ?? res.data;
}

// ----------------------------------------------------------------------

/**
 * DELETE /api/organizations/:organizationId/integration/:integrationId
 */
export async function deleteOrganizationIntegration(organizationId, integrationId) {
  if (!organizationId || !integrationId) {
    throw new Error('organizationId e integrationId são obrigatórios');
  }

  const res = await axios.delete(
    endpoints.organization.integration(organizationId, integrationId)
  );

  const { success, message } = res.data ?? {};

  if (success === false && message) {
    throw new Error(message);
  }

  return res.data;
}

// ----------------------------------------------------------------------

/**
 * POST /api/organizations/:organizationId/integration/:integrationId/sync
 */
export async function syncOrganizationIntegration(organizationId, integrationId) {
  if (!organizationId || !integrationId) {
    throw new Error('organizationId e integrationId são obrigatórios');
  }

  const res = await axios.post(
    endpoints.organization.integrationSync(organizationId, integrationId)
  );

  const { success, data, message } = res.data ?? {};

  if (success === false && message) {
    throw new Error(message);
  }

  return data ?? res.data;
}
