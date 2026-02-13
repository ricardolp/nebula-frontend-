// ----------------------------------------------------------------------
// Opções de Tipos de Material para SAP
// ----------------------------------------------------------------------

export const SAP_MATERIAL_TYPE_OPTIONS = [
  { value: 'ABF', label: 'ABF - Resíduo' },
  { value: 'BUND', label: 'BUND - Produto do pacote' },
  { value: 'CBAU', label: 'CBAU - Unidade compatível' },
  { value: 'CH00', label: 'CH00 - Administr.contratos CH' },
  { value: 'CONT', label: 'CONT - Recipiente KANBAN' },
  { value: 'COUP', label: 'COUP - Cupom' },
  { value: 'DIEN', label: 'DIEN - Serviço' },
  { value: 'EPA', label: 'EPA - Pacote do equipamento' },
  { value: 'ERSA', label: 'ERSA - Peças de reposição' },
  { value: 'FERT', label: 'FERT - Produto acabado' },
  { value: 'FFFC', label: 'FFFC - Classe form-fit-function' },
  { value: 'FGTR', label: 'FGTR - Bebidas' },
  { value: 'FHMI', label: 'FHMI - Meio auxiliar de produção' },
  { value: 'FOOD', label: 'FOOD - Prod.alim.(excl.prd.per.)' },
  { value: 'FRIP', label: 'FRIP - Produtos perecíveis' },
  { value: 'GBRA', label: 'GBRA - ETM material utilizável' },
  { value: 'HALB', label: 'HALB - Produto semiacabado' },
  { value: 'HAWA', label: 'HAWA - Produto comercializável' },
  { value: 'HERB', label: 'HERB - Material substituível' },
  { value: 'HERS', label: 'HERS - Peça do fabricante' },
  { value: 'HIBE', label: 'HIBE - Mat.aux./de consumo' },
  { value: 'IBAU', label: 'IBAU - Conjunto de manutenção' },
  { value: 'INTR', label: 'INTR - Intramaterial' },
  { value: 'IWIP', label: 'IWIP - Material em processo' },
  { value: 'KMAT', label: 'KMAT - Materiais configuráveis' },
  { value: 'LEER', label: 'LEER - Vasilhame' },
  { value: 'LEIH', label: 'LEIH - Embalagem retornável' },
  { value: 'LGUT', label: 'LGUT - Vasilhame admin.mercad.' },
  { value: 'MAT', label: 'MAT - Material geral' },
  { value: 'MODE', label: 'MODE - Moda (sazonal)' },
  { value: 'MPO', label: 'MPO - Obj.planej.material' },
  { value: 'NLAG', label: 'NLAG - Material não estocável' },
  { value: 'NOF1', label: 'NOF1 - Produtos não alimentícios' },
  { value: 'PIPE', label: 'PIPE - Materiais pipeline' },
  { value: 'PLAN', label: 'PLAN - Prod.comercial (planej.)' },
  { value: 'PROC', label: 'PROC - Material de processo' },
  { value: 'PROD', label: 'PROD - Grupo de produtos' },
  { value: 'ROH', label: 'ROH - Matérias-primas' },
  { value: 'SERV', label: 'SERV - Produto de serviços' },
  { value: 'SUBC', label: 'SUBC - Prod.compart.assinatura' },
  { value: 'SUBP', label: 'SUBP - Prod.parceiro assinatura' },
  { value: 'SUBS', label: 'SUBS - Produto de assinatura' },
  { value: 'SWNV', label: 'SWNV - Software não avaliado' },
  { value: 'UNBW', label: 'UNBW - Material não avaliado' },
  { value: 'VBRA', label: 'VBRA - ETM material de consumo' },
  { value: 'VEHI', label: 'VEHI - Configuração de veículo' },
  { value: 'VERP', label: 'VERP - Embalagens' },
  { value: 'VKHM', label: 'VKHM - Meio auxiliar de vendas' },
  { value: 'VOLL', label: 'VOLL - Produto' },
  { value: 'VVGR', label: 'VVGR - Produto concorrente' },
  { value: 'WERB', label: 'WERB - Material publicitário' },
  { value: 'WERT', label: 'WERT - Material de valor' },
  { value: 'WETT', label: 'WETT - Produto concorrente' },
  { value: 'ZCOM', label: 'ZCOM - Commodities' },
  { value: 'ZROH', label: 'ZROH - Matérias-primas' },
  { value: 'ZRSA', label: 'ZRSA - Peças de reposição' },
];

// Função para buscar tipos de material por termo
export const searchSapMaterialTypeOptions = (searchTerm) => {
  if (!searchTerm) return SAP_MATERIAL_TYPE_OPTIONS;
  
  const term = searchTerm.toLowerCase();
  return SAP_MATERIAL_TYPE_OPTIONS.filter(option => 
    option.value.toLowerCase().includes(term) || 
    option.label.toLowerCase().includes(term)
  );
};

// Função para obter label do tipo de material pelo valor
export const getSapMaterialTypeLabel = (value) => {
  const option = SAP_MATERIAL_TYPE_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : value;
};

// Função para obter apenas o código do tipo de material
export const getSapMaterialTypeCode = (value) => {
  const option = SAP_MATERIAL_TYPE_OPTIONS.find(opt => opt.value === value);
  return option ? option.value : value;
};
