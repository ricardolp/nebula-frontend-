import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/roles
 * Resposta: { success, data: { roles: [...] } }
 */
export async function getOrganizationRoles(organizationId) {
  if (!organizationId) {
    return [];
  }

  const res = await axios.get(endpoints.organization.roles(organizationId));
  const data = res.data;

  if (data?.success && data?.data?.roles && Array.isArray(data.data.roles)) {
    return data.data.roles;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
}

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/roles/:roleId
 * Resposta: { success, data: { role } }
 */
export async function getOrganizationRole(organizationId, roleId) {
  if (!organizationId || !roleId) {
    throw new Error('organizationId e roleId são obrigatórios');
  }

  const res = await axios.get(endpoints.organization.role(organizationId, roleId));
  const data = res.data;

  if (data?.success && data?.data?.role) {
    return data.data.role;
  }

  if (data?.data) {
    return data.data;
  }

  throw new Error('Role não encontrado');
}

// ----------------------------------------------------------------------

/**
 * POST /api/organizations/:organizationId/roles
 * Payload: { name, slug, permissions: string[] }
 * Resposta: { success, data: { role } }
 */
export async function createOrganizationRole(organizationId, payload) {
  if (!organizationId) {
    throw new Error('organizationId é obrigatório');
  }

  const res = await axios.post(endpoints.organization.roles(organizationId), payload);
  const data = res.data;

  if (data?.success === false && data?.error?.message) {
    throw new Error(data.error.message);
  }

  return data?.data?.role ?? data?.data ?? res.data;
}

// ----------------------------------------------------------------------

/**
 * PATCH /api/organizations/:organizationId/roles/:roleId
 * Payload: { name?, slug?, permissions? }
 */
export async function updateOrganizationRole(organizationId, roleId, payload) {
  if (!organizationId || !roleId) {
    throw new Error('organizationId e roleId são obrigatórios');
  }

  const res = await axios.patch(
    endpoints.organization.role(organizationId, roleId),
    payload
  );
  const data = res.data;

  if (data?.success === false && data?.error?.message) {
    throw new Error(data.error.message);
  }

  return data?.data?.role ?? data?.data ?? res.data;
}

// ----------------------------------------------------------------------

/**
 * DELETE /api/organizations/:organizationId/roles/:roleId
 */
export async function deleteOrganizationRole(organizationId, roleId) {
  if (!organizationId || !roleId) {
    throw new Error('organizationId e roleId são obrigatórios');
  }

  await axios.delete(endpoints.organization.role(organizationId, roleId));
}

// ----------------------------------------------------------------------

/**
 * Converte entities da API (id, label, actions) em lista de opções { id, label }.
 * Permissão no formato entity_action (ex: users_view, projects_edit).
 */
function buildPermissionOptions(entities) {
  if (!Array.isArray(entities)) return [];
  const options = [];
  entities.forEach((entity) => {
    const entityId = entity.id;
    const entityLabel = entity.label || entityId;
    const actions = entity.actions || [];
    actions.forEach((action) => {
      const actionId = action.id;
      const actionLabel = action.label || actionId;
      options.push({
        id: `${entityId}_${actionId}`,
        label: `${entityLabel} › ${actionLabel}`,
      });
    });
  });
  return options;
}

/**
 * GET /api/role-types
 * Resposta: { success, data: { entities: [{ id, label, actions: [{ id, label }] }] } }
 * Retorna lista de opções { id, label } para seleção (id = entity_action para a API).
 */
export async function getRoleTypes() {
  try {
    const res = await axios.get(endpoints.roleTypes);
    const data = res.data;

    if (data?.success && data?.data?.entities && Array.isArray(data.data.entities)) {
      return buildPermissionOptions(data.data.entities);
    }

    if (data?.data?.entities && Array.isArray(data.data.entities)) {
      return buildPermissionOptions(data.data.entities);
    }

    return [];
  } catch {
    return buildPermissionOptions(FALLBACK_ENTITIES);
  }
}

// Fallback quando /api/role-types não está disponível
const FALLBACK_ENTITIES = [
  { id: 'users', label: 'Usuários', actions: [{ id: 'view', label: 'Visualizar' }, { id: 'edit', label: 'Editar' }, { id: 'delete', label: 'Remover' }, { id: 'manage', label: 'Gerenciar' }] },
  { id: 'invites', label: 'Convites', actions: [{ id: 'view', label: 'Visualizar' }, { id: 'create', label: 'Criar' }, { id: 'delete', label: 'Remover' }] },
  { id: 'roles', label: 'Roles', actions: [{ id: 'view', label: 'Visualizar' }, { id: 'create', label: 'Criar' }, { id: 'edit', label: 'Editar' }, { id: 'delete', label: 'Remover' }] },
  { id: 'projects', label: 'Projetos', actions: [{ id: 'view', label: 'Visualizar' }, { id: 'create', label: 'Criar' }, { id: 'edit', label: 'Editar' }, { id: 'delete', label: 'Remover' }] },
];
