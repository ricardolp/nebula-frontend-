/**
 * Fonte única dos campos de Business Partner para:
 * - Form builder (/dashboard/forms/:id/edit): biblioteca de campos para arrastar
 * - Novo parceiro (/dashboard/business-partners/new): campos exibidos vêm só dos que foram arrastados neste formulário
 *
 * Os campos disponíveis no form builder são exatamente os que podem aparecer no "new".
 * Cada item: { id, label, campo, tabela }. O "campo" é a chave usada na API e no estado (pode repetir em tabelas diferentes).
 */

function t(id, label, campo, tabela) {
  return { id: `bp-${id}`, label, campo, tabela };
}

// ----------------------------------------------------------------------
// 1. Parceiro (dados principais)
// ----------------------------------------------------------------------
const PARCEIRO = [
  t('codigo_antigo', 'Cód. antigo', 'codigo_antigo', 'BusinessPartner'),
  t('tipo', 'Tipo', 'tipo', 'BusinessPartner'),
  t('funcao', 'Função', 'funcao', 'BusinessPartner'),
  t('grupo_contas', 'Grupo contas', 'grupo_contas', 'BusinessPartner'),
  t('agr_contas', 'Agr. contas', 'agr_contas', 'BusinessPartner'),
  t('sexo', 'Gênero', 'sexo', 'BusinessPartner'),
  t('nome_nome_fantasia', 'Nome / Nome fantasia', 'nome_nome_fantasia', 'BusinessPartner'),
  t('sobrenome_razao_social', 'Sobrenome / Razão social', 'sobrenome_razao_social', 'BusinessPartner'),
  t('nome3', 'Nome 3', 'nome3', 'BusinessPartner'),
  t('nome4', 'Nome 4', 'nome4', 'BusinessPartner'),
  t('termo_pesquisa1', 'Termo pesquisa 1', 'termo_pesquisa1', 'BusinessPartner'),
  t('termo_pesquisa2', 'Termo pesquisa 2', 'termo_pesquisa2', 'BusinessPartner'),
  t('vocativo', 'Vocativo', 'vocativo', 'BusinessPartner'),
  t('data_nascimento_fundacao', 'Data de Nascimento/Fundação', 'data_nascimento_fundacao', 'BusinessPartner'),
];

// ----------------------------------------------------------------------
// 2. Endereço
// ----------------------------------------------------------------------
const ENDERECO = [
  t('rua', 'Rua', 'rua', 'Address'),
  t('rua2', 'Rua 2', 'rua2', 'Address'),
  t('numero', 'Número', 'numero', 'Address'),
  t('complemento', 'Complemento', 'complemento', 'Address'),
  t('bairro', 'Bairro', 'bairro', 'Address'),
  t('cep', 'CEP', 'cep', 'Address'),
  t('cidade', 'Cidade', 'cidade', 'Address'),
  t('estado', 'Estado', 'estado', 'Address'),
  t('pais', 'País', 'pais', 'Address'),
];

// ----------------------------------------------------------------------
// 3. Comunicação
// ----------------------------------------------------------------------
const COMUNICACAO = [
  t('telefone', 'Telefone', 'telefone', 'Communication'),
  t('telefone2', 'Telefone 2', 'telefone2', 'Communication'),
  t('telefone3', 'Telefone 3', 'telefone3', 'Communication'),
  t('celular', 'Celular', 'celular', 'Communication'),
  t('email', 'E-mail', 'email', 'Communication'),
  t('observacoes_com', 'Observações', 'observacoes_com', 'Communication'),
  t('data_nascimento', 'Data nascimento', 'data_nascimento', 'Communication'),
  t('data_fundacao', 'Data fundação', 'data_fundacao', 'Communication'),
];

// ----------------------------------------------------------------------
// 4. Identificação
// ----------------------------------------------------------------------
const IDENTIFICACAO = [
  t('cpf', 'CPF', 'cpf', 'Identification'),
  t('cnpj', 'CNPJ', 'cnpj', 'Identification'),
  t('inscr_estatual', 'Inscr. estadual', 'inscr_estatual', 'Identification'),
  t('inscr_municipal', 'Inscr. municipal', 'inscr_municipal', 'Identification'),
  t('tipo_id_ident', 'Tipo ID ident.', 'tipo_id_ident', 'Identification'),
  t('numero_id', 'Número ID', 'numero_id', 'Identification'),
];

// ----------------------------------------------------------------------
// 5. Setor Industrial
// ----------------------------------------------------------------------
const SETOR_INDUSTRIAL = [
  t('chave_setor_ind', 'Chave setor ind.', 'chave_setor_ind', 'IndustrySector'),
  t('cod_setor_ind', 'Cód. setor ind.', 'cod_setor_ind', 'IndustrySector'),
  t('setor_ind_padrao', 'Setor ind. padrão', 'setor_ind_padrao', 'IndustrySector'),
];

// ----------------------------------------------------------------------
// 6. Pagamentos
// ----------------------------------------------------------------------
const PAGAMENTOS = [
  t('cod_banco', 'Cód. banco', 'cod_banco', 'Payment'),
  t('cod_agencia', 'Cód. agência', 'cod_agencia', 'Payment'),
  t('dig_agencia', 'Díg. agência', 'dig_agencia', 'Payment'),
  t('cod_conta', 'Cód. conta', 'cod_conta', 'Payment'),
  t('dig_conta', 'Díg. conta', 'dig_conta', 'Payment'),
  t('favorecido', 'Favorecido', 'favorecido', 'Payment'),
  t('cpf_favorecido', 'CPF favorecido', 'cpf_favorecido', 'Payment'),
];

// ----------------------------------------------------------------------
// 7. Funções de Parceiro
// ----------------------------------------------------------------------
const FUNCOES_PARCEIRO = [
  t('funcao_parceiro', 'Função do parceiro', 'funcao_parceiro', 'PartnerFunction'),
  t('autorizacao', 'Autorização', 'autorizacao', 'PartnerFunction'),
  t('validade_inicio', 'Validade início', 'validade_inicio', 'PartnerFunction'),
  t('validade_fim', 'Validade fim', 'validade_fim', 'PartnerFunction'),
];

// ----------------------------------------------------------------------
// 8. Dados Adicionais
// ----------------------------------------------------------------------
const DADOS_ADICIONAIS = [
  t('referencia_externa', 'Referência externa', 'referencia_externa', 'AdditionalData'),
  t('codigo_antigo_add', 'Código antigo', 'codigo_antigo_add', 'AdditionalData'),
  t('observacoes_add', 'Observações', 'observacoes_add', 'AdditionalData'),
  t('informacoes_complementares', 'Informações complementares', 'informacoes_complementares', 'AdditionalData'),
];

// ----------------------------------------------------------------------
// 9. Fornecedor (dados básicos)
// ----------------------------------------------------------------------
const FORNECEDOR = [
  t('devolucao', 'Devolução', 'devolucao', 'Vendor'),
  t('rev_fat_bas_em', 'Rev. fat. bás. em', 'rev_fat_bas_em', 'Vendor'),
  t('rev_fat_bas_serv', 'Rev. fat. bás. serv.', 'rev_fat_bas_serv', 'Vendor'),
  t('relevante_liquidacao', 'Relevante liquidação', 'relevante_liquidacao', 'Vendor'),
  t('pedido_autom', 'Pedido autom.', 'pedido_autom', 'Vendor'),
  t('tipo_nfe', 'Tipo NFe', 'tipo_nfe', 'Vendor'),
  t('tipo_imposto', 'Tipo imposto', 'tipo_imposto', 'Vendor'),
  t('simples_nacional', 'Simples nacional', 'simples_nacional', 'Vendor'),
  t('grp_esq_forn', 'Grp. esq. forn.', 'grp_esq_forn', 'Vendor'),
  t('cntrle_confir', 'Controle confir.', 'cntrle_confir', 'Vendor'),
  t('regime_pis_cofins', 'Regime PIS/COFINS', 'regime_pis_cofins', 'Vendor'),
  t('optante_simples', 'Optante simples', 'optante_simples', 'Vendor'),
  t('recebedor_alternativo', 'Recebedor alternativo', 'recebedor_alternativo', 'Vendor'),
];

// ----------------------------------------------------------------------
// 10. Fornecedor Compras
// ----------------------------------------------------------------------
const FORNECEDOR_COMPRAS = [
  t('org_compras', 'Org. compras', 'org_compras', 'VendorPurchasing'),
  t('moeda_pedido', 'Moeda pedido', 'moeda_pedido', 'VendorPurchasing'),
  t('cond_pgto_fc', 'Cond. pgto', 'cond_pgto_fc', 'VendorPurchasing'),
  t('vers_incoterms', 'Vers. incoterms', 'vers_incoterms', 'VendorPurchasing'),
  t('incoterms', 'Incoterms', 'incoterms', 'VendorPurchasing'),
  t('local_inco1', 'Local inco 1', 'local_inco1', 'VendorPurchasing'),
  t('compensacao', 'Compensação', 'compensacao', 'VendorPurchasing'),
  t('marc_preco_forn', 'Marc. preço forn.', 'marc_preco_forn', 'VendorPurchasing'),
];

// ----------------------------------------------------------------------
// 11. Fornecedor Empresa
// ----------------------------------------------------------------------
const FORNECEDOR_EMPRESA = [
  t('fe-centro', 'Centro', 'centro', 'VendorCompany'),
  t('fe-empresa', 'Empresa', 'empresa', 'VendorCompany'),
  t('fe-conta_conciliacao', 'Conta conciliação', 'conta_conciliacao', 'VendorCompany'),
  t('fe-grp_admin_tesouraria', 'Grp. admin tesouraria', 'grp_admin_tesouraria', 'VendorCompany'),
  t('fe-minorit', 'Minoritário', 'minorit', 'VendorCompany'),
  t('fe-cond_pgto', 'Cond. pgto', 'cond_pgto', 'VendorCompany'),
  t('fe-form_pgto', 'Form. pgto', 'form_pgto', 'VendorCompany'),
  t('fe-banco_empresa_fornecedor', 'Banco empresa fornecedor', 'banco_empresa_fornecedor', 'VendorCompany'),
  t('fe-verificar_fatura_duplicada', 'Verif. fatura duplicada', 'verificar_fatura_duplicada', 'VendorCompany'),
  t('fe-procedimento_advertencia', 'Proced. advertencia', 'procedimento_advertencia', 'VendorCompany'),
  t('fe-responsavel_advertencia', 'Respons. advertencia', 'responsavel_advertencia', 'VendorCompany'),
  t('fe-contrib_icms', 'Contrib. ICMS', 'contrib_icms', 'VendorCompany'),
  t('fe-tp_princ_set_ind', 'Tp. princ. set. ind.', 'tp_princ_set_ind', 'VendorCompany'),
];

// ----------------------------------------------------------------------
// 12. Fornecedor IRF
// ----------------------------------------------------------------------
const FORNECEDOR_IRF = [
  t('ctg_irf', 'Categoria IRF', 'ctg_irf', 'VendorIRF'),
  t('codigo_irf', 'Código IRF', 'codigo_irf', 'VendorIRF'),
];

// ----------------------------------------------------------------------
// 13. Cliente Vendas / Vendas e distribuição
// ----------------------------------------------------------------------
const CLIENTE_VENDAS = [
  t('org_vendas', 'Org. vendas', 'org_vendas', 'CustomerSales'),
  t('canal_distr', 'Canal distr.', 'canal_distr', 'CustomerSales'),
  t('setor_ativ', 'Setor ativ.', 'setor_ativ', 'CustomerSales'),
  t('regiao_vendas', 'Região vendas', 'regiao_vendas', 'CustomerSales'),
  t('prioridade_remessa', 'Prioridade remessa', 'prioridade_remessa', 'CustomerSales'),
  t('incoterms_cs', 'Incoterms', 'incoterms_cs', 'CustomerSales'),
  t('local_inco1_cs', 'Local inco 1', 'local_inco1_cs', 'CustomerSales'),
  t('grp_class_cont_cli', 'Grp. class cont. cli', 'grp_class_cont_cli', 'CustomerSales'),
  t('class_fiscal', 'Class. fiscal', 'class_fiscal', 'CustomerSales'),
  t('moeda_cliente', 'Moeda cliente', 'moeda_cliente', 'CustomerSales'),
  t('esquema_cliente', 'Esquema cliente', 'esquema_cliente', 'CustomerSales'),
  t('grupo_preco', 'Grupo preço', 'grupo_preco', 'CustomerSales'),
  t('lista_preco', 'Lista preço', 'lista_preco', 'CustomerSales'),
  t('compensacao_cs', 'Compensação', 'compensacao_cs', 'CustomerSales'),
  t('icms', 'ICMS', 'icms', 'CustomerSales'),
  t('ipi', 'IPI', 'ipi', 'CustomerSales'),
  t('subst_fiscal', 'Subst. fiscal', 'subst_fiscal', 'CustomerSales'),
  t('cfop', 'CFOP', 'cfop', 'CustomerSales'),
  t('contrib_icms', 'Contrib. ICMS', 'contrib_icms', 'CustomerSales'),
  t('tp_princ_set_ind', 'Tp. princ. set. ind.', 'tp_princ_set_ind', 'CustomerSales'),
  t('agrupamento_ordens', 'Agrupamento ordens', 'agrupamento_ordens', 'CustomerSales'),
  t('vendas_grupo_clientes', 'Vendas grupo clientes', 'vendas_grupo_clientes', 'CustomerSales'),
  t('vendas_escritorio_vendas', 'Vendas escritório', 'vendas_escritorio_vendas', 'CustomerSales'),
  t('vendas_equipe_vendas', 'Vendas equipe', 'vendas_equipe_vendas', 'CustomerSales'),
  t('vendas_atributo_1', 'Vendas atributo 1', 'vendas_atributo_1', 'CustomerSales'),
  t('vendas_atributo_2', 'Vendas atributo 2', 'vendas_atributo_2', 'CustomerSales'),
  t('vendas_sociedade_parceiro', 'Vendas sociedade parceiro', 'vendas_sociedade_parceiro', 'CustomerSales'),
  t('vendas_centro_fornecedor', 'Vendas centro fornecedor', 'vendas_centro_fornecedor', 'CustomerSales'),
  t('condicao_expedicao', 'Condição expedição', 'condicao_expedicao', 'CustomerSales'),
  t('vendas_relevante_liquidacao', 'Vendas relevante liquidação', 'vendas_relevante_liquidacao', 'CustomerSales'),
  t('relevante_crr', 'Relevante CRR', 'relevante_crr', 'CustomerSales'),
  t('perfil_cliente_bayer', 'Perfil cliente Bayer', 'perfil_cliente_bayer', 'CustomerSales'),
];

// ----------------------------------------------------------------------
// 14. Cliente Empresa
// ----------------------------------------------------------------------
const CLIENTE_EMPRESA = [
  t('ce-centro', 'Centro', 'centro', 'CustomerCompany'),
  t('ce-empresa', 'Empresa', 'empresa', 'CustomerCompany'),
  t('ce-conta_conciliacao', 'Conta conciliação', 'conta_conciliacao', 'CustomerCompany'),
  t('ce-cond_pgto', 'Cond. pgto', 'cond_pgto', 'CustomerCompany'),
  t('ce-chv_ordenacao', 'Chv. ordenação', 'chv_ordenacao', 'CustomerCompany'),
  t('ce-grp_admin_tesouraria', 'Grp. admin tesouraria', 'grp_admin_tesouraria', 'CustomerCompany'),
  t('ce-ajus_valor', 'Ajus. valor', 'ajus_valor', 'CustomerCompany'),
  t('ce-form_pgto', 'Form. pgto', 'form_pgto', 'CustomerCompany'),
  t('ce-banco_empresa_cliente', 'Banco empresa cliente', 'banco_empresa_cliente', 'CustomerCompany'),
  t('ce-verificar_fatura_duplicada', 'Verif. fatura duplicada', 'verificar_fatura_duplicada', 'CustomerCompany'),
  t('ce-procedimento_advertencia', 'Proced. advertencia', 'procedimento_advertencia', 'CustomerCompany'),
  t('ce-responsavel_advertencia', 'Respons. advertencia', 'responsavel_advertencia', 'CustomerCompany'),
];

// ----------------------------------------------------------------------
// 15. Dados de Crédito
// ----------------------------------------------------------------------
const DADOS_CREDITO = [
  t('crd-partner', 'Parceiro', 'partner', 'CreditData'),
  t('crd-role', 'Função', 'role', 'CreditData'),
  t('limit_rule', 'Regra de limite', 'limit_rule', 'CreditData'),
  t('risk_class', 'Classe de risco', 'risk_class', 'CreditData'),
  t('check_rule', 'Regra de verificação', 'check_rule', 'CreditData'),
  t('credit_group', 'Grupo de crédito', 'credit_group', 'CreditData'),
  t('segment', 'Segmento', 'segment', 'CreditData'),
  t('credit_limit', 'Limite de crédito', 'credit_limit', 'CreditData'),
  t('limit_valid_date', 'Data validade limite', 'limit_valid_date', 'CreditData'),
  t('follow_up_dt', 'Data acompanhamento', 'follow_up_dt', 'CreditData'),
  t('xblocked', 'Bloqueado', 'xblocked', 'CreditData'),
  t('infocategory', 'Categoria informação', 'infocategory', 'CreditData'),
  t('infotype', 'Tipo informação', 'infotype', 'CreditData'),
  t('check_relevant', 'Verificação relevante', 'check_relevant', 'CreditData'),
  t('amount', 'Valor', 'amount', 'CreditData'),
  t('currency', 'Moeda', 'currency', 'CreditData'),
  t('date_from', 'Data inicial', 'date_from', 'CreditData'),
  t('date_to', 'Data final', 'date_to', 'CreditData'),
  t('date_follow_up', 'Data acompanhamento', 'date_follow_up', 'CreditData'),
  t('text', 'Texto/Observações', 'text', 'CreditData'),
];

// ----------------------------------------------------------------------
// 16. Credit Collection
// ----------------------------------------------------------------------
const CREDIT_COLLECTION = [
  t('coll-cod_antigo', 'Cód. antigo', 'cod_antigo', 'CreditCollection'),
  t('coll-role', 'Função', 'role', 'CreditCollection'),
  t('perfil', 'Perfil', 'perfil', 'CreditCollection'),
  t('coll-segment', 'Segmento', 'segment', 'CreditCollection'),
  t('grupo', 'Grupo', 'grupo', 'CreditCollection'),
  t('resp', 'Responsável', 'resp', 'CreditCollection'),
];

// ----------------------------------------------------------------------
// Grupos para o form builder (mesma ordem e conteúdo que podem aparecer no new)
// ----------------------------------------------------------------------
export const PARTNER_FIELD_GROUPS = [
  { key: 'parceiro', title: 'Parceiro (dados principais)', icon: 'solar:user-id-bold', templates: PARCEIRO },
  { key: 'endereco', title: 'Endereço', icon: 'solar:map-point-bold', templates: ENDERECO },
  { key: 'comunicacao', title: 'Comunicação', icon: 'solar:plain-2-bold', templates: COMUNICACAO },
  { key: 'identificacao', title: 'Identificação', icon: 'solar:card-2-bold', templates: IDENTIFICACAO },
  { key: 'setor_industrial', title: 'Setor industrial', icon: 'solar:buildings-2-bold', templates: SETOR_INDUSTRIAL },
  { key: 'pagamentos', title: 'Pagamentos', icon: 'solar:wallet-money-bold', templates: PAGAMENTOS },
  { key: 'funcoes_parceiro', title: 'Funções de parceiro', icon: 'solar:settings-bold', templates: FUNCOES_PARCEIRO },
  { key: 'dados_adicionais', title: 'Dados adicionais', icon: 'solar:document-text-bold', templates: DADOS_ADICIONAIS },
  { key: 'fornecedor', title: 'Fornecedor', icon: 'solar:box-bold', templates: FORNECEDOR },
  { key: 'fornecedor_compras', title: 'Fornecedor – Compras', icon: 'solar:cart-large-bold', templates: FORNECEDOR_COMPRAS },
  { key: 'fornecedor_empresa', title: 'Fornecedor – Empresa', icon: 'solar:buildings-3-bold', templates: FORNECEDOR_EMPRESA },
  { key: 'fornecedor_irf', title: 'Fornecedor – IRF', icon: 'solar:list-bold', templates: FORNECEDOR_IRF },
  { key: 'cliente_vendas', title: 'Cliente – Vendas', icon: 'solar:chart-2-bold', templates: CLIENTE_VENDAS },
  { key: 'cliente_empresa', title: 'Cliente – Empresa', icon: 'solar:users-group-two-rounded-bold', templates: CLIENTE_EMPRESA },
  { key: 'dados_credito', title: 'Dados de crédito', icon: 'solar:shield-check-bold', templates: DADOS_CREDITO },
  { key: 'credit_collection', title: 'Credit Collection', icon: 'solar:bill-list-bold', templates: CREDIT_COLLECTION },
];

/** Lista plana: todos os campos que podem ser arrastados no builder e exibidos no new */
const PARTNER_FIELD_TEMPLATES = PARTNER_FIELD_GROUPS.flatMap((g) => g.templates);

export { PARTNER_FIELD_TEMPLATES };
