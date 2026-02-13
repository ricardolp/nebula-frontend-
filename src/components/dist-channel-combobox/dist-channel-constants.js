// Canal de Distribuição
// Match code / tabela SAP: TVTWT
export const DIST_CHANNEL_OPTIONS = [
  { code: '01', label: 'Canal distrib.01' },
  { code: '10', label: 'Direto' },
  { code: '20', label: 'Industria' },
  { code: '30', label: 'Expodireto' },
  { code: '40', label: 'Comercial Rações' },
  { code: '50', label: 'Loja 1000 Agrícola' },
  { code: '51', label: 'Loja 2000 Varejo' },
  { code: '52', label: 'Loja 3000 Colab.' },
  { code: '60', label: 'Super 1000 Agícola' },
  { code: '61', label: 'Super 2000 Varejo' },
  { code: '62', label: 'Super 3000 Colab.' },
  { code: '70', label: 'TRR' },
  { code: 'TR', label: 'Transferências' },
  { code: 'VD', label: 'Canal distrib. VD' },
];

export function searchDistChannelOptions(searchTerm) {
  if (!searchTerm) return DIST_CHANNEL_OPTIONS;
  const term = searchTerm.toLowerCase();
  return DIST_CHANNEL_OPTIONS.filter(
    (option) =>
      option.code.toLowerCase().includes(term) ||
      option.label.toLowerCase().includes(term)
  );
}

export function getDistChannelLabel(code) {
  const option = DIST_CHANNEL_OPTIONS.find((opt) => opt.code === code);
  return option ? `${option.code} - ${option.label}` : code;
}

export function getDistChannelCode(value) {
  if (!value) return '';
  if (typeof value !== 'string' || !value.includes(' - ')) return value;
  return value.split(' - ')[0];
}
