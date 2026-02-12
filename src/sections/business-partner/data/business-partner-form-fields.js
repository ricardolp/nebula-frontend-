/**
 * Definição de todos os campos do formulário Business Partner conforme LISTA-CAMPOS-BP.md.
 * Cada seção exporta um array de { name, label, widget?, section } para o form builder.
 */

export const SECTION_GENERAL = 'general';
export const SECTION_ADDRESS = 'address';
export const SECTION_COMMUNICATION = 'communication';
export const SECTION_IDENTIFICATION = 'identification';
export const SECTION_INDUSTRIAL_SECTOR = 'industrial-sector';
export const SECTION_PAYMENTS = 'payments';
export const SECTION_PARTNER_FUNCTIONS = 'partner-functions';
export const SECTION_ADDITIONAL_DATA = 'additional-data';
export const SECTION_PURCHASES = 'purchases';
export const SECTION_SALES = 'sales';
export const SECTION_CREDIT_DATA = 'credit-data';
export const SECTION_CREDIT_COLLECTION = 'credit-collection';

// ----------------------------------------------------------------------
// 1. Dados Básicos (General)
// ----------------------------------------------------------------------
export const FIELDS_GENERAL = [
  { name: 'tipo', label: 'Tipo' },
  { name: 'funcao', label: 'Função' },
  { name: 'agrContas', label: 'Agrupamento de Contas' },
  { name: 'vocativo', label: 'Vocativo' },
  { name: 'nomeNomeFantasia', label: 'Nome / Nome Fantasia' },
  { name: 'sobrenomeRazaoSocial', label: 'Sobrenome / Razão Social' },
  { name: 'nome3', label: 'Nome 3' },
  { name: 'nome4', label: 'Nome 4' },
  { name: 'dataNascimentoFundacao', label: 'Data de Nascimento/Fundação', widget: 'date' },
  { name: 'sexo', label: 'Gênero' },
  { name: 'termoPesquisa1', label: 'Termo de Pesquisa 1' },
  { name: 'termoPesquisa2', label: 'Termo de Pesquisa 2' },
];

// ----------------------------------------------------------------------
// 3. Endereço (Address)
// ----------------------------------------------------------------------
export const FIELDS_ADDRESS = [
  { name: 'cep', label: 'CEP' },
  { name: 'rua', label: 'Rua' },
  { name: 'numero', label: 'Número', widget: 'number' },
  { name: 'rua2', label: 'Rua 2' },
  { name: 'complemento', label: 'Complemento' },
  { name: 'bairro', label: 'Bairro' },
  { name: 'cidade', label: 'Cidade' },
  { name: 'estado', label: 'Estado' },
  { name: 'pais', label: 'País' },
];

// ----------------------------------------------------------------------
// 4. Comunicação (Communication)
// ----------------------------------------------------------------------
export const FIELDS_COMMUNICATION = [
  { name: 'telefone', label: 'Telefone', widget: 'mask_phone' },
  { name: 'telefone2', label: 'Telefone 2', widget: 'mask_phone' },
  { name: 'telefone3', label: 'Telefone 3', widget: 'mask_phone' },
  { name: 'celular', label: 'Celular', widget: 'mask_phone' },
  { name: 'email', label: 'E-mail', widget: 'email' },
  { name: 'comunicacaoObservacoes', label: 'Observações' },
];

// ----------------------------------------------------------------------
// 5. Identificação (Identification)
// ----------------------------------------------------------------------
export const FIELDS_IDENTIFICATION = [
  { name: 'cpf', label: 'CPF', widget: 'mask_cpf' },
  { name: 'cnpj', label: 'CNPJ', widget: 'mask_cnpj' },
  { name: 'inscrEstatual', label: 'Inscrição Estadual' },
  { name: 'inscrMunicipal', label: 'Inscrição Municipal' },
  { name: 'tipoIdIdent', label: 'Tipo de Identificação' },
  { name: 'numeroId', label: 'Número de Identificação' },
];

// ----------------------------------------------------------------------
// 6. Setor Industrial (Industrial Sector)
// ----------------------------------------------------------------------
export const FIELDS_INDUSTRIAL_SECTOR = [
  { name: 'chaveSetorInd', label: 'Chave Setor Industrial' },
  { name: 'codSetorInd', label: 'Código Setor Industrial' },
  { name: 'setorIndPadrao', label: 'Setor Industrial Padrão' },
];

// ----------------------------------------------------------------------
// 7. Pagamentos (Payments)
// ----------------------------------------------------------------------
export const FIELDS_PAYMENTS = [
  { name: 'codBanco', label: 'Código do Banco', widget: 'number' },
  { name: 'codAgencia', label: 'Código da Agência', widget: 'number' },
  { name: 'digAgencia', label: 'Dígito da Agência' },
  { name: 'codConta', label: 'Código da Conta', widget: 'number' },
  { name: 'digConta', label: 'Dígito da Conta' },
  { name: 'favorecido', label: 'Favorecido' },
  { name: 'cpfFavorecido', label: 'CPF do Favorecido', widget: 'mask_cpf' },
];

// ----------------------------------------------------------------------
// 8. Funções de Parceiro (Partner Functions)
// ----------------------------------------------------------------------
export const FIELDS_PARTNER_FUNCTIONS = [
  { name: 'funcaoParceiro', label: 'Função do Parceiro' },
  { name: 'autorizacao', label: 'Autorização' },
  { name: 'validadeInicio', label: 'Validade Início', widget: 'date' },
  { name: 'validadeFim', label: 'Validade Fim', widget: 'date' },
];

// ----------------------------------------------------------------------
// 9. Dados Adicionais (Additional Data)
// ----------------------------------------------------------------------
export const FIELDS_ADDITIONAL_DATA = [
  { name: 'referenciaExterna', label: 'Referência Externa' },
  { name: 'codigoAntigo', label: 'Código Antigo' },
  { name: 'observacoes', label: 'Observações' },
  { name: 'informacoesComplementares', label: 'Informações Complementares' },
];

// ----------------------------------------------------------------------
// 10. Compras (Purchases) – Fornecedor – dados básicos (objeto fornecedor)
// ----------------------------------------------------------------------
export const FIELDS_FORNECEDOR_BASIC = [
  { name: 'devolucao', label: 'Devolução', widget: 'checkbox' },
  { name: 'revFatBasEm', label: 'Revisão Fatura Baseada em Entrada de Mercadoria', widget: 'checkbox' },
  { name: 'revFatBasServ', label: 'Revisão Fatura Baseada em Serviço', widget: 'checkbox' },
  { name: 'relevanteLiquidacao', label: 'Relevante para Liquidação', widget: 'checkbox' },
  { name: 'pedidoAutom', label: 'Pedido Automático', widget: 'checkbox' },
  { name: 'tipoNfe', label: 'Tipo NFe' },
  { name: 'tipoImposto', label: 'Tipo Imposto' },
  { name: 'simplesNacional', label: 'Simples Nacional' },
  { name: 'grpEsqForn', label: 'Grupo Esquema Fornecedor' },
  { name: 'cntrleConfir', label: 'Controle de Confirmação' },
  { name: 'regimePisCofins', label: 'Regime PIS/COFINS' },
  { name: 'optanteSimples', label: 'Optante Simples' },
  { name: 'recebedorAlternativo', label: 'Recebedor Alternativo' },
];

// Fornecedor Compras (array fornecedorCompras[])
export const FIELDS_FORNECEDOR_COMPRAS = [
  { name: 'orgCompras', label: 'Organização de Compras' },
  { name: 'moedaPedido', label: 'Moeda do Pedido' },
  { name: 'condPgto', label: 'Condição de Pagamento' },
  { name: 'versIncoterms', label: 'Versão Incoterms' },
  { name: 'incoterms', label: 'Incoterms' },
  { name: 'localInco1', label: 'Local Incoterms' },
  { name: 'compensacao', label: 'Compensação', widget: 'checkbox' },
  { name: 'marcPrecoForn', label: 'Marcação de Preço Fornecedor' },
];

// Fornecedor Empresas (array fornecedorEmpresas[])
export const FIELDS_FORNECEDOR_EMPRESAS = [
  { name: 'centro', label: 'Centro' },
  { name: 'empresa', label: 'Empresa' },
  { name: 'contaConciliacao', label: 'Conta de Conciliação' },
  { name: 'grpAdminTesouraria', label: 'Grupo Administração de Tesouraria' },
  { name: 'minorit', label: 'Minoritário' },
  { name: 'condPgto', label: 'Condição de Pagamento' },
  { name: 'formPgto', label: 'Forma de Pagamento' },
  { name: 'bancoEmpresaFornecedor', label: 'Banco Empresa Fornecedor' },
  { name: 'verificarFaturaDuplicada', label: 'Verificar Fatura Duplicada' },
  { name: 'procedimentoAdvertencia', label: 'Procedimento de Advertência' },
  { name: 'responsavelAdvertencia', label: 'Responsável por Advertência' },
  { name: 'contribIcms', label: 'Contribuição ICMS' },
  { name: 'tpPrincSetInd', label: 'Tipo Principal Setor Industrial' },
];

// Fornecedor IRF (array fornecedorIrf[])
export const FIELDS_FORNECEDOR_IRF = [
  { name: 'ctgIrf', label: 'Categoria IRF' },
  { name: 'codigoIrf', label: 'Código IRF' },
];

// ----------------------------------------------------------------------
// 11. Vendas (Sales) – Cliente Vendas (array clienteVendas[])
// ----------------------------------------------------------------------
export const FIELDS_CLIENTE_VENDAS = [
  { name: 'orgVendas', label: 'Organização de Vendas' },
  { name: 'canalDistr', label: 'Canal de Distribuição' },
  { name: 'setorAtiv', label: 'Setor de Atividade' },
  { name: 'regiaoVendas', label: 'Região de Vendas' },
  { name: 'prioridadeRemessa', label: 'Prioridade de Remessa' },
  { name: 'incoterms', label: 'Incoterms' },
  { name: 'localInco1', label: 'Local Incoterms' },
  { name: 'grpClassContCli', label: 'Grupo Classificação Conta Cliente' },
  { name: 'classFiscal', label: 'Classificação Fiscal' },
  { name: 'moedaCliente', label: 'Moeda do Cliente' },
  { name: 'esquemaCliente', label: 'Esquema do Cliente' },
  { name: 'grupoPreco', label: 'Grupo de Preço' },
  { name: 'listaPreco', label: 'Lista de Preços' },
  { name: 'compensacao', label: 'Compensação', widget: 'checkbox' },
  { name: 'icms', label: 'ICMS' },
  { name: 'ipi', label: 'IPI' },
  { name: 'substFiscal', label: 'Substituição Fiscal' },
  { name: 'cfop', label: 'CFOP' },
  { name: 'contribIcms', label: 'Contribuição ICMS' },
  { name: 'tpPrincSetInd', label: 'Tipo Principal Setor Industrial' },
  { name: 'agrupamentoOrdens', label: 'Agrupamento de Ordens', widget: 'checkbox' },
  { name: 'vendasGrupoClientes', label: 'Grupo de Clientes de Vendas' },
  { name: 'vendasEscritorioVendas', label: 'Escritório de Vendas' },
  { name: 'vendasEquipeVendas', label: 'Equipe de Vendas' },
  { name: 'vendasAtributo1', label: 'Atributo de Vendas 1' },
  { name: 'vendasAtributo2', label: 'Atributo de Vendas 2' },
  { name: 'vendasSociedadeParceiro', label: 'Sociedade Parceiro' },
  { name: 'vendasCentroFornecedor', label: 'Centro Fornecedor' },
  { name: 'condicaoExpedicao', label: 'Condição de Expedição' },
  { name: 'vendasRelevanteliquidacao', label: 'Liquidação Relevante', widget: 'checkbox' },
  { name: 'relevanteCrr', label: 'CRR Relevante', widget: 'checkbox' },
  { name: 'perfilClienteBayer', label: 'Perfil do Cliente Bayer' },
];

// Cliente Empresas (array clienteEmpresas[])
export const FIELDS_CLIENTE_EMPRESAS = [
  { name: 'centro', label: 'Centro' },
  { name: 'empresa', label: 'Empresa' },
  { name: 'contaConciliacao', label: 'Conta de Conciliação' },
  { name: 'condPgto', label: 'Condição de Pagamento' },
  { name: 'chvOrdenacao', label: 'Chave de Ordenação' },
  { name: 'grpAdminTesouraria', label: 'Grupo Administração de Tesouraria' },
  { name: 'ajusValor', label: 'Ajuste de Valor' },
  { name: 'formPgto', label: 'Forma de Pagamento' },
  { name: 'bancoEmpresaCliente', label: 'Banco Empresa Cliente' },
  { name: 'verificarFaturaDuplicada', label: 'Verificar Fatura Duplicada' },
  { name: 'procedimentoAdvertencia', label: 'Procedimento de Advertência' },
  { name: 'responsavelAdvertencia', label: 'Responsável por Advertência' },
];

// ----------------------------------------------------------------------
// 12. Dados de Crédito (Credit Data) – array dadosCredito[]
// ----------------------------------------------------------------------
export const FIELDS_CREDIT_DATA = [
  { name: 'partner', label: 'Parceiro' },
  { name: 'role', label: 'Função' },
  { name: 'limitRule', label: 'Regra de Limite' },
  { name: 'riskClass', label: 'Classe de Risco' },
  { name: 'checkRule', label: 'Regra de Verificação' },
  { name: 'creditGroup', label: 'Grupo de Crédito' },
  { name: 'segment', label: 'Segmento' },
  { name: 'creditLimit', label: 'Limite de Crédito', widget: 'number' },
  { name: 'limitValidDate', label: 'Data de Validade do Limite', widget: 'date' },
  { name: 'followUpDt', label: 'Data de Acompanhamento', widget: 'date' },
  { name: 'xblocked', label: 'Bloqueado' },
  { name: 'infocategory', label: 'Categoria de Informação' },
  { name: 'infotype', label: 'Tipo de Informação' },
  { name: 'checkRelevant', label: 'Verificação Relevante' },
  { name: 'amount', label: 'Valor', widget: 'number' },
  { name: 'currency', label: 'Moeda' },
  { name: 'dateFrom', label: 'Data Inicial', widget: 'date' },
  { name: 'dateTo', label: 'Data Final', widget: 'date' },
  { name: 'dateFollowUp', label: 'Data de Acompanhamento', widget: 'date' },
  { name: 'text', label: 'Texto/Observações' },
];

// ----------------------------------------------------------------------
// 13. Credit Collection – array collection[]
// ----------------------------------------------------------------------
export const FIELDS_CREDIT_COLLECTION = [
  { name: 'codAntigo', label: 'Código Antigo' },
  { name: 'role', label: 'Função' },
  { name: 'perfil', label: 'Perfil' },
  { name: 'segment', label: 'Segmento' },
  { name: 'grupo', label: 'Grupo' },
  { name: 'resp', label: 'Responsável' },
];

// ----------------------------------------------------------------------
// Mapa: tab value → lista de definições de campos (para seções fixas)
// ----------------------------------------------------------------------
export const FIELDS_BY_TAB = {
  [SECTION_GENERAL]: [
    { sectionTitle: 'Identificação', fields: FIELDS_GENERAL },
    { sectionTitle: 'Endereço', fields: FIELDS_ADDRESS },
    { sectionTitle: 'Comunicação', fields: FIELDS_COMMUNICATION },
    { sectionTitle: 'Documentos', fields: FIELDS_IDENTIFICATION },
    { sectionTitle: 'Setor Industrial', fields: FIELDS_INDUSTRIAL_SECTOR },
  ],
  [SECTION_PAYMENTS]: [{ sectionTitle: 'Pagamentos', fields: FIELDS_PAYMENTS }],
  [SECTION_PARTNER_FUNCTIONS]: [
    { sectionTitle: 'Funções de Parceiro', fields: FIELDS_PARTNER_FUNCTIONS },
  ],
  [SECTION_ADDITIONAL_DATA]: [
    { sectionTitle: 'Dados Adicionais', fields: FIELDS_ADDITIONAL_DATA },
  ],
  [SECTION_PURCHASES]: [
    { sectionTitle: 'Dados do Fornecedor', fields: FIELDS_FORNECEDOR_BASIC },
    { sectionTitle: 'Fornecedor Compras', fields: FIELDS_FORNECEDOR_COMPRAS, isArray: true },
    { sectionTitle: 'Fornecedor Empresas', fields: FIELDS_FORNECEDOR_EMPRESAS, isArray: true },
    { sectionTitle: 'Fornecedor IRF', fields: FIELDS_FORNECEDOR_IRF, isArray: true },
  ],
  [SECTION_SALES]: [
    { sectionTitle: 'Cliente Vendas', fields: FIELDS_CLIENTE_VENDAS, isArray: true },
    { sectionTitle: 'Cliente Empresas', fields: FIELDS_CLIENTE_EMPRESAS, isArray: true },
  ],
  [SECTION_CREDIT_DATA]: [
    { sectionTitle: 'Dados de Crédito', fields: FIELDS_CREDIT_DATA, isArray: true },
  ],
  [SECTION_CREDIT_COLLECTION]: [
    { sectionTitle: 'Credit Collection', fields: FIELDS_CREDIT_COLLECTION, isArray: true },
  ],
};
