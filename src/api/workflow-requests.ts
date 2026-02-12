import { apiBaseUrl } from '@/config/api'

/** Workflow ref inside request */
export interface WorkflowRequestWorkflowRef {
  id: string
  name: string
  type: string
  action: string
}

/** User ref (submittedBy) */
export interface WorkflowRequestUserRef {
  id: string
  email: string
  name: string
}

/** Step approval record inside request */
export interface WorkflowRequestStepRecord {
  id: string
  workflowRequestId: string
  workflowStepId: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: string | null
  approvedAt?: string | null
  comments?: string | null
  createdAt?: string
  updatedAt?: string
  workflowStep: {
    id: string
    workflowId: string
    formId?: string
    organizationRoleId?: string
    order: number
    previousStepId?: string | null
    createdAt?: string
    updatedAt?: string
    form?: { id: string; name: string; entity?: string; status?: string }
    organizationRole?: { id: string; name: string; slug: string; permissions?: string[] }
  }
}

/** Workflow request as returned by the API */
export interface WorkflowRequest {
  id: string
  workflowId: string
  organizationId: string
  submittedBy: string
  currentStepOrder: number
  status: 'pending' | 'approved' | 'rejected'
  payload: Record<string, unknown>
  titulo?: string
  descricao?: string
  motivo?: string
  prioridade?: string
  slaDueAt?: string | null
  workflow?: WorkflowRequestWorkflowRef
  submittedByUser?: WorkflowRequestUserRef
  steps?: WorkflowRequestStepRecord[]
  createdAt?: string
  updatedAt?: string
}

/** Filter for list: all | pending_my_approval (aguardam meu perfil) | submitted_by_me (que eu enviei) */
export type WorkflowRequestsListFilter = 'all' | 'pending_my_approval' | 'submitted_by_me'

export interface ListWorkflowRequestsParams {
  filter?: WorkflowRequestsListFilter
  workflowId?: string
  status?: 'pending' | 'approved' | 'rejected'
  skip?: number
  take?: number
}


export interface ListWorkflowRequestsResponse {
  success: true
  data: {
    requests: WorkflowRequest[]
    total?: number
  }
}

export interface GetWorkflowRequestResponse {
  success: true
  data: {
    request: WorkflowRequest
  }
}

export interface CreateWorkflowRequestPayload {
  workflowId: string
  payload: Record<string, unknown>
}

export interface ApproveWorkflowRequestPayload {
  workflowStepId: string
  status: 'approved' | 'rejected'
  comments?: string
}

function getError(data: unknown): string {
  const obj = data as { error?: { message?: string }; message?: string }
  return obj?.error?.message ?? obj?.message ?? 'Request failed'
}

/**
 * GET /api/organizations/:organizationId/workflow-requests
 */
export async function getWorkflowRequests(
  organizationId: string,
  params: ListWorkflowRequestsParams,
  token: string
): Promise<ListWorkflowRequestsResponse> {
  const url = new URL(
    `${apiBaseUrl}/api/organizations/${organizationId}/workflow-requests`
  )
  url.searchParams.set('filter', params.filter ?? 'all')
  if (params.workflowId) url.searchParams.set('workflowId', params.workflowId)
  if (params.status) url.searchParams.set('status', params.status)
  if (params.skip != null) url.searchParams.set('skip', String(params.skip))
  if (params.take != null) url.searchParams.set('take', String(params.take))

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(getError(data))
  }

  if (!(data as ListWorkflowRequestsResponse)?.success || !(data as ListWorkflowRequestsResponse)?.data?.requests) {
    throw new Error('Invalid workflow requests response')
  }

  return data as ListWorkflowRequestsResponse
}

/**
 * GET /api/organizations/:organizationId/workflow-requests/:requestId
 */
export async function getWorkflowRequest(
  organizationId: string,
  requestId: string,
  token: string
): Promise<GetWorkflowRequestResponse> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/workflow-requests/${requestId}`,
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

  if (!(data as GetWorkflowRequestResponse)?.success || !(data as GetWorkflowRequestResponse)?.data?.request) {
    throw new Error('Invalid workflow request response')
  }

  return data as GetWorkflowRequestResponse
}

/**
 * POST /api/organizations/:organizationId/workflow-requests
 */
export async function createWorkflowRequest(
  organizationId: string,
  payload: CreateWorkflowRequestPayload,
  token: string
): Promise<{ success: boolean; data?: { request: WorkflowRequest } }> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/workflow-requests`,
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
 * PATCH /api/organizations/:organizationId/workflow-requests/:requestId/approve
 */
export async function approveWorkflowRequest(
  organizationId: string,
  requestId: string,
  payload: ApproveWorkflowRequestPayload,
  token: string
): Promise<{ success: boolean }> {
  const res = await fetch(
    `${apiBaseUrl}/api/organizations/${organizationId}/workflow-requests/${requestId}/approve`,
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
