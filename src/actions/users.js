import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/me
 * Retorna o perfil do usuário atual na organização (ex.: { organizationRoleId, ... }).
 * Usado para saber se o usuário pode preencher/aprovar um step do workflow.
 */
export async function getOrganizationMe(organizationId) {
  if (!organizationId) {
    return null;
  }

  try {
    const res = await axios.get(endpoints.organization.me(organizationId));
    const data = res.data?.data ?? res.data;
    return data ?? null;
  } catch (err) {
    return null;
  }
}

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/users?skip=0&take=20
 * Resposta: { success, data: { users: [...], total?: number } }
 */
export async function getOrganizationUsers(organizationId, { skip = 0, take = 20 } = {}) {
  if (!organizationId) {
    return { users: [], total: 0 };
  }

  const res = await axios.get(endpoints.organization.users(organizationId), {
    params: { skip, take },
  });

  const { success, data } = res.data;

  if (!success || !data) {
    throw new Error(data?.message || 'Erro ao carregar usuários');
  }

  return {
    users: data.users ?? [],
    total: data.total ?? (data.users?.length ?? 0),
  };
}

// ----------------------------------------------------------------------

/**
 * PATCH /api/organizations/:organizationId/users/:userId
 * Payload: { name?, status?, organizationRoleId?, email?, avatar? }
 */
export async function updateOrganizationUser(organizationId, userId, payload) {
  if (!organizationId || !userId) {
    throw new Error('organizationId e userId são obrigatórios');
  }

  const res = await axios.patch(
    endpoints.organization.user(organizationId, userId),
    payload
  );

  const { success, data, message } = res.data ?? {};

  if (success === false && message) {
    throw new Error(message);
  }

  return data ?? res.data;
}

// ----------------------------------------------------------------------

/**
 * POST /api/invite
 * Payload: { email, organizationId }
 * Resposta: { success, data: { invite, inviteUrl }, message }
 */
export async function inviteUser(email, organizationId) {
  if (!email || !organizationId) {
    throw new Error('E-mail e organização são obrigatórios');
  }

  const res = await axios.post(endpoints.invite, {
    email: email.trim(),
    organizationId,
  });

  const { success, data, message } = res.data ?? {};

  if (success === false && message) {
    throw new Error(message);
  }

  return data ?? res.data;
}
