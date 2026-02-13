import { useState, useCallback, useEffect } from 'react';
import axios, { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/materials
 * Params: page, limit, matl_type, status
 * Resposta: { success, data: { materials: [], pagination: { total, page, limit } } }
 */
export async function getOrganizationMaterials(organizationId, params = {}) {
  if (!organizationId) {
    return { materials: [], pagination: { total: 0, page: 1, limit: 10 } };
  }

  const { page = 1, limit = 10, matl_type, status } = params;
  const query = new URLSearchParams({ page, limit });
  if (matl_type) query.set('matl_type', matl_type);
  if (status !== undefined && status !== null) query.set('status', status);

  const res = await axios.get(
    `${endpoints.organization.materials(organizationId)}?${query.toString()}`
  );
  const data = res.data;

  if (data?.success && data?.data) {
    return {
      materials: Array.isArray(data.data.materials) ? data.data.materials : data.data.data || [],
      pagination: data.data.pagination || { total: 0, page: 1, limit: 10 },
    };
  }

  return { materials: [], pagination: { total: 0, page: 1, limit: 10 } };
}

// ----------------------------------------------------------------------

/**
 * GET /api/organizations/:organizationId/materials/:materialId
 */
export async function getOrganizationMaterial(organizationId, materialId) {
  if (!organizationId || !materialId) {
    throw new Error('organizationId e materialId são obrigatórios');
  }

  const res = await axios.get(
    endpoints.organization.material(organizationId, materialId)
  );
  const data = res.data;

  if (data?.success && data?.data?.material) return data.data.material;
  if (data?.data?.material) return data.data.material;
  if (data?.data) return data.data;

  throw new Error(data?.message || 'Material não encontrado');
}

// ----------------------------------------------------------------------

/**
 * POST /api/organizations/:organizationId/materials
 */
export async function createMaterial(organizationId, payload) {
  if (!organizationId) throw new Error('organizationId é obrigatório');

  const res = await axios.post(
    endpoints.organization.materials(organizationId),
    payload
  );
  const data = res.data;

  if (data?.success) return { success: true, data: data.data };
  if (data?.data) return { success: true, data: data.data };
  return { success: false, error: data?.message || 'Erro ao criar material' };
}

// ----------------------------------------------------------------------

/**
 * PUT /api/organizations/:organizationId/materials/:materialId
 */
export async function updateMaterial(organizationId, materialId, payload) {
  if (!organizationId || !materialId) {
    return { success: false, error: 'organizationId e materialId são obrigatórios' };
  }

  try {
    const res = await axios.put(
      endpoints.organization.material(organizationId, materialId),
      payload
    );
    const data = res.data;
    if (data?.success || data?.data) return { success: true, data: data?.data };
    return { success: false, error: data?.message || 'Erro ao atualizar material' };
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'Erro ao atualizar material';
    return { success: false, error: msg };
  }
}

// ----------------------------------------------------------------------

/**
 * DELETE /api/organizations/:organizationId/materials/:materialId
 */
export async function deleteMaterial(organizationId, materialId) {
  if (!organizationId || !materialId) {
    return { success: false, error: 'organizationId e materialId são obrigatórios' };
  }

  try {
    await axios.delete(
      endpoints.organization.material(organizationId, materialId)
    );
    return { success: true };
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'Erro ao excluir material';
    return { success: false, error: msg };
  }
}

// ----------------------------------------------------------------------

/**
 * PATCH /api/organizations/:organizationId/materials/:materialId (toggle status)
 */
export async function toggleMaterialStatus(organizationId, materialId, active) {
  if (!organizationId || !materialId) {
    return { success: false, error: 'organizationId e materialId são obrigatórios' };
  }

  try {
    const res = await axios.patch(
      endpoints.organization.material(organizationId, materialId),
      { isActive: active }
    );
    const data = res.data;
    if (data?.success || data?.data) return { success: true };
    return { success: false, error: data?.message || 'Erro ao atualizar status' };
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'Erro ao atualizar status';
    return { success: false, error: msg };
  }
}

// ----------------------------------------------------------------------

/**
 * POST /api/organizations/:organizationId/materials/:materialId/send-sap
 */
export async function sendMaterialToSap(organizationId, materialId) {
  if (!organizationId || !materialId) {
    throw new Error('organizationId e materialId são obrigatórios');
  }

  const res = await axios.post(
    endpoints.organization.materialSendSap(organizationId, materialId)
  );
  const data = res.data;

  return {
    success: !!data?.success,
    message: data?.message || data?.data?.message,
    error: data?.error || data?.sapError,
    fullError: data?.fullError || data?.data?.fullError,
    status: data?.status,
  };
}

// ----------------------------------------------------------------------
// Hooks (usam organizationId do contexto de auth)
// ----------------------------------------------------------------------

export function useGetMaterials(apiParams = {}) {
  const { selectedOrganizationId: organizationId } = useAuthContext();
  const [materials, setMaterials] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [materialsError, setMaterialsError] = useState(null);

  const load = useCallback(() => {
    if (!organizationId) {
      setMaterials([]);
      setPagination({ total: 0, page: 1, limit: 10 });
      setMaterialsLoading(false);
      return;
    }
    setMaterialsLoading(true);
    setMaterialsError(null);
    getOrganizationMaterials(organizationId, apiParams)
      .then(({ materials: list, pagination: pag }) => {
        setMaterials(list || []);
        setPagination(pag || { total: 0, page: 1, limit: 10 });
      })
      .catch((err) => {
        setMaterialsError(err?.message || 'Erro ao carregar materiais');
        setMaterials([]);
      })
      .finally(() => setMaterialsLoading(false));
  }, [organizationId, apiParams?.page, apiParams?.limit, apiParams?.matl_type, apiParams?.status]);

  useEffect(() => {
    load();
  }, [load]);

  return { materials, pagination, materialsLoading, materialsError, refetch: load };
}

export function useGetMaterial(id) {
  const { selectedOrganizationId: organizationId } = useAuthContext();
  const [material, setMaterial] = useState(null);
  const [materialLoading, setMaterialLoading] = useState(!!id);
  const [materialError, setMaterialError] = useState(null);

  useEffect(() => {
    if (!id || !organizationId) {
      setMaterial(null);
      setMaterialLoading(false);
      return;
    }
    setMaterialLoading(true);
    setMaterialError(null);
    getOrganizationMaterial(organizationId, id)
      .then(setMaterial)
      .catch((err) => {
        setMaterialError(err?.message || 'Material não encontrado');
        setMaterial(null);
      })
      .finally(() => setMaterialLoading(false));
  }, [id, organizationId]);

  return { material, materialLoading, materialError };
}
