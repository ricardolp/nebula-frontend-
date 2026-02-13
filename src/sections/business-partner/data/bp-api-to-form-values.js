/**
 * Converte o BP retornado pela API (GET /api/organizations/:orgId/bps/:bpId)
 * em um objeto plano de valores para preencher o formulário de edição.
 * Apenas chaves existentes no bp são incluídas (merge com estado inicial do form).
 */

function safe(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object' && typeof val.toISOString === 'function') {
    return val.toISOString().slice(0, 10);
  }
  return String(val);
}

/**
 * @param {Record<string, unknown>} bp - objeto bp da API (data.bp)
 * @returns {Record<string, unknown>} objeto plano para setValues(prev => ({ ...prev, ...result }))
 */
export function mapBpApiToFormValues(bp) {
  if (!bp || typeof bp !== 'object') return {};

  const flat = {};

  // Raiz (BusinessPartner)
  if (bp.tipo !== undefined) flat.tipo = safe(bp.tipo);
  if (bp.funcao !== undefined) flat.funcao = safe(bp.funcao);
  if (bp.agrContas !== undefined) flat.agrContas = safe(bp.agrContas);
  if (bp.vocativo !== undefined) flat.vocativo = safe(bp.vocativo);
  if (bp.nomeNomeFantasia !== undefined) flat.nomeNomeFantasia = safe(bp.nomeNomeFantasia);
  if (bp.sobrenomeRazaoSocial !== undefined) flat.sobrenomeRazaoSocial = safe(bp.sobrenomeRazaoSocial);
  if (bp.nome3 !== undefined) flat.nome3 = safe(bp.nome3);
  if (bp.nome4 !== undefined) flat.nome4 = safe(bp.nome4);
  if (bp.dataNascimentoFundacao !== undefined) flat.dataNascimentoFundacao = safe(bp.dataNascimentoFundacao);
  if (bp.sexo !== undefined) flat.sexo = safe(bp.sexo);
  if (bp.termoPesquisa1 !== undefined) flat.termoPesquisa1 = safe(bp.termoPesquisa1);
  if (bp.termoPesquisa2 !== undefined) flat.termoPesquisa2 = safe(bp.termoPesquisa2);
  if (bp.codigoAntigo !== undefined) flat.codigoAntigo = safe(bp.codigoAntigo);

  // endereco (objeto único)
  const endereco = bp.endereco && typeof bp.endereco === 'object' ? bp.endereco : {};
  flat.cep = safe(endereco.cep);
  flat.rua = safe(endereco.rua);
  flat.numero = safe(endereco.numero);
  flat.rua2 = safe(endereco.rua2);
  flat.complemento = safe(endereco.complemento);
  flat.bairro = safe(endereco.bairro);
  flat.cidade = safe(endereco.cidade);
  flat.estado = safe(endereco.estado ?? endereco.uf);
  flat.pais = safe(endereco.pais) || 'BR';

  // comunicacao (objeto único)
  const comunicacao = bp.comunicacao && typeof bp.comunicacao === 'object' ? bp.comunicacao : {};
  flat.telefone = safe(comunicacao.telefone);
  flat.telefone2 = safe(comunicacao.telefone2);
  flat.telefone3 = safe(comunicacao.telefone3);
  flat.celular = safe(comunicacao.celular);
  flat.email = safe(comunicacao.email);
  flat.comunicacaoObservacoes = safe(comunicacao.observacoes ?? comunicacao.comunicacaoObservacoes);

  // identificacao (objeto único)
  const identificacao = bp.identificacao && typeof bp.identificacao === 'object' ? bp.identificacao : {};
  flat.cpf = safe(identificacao.cpf);
  flat.cnpj = safe(identificacao.cnpj);
  flat.inscrEstatual = safe(identificacao.inscrEstatual);
  flat.inscrMunicipal = safe(identificacao.inscrMunicipal);
  flat.tipoIdIdent = safe(identificacao.tipoIdIdent);
  flat.numeroId = safe(identificacao.numeroId);

  // setorIndustrial (objeto único)
  const setorIndustrial = bp.setorIndustrial && typeof bp.setorIndustrial === 'object' ? bp.setorIndustrial : {};
  flat.chaveSetorInd = safe(setorIndustrial.chaveSetorInd);
  flat.codSetorInd = safe(setorIndustrial.codSetorInd);
  flat.setorIndPadrao = safe(setorIndustrial.setorIndPadrao);

  // pagamentos (objeto único; API pode enviar como objeto ou primeiro item de array)
  let pagamentos = bp.pagamentos;
  if (Array.isArray(pagamentos) && pagamentos.length > 0) pagamentos = pagamentos[0];
  if (pagamentos && typeof pagamentos === 'object') {
    flat.codBanco = safe(pagamentos.codBanco);
    flat.codAgencia = safe(pagamentos.codAgencia);
    flat.digAgencia = safe(pagamentos.digAgencia);
    flat.codConta = safe(pagamentos.codConta);
    flat.digConta = safe(pagamentos.digConta);
    flat.favorecido = safe(pagamentos.favorecido);
    flat.cpfFavorecido = safe(pagamentos.cpfFavorecido);
  }

  // dadosAdicionais (objeto único)
  const dadosAdicionais = bp.dadosAdicionais && typeof bp.dadosAdicionais === 'object' ? bp.dadosAdicionais : {};
  flat.referenciaExterna = safe(dadosAdicionais.referenciaExterna);
  if (dadosAdicionais.codigoAntigo !== undefined) flat.codigoAntigo = safe(dadosAdicionais.codigoAntigo);
  flat.observacoes = safe(dadosAdicionais.observacoes);
  flat.informacoesComplementares = safe(dadosAdicionais.informacoesComplementares);

  // funcoesParceiro (array; primeiro item)
  const funcoesParceiro = Array.isArray(bp.funcoesParceiro) && bp.funcoesParceiro[0] ? bp.funcoesParceiro[0] : {};
  if (funcoesParceiro && typeof funcoesParceiro === 'object') {
    flat.funcaoParceiro = safe(funcoesParceiro.funcaoParceiro);
    flat.autorizacao = safe(funcoesParceiro.autorizacao);
    flat.validadeInicio = safe(funcoesParceiro.validadeInicio);
    flat.validadeFim = safe(funcoesParceiro.validadeFim);
  }

  // fornecedor (objeto com arrays internos) – primeiro item de cada array
  const fornecedor = bp.fornecedor && typeof bp.fornecedor === 'object' ? bp.fornecedor : {};
  const vendorPurchasing = Array.isArray(fornecedor.fornecedorCompras) && fornecedor.fornecedorCompras[0] ? fornecedor.fornecedorCompras[0] : {};
  const vendorCompany = Array.isArray(fornecedor.fornecedorEmpresas) && fornecedor.fornecedorEmpresas[0] ? fornecedor.fornecedorEmpresas[0] : {};
  Object.assign(flat, {
    devolucao: Boolean(fornecedor.devolucao),
    revFatBasEm: Boolean(fornecedor.revFatBasEm),
    revFatBasServ: Boolean(fornecedor.revFatBasServ),
    relevanteLiquidacao: Boolean(fornecedor.relevanteLiquidacao),
    pedidoAutom: Boolean(fornecedor.pedidoAutom),
    tipoNfe: safe(fornecedor.tipoNfe),
    tipoImposto: safe(fornecedor.tipoImposto),
    simplesNacional: safe(fornecedor.simplesNacional),
    grpEsqForn: safe(fornecedor.grpEsqForn),
    cntrleConfir: safe(fornecedor.cntrleConfir),
    regimePisCofins: safe(fornecedor.regimePisCofins),
    optanteSimples: safe(fornecedor.optanteSimples),
    recebedorAlternativo: safe(fornecedor.recebedorAlternativo),
    orgCompras: safe(vendorPurchasing.orgCompras),
    moedaPedido: safe(vendorPurchasing.moedaPedido),
    condPgto: safe(vendorPurchasing.condPgto),
    versIncoterms: safe(vendorPurchasing.versIncoterms),
    incoterms: safe(vendorPurchasing.incoterms),
    localInco1: safe(vendorPurchasing.localInco1),
    compensacao: Boolean(vendorPurchasing.compensacao),
    marcPrecoForn: safe(vendorPurchasing.marcPrecoForn),
    centro: safe(vendorCompany.centro),
    empresa: safe(vendorCompany.empresa),
    contaConciliacao: safe(vendorCompany.contaConciliacao),
    grpAdminTesouraria: safe(vendorCompany.grpAdminTesouraria),
    minorit: safe(vendorCompany.minorit),
    formPgto: safe(vendorCompany.formPgto),
    bancoEmpresaFornecedor: safe(vendorCompany.bancoEmpresaFornecedor),
    verificarFaturaDuplicada: safe(vendorCompany.verificarFaturaDuplicada),
    procedimentoAdvertencia: safe(vendorCompany.procedimentoAdvertencia),
    responsavelAdvertencia: safe(vendorCompany.responsavelAdvertencia),
    contribIcms: safe(vendorCompany.contribIcms),
    tpPrincSetInd: safe(vendorCompany.tpPrincSetInd),
    ctgIrf: safe(fornecedor.ctgIrf),
    codigoIrf: safe(fornecedor.codigoIrf),
  });

  // clienteVendas: array completo para múltiplas áreas de vendas; flat mantém primeiro item para compat
  const clienteVendasArray = Array.isArray(bp.clienteVendas) ? bp.clienteVendas : [];
  const mapClienteVendasItem = (item) => {
    const cv = item && typeof item === 'object' ? item : {};
    return {
      orgVendas: safe(cv.orgVendas),
      canalDistr: safe(cv.canalDistr),
      setorAtiv: safe(cv.setorAtiv),
      regiaoVendas: safe(cv.regiaoVendas),
      prioridadeRemessa: safe(cv.prioridadeRemessa),
      grpClassContCli: safe(cv.grpClassContCli),
      classFiscal: safe(cv.classFiscal),
      moedaCliente: safe(cv.moedaCliente),
      esquemaCliente: safe(cv.esquemaCliente),
      grupoPreco: safe(cv.grupoPreco),
      listaPreco: safe(cv.listaPreco),
      icms: safe(cv.icms),
      ipi: safe(cv.ipi),
      substFiscal: safe(cv.substFiscal),
      cfop: safe(cv.cfop),
      agrupamentoOrdens: Boolean(cv.agrupamentoOrdens),
      vendasGrupoClientes: safe(cv.vendasGrupoClientes),
      vendasEscritorioVendas: safe(cv.vendasEscritorioVendas),
      vendasEquipeVendas: safe(cv.vendasEquipeVendas),
      vendasAtributo1: safe(cv.vendasAtributo1),
      vendasAtributo2: safe(cv.vendasAtributo2),
      vendasSociedadeParceiro: safe(cv.vendasSociedadeParceiro),
      vendasCentroFornecedor: safe(cv.vendasCentroFornecedor),
      condicaoExpedicao: safe(cv.condicaoExpedicao),
      vendasRelevanteliquidacao: Boolean(cv.vendasRelevanteliquidacao),
      relevanteCrr: Boolean(cv.relevanteCrr),
      perfilClienteBayer: safe(cv.perfilClienteBayer),
    };
  };
  flat.clienteVendasList = clienteVendasArray.map(mapClienteVendasItem);
  flat.selectedSalesAreaIndex = flat.clienteVendasList.length > 0 ? 0 : null;

  const clienteVendas = clienteVendasArray[0] || {};
  const clienteEmpresas = Array.isArray(bp.clienteEmpresas) && bp.clienteEmpresas[0] ? bp.clienteEmpresas[0] : {};
  Object.assign(flat, {
    orgVendas: safe(clienteVendas.orgVendas),
    canalDistr: safe(clienteVendas.canalDistr),
    setorAtiv: safe(clienteVendas.setorAtiv),
    regiaoVendas: safe(clienteVendas.regiaoVendas),
    prioridadeRemessa: safe(clienteVendas.prioridadeRemessa),
    grpClassContCli: safe(clienteVendas.grpClassContCli),
    classFiscal: safe(clienteVendas.classFiscal),
    moedaCliente: safe(clienteVendas.moedaCliente),
    esquemaCliente: safe(clienteVendas.esquemaCliente),
    grupoPreco: safe(clienteVendas.grupoPreco),
    listaPreco: safe(clienteVendas.listaPreco),
    icms: safe(clienteVendas.icms),
    ipi: safe(clienteVendas.ipi),
    substFiscal: safe(clienteVendas.substFiscal),
    cfop: safe(clienteVendas.cfop),
    agrupamentoOrdens: Boolean(clienteVendas.agrupamentoOrdens),
    vendasGrupoClientes: safe(clienteVendas.vendasGrupoClientes),
    vendasEscritorioVendas: safe(clienteVendas.vendasEscritorioVendas),
    vendasEquipeVendas: safe(clienteVendas.vendasEquipeVendas),
    vendasAtributo1: safe(clienteVendas.vendasAtributo1),
    vendasAtributo2: safe(clienteVendas.vendasAtributo2),
    vendasSociedadeParceiro: safe(clienteVendas.vendasSociedadeParceiro),
    vendasCentroFornecedor: safe(clienteVendas.vendasCentroFornecedor),
    condicaoExpedicao: safe(clienteVendas.condicaoExpedicao),
    vendasRelevanteliquidacao: Boolean(clienteVendas.vendasRelevanteliquidacao),
    relevanteCrr: Boolean(clienteVendas.relevanteCrr),
    perfilClienteBayer: safe(clienteVendas.perfilClienteBayer),
    chvOrdenacao: safe(clienteEmpresas.chvOrdenacao),
    ajusValor: safe(clienteEmpresas.ajusValor),
    bancoEmpresaCliente: safe(clienteEmpresas.bancoEmpresaCliente),
  });

  // dadosCredito[0], collection[0]
  const dadosCredito = Array.isArray(bp.dadosCredito) && bp.dadosCredito[0] ? bp.dadosCredito[0] : {};
  const collection = Array.isArray(bp.collection) && bp.collection[0] ? bp.collection[0] : {};
  Object.assign(flat, {
    partner: safe(dadosCredito.partner),
    creditRole: safe(dadosCredito.creditRole),
    limitRule: safe(dadosCredito.limitRule),
    riskClass: safe(dadosCredito.riskClass),
    checkRule: safe(dadosCredito.checkRule),
    creditGroup: safe(dadosCredito.creditGroup),
    segment: safe(dadosCredito.segment),
    creditLimit: safe(dadosCredito.creditLimit),
    limitValidDate: safe(dadosCredito.limitValidDate),
    followUpDt: safe(dadosCredito.followUpDt),
    xblocked: safe(dadosCredito.xblocked),
    infocategory: safe(dadosCredito.infocategory),
    infotype: safe(dadosCredito.infotype),
    checkRelevant: safe(dadosCredito.checkRelevant),
    amount: safe(dadosCredito.amount),
    currency: safe(dadosCredito.currency),
    dateFrom: safe(dadosCredito.dateFrom),
    dateTo: safe(dadosCredito.dateTo),
    dateFollowUp: safe(dadosCredito.dateFollowUp),
    creditText: safe(dadosCredito.creditText),
    collectionCodAntigo: safe(collection.collectionCodAntigo ?? collection.codigoAntigo),
    collectionRole: safe(collection.collectionRole),
    perfil: safe(collection.perfil),
    collectionSegment: safe(collection.collectionSegment),
    grupo: safe(collection.grupo),
    resp: safe(collection.resp),
  });

  return flat;
}

/** Objeto vazio de área de vendas (clienteVendas) para botão Inserir */
export function getEmptyClienteVendasItem() {
  return {
    orgVendas: '',
    canalDistr: '',
    setorAtiv: '',
    regiaoVendas: '',
    prioridadeRemessa: '',
    grpClassContCli: '',
    classFiscal: '',
    moedaCliente: '',
    esquemaCliente: '',
    grupoPreco: '',
    listaPreco: '',
    icms: '',
    ipi: '',
    substFiscal: '',
    cfop: '',
    agrupamentoOrdens: false,
    vendasGrupoClientes: '',
    vendasEscritorioVendas: '',
    vendasEquipeVendas: '',
    vendasAtributo1: '',
    vendasAtributo2: '',
    vendasSociedadeParceiro: '',
    vendasCentroFornecedor: '',
    condicaoExpedicao: '',
    vendasRelevanteliquidacao: false,
    relevanteCrr: false,
    perfilClienteBayer: '',
  };
}
