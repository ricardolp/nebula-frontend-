/**
 * Converte valores do formulário (campos por campo/tabela) no payload esperado pela API do BP.
 * Form: formValues keyed by campo (snake_case); formFields com { campo, tabela }.
 * API: payload em camelCase, aninhado por seção (endereco, comunicacao, etc.).
 *
 * Tabelas que viram objeto único: Address -> endereco, Communication -> comunicacao, etc.
 * Tabelas que viram array de 1 item (formulário plano): PartnerFunction -> funcoesParceiro, etc.
 */

function snakeToCamel(str) {
  if (!str || typeof str !== 'string') return str;
  return str
    .split('_')
    .map((part, i) => (i === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()))
    .join('');
}

/** Tabela -> chave no payload. null = raiz; string = objeto aninhado; string com isArray = array de 1 item */
const TABELA_TO_PATH = {
  BusinessPartner: { key: null, array: false },
  Address: { key: 'endereco', array: false },
  Communication: { key: 'comunicacao', array: false },
  Identification: { key: 'identificacao', array: false },
  IndustrySector: { key: 'setorIndustrial', array: false },
  Payment: { key: 'pagamentos', array: false },
  PartnerFunction: { key: 'funcoesParceiro', array: true },
  AdditionalData: { key: 'dadosAdicionais', array: false },
  Vendor: { key: 'fornecedor', array: false },
  VendorPurchasing: { key: 'fornecedorCompras', array: true },
  VendorCompany: { key: 'fornecedorEmpresas', array: true },
  VendorIRF: { key: 'fornecedorIrf', array: true },
  CustomerSales: { key: 'clienteVendas', array: true },
  CustomerCompany: { key: 'clienteEmpresas', array: true },
  CreditData: { key: 'dadosCredito', array: true },
  CreditCollection: { key: 'collection', array: true },
};

/** Normaliza nome da tabela (API pode vir "endereco", "Endereço", "address") para chave canônica do TABELA_TO_PATH */
const TABELA_NORMALIZE = {
  endereco: 'Address',
  endereço: 'Address',
  address: 'Address',
  comunicacao: 'Communication',
  comunicação: 'Communication',
  communication: 'Communication',
  identificacao: 'Identification',
  identificação: 'Identification',
  identification: 'Identification',
  setorindustrial: 'IndustrySector',
  'industry-sector': 'IndustrySector',
  industrysector: 'IndustrySector',
  pagamentos: 'Payment',
  payment: 'Payment',
  funcoesparceiro: 'PartnerFunction',
  'partner-function': 'PartnerFunction',
  partnerfunction: 'PartnerFunction',
  dadosadicionais: 'AdditionalData',
  'additional-data': 'AdditionalData',
  additionaldata: 'AdditionalData',
  fornecedor: 'Vendor',
  vendor: 'Vendor',
  fornecedorcompras: 'VendorPurchasing',
  vendorpurchasing: 'VendorPurchasing',
  fornecedorempresas: 'VendorCompany',
  vendorcompany: 'VendorCompany',
  fornecedorirf: 'VendorIRF',
  vendorirf: 'VendorIRF',
  clientevendas: 'CustomerSales',
  customersales: 'CustomerSales',
  clienteempresas: 'CustomerCompany',
  customercompany: 'CustomerCompany',
  dadoscredito: 'CreditData',
  'credit-data': 'CreditData',
  creditdata: 'CreditData',
  collection: 'CreditCollection',
  'credit-collection': 'CreditCollection',
  creditcollection: 'CreditCollection',
  businesspartner: 'BusinessPartner',
  general: 'BusinessPartner',
};

function normalizeTabela(tabela) {
  if (!tabela || typeof tabela !== 'string') return 'BusinessPartner';
  const trimmed = tabela.trim();
  const normalized = trimmed.toLowerCase().replace(/\s+/g, '').replace(/ç/g, 'c');
  if (TABELA_NORMALIZE[normalized]) return TABELA_NORMALIZE[normalized];
  if (TABELA_TO_PATH[trimmed]) return trimmed;
  return null;
}

/** VendorPurchasing, VendorCompany, VendorIRF ficam dentro de fornecedor (arrays) */
const NESTED_UNDER_FORNECEDOR = ['VendorPurchasing', 'VendorCompany', 'VendorIRF'];

function getPathForTabela(tabela) {
  const canonical = normalizeTabela(tabela);
  const t = canonical || (tabela || 'BusinessPartner').trim();
  const def = TABELA_TO_PATH[t];
  if (def) return def;
  return { key: t === 'BusinessPartner' ? null : snakeToCamel(t), array: false };
}

/**
 * Monta o payload para PATCH do BP a partir dos campos do formulário e valores.
 * @param {Array<{ id, campo, tabela }>} formFields - campos do form (campo em snake_case, tabela)
 * @param {Record<string, unknown>} formValues - valores keyed por campo (snake_case) ou por field.id se keyByFieldId
 * @param {{ keyByFieldId?: boolean }} [options] - se true, formValues é keyed por field.id (evita sobrescrever mesmo campo em abas diferentes)
 * @returns {Record<string, unknown>} payload para PATCH /api/organizations/:orgId/bps/:bpId
 */
export function buildBpPayloadFromForm(formFields, formValues, options = {}) {
  const payload = {};
  const keyByFieldId = Boolean(options?.keyByFieldId);

  if (!Array.isArray(formFields) || !formValues || typeof formValues !== 'object') {
    return payload;
  }

  for (const field of formFields) {
    const value = keyByFieldId ? formValues[field.id] : formValues[field.campo];
    if (value === undefined) continue;

    const { campo, tabela } = field;
    const camelKey = snakeToCamel(campo);
    const canonicalTabela = normalizeTabela(tabela) || tabela?.trim();
    const { key: pathKey, array: isArray } = getPathForTabela(tabela);

    let normalizedValue = value;
    if (value === '' || (typeof value === 'string' && value.trim() === '')) {
      normalizedValue = null;
    } else if (value && typeof value === 'object') {
      if (typeof value.format === 'function') {
        normalizedValue = value.format('YYYY-MM-DD');
      } else if (typeof value.toISOString === 'function') {
        normalizedValue = value.toISOString().slice(0, 10);
      }
    }

    if (pathKey === null) {
      payload[camelKey] = normalizedValue;
      continue;
    }

    if (NESTED_UNDER_FORNECEDOR.includes(canonicalTabela)) {
      if (!payload.fornecedor) payload.fornecedor = {};
      const arrKey = pathKey;
      if (!payload.fornecedor[arrKey]) payload.fornecedor[arrKey] = [{}];
      payload.fornecedor[arrKey][0][camelKey] = normalizedValue;
      continue;
    }

    if (isArray) {
      if (!payload[pathKey]) payload[pathKey] = [{}];
      payload[pathKey][0][camelKey] = normalizedValue;
      continue;
    }

    if (!payload[pathKey]) payload[pathKey] = {};
    payload[pathKey][camelKey] = normalizedValue;
  }

  return payload;
}

// ----------------------------------------------------------------------
// Conversão: valores planos do formulário (business-partner-form-view) → payload aninhado da API
// Usado no POST /api/organizations/:organizationId/bps
// ----------------------------------------------------------------------

function toPayloadVal(val) {
  if (val === null || val === undefined || (typeof val === 'string' && val.trim() === '')) return '';
  if (typeof val === 'object' && typeof val.toISOString === 'function') {
    return val.toISOString().slice(0, 10);
  }
  if (typeof val === 'object' && typeof val.format === 'function') {
    return val.format('YYYY-MM-DD');
  }
  return val;
}

/** Converte um item da lista de áreas de vendas para o formato da API */
function clienteVendasItemToPayload(item) {
  if (!item || typeof item !== 'object') return {};
  const i = item;
  return {
    orgVendas: toPayloadVal(i.orgVendas),
    canalDistr: toPayloadVal(i.canalDistr),
    setorAtiv: toPayloadVal(i.setorAtiv),
    regiaoVendas: toPayloadVal(i.regiaoVendas),
    prioridadeRemessa: toPayloadVal(i.prioridadeRemessa),
    grpClassContCli: toPayloadVal(i.grpClassContCli),
    classFiscal: toPayloadVal(i.classFiscal),
    moedaCliente: toPayloadVal(i.moedaCliente),
    esquemaCliente: toPayloadVal(i.esquemaCliente),
    grupoPreco: toPayloadVal(i.grupoPreco),
    listaPreco: toPayloadVal(i.listaPreco),
    icms: toPayloadVal(i.icms),
    ipi: toPayloadVal(i.ipi),
    substFiscal: toPayloadVal(i.substFiscal),
    cfop: toPayloadVal(i.cfop),
    agrupamentoOrdens: Boolean(i.agrupamentoOrdens),
    vendasGrupoClientes: toPayloadVal(i.vendasGrupoClientes),
    vendasEscritorioVendas: toPayloadVal(i.vendasEscritorioVendas),
    vendasEquipeVendas: toPayloadVal(i.vendasEquipeVendas),
    vendasAtributo1: toPayloadVal(i.vendasAtributo1),
    vendasAtributo2: toPayloadVal(i.vendasAtributo2),
    vendasSociedadeParceiro: toPayloadVal(i.vendasSociedadeParceiro),
    vendasCentroFornecedor: toPayloadVal(i.vendasCentroFornecedor),
    condicaoExpedicao: toPayloadVal(i.condicaoExpedicao),
    vendasRelevanteliquidacao: Boolean(i.vendasRelevanteliquidacao),
    relevanteCrr: Boolean(i.relevanteCrr),
    perfilClienteBayer: toPayloadVal(i.perfilClienteBayer),
  };
}

/** Retorna array clienteVendas para o payload: usa clienteVendasList se existir, senão um item a partir dos flat values */
function mapClienteVendasListToPayload(v) {
  if (Array.isArray(v.clienteVendasList) && v.clienteVendasList.length > 0) {
    return v.clienteVendasList.map(clienteVendasItemToPayload);
  }
  return [clienteVendasItemToPayload({
    orgVendas: v.orgVendas,
    canalDistr: v.canalDistr,
    setorAtiv: v.setorAtiv,
    regiaoVendas: v.regiaoVendas,
    prioridadeRemessa: v.prioridadeRemessa,
    grpClassContCli: v.grpClassContCli,
    classFiscal: v.classFiscal,
    moedaCliente: v.moedaCliente,
    esquemaCliente: v.esquemaCliente,
    grupoPreco: v.grupoPreco,
    listaPreco: v.listaPreco,
    icms: v.icms,
    ipi: v.ipi,
    substFiscal: v.substFiscal,
    cfop: v.cfop,
    agrupamentoOrdens: v.agrupamentoOrdens,
    vendasGrupoClientes: v.vendasGrupoClientes,
    vendasEscritorioVendas: v.vendasEscritorioVendas,
    vendasEquipeVendas: v.vendasEquipeVendas,
    vendasAtributo1: v.vendasAtributo1,
    vendasAtributo2: v.vendasAtributo2,
    vendasSociedadeParceiro: v.vendasSociedadeParceiro,
    vendasCentroFornecedor: v.vendasCentroFornecedor,
    condicaoExpedicao: v.condicaoExpedicao,
    vendasRelevanteliquidacao: v.vendasRelevanteliquidacao,
    relevanteCrr: v.relevanteCrr,
    perfilClienteBayer: v.perfilClienteBayer,
  })];
}

/**
 * Converte o estado plano do formulário (values) no payload aninhado esperado pela API.
 * POST /api/organizations/:organizationId/bps com body JSON.
 * @param {Record<string, unknown>} flatValues - valores do form (tipo, funcao, cep, rua, ...)
 * @returns {Record<string, unknown>} payload para POST (com endereco, comunicacao, etc.)
 */
export function mapFormValuesToBpPayload(flatValues) {
  if (!flatValues || typeof flatValues !== 'object') return {};

  const v = flatValues;
  const payload = {
    tipo: toPayloadVal(v.tipo),
    funcao: toPayloadVal(v.funcao),
    agrContas: toPayloadVal(v.agrContas),
    vocativo: toPayloadVal(v.vocativo),
    nomeNomeFantasia: toPayloadVal(v.nomeNomeFantasia),
    sobrenomeRazaoSocial: toPayloadVal(v.sobrenomeRazaoSocial),
    nome3: toPayloadVal(v.nome3),
    nome4: toPayloadVal(v.nome4),
    dataNascimentoFundacao: toPayloadVal(v.dataNascimentoFundacao),
    sexo: toPayloadVal(v.sexo),
    termoPesquisa1: toPayloadVal(v.termoPesquisa1),
    termoPesquisa2: toPayloadVal(v.termoPesquisa2),
    codigoAntigo: toPayloadVal(v.codigoAntigo),
    endereco: {
      cep: toPayloadVal(v.cep),
      rua: toPayloadVal(v.rua),
      numero: toPayloadVal(v.numero),
      rua2: toPayloadVal(v.rua2),
      complemento: toPayloadVal(v.complemento),
      bairro: toPayloadVal(v.bairro),
      cidade: toPayloadVal(v.cidade),
      estado: toPayloadVal(v.estado),
      pais: toPayloadVal(v.pais) || 'BR',
    },
    comunicacao: {
      telefone: toPayloadVal(v.telefone),
      telefone2: toPayloadVal(v.telefone2),
      telefone3: toPayloadVal(v.telefone3),
      celular: toPayloadVal(v.celular),
      email: toPayloadVal(v.email),
      observacoes: toPayloadVal(v.comunicacaoObservacoes),
    },
    identificacao: {
      cpf: toPayloadVal(v.cpf),
      cnpj: toPayloadVal(v.cnpj),
      inscrEstatual: toPayloadVal(v.inscrEstatual),
      inscrMunicipal: toPayloadVal(v.inscrMunicipal),
      tipoIdIdent: toPayloadVal(v.tipoIdIdent),
      numeroId: toPayloadVal(v.numeroId),
    },
    setorIndustrial: {
      chaveSetorInd: toPayloadVal(v.chaveSetorInd),
      codSetorInd: toPayloadVal(v.codSetorInd),
      setorIndPadrao: toPayloadVal(v.setorIndPadrao),
    },
    pagamentos: [{
      codBanco: toPayloadVal(v.codBanco),
      codAgencia: toPayloadVal(v.codAgencia),
      digAgencia: toPayloadVal(v.digAgencia),
      codConta: toPayloadVal(v.codConta),
      digConta: toPayloadVal(v.digConta),
      favorecido: toPayloadVal(v.favorecido),
      cpfFavorecido: toPayloadVal(v.cpfFavorecido),
    }],
    dadosAdicionais: {
      referenciaExterna: toPayloadVal(v.referenciaExterna),
      codigoAntigo: toPayloadVal(v.codigoAntigo),
      observacoes: toPayloadVal(v.observacoes),
      informacoesComplementares: toPayloadVal(v.informacoesComplementares),
    },
    funcoesParceiro: [{
      funcaoParceiro: toPayloadVal(v.funcaoParceiro),
      autorizacao: toPayloadVal(v.autorizacao),
      validadeInicio: toPayloadVal(v.validadeInicio),
      validadeFim: toPayloadVal(v.validadeFim),
    }],
    fornecedor: {
      devolucao: Boolean(v.devolucao),
      revFatBasEm: Boolean(v.revFatBasEm),
      revFatBasServ: Boolean(v.revFatBasServ),
      relevanteLiquidacao: Boolean(v.relevanteLiquidacao),
      pedidoAutom: Boolean(v.pedidoAutom),
      tipoNfe: toPayloadVal(v.tipoNfe),
      tipoImposto: toPayloadVal(v.tipoImposto),
      simplesNacional: toPayloadVal(v.simplesNacional),
      grpEsqForn: toPayloadVal(v.grpEsqForn),
      cntrleConfir: toPayloadVal(v.cntrleConfir),
      regimePisCofins: toPayloadVal(v.regimePisCofins),
      optanteSimples: toPayloadVal(v.optanteSimples),
      recebedorAlternativo: toPayloadVal(v.recebedorAlternativo),
      ctgIrf: toPayloadVal(v.ctgIrf),
      codigoIrf: toPayloadVal(v.codigoIrf),
      fornecedorCompras: [{
        orgCompras: toPayloadVal(v.orgCompras),
        moedaPedido: toPayloadVal(v.moedaPedido),
        condPgto: toPayloadVal(v.condPgto),
        versIncoterms: toPayloadVal(v.versIncoterms),
        incoterms: toPayloadVal(v.incoterms),
        localInco1: toPayloadVal(v.localInco1),
        compensacao: Boolean(v.compensacao),
        marcPrecoForn: toPayloadVal(v.marcPrecoForn),
      }],
      fornecedorEmpresas: [{
        centro: toPayloadVal(v.centro),
        empresa: toPayloadVal(v.empresa),
        contaConciliacao: toPayloadVal(v.contaConciliacao),
        grpAdminTesouraria: toPayloadVal(v.grpAdminTesouraria),
        minorit: toPayloadVal(v.minorit),
        formPgto: toPayloadVal(v.formPgto),
        bancoEmpresaFornecedor: toPayloadVal(v.bancoEmpresaFornecedor),
        verificarFaturaDuplicada: toPayloadVal(v.verificarFaturaDuplicada),
        procedimentoAdvertencia: toPayloadVal(v.procedimentoAdvertencia),
        responsavelAdvertencia: toPayloadVal(v.responsavelAdvertencia),
        contribIcms: toPayloadVal(v.contribIcms),
        tpPrincSetInd: toPayloadVal(v.tpPrincSetInd),
      }],
    },
    clienteVendas: mapClienteVendasListToPayload(v),
    clienteEmpresas: [{
      chvOrdenacao: toPayloadVal(v.chvOrdenacao),
      ajusValor: toPayloadVal(v.ajusValor),
      bancoEmpresaCliente: toPayloadVal(v.bancoEmpresaCliente),
    }],
    dadosCredito: [{
      partner: toPayloadVal(v.partner),
      creditRole: toPayloadVal(v.creditRole),
      limitRule: toPayloadVal(v.limitRule),
      riskClass: toPayloadVal(v.riskClass),
      checkRule: toPayloadVal(v.checkRule),
      creditGroup: toPayloadVal(v.creditGroup),
      segment: toPayloadVal(v.segment),
      creditLimit: toPayloadVal(v.creditLimit),
      limitValidDate: toPayloadVal(v.limitValidDate),
      followUpDt: toPayloadVal(v.followUpDt),
      xblocked: toPayloadVal(v.xblocked),
      infocategory: toPayloadVal(v.infocategory),
      infotype: toPayloadVal(v.infotype),
      checkRelevant: toPayloadVal(v.checkRelevant),
      amount: toPayloadVal(v.amount),
      currency: toPayloadVal(v.currency),
      dateFrom: toPayloadVal(v.dateFrom),
      dateTo: toPayloadVal(v.dateTo),
      dateFollowUp: toPayloadVal(v.dateFollowUp),
      creditText: toPayloadVal(v.creditText),
    }],
    collection: [{
      codigoAntigo: toPayloadVal(v.collectionCodAntigo),
      collectionRole: toPayloadVal(v.collectionRole),
      perfil: toPayloadVal(v.perfil),
      collectionSegment: toPayloadVal(v.collectionSegment),
      grupo: toPayloadVal(v.grupo),
      resp: toPayloadVal(v.resp),
    }],
  };

  return payload;
}
