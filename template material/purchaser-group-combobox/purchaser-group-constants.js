/**
 * Constantes e opções para Grupo de Compradores
 */

export const PURCHASER_GROUP_OPTIONS = [
  { code: '001', label: 'Group 001' },
  { code: '002', label: 'Group 002' },
  { code: '003', label: 'Group 003' },
  { code: '005', label: 'Transportation Srv' },
  { code: 'CMM', label: 'Grãos' },
  { code: 'G01', label: 'Compras Padaria' },
  { code: 'G02', label: 'Compras Açougue' },
  { code: 'G03', label: 'Compras Fruteira' },
  { code: 'G04', label: 'Compras Mercearia' },
  { code: 'G05', label: 'Saúde Animal' },
  { code: 'G06', label: 'Mat. Construção' },
  { code: 'G07', label: 'Geral Lojas' },
  { code: 'G08', label: 'Defensivos' },
  { code: 'G09', label: 'Corretivos' },
  { code: 'G10', label: 'Fertilizantes' },
  { code: 'G11', label: 'Leite' },
  { code: 'G12', label: 'Sementes' },
  { code: 'G13', label: 'Mecânica' },
  { code: 'G14', label: 'Elétrica' },
  { code: 'G15', label: 'Civil CIVIL' },
  { code: 'G16', label: 'Serviços Obras' },
  { code: 'G17', label: 'Serviços Gerais' },
  { code: 'G18', label: 'Fab. Ração' },
  { code: 'G19', label: 'Prod. Sementes' },
  { code: 'G20', label: 'Logística' },
  { code: 'G21', label: 'Transportes' },
  { code: 'G22', label: 'TRR' },
  { code: 'G23', label: 'Almox. Central' },
  { code: 'G24', label: 'TI' },
  { code: 'G25', label: 'Fretes TM' },
  { code: 'G26', label: 'Eventos e Viagens' },
];

/**
 * Busca um grupo de compradores pelo código
 * @param {string} code - Código do grupo
 * @returns {Object|null} - Opção encontrada ou null
 */
export function findPurchaserGroupByCode(code) {
  if (!code) return null;
  return PURCHASER_GROUP_OPTIONS.find((opt) => opt.code === code) || null;
}

/**
 * Busca grupos de compradores por termo de busca
 * @param {string} searchTerm - Termo de busca
 * @returns {Array} - Opções filtradas
 */
export function searchPurchaserGroupOptions(searchTerm) {
  if (!searchTerm) return PURCHASER_GROUP_OPTIONS;

  const term = searchTerm.toLowerCase().trim();

  return PURCHASER_GROUP_OPTIONS.filter(
    (option) =>
      option.code.toLowerCase().includes(term) ||
      option.label.toLowerCase().includes(term)
  );
}

