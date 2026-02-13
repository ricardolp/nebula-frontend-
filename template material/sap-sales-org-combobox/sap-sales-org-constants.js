// ----------------------------------------------------------------------
// Opções de Organizações de Vendas para SAP
// ----------------------------------------------------------------------

export const SAP_SALES_ORG_OPTIONS = [
  { value: '0001', label: '0001 - Orgiz.vendas 001' },
  { value: '0003', label: '0003' },
  { value: '1401', label: '1401 - Org.Vend Cotrijal' },
  { value: '1402', label: '1402 - Org.Vend Transportes' },
  { value: '1410', label: '1410 - Org.vendas nac.BR' },
  { value: '14TR', label: '14TR - Org.Transfer.Centros' },
  { value: '1510', label: '1510 - Org.vendas nac.BR' },
  { value: '1710', label: '1710 - Org.vendas nac.US' },
  { value: 'GRBR', label: 'GRBR - Org.vendas GRBR' },
];

// Função para buscar organizações de vendas por termo
export const searchSapSalesOrgOptions = (searchTerm) => {
  if (!searchTerm) return SAP_SALES_ORG_OPTIONS;
  
  const term = searchTerm.toLowerCase();
  return SAP_SALES_ORG_OPTIONS.filter(option => 
    option.value.toLowerCase().includes(term) || 
    option.label.toLowerCase().includes(term)
  );
};

// Função para obter label da organização de vendas pelo valor
export const getSapSalesOrgLabel = (value) => {
  const option = SAP_SALES_ORG_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : value;
};

// Função para obter apenas o código da organização de vendas
export const getSapSalesOrgCode = (value) => {
  const option = SAP_SALES_ORG_OPTIONS.find(opt => opt.value === value);
  return option ? option.value : value;
};
