// ----------------------------------------------------------------------
// Opções de Canais de Distribuição para SAP
// ----------------------------------------------------------------------

export const SAP_DIST_CHANNEL_OPTIONS = [
  { value: '01', label: '01 - Canal distrib.01' },
  { value: '10', label: '10 - Direto' },
  { value: '20', label: '20 - Industria' },
  { value: '30', label: '30 - Expodireto' },
  { value: '40', label: '40 - Comercial Rações' },
  { value: '50', label: '50 - Loja 1000 Agrícola' },
  { value: '51', label: '51 - Loja 2000 Varejo' },
  { value: '52', label: '52 - Loja 3000 Colab.' },
  { value: '60', label: '60 - Super 1000 Agícola' },
  { value: '61', label: '61 - Super 2000 Varejo' },
  { value: '62', label: '62 - Super 3000 Colab.' },
  { value: '70', label: '70 - TRR' },
  { value: 'TR', label: 'TR - Transferências' },
  { value: 'VD', label: 'VD - Canal distrib. VD' },
];

// Função para buscar canais de distribuição por termo
export const searchSapDistChannelOptions = (searchTerm) => {
  if (!searchTerm) return SAP_DIST_CHANNEL_OPTIONS;
  
  const term = searchTerm.toLowerCase();
  return SAP_DIST_CHANNEL_OPTIONS.filter(option => 
    option.value.toLowerCase().includes(term) || 
    option.label.toLowerCase().includes(term)
  );
};

// Função para obter label do canal de distribuição pelo valor
export const getSapDistChannelLabel = (value) => {
  const option = SAP_DIST_CHANNEL_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : value;
};

// Função para obter apenas o código do canal de distribuição
export const getSapDistChannelCode = (value) => {
  const option = SAP_DIST_CHANNEL_OPTIONS.find(opt => opt.value === value);
  return option ? option.value : value;
};
