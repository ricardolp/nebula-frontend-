import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/workflows
 * Resposta: { success, data: { workflows: [...] } }
 */
export async function getOrganizationWorkflows(organizationId) {
  if (!organizationId) {
    return [];
  }

  const res = await axios.get(endpoints.organization.workflows(organizationId));
  const data = res.data;

  if (data?.success && data?.data?.workflows && Array.isArray(data.data.workflows)) {
    return data.data.workflows;
  }

  if (Array.isArray(data?.data?.workflows)) {
    return data.data.workflows;
  }

  return [];
}

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/workflows/:workflowId
 * Resposta: { success, data: { workflow } }
 */
export async function getOrganizationWorkflow(organizationId, workflowId) {
  if (!organizationId || !workflowId) {
    throw new Error('organizationId e workflowId são obrigatórios');
  }

  const res = await axios.get(
    endpoints.organization.workflow(organizationId, workflowId)
  );
  const data = res.data;

  if (data?.success === false && data?.error?.message) {
    throw new Error(data.error.message);
  }

  return data?.data?.workflow ?? data?.data ?? res.data;
}

// ----------------------------------------------------------------------

/**
 * POST /api/organizations/:organizationId/workflows
 * Payload: { type: 'material'|'partner', action: 'create'|'update', name?: string }
 * Resposta: { success, data: { workflow } }
 */
export async function createOrganizationWorkflow(organizationId, payload) {
  if (!organizationId) {
    throw new Error('organizationId é obrigatório');
  }

  const res = await axios.post(
    endpoints.organization.workflows(organizationId),
    payload
  );
  const data = res.data;

  if (data?.success === false && data?.error?.message) {
    throw new Error(data.error.message);
  }

  return data?.data?.workflow ?? data?.data ?? res.data;
}

// ----------------------------------------------------------------------

/**
 * PATCH /api/organizations/:organizationId/workflows/:workflowId
 * Payload: { type?, action?, name? }
 */
export async function patchOrganizationWorkflow(organizationId, workflowId, payload) {
  if (!organizationId || !workflowId) {
    throw new Error('organizationId e workflowId são obrigatórios');
  }

  const res = await axios.patch(
    endpoints.organization.workflow(organizationId, workflowId),
    payload
  );
  const data = res.data;

  if (data?.success === false && data?.error?.message) {
    throw new Error(data.error.message);
  }

  return data;
}

// ----------------------------------------------------------------------

/**
 * POST /api/organizations/:organizationId/workflows/:workflowId/steps
 * Payload: { formId, organizationRoleId, order }
 */
export async function createOrganizationWorkflowStep(organizationId, workflowId, payload) {
  if (!organizationId || !workflowId) {
    throw new Error('organizationId e workflowId são obrigatórios');
  }

  const res = await axios.post(
    endpoints.organization.workflowSteps(organizationId, workflowId),
    payload
  );
  const data = res.data;

  if (data?.success === false && data?.error?.message) {
    throw new Error(data.error.message);
  }

  return data?.data?.step ?? data?.data ?? res.data;
}

/**
 * PATCH /api/organizations/:organizationId/workflows/:workflowId/steps/:stepId
 */
export async function patchOrganizationWorkflowStep(
  organizationId,
  workflowId,
  stepId,
  payload
) {
  if (!organizationId || !workflowId || !stepId) {
    throw new Error('organizationId, workflowId e stepId são obrigatórios');
  }

  const res = await axios.patch(
    endpoints.organization.workflowStep(organizationId, workflowId, stepId),
    payload
  );
  const data = res.data;

  if (data?.success === false && data?.error?.message) {
    throw new Error(data.error.message);
  }

  return data;
}

/**
 * DELETE /api/organizations/:organizationId/workflows/:workflowId/steps/:stepId
 */
export async function deleteOrganizationWorkflowStep(organizationId, workflowId, stepId) {
  if (!organizationId || !workflowId || !stepId) {
    throw new Error('organizationId, workflowId e stepId são obrigatórios');
  }

  await axios.delete(
    endpoints.organization.workflowStep(organizationId, workflowId, stepId)
  );
}

// ----------------------------------------------------------------------

/**
 * DELETE /api/organizations/:organizationId/workflows/:workflowId
 */
export async function deleteOrganizationWorkflow(organizationId, workflowId) {
  if (!organizationId || !workflowId) {
    throw new Error('organizationId e workflowId são obrigatórios');
  }

  await axios.delete(endpoints.organization.workflow(organizationId, workflowId));
}
