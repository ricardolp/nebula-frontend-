import { apiBaseUrl } from '@/config/api'

/** Form field as returned by the API */
export interface FormField {
  id: string
  formId: string
  campo: string
  tabela: string
  sequencia: number
  createdAt: string
  updatedAt: string
}

/** Form as returned by the API (may include fields) */
export interface Form {
  id: string
  organizationId: string
  name: string
  createdAt: string
  updatedAt: string
  fields?: FormField[]
}

export interface ListFormsResponse {
  success: true
  data: {
    forms: Form[]
  }
}

export interface GetFormResponse {
  success: true
  data: {
    form: Form
  }
}

export interface CreateFormPayload {
  name: string
}

export interface UpdateFormPayload {
  name?: string
}

export interface CreateFormFieldPayload {
  campo: string
  tabela: string
  sequencia: number
}

export interface UpdateFormFieldPayload {
  campo?: string
  tabela?: string
  sequencia?: number
}

function getError(data: unknown): string {
  const obj = data as { error?: { message?: string }; message?: string }
  return obj?.error?.message ?? obj?.message ?? 'Request failed'
}

/**
 * GET /api/organizations/:organizationId/forms
 * Desativado para evitar CORS - retorna lista vazia
 */
export async function getForms(
  _organizationId: string,
  _token: string
): Promise<ListFormsResponse> {
  return { success: true, data: { forms: [] } }
}

/**
 * GET /api/organizations/:organizationId/forms/:formId
 * Desativado para evitar CORS - retorna formulário vazio
 */
export async function getForm(
  _organizationId: string,
  formId: string,
  _token: string
): Promise<GetFormResponse> {
  return {
    success: true,
    data: {
      form: {
        id: formId,
        organizationId: '',
        name: '',
        createdAt: '',
        updatedAt: '',
        fields: [],
      },
    },
  }
}

/**
 * POST /api/organizations/:organizationId/forms
 */
export async function createForm(
  organizationId: string,
  payload: CreateFormPayload,
  token: string
): Promise<{ success: boolean; data?: { form: Form } }> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/forms`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(getError(data))
  }

  return data
}

/**
 * PATCH /api/organizations/:organizationId/forms/:formId
 */
export async function patchForm(
  organizationId: string,
  formId: string,
  payload: UpdateFormPayload,
  token: string
): Promise<{ success: boolean }> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/forms/${formId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(getError(data))
  }

  return data as { success: boolean }
}

/**
 * DELETE /api/organizations/:organizationId/forms/:formId
 */
export async function deleteForm(
  organizationId: string,
  formId: string,
  token: string
): Promise<void> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/forms/${formId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(getError(data))
  }
}

/**
 * GET /api/organizations/:organizationId/forms/:formId/fields
 * Desativado para evitar CORS - retorna lista vazia
 */
export async function getFormFields(
  _organizationId: string,
  _formId: string,
  _token: string
): Promise<{ success: true; data: { fields: FormField[] } }> {
  return { success: true, data: { fields: [] } }
}

/**
 * POST /api/organizations/:organizationId/forms/:formId/fields
 */
export async function createFormField(
  organizationId: string,
  formId: string,
  payload: CreateFormFieldPayload,
  token: string
): Promise<{ success: boolean; data?: { field: FormField } }> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/forms/${formId}/fields`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(getError(data))
  }

  return data
}

/**
 * PATCH /api/organizations/:organizationId/forms/:formId/fields/:fieldId
 */
export async function patchFormField(
  organizationId: string,
  formId: string,
  fieldId: string,
  payload: UpdateFormFieldPayload,
  token: string
): Promise<{ success: boolean }> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/forms/${formId}/fields/${fieldId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(getError(data))
  }

  return data as { success: boolean }
}

/**
 * DELETE /api/organizations/:organizationId/forms/:formId/fields/:fieldId
 */
export async function deleteFormField(
  organizationId: string,
  formId: string,
  fieldId: string,
  token: string
): Promise<void> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/forms/${formId}/fields/${fieldId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(getError(data))
  }
}
