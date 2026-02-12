/**
 * Visibilidade das abas Compras e Vendas conforme a função do parceiro (estilo SAP Fiori).
 * No SAP, as visões "Purchasing" e "Sales Area" dependem do papel do BP (Vendor FLVN01 / Customer FLCU01).
 *
 * funcao: 'C' = Cliente, 'F' = Fornecedor, 'A' = Cliente e Fornecedor
 */

export const FUNCAO_VALUES = {
  CLIENTE: 'C',
  FORNECEDOR: 'F',
  AMBOS: 'A',
};

/** Abas que dependem da função do parceiro (só estas são filtradas) */
export const PARTNER_FUNCTION_TABS = ['purchases', 'sales'];

/**
 * Indica se a aba "Compras" deve ser exibida para a função informada.
 * Compras = dados de fornecedor (Organização de Compras, etc.)
 */
export function isPurchasesTabVisible(funcao) {
  if (!funcao) return true; // sem função definida: exibe para não esconder abas no cadastro novo
  return funcao === FUNCAO_VALUES.FORNECEDOR || funcao === FUNCAO_VALUES.AMBOS;
}

/**
 * Indica se a aba "Vendas" deve ser exibida para a função informada.
 * Vendas = dados de cliente (Área de Vendas, etc.)
 */
export function isSalesTabVisible(funcao) {
  if (!funcao) return true;
  return funcao === FUNCAO_VALUES.CLIENTE || funcao === FUNCAO_VALUES.AMBOS;
}

/**
 * Retorna a lista de abas filtrada pela função do parceiro.
 * Abas que não dependem de função são sempre incluídas.
 */
export function getVisibleTabs(allTabs, funcao) {
  return allTabs.filter((tab) => {
    if (tab.value === 'purchases') return isPurchasesTabVisible(funcao);
    if (tab.value === 'sales') return isSalesTabVisible(funcao);
    return true;
  });
}
