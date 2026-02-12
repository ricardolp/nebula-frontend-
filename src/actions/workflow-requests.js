import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/workflow-requests?filter=all|pending_my_approval|submitted_by_me&skip=0&take=20
 * Resposta: { success, data: { requests: [...], total?: number } }
 */
export async function getOrganizationWorkflowRequests(
  organizationId,
  { filter = 'all', workflowId, status, skip = 0, take = 20 } = {}
) {
  if (!organizationId) {
    return { requests: [], total: 0 };
  }

  const params = { filter, skip, take };
  if (workflowId) params.workflowId = workflowId;
  if (status) params.status = status;

  const res = await axios.get(endpoints.organization.workflowRequests(organizationId), {
    params,
  });

  const { success, data } = res.data ?? {};

  if (!success || !data) {
    throw new Error(res.data?.error?.message || res.data?.message || 'Erro ao carregar solicitações');
  }

  return {
    requests: data.requests ?? [],
    total: data.total ?? (data.requests?.length ?? 0),
  };
}

/**
 * GET /api/organizations/:organizationId/workflow-requests/pending-my-approval?skip=0&take=20
 * Retorna solicitações que aguardam aprovação do perfil do usuário logado.
 * Resposta: { success, data: { requests: [...] } }
 */
export async function getOrganizationWorkflowRequestsPendingMyApproval(
  organizationId,
  { skip = 0, take = 20 } = {}
) {
  if (!organizationId) {
    return { requests: [], total: 0 };
  }

  const res = await axios.get(
    endpoints.organization.workflowRequestsPendingMyApproval(organizationId),
    { params: { skip, take } }
  );

  const { success, data } = res.data ?? {};

  if (!success || !data) {
    throw new Error(
      res.data?.error?.message || res.data?.message || 'Erro ao carregar solicitações pendentes'
    );
  }

  return {
    requests: data.requests ?? [],
    total: data.total ?? (data.requests?.length ?? 0),
  };
}

/**
 * GET /api/organizations/:organizationId/workflow-requests/:requestId
 */
export async function getOrganizationWorkflowRequest(organizationId, requestId) {
  if (!organizationId || !requestId) {
    throw new Error('Organização e ID da solicitação são obrigatórios');
  }

  const res = await axios.get(
    endpoints.organization.workflowRequest(organizationId, requestId)
  );

  const { success, data } = res.data ?? {};

  if (!success || !data?.request) {
    throw new Error(
      res.data?.error?.message || res.data?.message || 'Erro ao carregar solicitação'
    );
  }

  return data.request;
}

/**
 * POST /api/organizations/:organizationId/bps
 * Body: {} — cria um BP em draft para reservar o id.
 * Resposta: { success, data: { bp: { id, organizationId, status: 'draft', ... } } }
 */
export async function createOrganizationBp(organizationId) {
  if (!organizationId) {
    throw new Error('Organização é obrigatória');
  }

  const res = await axios.post(endpoints.organization.bps(organizationId), {});

  const { success, data } = res.data ?? {};
  if (!success || !data?.bp) {
    throw new Error(
      res.data?.error?.message || res.data?.message || 'Erro ao criar BP (reservar id)'
    );
  }

  return data.bp;
}

/**
 * PATCH /api/organizations/:organizationId/bps/:bpId
 * Body: campos do BP em camelCase (podem ser parciais).
 * Em erro de validação (4xx), re-lança Error com message da API (ex.: error.message).
 */
export async function patchOrganizationBp(organizationId, bpId, payload) {
  if (!organizationId || !bpId) {
    throw new Error('Organização e ID do BP são obrigatórios');
  }

  try {
    const res = await axios.patch(
      endpoints.organization.bp(organizationId, bpId),
      payload
    );

    const { success, data } = res.data ?? {};
    if (!success) {
      throw new Error(
        res.data?.error?.message || res.data?.message || 'Erro ao atualizar BP'
      );
    }

    return data?.bp ?? data;
  } catch (err) {
    const body = err?.response?.data ?? (typeof err === 'object' && err ? err : {});
    const message =
      body?.error?.message ??
      body?.message ??
      (err instanceof Error ? err.message : null) ??
      'Erro ao atualizar BP';
    throw new Error(message);
  }
}

/**
 * PATCH /api/organizations/:organizationId/workflow-requests/:requestId
 * Body: { bpId } — associa a solicitação ao BP reservado.
 */
export async function updateOrganizationWorkflowRequest(organizationId, requestId, payload) {
  if (!organizationId || !requestId) {
    throw new Error('Organização e ID da solicitação são obrigatórios');
  }

  const res = await axios.patch(
    endpoints.organization.workflowRequest(organizationId, requestId),
    payload
  );

  const { success } = res.data ?? {};
  if (!success) {
    throw new Error(
      res.data?.error?.message || res.data?.message || 'Erro ao atualizar solicitação'
    );
  }

  return res.data?.data?.request ?? res.data;
}

/**
 * POST /api/organizations/:organizationId/workflow-requests
 * Body: { workflowId, titulo, prioridade, descricao, motivo }
 * Fluxo: criar solicitação → criar BP (draft) → atualizar solicitação com bpId.
 */
export async function createOrganizationWorkflowRequest(organizationId, payload) {
  if (!organizationId) {
    throw new Error('Organização é obrigatória');
  }
  if (!payload?.workflowId) {
    throw new Error('Workflow é obrigatório');
  }
  if (!payload?.titulo?.trim()) {
    throw new Error('Título é obrigatório');
  }

  try {
    // 1. Criar solicitação
    const createRes = await axios.post(
      endpoints.organization.workflowRequests(organizationId),
      {
        workflowId: payload.workflowId,
        titulo: payload.titulo?.trim() ?? '',
        prioridade: payload.prioridade ?? 'media',
        descricao: payload.descricao?.trim() ?? '',
        motivo: payload.motivo?.trim() ?? '',
      }
    );

    const { success, data } = createRes.data ?? {};
    if (!success) {
      const msg =
        createRes.data?.error?.message ||
        createRes.data?.message ||
        'Erro ao criar solicitação';
      throw new Error(msg);
    }

    const request = data?.request ?? data;
    const requestId = request?.id;
    if (!requestId) {
      throw new Error('Resposta da criação da solicitação sem id');
    }

    // 2. Criar BP para reservar id (draft)
    const bp = await createOrganizationBp(organizationId);
    if (!bp?.id) {
      throw new Error('Resposta da criação do BP sem id');
    }

    // 3. Atualizar solicitação com bpId
    await updateOrganizationWorkflowRequest(organizationId, requestId, { bpId: bp.id });

    return { ...request, bpId: bp.id };
  } catch (err) {
    const data = err && typeof err === 'object' && !(err instanceof Error) ? err : {};
    const message =
      data?.error?.message ||
      data?.message ||
      (err instanceof Error ? err.message : null) ||
      (typeof err === 'string' ? err : null) ||
      'Erro ao criar solicitação';
    throw new Error(message);
  }
}

/**
 * PATCH /api/organizations/:organizationId/workflow-requests/:requestId/approve
 */
export async function approveOrganizationWorkflowRequest(
  organizationId,
  requestId,
  payload
) {
  if (!organizationId || !requestId) {
    throw new Error('Organização e solicitação são obrigatórios');
  }

  try {
    const url = `${endpoints.organization.workflowRequest(organizationId, requestId)}/approve`;
    const res = await axios.patch(url, payload);

    const { success } = res.data ?? {};
    if (!success && res.data?.error?.message) {
      throw new Error(res.data.error.message);
    }

    return res.data;
  } catch (err) {
    const data = err && typeof err === 'object' && !(err instanceof Error) ? err : {};
    const message =
      data?.error?.message ||
      data?.message ||
      (err instanceof Error ? err.message : null) ||
      (typeof err === 'string' ? err : null) ||
      'Erro ao processar aprovação';
    throw new Error(message);
  }
}
