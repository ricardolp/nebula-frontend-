/**
 * Configuração de widget por campo do Business Partner.
 * Define quais campos usam máscara (CPF, CNPJ, CEP, telefone), combobox (select), data, número, email, checkbox.
 *
 * widget: 'text' | 'mask_cpf' | 'mask_cnpj' | 'mask_cep' | 'mask_phone' | 'date' | 'select' | 'number' | 'email' | 'checkbox'
 * options: apenas para widget === 'select' → [{ value, label }]
 *
 * Funções de máscara centralizadas: src/lib/masks.js (formatCep, formatCpf, formatCnpj, formatPhone).
 */

export const WIDGET_TYPES = {
  TEXT: 'text',
  MASK_CPF: 'mask_cpf',
  MASK_CNPJ: 'mask_cnpj',
  MASK_CEP: 'mask_cep',
  MASK_PHONE: 'mask_phone',
  DATE: 'date',
  SELECT: 'select',
  NUMBER: 'number',
  EMAIL: 'email',
  CHECKBOX: 'checkbox',
};

// ----------------------------------------------------------------------
// Opções para combobox (select)
// ----------------------------------------------------------------------

export const SELECT_OPTIONS = {
  tipo: [
    { value: 'PF', label: 'Pessoa Física' },
    { value: 'PJ', label: 'Pessoa Jurídica' },
  ],
  funcao: [
    { value: 'C', label: 'Cliente' },
    { value: 'F', label: 'Fornecedor' },
    { value: 'A', label: 'Cliente e Fornecedor' },
  ],
  sexo: [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
    { value: 'O', label: 'Outro' },
  ],
  cond_pgto: [
    { value: '001', label: 'À vista' },
    { value: '030', label: '30 dias' },
    { value: '060', label: '60 dias' },
    { value: '090', label: '90 dias' },
  ],
  form_pgto: [
    { value: 'B', label: 'Boleto' },
    { value: 'T', label: 'Transferência' },
    { value: 'C', label: 'Cartão' },
    { value: 'D', label: 'Débito' },
  ],
  moeda_cliente: [
    { value: 'BRL', label: 'BRL' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
  ],
  moeda_pedido: [
    { value: 'BRL', label: 'BRL' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
  ],
  pais: [
    { value: 'BR', label: 'Brasil' },
    { value: 'AR', label: 'Argentina' },
    { value: 'UY', label: 'Uruguai' },
    { value: 'PY', label: 'Paraguai' },
  ],
  estado: [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'PR', label: 'Paraná' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'TO', label: 'Tocantins' },
  ],
  verificar_fatura_duplicada: [
    { value: 'S', label: 'Sim' },
    { value: 'N', label: 'Não' },
  ],
  optante_simples: [
    { value: 'S', label: 'Sim' },
    { value: 'N', label: 'Não' },
  ],
  simples_nacional: [
    { value: 'S', label: 'Sim' },
    { value: 'N', label: 'Não' },
  ],
  tipo_nfe: [
    { value: '55', label: 'NF-e' },
    { value: '65', label: 'NFC-e' },
  ],
  regime_pis_cofins: [
    { value: '1', label: 'Regime Normal' },
    { value: '2', label: 'Simples Nacional' },
  ],
  tipo_imposto: [
    { value: 'ICMS', label: 'ICMS' },
    { value: 'ISENTO', label: 'Isento' },
  ],
  recebedor_alternativo: [
    { value: 'S', label: 'Sim' },
    { value: 'N', label: 'Não' },
  ],
  xblocked: [
    { value: 'S', label: 'Sim (bloqueado)' },
    { value: 'N', label: 'Não' },
  ],
  check_relevant: [
    { value: 'S', label: 'Sim' },
    { value: 'N', label: 'Não' },
  ],
};

// ----------------------------------------------------------------------
// Mapa: campo → { widget, options? }
// Campos não listados = text
// ----------------------------------------------------------------------

const FIELD_WIDGET_MAP = {
  // ---------- Máscaras ----------
  cpf: { widget: WIDGET_TYPES.MASK_CPF },
  cnpj: { widget: WIDGET_TYPES.MASK_CNPJ },
  cpf_favorecido: { widget: WIDGET_TYPES.MASK_CPF },
  cep: { widget: WIDGET_TYPES.MASK_CEP },
  telefone: { widget: WIDGET_TYPES.MASK_PHONE },
  telefone2: { widget: WIDGET_TYPES.MASK_PHONE },
  telefone3: { widget: WIDGET_TYPES.MASK_PHONE },
  celular: { widget: WIDGET_TYPES.MASK_PHONE },

  // ---------- Data ----------
  data_nascimento: { widget: WIDGET_TYPES.DATE },
  data_fundacao: { widget: WIDGET_TYPES.DATE },
  data_nascimento_fundacao: { widget: WIDGET_TYPES.DATE },
  validade_inicio: { widget: WIDGET_TYPES.DATE },
  validade_fim: { widget: WIDGET_TYPES.DATE },
  limit_valid_date: { widget: WIDGET_TYPES.DATE },
  date_from: { widget: WIDGET_TYPES.DATE },
  date_to: { widget: WIDGET_TYPES.DATE },
  date_follow_up: { widget: WIDGET_TYPES.DATE },
  follow_up_dt: { widget: WIDGET_TYPES.DATE },
  valid_date_from: { widget: WIDGET_TYPES.DATE },
  valid_date_to: { widget: WIDGET_TYPES.DATE },

  // ---------- Combobox (select) ----------
  tipo: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.tipo },
  funcao: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.funcao },
  sexo: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.sexo },
  cond_pgto: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.cond_pgto },
  condPgto: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.cond_pgto },
  form_pgto: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.form_pgto },
  formPgto: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.form_pgto },
  verificarFaturaDuplicada: {
    widget: WIDGET_TYPES.SELECT,
    options: SELECT_OPTIONS.verificar_fatura_duplicada,
  },
  moeda_cliente: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.moeda_cliente },
  moedaCliente: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.moeda_cliente },
  moeda_pedido: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.moeda_pedido },
  moedaPedido: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.moeda_pedido },
  pais: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.pais },
  estado: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.estado },
  verificar_fatura_duplicada: {
    widget: WIDGET_TYPES.SELECT,
    options: SELECT_OPTIONS.verificar_fatura_duplicada,
  },
  optante_simples: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.optante_simples },
  optanteSimples: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.optante_simples },
  simples_nacional: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.simples_nacional },
  simplesNacional: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.simples_nacional },
  tipo_nfe: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.tipo_nfe },
  tipoNfe: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.tipo_nfe },
  regime_pis_cofins: {
    widget: WIDGET_TYPES.SELECT,
    options: SELECT_OPTIONS.regime_pis_cofins,
  },
  regimePisCofins: {
    widget: WIDGET_TYPES.SELECT,
    options: SELECT_OPTIONS.regime_pis_cofins,
  },
  tipo_imposto: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.tipo_imposto },
  tipoImposto: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.tipo_imposto },
  recebedor_alternativo: {
    widget: WIDGET_TYPES.SELECT,
    options: SELECT_OPTIONS.recebedor_alternativo,
  },
  xblocked: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.xblocked },
  check_relevant: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.check_relevant },

  // ---------- Checkbox ----------
  devolucao: { widget: WIDGET_TYPES.CHECKBOX },
  revFatBasEm: { widget: WIDGET_TYPES.CHECKBOX },
  revFatBasServ: { widget: WIDGET_TYPES.CHECKBOX },
  relevanteLiquidacao: { widget: WIDGET_TYPES.CHECKBOX },
  pedidoAutom: { widget: WIDGET_TYPES.CHECKBOX },
  compensacao: { widget: WIDGET_TYPES.CHECKBOX },
  agrupamentoOrdens: { widget: WIDGET_TYPES.CHECKBOX },
  vendasRelevanteliquidacao: { widget: WIDGET_TYPES.CHECKBOX },
  relevanteCrr: { widget: WIDGET_TYPES.CHECKBOX },

  // ---------- Número ----------
  cod_banco: { widget: WIDGET_TYPES.NUMBER },
  codBanco: { widget: WIDGET_TYPES.NUMBER },
  cod_agencia: { widget: WIDGET_TYPES.NUMBER },
  dig_agencia: { widget: WIDGET_TYPES.NUMBER },
  cod_conta: { widget: WIDGET_TYPES.NUMBER },
  dig_conta: { widget: WIDGET_TYPES.NUMBER },
  numero: { widget: WIDGET_TYPES.NUMBER },
  credit_limit: { widget: WIDGET_TYPES.NUMBER },
  creditLimit: { widget: WIDGET_TYPES.NUMBER },
  amount: { widget: WIDGET_TYPES.NUMBER },
  checkRelevant: { widget: WIDGET_TYPES.SELECT, options: SELECT_OPTIONS.check_relevant },

  // ---------- Email ----------
  email: { widget: WIDGET_TYPES.EMAIL },
};

/**
 * Retorna a configuração de widget para um campo (por nome do campo).
 * @param {string} campo - Nome do campo (ex: 'cpf', 'tipo', 'data_nascimento')
 * @returns {{ widget: string, options?: Array<{ value, label }> }}
 */
export function getFieldWidgetConfig(campo) {
  return FIELD_WIDGET_MAP[campo] ?? { widget: WIDGET_TYPES.TEXT };
}

/**
 * Lista resumida para documentação: campos com máscara, combobox e data.
 */
export const FIELDS_BY_WIDGET = {
  mask_cpf: ['cpf', 'cpf_favorecido'],
  mask_cnpj: ['cnpj'],
  mask_cep: ['cep'],
  mask_phone: ['telefone', 'telefone2', 'telefone3', 'celular'],
  date: [
    'data_nascimento',
    'data_fundacao',
    'valid_date_from',
    'valid_date_to',
    'limit_valid_date',
    'follow_up_dt',
    'date_from',
    'date_to',
    'date_follow_up',
  ],
  select: [
    'tipo',
    'funcao',
    'sexo',
    'cond_pgto',
    'form_pgto',
    'moeda_cliente',
    'moeda_pedido',
    'pais',
    'estado',
    'verificar_fatura_duplicada',
    'optante_simples',
    'simples_nacional',
    'tipo_nfe',
    'regime_pis_cofins',
    'tipo_imposto',
    'recebedor_alternativo',
    'xblocked',
    'check_relevant',
  ],
  number: [
    'cod_banco',
    'cod_agencia',
    'dig_agencia',
    'cod_conta',
    'dig_conta',
    'numero',
    'credit_limit',
    'amount',
  ],
  email: ['email'],
};
