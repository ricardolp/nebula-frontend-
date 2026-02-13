// Organização de Vendas
export const SALES_ORG_OPTIONS = [
  { code: '0001', label: 'Orgiz.vendas 001' },
  { code: '0003', label: 'Org.vendas 003' },
  { code: '1401', label: 'Org.Vend Cotrijal' },
  { code: '1402', label: 'Org.Vend Transportes' },
  { code: '1410', label: 'Org.vendas nac.BR' },
  { code: '14TR', label: 'Org.Transfer.Centros' },
  { code: '1510', label: 'Org.vendas nac.BR' },
  { code: '1710', label: 'Org.vendas nac.US' },
  { code: 'GRBR', label: 'Org.vendas GRBR' },
];

export function searchSalesOrgOptions(searchTerm) {
  if (!searchTerm) return SALES_ORG_OPTIONS;
  
  const term = searchTerm.toLowerCase();
  return SALES_ORG_OPTIONS.filter(
    (option) =>
      option.code.toLowerCase().includes(term) ||
      option.label.toLowerCase().includes(term)
  );
}

export function getSalesOrgLabel(code) {
  const option = SALES_ORG_OPTIONS.find((opt) => opt.code === code);
  return option ? `${option.code} - ${option.label}` : code;
}

export function getSalesOrgCode(value) {
  if (!value) return '';
  if (!value.includes(' - ')) return value;
  return value.split(' - ')[0];
}

