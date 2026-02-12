/**
 * Converte valores do formulário (campos por campo/tabela) no payload esperado pela API do BP.
 * Form: formValues keyed by campo (snake_case); formFields com { campo, tabela }.
 * API: payload em camelCase, aninhado por seção (endereco, comunicacao, etc.).
 *
 * Tabelas que viram objeto único: Address -> endereco, Communication -> comunicacao, etc.
 * Tabelas que viram array de 1 item (formulário plano): PartnerFunction -> funcoesParceiro, etc.
 */

function snakeToCamel(str) {
  if (!str || typeof str !== 'string') return str;
  return str
    .split('_')
    .map((part, i) => (i === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()))
    .join('');
}

/** Tabela -> chave no payload. null = raiz; string = objeto aninhado; string com isArray = array de 1 item */
const TABELA_TO_PATH = {
  BusinessPartner: { key: null, array: false },
  Address: { key: 'endereco', array: false },
  Communication: { key: 'comunicacao', array: false },
  Identification: { key: 'identificacao', array: false },
  IndustrySector: { key: 'setorIndustrial', array: false },
  Payment: { key: 'pagamentos', array: false },
  PartnerFunction: { key: 'funcoesParceiro', array: true },
  AdditionalData: { key: 'dadosAdicionais', array: false },
  Vendor: { key: 'fornecedor', array: false },
  VendorPurchasing: { key: 'fornecedorCompras', array: true },
  VendorCompany: { key: 'fornecedorEmpresas', array: true },
  VendorIRF: { key: 'fornecedorIrf', array: true },
  CustomerSales: { key: 'clienteVendas', array: true },
  CustomerCompany: { key: 'clienteEmpresas', array: true },
  CreditData: { key: 'dadosCredito', array: true },
  CreditCollection: { key: 'collection', array: true },
};

/** VendorPurchasing, VendorCompany, VendorIRF ficam dentro de fornecedor (arrays) */
const NESTED_UNDER_FORNECEDOR = ['VendorPurchasing', 'VendorCompany', 'VendorIRF'];

function getPathForTabela(tabela) {
  const t = (tabela || 'BusinessPartner').trim();
  const def = TABELA_TO_PATH[t];
  if (def) return def;
  return { key: t === 'BusinessPartner' ? null : snakeToCamel(t), array: false };
}

/**
 * Monta o payload para PATCH do BP a partir dos campos do formulário e valores.
 * @param {Array<{ id, campo, tabela }>} formFields - campos do form (campo em snake_case, tabela)
 * @param {Record<string, unknown>} formValues - valores keyed por campo (snake_case)
 * @returns {Record<string, unknown>} payload para PATCH /api/organizations/:orgId/bps/:bpId
 */
export function buildBpPayloadFromForm(formFields, formValues) {
  const payload = {};

  if (!Array.isArray(formFields) || !formValues || typeof formValues !== 'object') {
    return payload;
  }

  for (const field of formFields) {
    const { campo, tabela } = field;
    const value = formValues[campo];
    if (value === undefined) continue;

    const camelKey = snakeToCamel(campo);
    const { key: pathKey, array: isArray } = getPathForTabela(tabela);

    let normalizedValue = value;
    if (value === '' || (typeof value === 'string' && value.trim() === '')) {
      normalizedValue = null;
    } else if (value && typeof value === 'object') {
      if (typeof value.format === 'function') {
        normalizedValue = value.format('YYYY-MM-DD');
      } else if (typeof value.toISOString === 'function') {
        normalizedValue = value.toISOString().slice(0, 10);
      }
    }

    if (pathKey === null) {
      payload[camelKey] = normalizedValue;
      continue;
    }

    if (NESTED_UNDER_FORNECEDOR.includes(tabela)) {
      if (!payload.fornecedor) payload.fornecedor = {};
      const arrKey = pathKey;
      if (!payload.fornecedor[arrKey]) payload.fornecedor[arrKey] = [{}];
      payload.fornecedor[arrKey][0][camelKey] = normalizedValue;
      continue;
    }

    if (isArray) {
      if (!payload[pathKey]) payload[pathKey] = [{}];
      payload[pathKey][0][camelKey] = normalizedValue;
      continue;
    }

    if (!payload[pathKey]) payload[pathKey] = {};
    payload[pathKey][camelKey] = normalizedValue;
  }

  return payload;
}
