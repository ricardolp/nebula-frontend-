import { z as zod } from 'zod';

// ----------------------------------------------------------------------

export const businessPartnerSchema = zod.object({
  // Informações Gerais
  codAntigo: zod.string().optional(),
  tipo: zod.string().min(1, 'Tipo é obrigatório').refine(
    (val) => val === 'SOCI' || val === 'TERC',
    { message: 'Tipo deve ser SOCI ou TERC' }
  ),
  funcao: zod.array(zod.string()).min(1, 'Pelo menos uma função deve ser selecionada'),
  grupoContas: zod.string().optional(),
  agrContas: zod.string().min(1, 'Agrupamento de Contas é obrigatório'),
  sexo: zod.string().optional(),
  nomeNomeFantasia: zod.string().min(1, 'Nome/Nome Fantasia é obrigatório').max(40, 'Nome/Nome Fantasia deve ter no máximo 40 caracteres'),
  sobrenomeRazaoSocial: zod.string().min(1, 'Sobrenome/Razão Social é obrigatório').max(40, 'Sobrenome/Razão Social deve ter no máximo 40 caracteres'),
  nome3: zod.string().max(40, 'Nome 3 deve ter no máximo 40 caracteres').optional(),
  nome4: zod.string().max(40, 'Nome 4 deve ter no máximo 40 caracteres').optional(),
         termoPesquisa1: zod.string().max(20, 'Termo de Pesquisa 1 deve ter no máximo 20 caracteres').optional(),
         termoPesquisa2: zod.string().max(20, 'Termo de Pesquisa 2 deve ter no máximo 20 caracteres').optional(),
         vocativo: zod.string().max(15, 'Vocativo deve ter no máximo 15 caracteres').optional(),
         dataNascimentoFundacao: zod.string().nullable().optional(),
         status: zod.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).default('DRAFT'),

  // Endereço
  endereco: zod.object({
    rua: zod.string().min(1, 'Rua é obrigatória'),
    rua2: zod.string().optional(),
    numero: zod.string().min(1, 'Número é obrigatório. Use "S/N" se não houver número'),
    complemento: zod.string().optional(),
    bairro: zod.string().optional(),
    cep: zod.string().min(1, 'CEP é obrigatório'),
    cidade: zod.string().min(1, 'Cidade é obrigatória'),
    estado: zod.string().min(1, 'Estado é obrigatório'),
    pais: zod.string().min(1, 'País é obrigatório').default('BR'),
  }),

  // Comunicação
  comunicacao: zod.object({
    telefone: zod.string().optional(),
    telefone2: zod.string().optional(),
    telefone3: zod.string().optional(),
    celular: zod.string().optional(),
    email: zod.string().email('Email inválido').or(zod.literal('')).optional(),
    observacoes: zod.string().optional(),
  }).optional(),

  // Identificação
  identificacao: zod.object({
    cpf: zod.string().optional(),
    cnpj: zod.string().optional(),
    inscrEstatual: zod.string().max(20, 'Inscrição Estadual deve ter no máximo 20 caracteres').optional(),
    inscrMunicipal: zod.string().max(20, 'Inscrição Municipal deve ter no máximo 20 caracteres').optional(),
    tipoIdIdent: zod.string().optional(),
    numeroId: zod.string().max(20, 'Número de ID deve ter no máximo 20 caracteres').optional(),
  }).optional().refine(
    (data) => {
      if (!data) return true;
      const hasCpf = data.cpf && data.cpf.trim() !== '';
      const hasCnpj = data.cnpj && data.cnpj.trim() !== '';
      return !(hasCpf && hasCnpj);
    },
    {
      message: 'CPF e CNPJ não podem ser preenchidos ao mesmo tempo',
      path: ['cpf', 'cnpj'],
    }
  ),

  // Setor Industrial
  setorIndustrial: zod.object({
    chaveSetorInd: zod.string().optional(),
    codSetorInd: zod.string().optional(),
    setorIndPadrao: zod.string().optional(),
  }).optional(),

  // Pagamentos
  pagamentos: zod.object({
    codBanco: zod.string().optional(),
    codAgencia: zod.string().optional(),
    digAgencia: zod.string().optional(),
    codConta: zod.string().optional(),
    digConta: zod.string().optional(),
    favorecido: zod.string().optional(),
    cpfFavorecido: zod.string().optional(),
  }).optional(),

  // Fornecedor - Dados básicos
  fornecedor: zod.object({
    devolucao: zod.boolean().optional(),
    revFatBasEm: zod.boolean().optional(),
    revFatBasServ: zod.boolean().optional(),
    grpEsqForn: zod.string().optional(),
    cntrleConfir: zod.string().optional(),
    relevanteLiquidacao: zod.boolean().optional(),
    pedidoAutom: zod.boolean().optional(),
    tipoNfe: zod.boolean().optional(),
    regimePisCofins: zod.string().optional(),
    tipoImposto: zod.boolean().optional(),
    optanteSimples: zod.string().optional(),
    simplesNacional: zod.boolean().optional(),
    recebedorAlternativo: zod.string().optional(),
  }).optional(),

  // Fornecedor Empresas
  fornecedorEmpresas: zod.array(zod.object({
    centro: zod.string().optional(),
    empresa: zod.string().optional(),
    contaConciliacao: zod.string().optional(),
    grpAdminTesouraria: zod.string().optional(),
    minorit: zod.boolean().optional(),
    condPgto: zod.string().optional(),
    formPgto: zod.string().optional(),
    bancoEmpresaFornecedor: zod.string().optional(),
    verificarFaturaDuplicada: zod.boolean().optional(),
    procedimentoAdvertencia: zod.string().optional(),
    responsavelAdvertencia: zod.string().optional(),
    contribIcms: zod.string().optional(),
    tpPrincSetInd: zod.string().optional(),
  })).optional(),

  // Fornecedor Compras
  fornecedorCompras: zod.array(zod.object({
    orgCompras: zod.string().optional(),
    moedaPedido: zod.string().optional(),
    condPgto: zod.string().optional(),
    versIncoterms: zod.string().optional(),
    incoterms: zod.string().optional(),
    localInco1: zod.string().optional(),
    compensacao: zod.boolean().optional(),
    marcPrecoForn: zod.string().optional(),
  })).optional(),

  // Fornecedor IRF
  fornecedorIrf: zod.array(zod.object({
    ctgIrf: zod.string().optional(),
    codigoIrf: zod.string().optional(),
  })).optional(),

  // Cliente Empresas
  clienteEmpresas: zod.array(zod.object({
    centro: zod.string().optional(),
    empresa: zod.string().optional(),
    contaConciliacao: zod.string().optional(),
    condPgto: zod.string().optional(),
    chvOrdenacao: zod.string().optional(),
    grpAdminTesouraria: zod.string().optional(),
    ajusValor: zod.string().optional(),
    formPgto: zod.string().optional(),
    bancoEmpresaCliente: zod.string().optional(),
    verificarFaturaDuplicada: zod.boolean().optional(),
    procedimentoAdvertencia: zod.string().optional(),
    responsavelAdvertencia: zod.string().optional(),
  })).optional(),

  // Cliente Vendas
  clienteVendas: zod.array(zod.object({
    orgVendas: zod.string().optional(),
    canalDistr: zod.string().optional(),
    setorAtiv: zod.string().optional(),
    regiaoVendas: zod.string().optional(),
    prioridadeRemessa: zod.string().optional(),
    incoterms: zod.string().optional(),
    localInco1: zod.string().optional(),
    grpClassContCli: zod.string().optional(),
    classFiscal: zod.string().optional(),
    moedaCliente: zod.string().optional(),
    esquemaCliente: zod.string().optional(),
    grupoPreco: zod.string().optional(),
    listaPreco: zod.string().optional(),
    compensacao: zod.boolean().optional(),
    icms: zod.string().optional(),
    ipi: zod.string().optional(),
    substFiscal: zod.string().optional(),
    cfop: zod.string().optional(),
    contribIcms: zod.string().optional(),
    tpPrincSetInd: zod.string().optional(),
    agrupamentoOrdens: zod.boolean().optional(),
    vendasGrupoClientes: zod.string().optional(),
    vendasEscritorioVendas: zod.string().optional(),
    vendasEquipeVendas: zod.string().optional(),
    vendasAtributo1: zod.string().optional(),
    vendasAtributo2: zod.string().optional(),
    vendasSociedadeParceiro: zod.string().optional(),
    vendasCentroFornecedor: zod.string().optional(),
    condicaoExpedicao: zod.string().optional(),
    vendasRelevanteliquidacao: zod.boolean().optional(),
    relevanteCrr: zod.boolean().optional(),
    perfilClienteBayer: zod.string().optional(),
  })).optional(),

  // PARCO
  parco: zod.array(zod.object({
    partner: zod.string().optional(),
    acao: zod.string().optional(),
    funcao: zod.string().optional(),
    organCompras: zod.string().optional(),
    parceiro: zod.string().optional(),
  })).optional(),

  // Dados de Crédito
  dadosCredito: zod.array(zod.object({
    partner: zod.string().optional(),
    role: zod.string().optional(),
    limitRule: zod.string().optional(),
    riskClass: zod.string().optional(),
    checkRule: zod.string().optional(),
    creditGroup: zod.string().optional(),
    segment: zod.string().optional(),
    creditLimit: zod.union([
      zod.number(),
      zod.string().transform((val) => val === '' ? undefined : parseFloat(val)),
    ]).optional(),
    limitValidDate: zod.string().optional(),
    followUpDt: zod.string().optional(),
    xblocked: zod.string().optional(),
    infocategory: zod.string().optional(),
    infotype: zod.string().optional(),
    checkRelevant: zod.string().optional(),
    amount: zod.union([
      zod.number(),
      zod.string().transform((val) => val === '' ? undefined : parseFloat(val)),
    ]).optional(),
    currency: zod.string().optional(),
    dateFrom: zod.string().optional(),
    dateTo: zod.string().optional(),
    dateFollowUp: zod.string().optional(),
    text: zod.string().optional(),
  })).optional(),

  // Credit Collection
  collection: zod.array(zod.object({
    codAntigo: zod.string().optional(),
    role: zod.string().optional(),
    perfil: zod.string().optional(),
    segment: zod.string().optional(),
    grupo: zod.string().optional(),
    resp: zod.string().optional(),
  })).optional(),

  // Funções de Parceiro
  funcoesParceiro: zod.object({
    funcaoParceiro: zod.string().optional(),
    autorizacao: zod.string().optional(),
    validadeInicio: zod.string().nullable().optional(),
    validadeFim: zod.string().nullable().optional(),
  }).optional(),

  // Dados Adicionais
  dadosAdicionais: zod.object({
    observacoes: zod.string().optional(),
    informacoesComplementares: zod.string().optional(),
    referenciaExterna: zod.string().optional(),
    codigoAntigo: zod.string().optional(),
  }).optional(),

  // Campos Z (Campos customizados)
  camposZ: zod.object({
    zz1AreadapcafBus: zod.string().nullable().optional(),
    zz1RepcomexterninsumoBus: zod.string().nullable().optional(),
    zz1ProdutividademensaBus: zod.string().nullable().optional(),
    zz1EntregadeleiteparaBus: zod.string().nullable().optional(),
    zz1AreapenhorBus: zod.string().nullable().optional(),
    zz1SituacaoBus: zod.string().nullable().optional(),
    zz1TransportadorBus: zod.string().nullable().optional(),
    zz1VencarrendamentoBus: zod.string().nullable().optional(),
    zz1AreatotaldamatricBus: zod.string().nullable().optional(),
    zz1FimatividadeBus: zod.string().nullable().optional(),
    zz1InicioatividadeBus: zod.string().nullable().optional(),
    zz1DapcafBus: zod.string().nullable().optional(),
    zz1EmissaoBus: zod.string().nullable().optional(),
    zz1TipoBus: zod.string().nullable().optional(),
    zz1NascfundacaoBus: zod.string().nullable().optional(),
    zz1MatrculaSeniorBus: zod.string().nullable().optional(),
    zz1VencimentorenasemBus: zod.string().nullable().optional(),
    zz1ArrendamentoBus: zod.string().nullable().optional(),
    zz1EnquadramentoBus: zod.string().nullable().optional(),
    zz1OrgaoemissorBus: zod.string().nullable().optional(),
    zz1AgronomoBus: zod.string().nullable().optional(),
    zz1CinBus: zod.string().nullable().optional(),
    zz1QtddegadocorteBus: zod.string().nullable().optional(),
    zz1QtddegadocorteBusu: zod.string().nullable().optional(),
    zz1CertificadodigitalBus: zod.string().nullable().optional(),
    zz1AtivprincipalBus: zod.string().nullable().optional(),
    zz1FuncColabBus: zod.string().nullable().optional(),
    zz1UltimomovimentoBus: zod.string().nullable().optional(),
    zz1AtividadeBus: zod.string().nullable().optional(),
    zz1RepcomexternracaoBus: zod.string().nullable().optional(),
    zz1LocalidadeBus: zod.string().nullable().optional(),
    zz1LatitudeBus: zod.string().nullable().optional(),
    zz1CreaBus: zod.string().nullable().optional(),
    zz1PaisnacionalidadeBus: zod.string().nullable().optional(),
    zz1RenasemBus: zod.string().nullable().optional(),
    zz1ColaboradorativoBus: zod.boolean().optional(),
    zz1GrauinstrucaoBus: zod.string().nullable().optional(),
    zz1SmartcoopBus: zod.string().nullable().optional(),
    zz1QtddevacasleiteBus: zod.string().nullable().optional(),
    zz1QtddevacasleiteBusu: zod.string().nullable().optional(),
    zz1RegistrogeralBus: zod.string().nullable().optional(),
    zz1CartrioregistrocomBus: zod.string().nullable().optional(),
    zz1MatrculadoimvelBus: zod.string().nullable().optional(),
    zz1NdapcafBus: zod.string().nullable().optional(),
    zz1VeterinarioBus: zod.string().nullable().optional(),
    zz1ProdutordeleiteBus: zod.string().nullable().optional(),
    zz1Ndapcaf1Bus: zod.string().nullable().optional(),
    zz1NpisBus: zod.string().nullable().optional(),
    zz1NomedamaeBus: zod.string().nullable().optional(),
    zz1GerenteUnidNegocBus: zod.string().nullable().optional(),
    zz1BpCustomatrib1Bus: zod.string().nullable().optional(),
    zz1AreacultivadaBus: zod.string().nullable().optional(),
    zz1NromatriculalegadoBus: zod.string().nullable().optional(),
    zz1LongitudeBus: zod.string().nullable().optional(),
    zz1IndIncorporacaoBus: zod.string().nullable().optional(),
    zz1PaisnascimentoBus: zod.string().nullable().optional(),
    zz1VendedorCotrijalBus: zod.string().nullable().optional(),
    zz1RepcomercialinternBus: zod.string().nullable().optional(),
    zz1InativacaoBus: zod.string().nullable().optional(),
    zz1CodigodeatividadeBus: zod.string().nullable().optional(),
    zz1CorretordenegociosBus: zod.string().nullable().optional(),
  }).optional(),
}).refine(
  (data) => {
    const cpf = data.identificacao?.cpf?.trim() || '';
    const cnpj = data.identificacao?.cnpj?.trim() || '';
    return !(cpf && cnpj);
  }, 
  {
    message: 'CPF e CNPJ não podem ser preenchidos ao mesmo tempo',
    path: ['identificacao'],
  }
);

// ----------------------------------------------------------------------

export const defaultValues = {
  // Informações Gerais
  codAntigo: '',
  tipo: '',
  funcao: [],
  grupoContas: '',
  agrContas: '',
  sexo: '',
  nomeNomeFantasia: '',
  sobrenomeRazaoSocial: '',
  nome3: '',
  nome4: '',
         termoPesquisa1: '',
         termoPesquisa2: '',
         vocativo: '',
         dataNascimentoFundacao: null,
         status: 'DRAFT',

  // Endereço
  endereco: {
    rua: '',
    rua2: '',
    numero: '',
    complemento: '',
    bairro: '',
    cep: '',
    cidade: '',
    estado: '',
    pais: 'BR',
  },

  // Comunicação
  comunicacao: {
    telefone: '',
    telefone2: '',
    telefone3: '',
    celular: '',
    email: '',
    observacoes: '',
  },

  // Identificação
  identificacao: {
    cpf: '',
    cnpj: '',
    inscrEstatual: '',
    inscrMunicipal: '',
    tipoIdIdent: '',
    numeroId: '',
  },

  // Setor Industrial
  setorIndustrial: {
    chaveSetorInd: '',
    codSetorInd: '',
    setorIndPadrao: '',
  },

  // Pagamentos
  pagamentos: {
    codBanco: '',
    codAgencia: '',
    digAgencia: '',
    codConta: '',
    digConta: '',
    favorecido: '',
    cpfFavorecido: '',
  },

  // Fornecedor - Dados básicos
  fornecedor: {
    devolucao: false,
    revFatBasEm: false,
    revFatBasServ: false,
    grpEsqForn: '',
    cntrleConfir: '',
    relevanteLiquidacao: false,
    pedidoAutom: false,
    tipoNfe: false,
    regimePisCofins: '',
    tipoImposto: false,
    optanteSimples: '',
    simplesNacional: false,
    recebedorAlternativo: '',
  },

  // Fornecedor Empresas
  fornecedorEmpresas: [],

  // Fornecedor Compras
  fornecedorCompras: [],

  // Fornecedor IRF
  fornecedorIrf: [],

  // Cliente Empresas
  clienteEmpresas: [],

  // Cliente Vendas
  clienteVendas: [],

  // PARCO
  parco: [],

  // Dados de Crédito
  dadosCredito: [],

  // Credit Collection
  collection: [],

  // Funções de Parceiro
  funcoesParceiro: {
    funcaoParceiro: '',
    autorizacao: '',
    validadeInicio: null,
    validadeFim: null,
  },

  // Dados Adicionais
  dadosAdicionais: {
    observacoes: '',
    informacoesComplementares: '',
    referenciaExterna: '',
    codigoAntigo: '',
  },

  // Campos Z (Campos customizados)
  camposZ: {
    zz1AreadapcafBus: '',
    zz1RepcomexterninsumoBus: '',
    zz1ProdutividademensaBus: '',
    zz1EntregadeleiteparaBus: '',
    zz1AreapenhorBus: '',
    zz1SituacaoBus: '',
    zz1TransportadorBus: '',
    zz1VencarrendamentoBus: '',
    zz1AreatotaldamatricBus: '',
    zz1FimatividadeBus: '',
    zz1InicioatividadeBus: '',
    zz1DapcafBus: '',
    zz1EmissaoBus: '',
    zz1TipoBus: '',
    zz1NascfundacaoBus: '',
    zz1MatrculaSeniorBus: '',
    zz1VencimentorenasemBus: '',
    zz1ArrendamentoBus: '',
    zz1EnquadramentoBus: '',
    zz1OrgaoemissorBus: '',
    zz1AgronomoBus: '',
    zz1CinBus: '',
    zz1QtddegadocorteBus: '',
    zz1QtddegadocorteBusu: '',
    zz1CertificadodigitalBus: '',
    zz1AtivprincipalBus: '',
    zz1FuncColabBus: '',
    zz1UltimomovimentoBus: '',
    zz1AtividadeBus: '',
    zz1RepcomexternracaoBus: '',
    zz1LocalidadeBus: '',
    zz1LatitudeBus: '',
    zz1CreaBus: '',
    zz1PaisnacionalidadeBus: '',
    zz1RenasemBus: '',
    zz1ColaboradorativoBus: false,
    zz1GrauinstrucaoBus: '',
    zz1SmartcoopBus: '',
    zz1QtddevacasleiteBus: '',
    zz1QtddevacasleiteBusu: '',
    zz1RegistrogeralBus: '',
    zz1CartrioregistrocomBus: '',
    zz1MatrculadoimvelBus: '',
    zz1NdapcafBus: '',
    zz1VeterinarioBus: '',
    zz1ProdutordeleiteBus: '',
    zz1Ndapcaf1Bus: '',
    zz1NpisBus: '',
    zz1NomedamaeBus: '',
    zz1GerenteUnidNegocBus: '',
    zz1BpCustomatrib1Bus: '',
    zz1AreacultivadaBus: '',
    zz1NromatriculalegadoBus: '',
    zz1LongitudeBus: '',
    zz1IndIncorporacaoBus: '',
    zz1PaisnascimentoBus: '',
    zz1VendedorCotrijalBus: '',
    zz1RepcomercialinternBus: '',
    zz1InativacaoBus: '',
    zz1CodigodeatividadeBus: '',
    zz1CorretordenegociosBus: '',
  },
};

// ----------------------------------------------------------------------

export const tipoOptions = [
  { value: 'SOCI', label: 'SOCI - Sócio' },
  { value: 'TERC', label: 'TERC - Terceiro' },
];

export const funcaoOptions = [
  { value: 'CLI', label: 'Cliente' },
  { value: 'FORN', label: 'Fornecedor' },
];

// ----------------------------------------------------------------------
// Funções de conversão para o backend

/**
 * Converte o tipo do frontend para o formato do backend
 * @param {string} tipo - Tipo no formato do frontend (SOCI ou TERC)
 * @returns {string} - Tipo no formato do backend (S ou T)
 */
export function convertTipoToBackend(tipo) {
  const tipoMap = {
    'SOCI': 'S',
    'TERC': 'T',
    '': '',
  };
  // Se não encontrar no mapa e não for vazio, retorna o valor original
  return tipoMap[tipo] !== undefined ? tipoMap[tipo] : (tipo || '');
}

/**
 * Converte o tipo do backend para o formato do frontend
 * @param {string} tipo - Tipo no formato do backend (S ou T)
 * @returns {string} - Tipo no formato do frontend (SOCI ou TERC)
 */
export function convertTipoFromBackend(tipo) {
  const tipoMap = {
    'S': 'SOCI',
    'T': 'TERC',
    '': '',
  };
  // Se não encontrar no mapa e não for vazio, retorna o valor original
  return tipoMap[tipo] !== undefined ? tipoMap[tipo] : (tipo || '');
}

/**
 * Converte o array de funções do frontend para o formato do backend
 * @param {string[]} funcoes - Array de funções no formato do frontend (['CLI', 'FORN'])
 * @returns {string} - Funções concatenadas no formato do backend ('CLIE', 'FORN' ou 'CLIE/FORN')
 */
export function convertFuncaoToBackend(funcoes) {
  if (!Array.isArray(funcoes) || funcoes.length === 0) {
    return '';
  }
  
  const funcaoMap = {
    'CLI': 'CLIE',
    'FORN': 'FORN',
  };
  
  const mappedFuncoes = funcoes.map(f => funcaoMap[f] || f).filter(Boolean);
  return mappedFuncoes.join('/');
}

/**
 * Converte a string de funções do backend para o formato do frontend
 * @param {string} funcao - Funções concatenadas no formato do backend ('CLIE', 'FORN', 'LI' ou 'CLIE/FORN')
 * @returns {string[]} - Array de funções no formato do frontend (['CLI', 'FORN'])
 */
export function convertFuncaoFromBackend(funcao) {
  if (!funcao || typeof funcao !== 'string') {
    return [];
  }
  
  const funcaoMap = {
    'CLIE': 'CLI',
    'LI': 'CLI',     // Alias para Cliente
    'CLI': 'CLI',
    'CLIENTE': 'CLI',
    'FORN': 'FORN',
    'FO': 'FORN',    // Alias para Fornecedor
    'FORNECEDOR': 'FORN',
  };
  
  const funcoes = funcao.split('/').filter(Boolean);
  return funcoes.map(f => funcaoMap[f] || f).filter(Boolean);
}

export const sexoOptions = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' },
  { value: 'O', label: 'Organização/Empresa' },
  { value: 'X', label: 'Outro' },
];

export const statusOptions = [
  { value: 'DRAFT', label: 'Rascunho' },
  { value: 'ACTIVE', label: 'Ativo' },
  { value: 'INACTIVE', label: 'Inativo' },
];

export const paisOptions = [
  { value: 'BR', label: 'Brasil' },
  { value: 'US', label: 'Estados Unidos' },
  { value: 'AR', label: 'Argentina' },
];

export const estadoOptions = [
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
];

export const agrupamentoContasOptions = [
  { value: '', label: '' },
  { value: 'Z001', label: 'Z001 - Carga BP - Cliente/Fornecedor/Cooperado' },
  { value: 'Z002', label: 'Z002 - BP - Cliente/Fornecedor/Cooperado' },
  { value: 'Z003', label: 'Z003 - Propriedade' },
  { value: 'Z004', label: 'Z004 - BP - Colaborador' },
];

export const vocativoOptions = [
  { value: '', label: '' },
  { value: '0001', label: '0001 - Sra.' },
  { value: '0002', label: '0002 - Sr.' },
  { value: '0003', label: '0003 - Empresa' },
  { value: '0004', label: '0004 - Sr. e Sra.' },
];

export const funcaoParceiroOptions = [
  { value: '', label: '' },
  { value: '000000', label: '000000 - Parceiro negócios (geral)' },
  { value: 'ACM01', label: 'ACM01 - Função parc.negócios ACM' },
  { value: 'ACM03', label: 'ACM03 - Escritório comercial' },
  { value: 'AUT001', label: 'AUT001 - Autoridades (EHS)' },
  { value: 'BBP000', label: 'BBP000 - Fornecedor' },
  { value: 'BBP001', label: 'BBP001 - Proponente' },
  { value: 'BBP005', label: 'BBP005 - Prestador de serviços' },
  { value: 'BBP010', label: 'BBP010 - Profissional liberal' },
  { value: 'BEA001', label: 'BEA001 - Unidade faturadora' },
  { value: 'BKK010', label: 'BKK010 - Titular da conta' },
  { value: 'BKK020', label: 'BKK020 - Autorizado ao crédito' },
  { value: 'BKK030', label: 'BKK030 - Destinatário da correspondência' },
  { value: 'BKK200', label: 'BKK200 - Administrador de contas' },
  { value: 'BPSITE', label: 'BPSITE - Centro de comercialização' },
  { value: 'BUP001', label: 'BUP001 - Pessoa de contato' },
  { value: 'BUP002', label: 'BUP002 - Cliente potencial' },
  { value: 'BUP003', label: 'BUP003 - Funcionário' },
  { value: 'BUP004', label: 'BUP004 - Unidade organizacional' },
  { value: 'BUP005', label: 'BUP005 - Usuário da Internet' },
  { value: 'BUP006', label: 'BUP006 - Usuário da Internet' },
  { value: 'BUP010', label: 'BUP010 - Contrato de trabalho' },
  { value: 'BUP011', label: 'BUP011 - Contrato trabalho externo' },
  { value: 'BUP012', label: 'BUP012 - Usuário de colaboração' },
  { value: 'BUPAUD', label: 'BUPAUD' },
  { value: 'BUPSPD', label: 'BUPSPD - Especialista de dados pessoais confidenciais' },
  { value: 'CACSA1', label: 'CACSA1 - Parceiro de contrato de comissões' },
  { value: 'CACSA2', label: 'CACSA2 - Responsável pelas comissões' },
  { value: 'CACSA3', label: 'CACSA3 - Agente' },
  { value: 'CHM001', label: 'CHM001 - Parceiro - sede' },
  { value: 'CHM003', label: 'CHM003 - Pessoa de contato no parceiro' },
  { value: 'CMMF01', label: 'CMMF01 - CDOTE corretor' },
  { value: 'CMMF02', label: 'CMMF02 - CDOTE contraparte' },
  { value: 'CMMF03', label: 'CMMF03' },
  { value: 'CMS001', label: 'CMS001 - Parceiro de garantias CMS' },
  { value: 'CRM000', label: 'CRM000 - Emissor da ordem' },
  { value: 'CRM002', label: 'CRM002 - Recebedor da mercadoria' },
  { value: 'CRM003', label: 'CRM003 - Pagador' },
  { value: 'CRM004', label: 'CRM004' },
  { value: 'CRM005', label: 'CRM005 - Concorrente' },
  { value: 'CRM006', label: 'CRM006 - Consumidor' },
  { value: 'CRM010', label: 'CRM010 - Transportadora' },
  { value: 'CRM011', label: 'CRM011 - Parceiro SD' },
  { value: 'CRMICM', label: 'CRMICM - Pessoa ICM / organização' },
  { value: 'FLCU00', label: 'FLCU00 - Cliente (contabilidade financeira)' },
  { value: 'FLCU01', label: 'FLCU01 - Cliente' },
  { value: 'FLVN00', label: 'FLVN00 - Fornecedor (contabilidade financeira)' },
  { value: 'FLVN01', label: 'FLVN01 - Fornecedor' },
  { value: 'FS0000', label: 'FS0000 - Parceiro de negócios de serviços financeiros' },
  { value: 'FS0003', label: 'FS0003 - Parceiro negócios FS com diferenciação' },
  { value: 'FS0KNE', label: 'FS0KNE - Parceiro de negócios entidade do mutuário' },
  { value: 'FSSC01', label: 'FSSC01 - Empresa' },
  { value: 'ICMEXT', label: 'ICMEXT - ICM externo' },
  { value: 'IHB100', label: 'IHB100 - Titular da conta IHB' },
  { value: 'IHB200', label: 'IHB200 - Proprietário da área bancária interna' },
  { value: 'ISHDPT', label: 'ISHDPT - Seg.assistência PN: consultório médico' },
  { value: 'ISHHSP', label: 'ISHHSP - Seg.assistência PN: hospital' },
  { value: 'ISHINS', label: 'ISHINS - Seg.assistência PN: seguro de saúde' },
  { value: 'ISHMEM', label: 'ISHMEM - Seg.assistência PN: assegurado por HMO' },
  { value: 'ISHPAT', label: 'ISHPAT - Seg.assistência PN: paciente' },
  { value: 'ISHPHY', label: 'ISHPHY - Seg.assistência PN: médico' },
  { value: 'LM0001', label: 'LM0001 - Auxiliar de depósito' },
  { value: 'PRCONT', label: 'PRCONT - Pessoa de contato no parceiro' },
  { value: 'PSSP01', label: 'PSSP01 - Patrocinador' },
  { value: 'SLLCOF', label: 'SLLCOF - Comércio exterior: posto alfandegário' },
  { value: 'SLLPOI', label: 'SLLPOI - Parte com obrigação de informar' },
  { value: 'SLLSTL', label: 'SLLSTL - Responsável pelo comércio internacional' },
  { value: 'SLLTPD', label: 'SLLTPD - Terceiro declarante' },
  { value: 'TAX000', label: 'TAX000' },
  { value: 'TM0001', label: 'TM0001 - Motorista' },
  { value: 'TR0100', label: 'TR0100 - Parceiro principal do empréstimo' },
  { value: 'TR0101', label: 'TR0101 - Mutuário' },
  { value: 'TR0110', label: 'TR0110 - Cliente potencial' },
  { value: 'TR0113', label: 'TR0113 - Controle de solvência' },
  { value: 'TR0115', label: 'TR0115 - Acordo especial' },
  { value: 'TR0120', label: 'TR0120 - Autorizado ao crédito' },
  { value: 'TR0121', label: 'TR0121 - Outro cust.parceiro empréstimo' },
  { value: 'TR0150', label: 'TR0150 - Emissor' },
  { value: 'TR0151', label: 'TR0151 - Contraparte' },
  { value: 'TR0152', label: 'TR0152 - Banco de depósitos' },
  { value: 'TR0153', label: 'TR0153 - Banco pagador' },
  { value: 'TR0154', label: 'TR0154 - Beneficiário' },
  { value: 'TR0155', label: 'TR0155 - Consignatário global' },
  { value: 'TR0156', label: 'TR0156 - Agente local' },
  { value: 'TR0157', label: 'TR0157 - Local de liquidação' },
  { value: 'TR0160', label: 'TR0160 - Mutuário final' },
  { value: 'TR0200', label: 'TR0200 - Fiador' },
  { value: 'TR0202', label: 'TR0202 - Pagador diferente' },
  { value: 'TR0203', label: 'TR0203 - Responsável pela cobrança' },
  { value: 'TR0600', label: 'TR0600 - Locatário principal em débito' },
  { value: 'TR0601', label: 'TR0601 - Locatário (não em débito)' },
  { value: 'TR0602', label: 'TR0602 - Locador credor' },
  { value: 'TR0603', label: 'TR0603 - Parceiro de contrato devedor' },
  { value: 'TR0604', label: 'TR0604 - Parceiro de contrato credor' },
  { value: 'TR0605', label: 'TR0605 - Proprietário (devedor)' },
  { value: 'TR0606', label: 'TR0606 - Administrador credor' },
  { value: 'TR0610', label: 'TR0610 - Locatário habitação de referência externa' },
  { value: 'TR0622', label: 'TR0622 - Subvencionador' },
  { value: 'TR0624', label: 'TR0624 - Pagador alternativo' },
  { value: 'TR0630', label: 'TR0630 - Tribunal' },
  { value: 'TR0635', label: 'TR0635 - Banco central' },
  { value: 'TR0636', label: 'TR0636 - Banco para caução' },
  { value: 'TR0640', label: 'TR0640 - Candidato' },
  { value: 'TR0641', label: 'TR0641 - Concorrente' },
  { value: 'TR0645', label: 'TR0645 - Autorizado p/determ.ocupação' },
  { value: 'TR0646', label: 'TR0646 - Autorizado p/proposta' },
  { value: 'TR0655', label: 'TR0655 - Concessor da garantia' },
  { value: 'TR0700', label: 'TR0700 - Segurado' },
  { value: 'TR0701', label: 'TR0701 - Seguradora' },
  { value: 'TR0702', label: 'TR0702 - Segurado' },
  { value: 'TR0703', label: 'TR0703 - Banco' },
  { value: 'TR0704', label: 'TR0704 - Fornecedor de serviços de seguros' },
  { value: 'TR0705', label: 'TR0705 - Pagador' },
  { value: 'TR0706', label: 'TR0706 - Agente de seguros' },
  { value: 'TR0800', label: 'TR0800 - Proprietário' },
  { value: 'TR0801', label: 'TR0801 - Corretor' },
  { value: 'TR0802', label: 'TR0802 - Notário' },
  { value: 'TR0803', label: 'TR0803 - Con.incorp.' },
  { value: 'TR0804', label: 'TR0804 - Concessionário geral' },
  { value: 'TR0805', label: 'TR0805 - Cessionário geral' },
  { value: 'TR0806', label: 'TR0806 - Administrador' },
  { value: 'TR0807', label: 'TR0807 - Técnica' },
  { value: 'TR0808', label: 'TR0808 - Zelador' },
  { value: 'TR0809', label: 'TR0809 - Arquiteto' },
  { value: 'TR0810', label: 'TR0810 - Cartório de registro de imóveis' },
  { value: 'TR0811', label: 'TR0811 - Proprietário legal' },
  { value: 'TR0812', label: 'TR0812 - Superficiário' },
  { value: 'TR0813', label: 'TR0813 - Ocupante' },
  { value: 'TR0814', label: 'TR0814 - Planejador de ocupação' },
  { value: 'TR0815', label: 'TR0815 - Perito' },
  { value: 'TR0817', label: 'TR0817 - Responsável pela reserva' },
  { value: 'TR0818', label: 'TR0818 - Recebedor da fatura do cliente' },
  { value: 'TR0820', label: 'TR0820 - Cartório de cadastro' },
  { value: 'TR0821', label: 'TR0821 - Repartição pública de finanças' },
  { value: 'TR0822', label: 'TR0822 - Credor' },
  { value: 'TR0823', label: 'TR0823 - Titular (de direitos de terrenos)' },
  { value: 'TR0824', label: 'TR0824 - Responsável (de direitos de terrenos)' },
  { value: 'TR0825', label: 'TR0825 - Repartição pública finanças predial - município' },
  { value: 'TR0850', label: 'TR0850 - Parceiro de correspondência privado' },
  { value: 'TR0860', label: 'TR0860 - Parceiro correspondência com.' },
  { value: 'TR0990', label: 'TR0990 - Responsáv.contrato empréstimo' },
  { value: 'TR0991', label: 'TR0991 - Responsável pela prorrogação de empréstimo' },
  { value: 'TR0992', label: 'TR0992 - Respons.contabilidade emprést.' },
  { value: 'TR0995', label: 'TR0995 - Responsável empréstimos' },
  { value: 'TR0997', label: 'TR0997 - Responsável LCC' },
  { value: 'TR0998', label: 'TR0998 - Responsável' },
  { value: 'TR1000', label: 'TR1000 - Representante autorizado' },
  { value: 'UDM000', label: 'UDM000 - Parceiro de negócios Collections Management' },
  { value: 'UKM000', label: 'UKM000 - SAP Credit Managment' },
  { value: 'VLC001', label: 'VLC001 - Cliente final' },
  { value: 'WDSP01', label: 'WDSP01 - Receptor de resíduos' },
  { value: 'WFM001', label: 'WFM001 - Recurso' },
  { value: 'WTRA01', label: 'WTRA01 - Transportador de resíduos' },
];

export const classeRiscoOptions = [
  { value: '', label: '' },
  { value: 'A', label: 'A - Nenhum risco de inadimplência' },
  { value: 'B', label: 'B - Baixo risco de inadimplência' },
  { value: 'C', label: 'C - Risco de inadimplência médio' },
  { value: 'D', label: 'D - Alto risco de inadimplência' },
  { value: 'E', label: 'E - Risco de inadimplência muito alto' },
  { value: 'F', label: 'F - Conta crédito Filho/filial' },
];

export const grupoCreditoOptions = [
  { value: '', label: '' },
  { value: '0001', label: '0001 - Empresas' },
  { value: '0002', label: '0002 - Pequenos/médios clientes' },
  { value: '0003', label: '0003 - Subsidiárias' },
];

export const segmentoOptions = [
  { value: '', label: '' },
  { value: '0000', label: '0000 - Segmento de crédito 0000' },
  { value: '0001', label: '0001 - Divisão 0001' },
  { value: '0002', label: '0002 - Divisão 0002' },
  { value: '0003', label: '0003 - Divisão 0003' },
  { value: '1000', label: '1000 - Segmento de crédito Agrícola' },
  { value: '2000', label: '2000 - Segmento de crédito Varejo' },
  { value: '3000', label: '3000 - Segmento de crédito Colaborador' },
  { value: '4000', label: '4000 - Segmento de crédito Fretes' },
];

export const empresaOptions = [
  { value: '', label: '' },
  { value: '0001', label: '0001 - SAP SE' },
  { value: '1000', label: '1000 - Company Code 1410' },
  { value: '1401', label: '1401 - COTRIJAL' },
  { value: '1402', label: '1402 - TRANSPORTES COTRIJAL' },
  { value: '1403', label: '1403 - ASSOCIAÇÃO COTRIJAL' },
  { value: '1410', label: '1410 - Company Code 1410' },
  { value: '1420', label: '1420 - Company Code 1420' },
  { value: '1710', label: '1710 - Company Code 1710' },
];

export const condicaoPagamentoOptions = [
  { value: '', label: '' },
  { value: '0001', label: '0001' },
  { value: '0002', label: '0002' },
  { value: '0003', label: '0003' },
  { value: '0004', label: '0004' },
  { value: '0005', label: '0005' },
  { value: '0006', label: '0006' },
  { value: '0007', label: '0007' },
  { value: '0008', label: '0008' },
  { value: '0009', label: '0009' },
  { value: 'C001', label: 'C001' },
  { value: 'C002', label: 'C002' },
  { value: 'C003', label: 'C003' },
  { value: 'CH00', label: 'CH00 - LOJA SETOR VAREJO CHEQUE A VISTA DT COMPRA/VENDA' },
  { value: 'CH01', label: 'CH01 - LOJA SETOR VAREJO CHEQUE 30 DIAS' },
  { value: 'CH02', label: 'CH02 - LOJA SETOR VAREJO CHEQUE 2 PARCELAS' },
  { value: 'CH03', label: 'CH03 - LOJA SETOR VAREJO CHEQUE 3 PARCELAS' },
  { value: 'CH04', label: 'CH04 - LOJA SETOR VAREJO CHEQUE 4 PARCELAS' },
  { value: 'CH05', label: 'CH05 - LOJA SETOR VAREJO CHEQUE 35 DIAS' },
  { value: 'CH06', label: 'CH06 - LOJA SETOR VAREJO CHEQUE 36 DIAS' },
  { value: 'CH07', label: 'CH07 - LOJA SETOR VAREJO CHEQUE 45 DIAS' },
  { value: 'CL01', label: 'CL01 - LOJA SETOR VAREJO PGTO LEITE DIA 20 MÊS SEGUINTE' },
  { value: 'CL02', label: 'CL02 - LOJA SETOR VAREJO 45 DIAS' },
  { value: 'CL03', label: 'CL03 - LOJA SETOR VAREJO 60 DIAS' },
  { value: 'CO07', label: 'CO07 - PAGTO SETOR COMB. TRR 7 DIAS' },
  { value: 'CO30', label: 'CO30 - LOJA SETOR VAREJO 30 DIAS' },
  { value: 'CR00', label: 'CR00 - LOJA SETOR CREDIARIO A VISTA DT VENDA/COMPRA' },
  { value: 'CR01', label: 'CR01 - LOJA SETOR CREDIARIO 30 DIAS' },
  { value: 'CR02', label: 'CR02 - LOJA SETOR CREDIARIO 2 PARCELAS' },
  { value: 'CR03', label: 'CR03 - LOJA SETOR CREDIARIO 3 PARCELAS' },
  { value: 'CR04', label: 'CR04 - LOJA SETOR CREDIARIO 4 PARCELAS' },
  { value: 'CR05', label: 'CR05 - LOJA SETOR CREDIARIO 5 PARCELAS' },
  { value: 'CR06', label: 'CR06 - LOJA SETOR CREDIARIO 6 PARCELAS' },
  { value: 'CR07', label: 'CR07 - LOJA SETOR CREDIARIO 7 PARCELAS' },
  { value: 'CR08', label: 'CR08 - LOJA SETOR CREDIARIO 8 PARCELAS' },
  { value: 'CR09', label: 'CR09 - LOJA SETOR CREDIARIO 9 PARCELAS' },
  { value: 'CR10', label: 'CR10 - LOJA SETOR CREDIARIO 10 PARCELAS' },
  { value: 'CR11', label: 'CR11 - LOJA SETOR CREDIARIO 11 PARCELAS' },
  { value: 'CR12', label: 'CR12 - LOJA SETOR CREDIARIO 12 PARCELAS' },
  { value: 'CSM1', label: 'CSM1 - LOJA PRAZO SAFRA ULTIMO DIA MAIO' },
  { value: 'CT01', label: 'CT01 - LOJA SETOR VAREJO CARTÃO 30 DIAS' },
  { value: 'CT02', label: 'CT02 - LOJA SETOR VAREJO CARTÃO 2 PARCELAS' },
  { value: 'CT03', label: 'CT03 - LOJA SETOR VAREJO CARTÃO 3 PARCELAS' },
  { value: 'CT04', label: 'CT04 - LOJA SETOR VAREJO CARTÃO 4 PARCELAS' },
  { value: 'CT05', label: 'CT05 - LOJA SETOR VAREJO CARTÃO 5 PARCELAS' },
  { value: 'CT06', label: 'CT06 - LOJA SETOR VAREJO CARTÃO 6 PARCELAS' },
  { value: 'CT07', label: 'CT07 - LOJA SETOR VAREJO CARTÃO 7 PARCELAS' },
  { value: 'CT08', label: 'CT08 - LOJA SETOR VAREJO CARTÃO 8 PARCELAS' },
  { value: 'CT09', label: 'CT09 - LOJA SETOR VAREJO CARTÃO 9 PARCELAS' },
  { value: 'CT10', label: 'CT10 - LOJA SETOR VAREJO CARTÃO 10 PARCELAS' },
  { value: 'CT11', label: 'CT11 - LOJA SETOR VAREJO CARTÃO 11 PARCELAS' },
  { value: 'CT12', label: 'CT12 - LOJA SETOR VAREJO CARTÃO 12 PARCELAS' },
  { value: 'CV00', label: 'CV00 - A VISTA TODOS SETORES NA DT VENDA/COMPRA' },
  { value: 'FC01', label: 'FC01 - Pagamento após 5 dias da emissão da nota' },
  { value: 'FC02', label: 'FC02 - Pagamento após 7 dias da emissão da nota' },
  { value: 'FC03', label: 'FC03 - Pagamento após 10 dias da emissão da nota' },
  { value: 'FC04', label: 'FC04 - Pagamento após 14 dias da emissão da nota' },
  { value: 'FC05', label: 'FC05 - Pagamento após 15 dias da emissão da nota' },
  { value: 'FC06', label: 'FC06 - Pagamento após 19 dias da emissão da nota' },
  { value: 'FC07', label: 'FC07 - Pagamento após 20 dias da emissão da nota' },
  { value: 'FC08', label: 'FC08 - Pagamento após 21 dias da emissão da nota' },
  { value: 'FC09', label: 'FC09 - Pagamento após 21 dias da emissão da nota' },
  { value: 'FC10', label: 'FC10 - Pagamento após 27 dias da emissão da nota' },
  { value: 'FC11', label: 'FC11 - Pagamento após 28 dias da emissão da nota' },
  { value: 'FC12', label: 'FC12 - Pagamento após 30 dias da emissão da nota' },
  { value: 'FC13', label: 'FC13 - Pagamento após 35 dias da emissão da nota' },
  { value: 'FC14', label: 'FC14 - Pagamento após 45 dias da emissão da nota' },
  { value: 'FC15', label: 'FC15 - Pagamento após 60 dias da emissão da nota' },
  { value: 'FC16', label: 'FC16 - Pagamento após 90 dias da emissão da nota' },
  { value: 'FC17', label: 'FC17 - Pagamento após 90 dias da emissão da nota' },
  { value: 'FC18', label: 'FC18 - Pagamento após 120 dias da emissão da nota' },
  { value: 'FCP0', label: 'FCP0 - 14 dias e 28 dias apos emissão nota' },
  { value: 'FCP1', label: 'FCP1 - 15 dias e 30 dias apos emissão nota' },
  { value: 'FCP2', label: 'FCP2 - 15 dias e 35 dias apos emissão nota' },
  { value: 'FCP3', label: 'FCP3 - 20 dias e 40 dias apos emissão nota' },
  { value: 'FCP4', label: 'FCP4 - 28 dias e 42 dias apos emissão nota' },
  { value: 'FCP5', label: 'FCP5 - 28 dias e 56 dias apos emissão nota' },
  { value: 'FCP6', label: 'FCP6 - 30 dias e 45 dias apos emissão nota' },
  { value: 'FCP7', label: 'FCP7 - 30 dias e 60 dias apos emissão nota' },
  { value: 'FCP8', label: 'FCP8 - 45 dias e 75 dias apos emissão nota' },
  { value: 'FCPO', label: 'FCPO - 7 dias e 14 dias apos emissão nota' },
  { value: 'FP01', label: 'FP01 - 7/14/21 dias apos emissão nota' },
  { value: 'FP02', label: 'FP02 - 10/17/24 dias apos emissão nota' },
  { value: 'FP03', label: 'FP03 - 14/21/28 dias apos emissão nota' },
  { value: 'FP04', label: 'FP04 - 15/30/45 dias apos emissão nota' },
  { value: 'FP05', label: 'FP05 - 21/28/35 dias apos emissão nota' },
  { value: 'FP06', label: 'FP06 - 20/30/40 dias apos emissão nota' },
  { value: 'FP07', label: 'FP07 - 28/42/56 dias apos emissão nota' },
  { value: 'FP08', label: 'FP08 - 28/35/42 dias apos emissão nota' },
  { value: 'FP09', label: 'FP09 - 30/45/60 dias apos emissão nota' },
  { value: 'NT00', label: 'NT00' },
  { value: 'NT08', label: 'NT08' },
  { value: 'NT15', label: 'NT15' },
  { value: 'NT30', label: 'NT30' },
  { value: 'NT45', label: 'NT45' },
  { value: 'NT60', label: 'NT60' },
  { value: 'TRM1', label: 'TRM1 - Contratos TRM' },
  { value: 'ZBAR', label: 'ZBAR - Operações de BARTER' },
];

export const organizacaoComprasOptions = [
  { value: '', label: '' },
  { value: '0001', label: '0001 - Einkaufsorg. 0001' },
  { value: '0002', label: '0002' },
  { value: '1000', label: '1000 - Cotrijal' },
  { value: '1410', label: '1410 - Purch. Org. 1410' },
  { value: '1510', label: '1510 - Purch. Org. 1510' },
  { value: '1710', label: '1710 - Purch. Org. 1710' },
  { value: '2000', label: '2000 - Varejo' },
  { value: '3000', label: '3000 - ACM' },
  { value: '4000', label: '4000 - TRANSPORTES' },
  { value: '5000', label: '5000 - AFC' },
  { value: '6000', label: '6000 - Armazenagem de Grãos' },
];

export const organizacaoVendasOptions = [
  { value: '', label: '' },
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

export const canalDistribuicaoOptions = [
  { value: '', label: '' },
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

export const setorAtividadeOptions = [
  { value: '', label: '' },
  { value: '00', label: '00 - Coluna produtos 00' },
  { value: '01', label: '01 - Família produtos 01' },
  { value: '10', label: '10 - Insumos' },
  { value: '20', label: '20 - Varejo' },
  { value: '30', label: '30 - Grãos' },
  { value: '40', label: '40 - Combustível' },
  { value: '50', label: '50 - Outros' },
  { value: '60', label: '60 - Serviços' },
  { value: '70', label: '70 - Leite' },
  { value: 'GR', label: 'GR - Setor Ativ. GR' },
  { value: 'TR', label: 'TR - Setor Transf.Centros' },
];

export const incotermsOptions = [
  { value: '', label: '' },
  { value: 'CFR', label: 'CFR - Custos e frete' },
  { value: 'CIF', label: 'CIF - Custos, seguro e frete' },
  { value: 'CIP', label: 'CIP - Frete e seguro pagos' },
  { value: 'CPT', label: 'CPT - Frete pago' },
  { value: 'DAF', label: 'DAF - Entregue na fronteira' },
  { value: 'DAP', label: 'DAP - Fornecido no local' },
  { value: 'DAT', label: 'DAT - Fornecido no terminal' },
  { value: 'DDP', label: 'DDP - Entregue desalfandegado' },
  { value: 'DDU', label: 'DDU - Entregue sem desembaraço alf.' },
  { value: 'DEQ', label: 'DEQ - Entregue cais (direitos pagos)' },
  { value: 'DES', label: 'DES - Entregue no navio' },
  { value: 'DPU', label: 'DPU - Fornecido no loc.descarregado' },
  { value: 'EXW', label: 'EXW - Na origem' },
  { value: 'FAS', label: 'FAS - Posto ao lado do navio' },
  { value: 'FCA', label: 'FCA - Franco transportador' },
  { value: 'FH', label: 'FH - Franco domicílio' },
  { value: 'FOB', label: 'FOB - Franco a bordo' },
  { value: 'UN', label: 'UN - Porte/frete a pagar' },
  { value: 'ZFO', label: 'ZFO - FOB ACM (c/um evento de receb)' },
];

export const equipeVendasOptions = [
  { value: '', label: '' },
  { value: '0001', label: '0001 - Agência vendas Sul' },
  { value: '140', label: '140 - Escrit.vendas 140' },
  { value: '150', label: '150 - Escrit.vendas 140' },
  { value: '170', label: '170 - Escrit.vendas 170' },
];

// ----------------------------------------------------------------------
// Funções de conversão para checkboxes (flags SAP)

/**
 * Converte valor do checkbox do frontend para o formato do backend
 * @param {boolean} value - Valor do checkbox (true/false)
 * @returns {string} - 'X' se marcado, '' se desmarcado
 */
export function convertCheckboxToBackend(value) {
  return value ? 'X' : '';
}

/**
 * Converte valor do backend para o formato do frontend (checkbox)
 * @param {string} value - Valor do backend ('X', '', null, undefined)
 * @returns {boolean} - true se 'X', false caso contrário
 */
export function convertCheckboxFromBackend(value) {
  return value === 'X';
}
