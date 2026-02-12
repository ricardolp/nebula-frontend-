import { z as zod } from 'zod';

// ----------------------------------------------------------------------

/**
 * Schema de validação para o formulário de parceiros de negócio
 * Inclui todas as 13 seções com validações específicas
 */
export const businessPartnerFormSchema = zod.object({
  // 1. Informações Gerais
  cod_antigo: zod
    .string()
    .min(1, 'Código antigo é obrigatório')
    .max(50, 'Código antigo deve ter no máximo 50 caracteres')
    .trim(),

  tipo: zod
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || ['SOCI', 'TERC'].includes(val), {
      message: 'Tipo inválido',
    }),

  funcao: zod
    .string()
    .min(1, 'Função é obrigatória')
    .refine((val) => ['FORNECEDOR', 'CLIENTE'].includes(val), {
      message: 'Função deve ser FORNECEDOR ou CLIENTE',
    }),

  empresa: zod
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || ['1401', '1402', '1403'].includes(val), {
      message: 'Empresa inválida',
    }),

  nome_nome_fantasia: zod
    .string()
    .max(255, 'Nome deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),

  sobrenome_razao_social: zod
    .string()
    .max(255, 'Razão social deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),

  nome3: zod
    .string()
    .max(255, 'Nome 3 deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),

  nome4: zod
    .string()
    .max(255, 'Nome 4 deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),

  vocativo: zod
    .string()
    .max(100, 'Vocativo deve ter no máximo 100 caracteres')
    .optional()
    .nullable(),

  grupo_contas: zod
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || ['SUPL', 'CUST'].includes(val), {
      message: 'Grupo de contas inválido',
    }),

  agr_contas: zod
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || ['Z001', 'Z002', 'Z003'].includes(val), {
      message: 'Agrupamento de contas inválido',
    }),

  genero: zod
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || val === '' || ['M', 'F', 'OUTRO'].includes(val), {
      message: 'Gênero inválido',
    }),

  termo_pesquisa1: zod
    .string()
    .max(255, 'Termo de pesquisa 1 deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),

  termo_pesquisa2: zod
    .string()
    .max(255, 'Termo de pesquisa 2 deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),

  data_nascimento: zod
    .string()
    .optional()
    .nullable(),

  data_fundacao: zod
    .string()
    .optional()
    .nullable(),

  // Campo category baseado na função
  category: zod
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || ['1', '2'].includes(val), {
      message: 'Categoria inválida',
    }),

  // 2. Endereço
  rua: zod
    .string()
    .max(255, 'Rua deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),

  rua2: zod
    .string()
    .max(255, 'Rua 2 deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),

  numero: zod
    .string()
    .max(20, 'Número deve ter no máximo 20 caracteres')
    .optional()
    .nullable(),

  complemento: zod
    .string()
    .max(100, 'Complemento deve ter no máximo 100 caracteres')
    .optional()
    .nullable(),

  bairro: zod
    .string()
    .max(100, 'Bairro deve ter no máximo 100 caracteres')
    .optional()
    .nullable(),

  cep: zod
    .string()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      return /^\d{5}-?\d{3}$/.test(val);
    }, {
      message: 'CEP deve ter formato válido (00000-000)',
    }),

  cidade: zod
    .string()
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .optional()
    .nullable(),

  estado: zod
    .string()
    .max(2, 'Estado deve ter no máximo 2 caracteres')
    .optional()
    .nullable(),

  pais: zod
    .string()
    .max(100, 'País deve ter no máximo 100 caracteres')
    .optional()
    .nullable(),

  // 3. Comunicação
  telefone: zod
    .string()
    .optional()
    .nullable(),

  telefone2: zod
    .string()
    .optional()
    .nullable(),

  telefone3: zod
    .string()
    .optional()
    .nullable(),

  celular: zod
    .string()
    .optional()
    .nullable(),

  email: zod
    .string()
    .email('Email deve ter formato válido')
    .optional()
    .nullable(),

  observacoes: zod
    .string()
    .max(1000, 'Observações devem ter no máximo 1000 caracteres')
    .optional()
    .nullable(),

  // 4. Identificação
  cpf: zod
    .string()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(val);
    }, {
      message: 'CPF deve ter formato válido (000.000.000-00)',
    }),

  cnpj: zod
    .string()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(val);
    }, {
      message: 'CNPJ deve ter formato válido (00.000.000/0000-00)',
    }),

  inscr_estadual: zod
    .string()
    .max(50, 'Inscrição estadual deve ter no máximo 50 caracteres')
    .optional()
    .nullable(),

  inscr_municipal: zod
    .string()
    .max(50, 'Inscrição municipal deve ter no máximo 50 caracteres')
    .optional()
    .nullable(),

  tipo_id_ident: zod
    .string()
    .optional()
    .nullable(),

  numero_id: zod
    .string()
    .max(50, 'Número ID deve ter no máximo 50 caracteres')
    .optional()
    .nullable(),

  // 5. Setor Industrial
  chave_setor_ind: zod
    .string()
    .max(50, 'Chave setor industrial deve ter no máximo 50 caracteres')
    .optional()
    .nullable(),

  cod_setor_ind: zod
    .string()
    .max(50, 'Código setor industrial deve ter no máximo 50 caracteres')
    .optional()
    .nullable(),

  setor_ind_padrao: zod
    .string()
    .optional()
    .nullable(),

  // 6. Pagamentos
  cod_banco: zod
    .string()
    .max(10, 'Código banco deve ter no máximo 10 caracteres')
    .optional()
    .nullable(),

  cod_agencia: zod
    .string()
    .max(10, 'Código agência deve ter no máximo 10 caracteres')
    .optional()
    .nullable(),

  cod_conta: zod
    .string()
    .max(20, 'Código conta deve ter no máximo 20 caracteres')
    .optional()
    .nullable(),

  dig_conta: zod
    .string()
    .max(2, 'Dígito conta deve ter no máximo 2 caracteres')
    .optional()
    .nullable(),

  favorecido: zod
    .string()
    .max(255, 'Favorecido deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),

  cpf_favorecido: zod
    .string()
    .optional()
    .nullable()
    .refine((val) => {
      if (!val || val.trim() === '') return true;
      return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(val);
    }, {
      message: 'CPF favorecido deve ter formato válido (000.000.000-00)',
    }),

  // 7. Vendas
  vendas_grupo_clientes: zod
    .string()
    .optional()
    .nullable(),

  vendas_escritorio_vendas: zod
    .string()
    .optional()
    .nullable(),

  vendas_equipe_vendas: zod
    .string()
    .optional()
    .nullable(),

  vendas_atributo_1: zod
    .string()
    .max(255, 'Atributo 1 deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),

  vendas_atributo_2: zod
    .string()
    .max(255, 'Atributo 2 deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),

  vendas_sociedade_parceiro: zod
    .string()
    .max(255, 'Sociedade parceiro deve ter no máximo 255 caracteres')
    .optional()
    .nullable(),

  vendas_centro_fornecedor: zod
    .string()
    .optional()
    .nullable(),

  condicao_expedicao: zod
    .string()
    .optional()
    .nullable(),

  vendas_relevante_liquidacao: zod
    .boolean()
    .default(false),

  relevante_crr: zod
    .boolean()
    .default(false),

  perfil_cliente_bayer: zod
    .string()
    .optional()
    .nullable(),

  // 8. Fornecedor IRF
  devolucao: zod
    .boolean()
    .default(false),

  rev_fat_bas_em: zod
    .string()
    .max(50, 'Revisão fatura base deve ter no máximo 50 caracteres')
    .optional()
    .nullable(),

  grp_esq_forn: zod
    .string()
    .max(50, 'Grupo esquema fornecedor deve ter no máximo 50 caracteres')
    .optional()
    .nullable(),

  relevante_liquidacao: zod
    .boolean()
    .default(false),

  regime_pis_cofins: zod
    .string()
    .optional()
    .nullable(),

  tipo_imposto: zod
    .string()
    .optional()
    .nullable(),

  optante_simples: zod
    .boolean()
    .default(false),

  simples_nacional: zod
    .boolean()
    .default(false),

  recebedor_alternativo: zod
    .boolean()
    .default(false),

  // 9. Business Partner Z (Campos Customizados)
  zz1_localidade_bus: zod
    .string()
    .optional()
    .nullable(),

  zz1_latitude_bus: zod
    .string()
    .optional()
    .nullable(),

  zz1_longitude_bus: zod
    .string()
    .optional()
    .nullable(),

  zz1_atividade_bus: zod
    .string()
    .optional()
    .nullable(),

  zz1_situacao_bus: zod
    .string()
    .optional()
    .nullable(),

  // 10. Arrays dinâmicos
  cliente_empresas: zod
    .array(zod.object({
      centro: zod.string().optional().nullable(),
      empresa: zod.string().optional().nullable(),
      conta_conciliacao: zod.string().optional().nullable(),
      cond_pgto: zod.string().optional().nullable(),
      grp_admin_tesouraria: zod.string().optional().nullable(),
      form_pgto: zod.string().optional().nullable(),
      banco_empresa_cliente: zod.string().optional().nullable(),
      verificar_fatura_duplicada: zod.string().optional().nullable(),
      procedimento_advertencia: zod.string().optional().nullable(),
      responsavel_advertencia: zod.string().optional().nullable(),
    }))
    .default([]),

  vendas_distribuicoes: zod
    .array(zod.object({
      org_vendas: zod.string().optional().nullable(),
      canal_distr: zod.string().optional().nullable(),
      setor_ativ: zod.string().optional().nullable(),
      regiao_vendas: zod.string().optional().nullable(),
      prioridade_remessa: zod.string().optional().nullable(),
      incoterms: zod.string().optional().nullable(),
      local_inco1: zod.string().optional().nullable(),
      grp_class_cont_cli: zod.string().optional().nullable(),
      class_fiscal: zod.string().optional().nullable(),
      moeda_cliente: zod.string().optional().nullable(),
      esquema_cliente: zod.string().optional().nullable(),
      grupo_preco: zod.string().optional().nullable(),
      lista_preco: zod.string().optional().nullable(),
      compensacao: zod.string().optional().nullable(),
      icms: zod.string().optional().nullable(),
      ipi: zod.string().optional().nullable(),
      subst_fiscal: zod.string().optional().nullable(),
      cfop: zod.string().optional().nullable(),
      contrib_icms: zod.string().optional().nullable(),
      tp_princ_set_ind: zod.string().optional().nullable(),
      agrupamento_ordens: zod.string().optional().nullable(),
    }))
    .default([]),

  fornecedor_empresas: zod
    .array(zod.object({
      centro: zod.string().optional().nullable(),
      empresa: zod.string().optional().nullable(),
      conta_conciliacao: zod.string().optional().nullable(),
      grp_admin_tesouraria: zod.string().optional().nullable(),
      cond_pgto: zod.string().optional().nullable(),
      form_pgto: zod.string().optional().nullable(),
      banco_empresa_fornecedor: zod.string().optional().nullable(),
      verificar_fatura_duplicada: zod.string().optional().nullable(),
      procedimento_advertencia: zod.string().optional().nullable(),
      responsavel_advertencia: zod.string().optional().nullable(),
      contrib_icms: zod.string().optional().nullable(),
      tp_princ_set_ind: zod.string().optional().nullable(),
    }))
    .default([]),

  fornecedor_mm: zod
    .array(zod.object({
      org_compras: zod.string().optional().nullable(),
      moeda_pedido: zod.string().optional().nullable(),
      cond_pgto: zod.string().optional().nullable(),
      incoterms: zod.string().optional().nullable(),
      local_inco1: zod.string().optional().nullable(),
      compensacao: zod.string().optional().nullable(),
      marc_preco_forn: zod.string().optional().nullable(),
    }))
    .default([]),

  fornecedor_compras: zod
    .array(zod.object({
      org_compras: zod.string().optional().nullable(),
      moeda_pedido: zod.string().optional().nullable(),
      cond_pgto: zod.string().optional().nullable(),
      incoterms: zod.string().optional().nullable(),
      local_inco1: zod.string().optional().nullable(),
      compensacao: zod.string().optional().nullable(),
      marc_preco_forn: zod.string().optional().nullable(),
    }))
    .default([]),

  relacoes: zod
    .array(zod.object({
      cod_produtor: zod.string().optional().nullable(),
      tp_relacao: zod.string().optional().nullable(),
      cod_propriedade: zod.string().optional().nullable(),
      valid_date_from: zod.string().optional().nullable(),
      valid_date_to: zod.string().optional().nullable(),
    }))
    .default([]),

  partner_functions: zod
    .array(zod.object({
      partner: zod.string().optional().nullable(),
      acao: zod.string().optional().nullable(),
      funcao: zod.string().optional().nullable(),
      organ_vendas: zod.string().optional().nullable(),
      canal_distr: zod.string().optional().nullable(),
      setor_ativ: zod.string().optional().nullable(),
      parceiro: zod.string().optional().nullable(),
    }))
    .default([]),
});

// ----------------------------------------------------------------------

/**
 * Valores padrão para o formulário
 */
export const businessPartnerFormDefaultValues = {
  // Informações Gerais
  cod_antigo: '',
  tipo: null,
  funcao: 'FORNECEDOR', // Valor padrão obrigatório
  empresa: '',
  nome_nome_fantasia: '',
  sobrenome_razao_social: '',
  nome3: '',
  nome4: '',
  vocativo: '',
  grupo_contas: '',
  agr_contas: '',
  genero: '',
  termo_pesquisa1: '',
  termo_pesquisa2: '',
  data_nascimento: '',
  data_fundacao: '',
  category: '', // Será preenchido automaticamente baseado na função

  // Endereço
  rua: '',
  rua2: '',
  numero: '',
  complemento: '',
  bairro: '',
  cep: '',
  cidade: '',
  estado: '',
  pais: 'Brasil',

  // Comunicação
  telefone: '',
  telefone2: '',
  telefone3: '',
  celular: '',
  email: '',
  observacoes: '',

  // Identificação
  cpf: '',
  cnpj: '',
  inscr_estadual: '',
  inscr_municipal: '',
  tipo_id_ident: '',
  numero_id: '',

  // Setor Industrial
  chave_setor_ind: '',
  cod_setor_ind: '',
  setor_ind_padrao: '',

  // Pagamentos
  cod_banco: '',
  cod_agencia: '',
  cod_conta: '',
  dig_conta: '',
  favorecido: '',
  cpf_favorecido: '',

  // Vendas
  vendas_grupo_clientes: '',
  vendas_escritorio_vendas: '',
  vendas_equipe_vendas: '',
  vendas_atributo_1: '',
  vendas_atributo_2: '',
  vendas_sociedade_parceiro: '',
  vendas_centro_fornecedor: '',
  condicao_expedicao: '',
  vendas_relevante_liquidacao: false,
  relevante_crr: false,
  perfil_cliente_bayer: '',

  // Fornecedor IRF
  devolucao: false,
  rev_fat_bas_em: '',
  grp_esq_forn: '',
  relevante_liquidacao: false,
  regime_pis_cofins: '',
  tipo_imposto: '',
  optante_simples: false,
  simples_nacional: false,
  recebedor_alternativo: false,

  // Business Partner Z (Campos Customizados)
  zz1_localidade_bus: '',
  zz1_latitude_bus: '',
  zz1_longitude_bus: '',
  zz1_atividade_bus: '',
  zz1_situacao_bus: '',

  // Arrays dinâmicos
  cliente_empresas: [],
  vendas_distribuicoes: [],
  fornecedor_empresas: [],
  fornecedor_mm: [],
  fornecedor_compras: [],
  relacoes: [],
  partner_functions: [],
};

// ----------------------------------------------------------------------

/**
 * Opções para os selects do formulário
 */
export const BUSINESS_PARTNER_FORM_OPTIONS = {
  tipo: [
    { value: '', label: '' },
    { value: 'SOCI', label: 'Sócio' },
    { value: 'TERC', label: 'Terceiro' },
  ],

  funcao: [
    { value: 'FORNECEDOR', label: 'Fornecedor' },
    { value: 'CLIENTE', label: 'Cliente' },
  ],

  grupo_contas: [
    { value: 'SUPL', label: 'SUPL - Fornecedor' },
    { value: 'CUST', label: 'CUST - Cliente' },
  ],

  agr_contas: [
    { value: '', label: '' },
    { value: 'Z001', label: 'Z001' },
    { value: 'Z002', label: 'Z002' },
    { value: 'Z003', label: 'Z003' },
  ],

  genero: [
    { value: '', label: 'Não informado' },
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
    { value: 'OUTRO', label: 'Outro' },
  ],

  estado: [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' },
  ],

  pais: [
    { value: 'Brasil', label: 'Brasil' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Chile', label: 'Chile' },
    { value: 'Colômbia', label: 'Colômbia' },
    { value: 'México', label: 'México' },
    { value: 'Peru', label: 'Peru' },
    { value: 'Uruguai', label: 'Uruguai' },
    { value: 'Venezuela', label: 'Venezuela' },
    { value: 'Estados Unidos', label: 'Estados Unidos' },
    { value: 'Canadá', label: 'Canadá' },
    { value: 'Alemanha', label: 'Alemanha' },
    { value: 'França', label: 'França' },
    { value: 'Itália', label: 'Itália' },
    { value: 'Espanha', label: 'Espanha' },
    { value: 'Reino Unido', label: 'Reino Unido' },
    { value: 'China', label: 'China' },
    { value: 'Japão', label: 'Japão' },
    { value: 'Índia', label: 'Índia' },
    { value: 'Austrália', label: 'Austrália' },
    { value: 'Outro', label: 'Outro' },
  ],
};

// ----------------------------------------------------------------------

/**
 * Função para aplicar máscara de CPF
 */
export const applyCpfMask = (value) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Função para aplicar máscara de CNPJ
 */
export const applyCnpjMask = (value) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Função para aplicar máscara de CEP
 */
export const applyCepMask = (value) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
};

/**
 * Função para aplicar máscara de telefone
 */
export const applyPhoneMask = (value) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};
