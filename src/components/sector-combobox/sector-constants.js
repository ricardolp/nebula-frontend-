// Setor de Atividade
// Match code / tabela SAP: T016T
export const SECTOR_OPTIONS = [
  { code: '00', label: 'Coluna produtos 00' },
  { code: '01', label: 'Família produtos 01' },
  { code: '10', label: 'Insumos' },
  { code: '20', label: 'Varejo' },
  { code: '30', label: 'Grãos' },
  { code: '40', label: 'Combustível' },
  { code: '50', label: 'Outros' },
  { code: '60', label: 'Serviços' },
  { code: '70', label: 'Leite' },
  { code: 'GR', label: 'Setor Ativ. GR' },
  { code: 'TR', label: 'Setor Transf.Centros' },
];

export function searchSectorOptions(searchTerm) {
  if (!searchTerm) return SECTOR_OPTIONS;
  const term = searchTerm.toLowerCase();
  return SECTOR_OPTIONS.filter(
    (option) =>
      option.code.toLowerCase().includes(term) ||
      option.label.toLowerCase().includes(term)
  );
}

export function getSectorLabel(code) {
  const option = SECTOR_OPTIONS.find((opt) => opt.code === code);
  return option ? `${option.code} - ${option.label}` : code;
}

export function getSectorCode(value) {
  if (!value) return '';
  if (typeof value !== 'string' || !value.includes(' - ')) return value;
  return value.split(' - ')[0];
}
