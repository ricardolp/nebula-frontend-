import { apiBaseUrl } from '@/config/api'

/** Form ref inside workflow step */
export interface FormRef {
  id: string
  name: string
}

/** Organization role ref inside workflow step */
export interface WorkflowStepRoleRef {
  id: string
  name: string
  slug: string
}

/** Workflow step as returned by the API */
export interface WorkflowStep {
  id: string
  workflowId: string
  formId: string
  organizationRoleId: string
  order: number
  form?: FormRef
  organizationRole?: WorkflowStepRoleRef
  createdAt?: string
  updatedAt?: string
}

/** Workflow as returned by the API (may include steps) */
export interface Workflow {
  id: string
  organizationId: string
  type: 'material' | 'partner'
  action: 'create' | 'update'
  name?: string
  createdAt: string
  updatedAt: string
  steps?: WorkflowStep[]
}

export interface ListWorkflowsResponse {
  success: true
  data: {
    workflows: Workflow[]
  }
}

export interface GetWorkflowResponse {
  success: true
  data: {
    workflow: Workflow
  }
}

export interface CreateWorkflowPayload {
  type: 'material' | 'partner'
  action: 'create' | 'update'
  name?: string
}

export interface UpdateWorkflowPayload {
  type?: 'material' | 'partner'
  action?: 'create' | 'update'
  name?: string
}

export interface CreateWorkflowStepPayload {
  formId: string
  organizationRoleId: string
  order: number
}

export interface UpdateWorkflowStepPayload {
  formId?: string
  organizationRoleId?: string
  order?: number
}

function getError(data: unknown): string {
  const obj = data as { error?: { message?: string }; message?: string }
  return obj?.error?.message ?? obj?.message ?? 'Request failed'
}

/**
 * GET /api/organizations/:organizationId/workflows
 */
export async function getWorkflows(
  organizationId: string,
  token: string
): Promise<ListWorkflowsResponse> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/workflows`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(getError(data))
  }

  if (!(data as ListWorkflowsResponse)?.success || !(data as ListWorkflowsResponse)?.data?.workflows) {
    throw new Error('Invalid workflows response')
  }

  return data as ListWorkflowsResponse
}

/**
 * GET /api/organizations/:organizationId/workflows/:workflowId
 */
export async function getWorkflow(
  organizationId: string,
  workflowId: string,
  token: string
): Promise<GetWorkflowResponse> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/workflows/${workflowId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(getError(data))
  }

  if (!(data as GetWorkflowResponse)?.success || !(data as GetWorkflowResponse)?.data?.workflow) {
    throw new Error('Invalid workflow response')
  }

  return data as GetWorkflowResponse
}

/**
 * POST /api/organizations/:organizationId/workflows
 */
export async function createWorkflow(
  organizationId: string,
  payload: CreateWorkflowPayload,
  token: string
): Promise<{ success: boolean; data?: { workflow: Workflow } }> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/workflows`,
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
 * PATCH /api/organizations/:organizationId/workflows/:workflowId
 */
export async function patchWorkflow(
  organizationId: string,
  workflowId: string,
  payload: UpdateWorkflowPayload,
  token: string
): Promise<{ success: boolean }> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/workflows/${workflowId}`,
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
 * DELETE /api/organizations/:organizationId/workflows/:workflowId
 */
export async function deleteWorkflow(
  organizationId: string,
  workflowId: string,
  token: string
): Promise<void> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/workflows/${workflowId}`,
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
 * GET /api/organizations/:organizationId/workflows/:workflowId/steps
 */
export async function getWorkflowSteps(
  organizationId: string,
  workflowId: string,
  token: string
): Promise<{ success: true; data: { steps: WorkflowStep[] } }> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/workflows/${workflowId}/steps`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(getError(data))
  }

  if (!(data as { success?: boolean; data?: { steps?: WorkflowStep[] } })?.data?.steps) {
    throw new Error('Invalid workflow steps response')
  }

  return data as { success: true; data: { steps: WorkflowStep[] } }
}

/**
 * POST /api/organizations/:organizationId/workflows/:workflowId/steps
 */
export async function createWorkflowStep(
  organizationId: string,
  workflowId: string,
  payload: CreateWorkflowStepPayload,
  token: string
): Promise<{ success: boolean; data?: { step: WorkflowStep } }> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/workflows/${workflowId}/steps`,
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
 * PATCH /api/organizations/:organizationId/workflows/:workflowId/steps/:stepId
 */
export async function patchWorkflowStep(
  organizationId: string,
  workflowId: string,
  stepId: string,
  payload: UpdateWorkflowStepPayload,
  token: string
): Promise<{ success: boolean }> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/workflows/${workflowId}/steps/${stepId}`,
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
 * DELETE /api/organizations/:organizationId/workflows/:workflowId/steps/:stepId
 */
export async function deleteWorkflowStep(
  organizationId: string,
  workflowId: string,
  stepId: string,
  token: string
): Promise<void> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/workflows/${workflowId}/steps/${stepId}`,
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
