import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/forms
 * @param {string} organizationId
 * @param {{ activeOnly?: boolean }} [options]
 * @returns {Promise<Array>} Lista de formulários
 */
export async function getOrganizationForms(organizationId, _options = {}) {
  if (!organizationId) {
    return [];
  }
  const res = await axios.get(endpoints.organization.forms(organizationId));
  const data = res.data;
  if (data?.data?.forms) {
    return data.data.forms;
  }
  if (Array.isArray(data?.forms)) {
    return data.forms;
  }
  if (Array.isArray(data)) {
    return data;
  }
  return [];
}

// ----------------------------------------------------------------------

/**
 * DELETE /api/organizations/:organizationId/forms/:formId
 * Implementar quando o endpoint estiver disponível.
 */
export async function deleteOrganizationForm(organizationId, formId) {
  if (!organizationId || !formId) {
    throw new Error('organizationId e formId são obrigatórios');
  }

  await axios.delete(endpoints.organization.form(organizationId, formId));
}

// ----------------------------------------------------------------------

/**
 * POST /api/organizations/:organizationId/forms
 * Corpo esperado: { name, entity }
 * entity: 'material' | 'partner'
 */
export async function createOrganizationForm(organizationId, payload) {
  if (!organizationId) {
    throw new Error('organizationId é obrigatório');
  }

  const res = await axios.post(endpoints.organization.forms(organizationId), payload);
  return res.data;
}

// ----------------------------------------------------------------------

/**
 * PATCH /api/organizations/:organizationId/forms/:formId
 * Corpo: { name? }
 */
export async function patchOrganizationForm(organizationId, formId, payload) {
  if (!organizationId || !formId) {
    throw new Error('organizationId e formId são obrigatórios');
  }
  await axios.patch(endpoints.organization.form(organizationId, formId), payload);
}

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/forms/:formId
 * Resposta: { success, data: { form } }
 */
export async function getOrganizationForm(organizationId, formId) {
  if (!organizationId || !formId) {
    throw new Error('organizationId e formId são obrigatórios');
  }
  const res = await axios.get(endpoints.organization.form(organizationId, formId));
  const data = res.data;
  if (!data?.success || !data?.data?.form) {
    throw new Error(data?.message || 'Resposta inválida do formulário');
  }
  return data.data.form;
}

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/forms/:formId/fields
 * Desativado para evitar CORS - retorna lista vazia
 */
export async function getOrganizationFormFields(_organizationId, _formId) {
  return [];
}

// ----------------------------------------------------------------------

/**
 * POST /api/organizations/:organizationId/forms/:formId/fields
 * Corpo: { campo, tabela, sequencia }
 */
export async function createOrganizationFormField(organizationId, formId, payload) {
  if (!organizationId || !formId) {
    throw new Error('organizationId e formId são obrigatórios');
  }
  const res = await axios.post(
    endpoints.organization.formFields(organizationId, formId),
    payload
  );
  return res.data?.data?.field ?? res.data;
}

// ----------------------------------------------------------------------

/**
 * PATCH /api/organizations/:organizationId/forms/:formId/fields/:fieldId
 * Corpo: { campo?, tabela?, sequencia? }
 */
export async function patchOrganizationFormField(organizationId, formId, fieldId, payload) {
  if (!organizationId || !formId || !fieldId) {
    throw new Error('organizationId, formId e fieldId são obrigatórios');
  }
  await axios.patch(
    endpoints.organization.formField(organizationId, formId, fieldId),
    payload
  );
}

// ----------------------------------------------------------------------

/**
 * DELETE /api/organizations/:organizationId/forms/:formId/fields/:fieldId
 */
export async function deleteOrganizationFormField(organizationId, formId, fieldId) {
  if (!organizationId || !formId || !fieldId) {
    throw new Error('organizationId, formId e fieldId são obrigatórios');
  }
  await axios.delete(endpoints.organization.formField(organizationId, formId, fieldId));
}
