// ----------------------------------------------------------------------
// Opções de Depósitos/Centros para SAP
// ----------------------------------------------------------------------

export const SAP_DEPOT_OPTIONS = [
  { value: 'AL01', label: 'AL01 - EWM ALMO Entrada' },
  { value: 'AL03', label: 'AL03 - Almox. Estoque' },
  { value: 'D001', label: 'D001 - Depósito' },
  { value: 'DA01', label: 'DA01 - Dep. Armazenagem' },
  { value: 'DAOB', label: 'DAOB - Dep. Armaz Oblig' },
  { value: 'DE01', label: 'DE01 - EWM Recebimento' },
  { value: 'DT01', label: 'DT01 - Dep. transitório' },
  { value: 'DV01', label: 'DV01 - Devoluções' },
  { value: 'E001', label: 'E001 - EWM Venda/Transf' },
  { value: 'E002', label: 'E002 - EWM Almoxarifado' },
  { value: 'MN01', label: 'MN01 - Manut. Produção' },
  { value: 'PI01', label: 'PI01 - Posto Interno' },
  { value: 'RE01', label: 'RE01 - Ret. Embalagem' },
  { value: 'S001', label: 'S001 - Depósito Grãos' },
  { value: 'TD01', label: 'TD01 - INS Trocas' },
  { value: 'TE01', label: 'TE01 - INS Terce/Espec' },
  { value: 'VB01', label: 'VB01 - INS Espec/Venda' },
];

// Função para buscar depósitos por termo
export const searchSapDepotOptions = (searchTerm) => {
  if (!searchTerm) return SAP_DEPOT_OPTIONS;
  
  const term = searchTerm.toLowerCase();
  return SAP_DEPOT_OPTIONS.filter(option => 
    option.value.toLowerCase().includes(term) || 
    option.label.toLowerCase().includes(term)
  );
};

// Função para obter label do depósito pelo valor
export const getSapDepotLabel = (value) => {
  const option = SAP_DEPOT_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : value;
};

// Função para obter apenas o código do depósito
export const getSapDepotCode = (value) => {
  const option = SAP_DEPOT_OPTIONS.find(opt => opt.value === value);
  return option ? option.value : value;
};

// Função para validar se a mensagem de resposta contém número de 18 ou 40 caracteres
export const validateResponseMessage = (message) => {
  if (!message) return false;
  
  // Converter para string se não for
  const messageStr = String(message);
  
  // Encontrar todos os números na mensagem
  const numberRegex = /\d+/g;
  const matches = messageStr.match(numberRegex);
  
  if (!matches) return false;
  
  // Verificar se algum número tem exatamente 18 ou 40 caracteres
  return matches.some(number => number.length === 18 || number.length === 40);
};
