/**
 * Campos Parceiro – disponíveis para arrastar quando o tipo do formulário é "partner".
 * Agrupados por seção (Endereço, Comunicação, Identificação, etc.).
 */
import type { FieldTemplate } from './field-templates'

function partnerField(
  id: string,
  label: string,
  campo: string,
  tabela: string
): FieldTemplate {
  return {
    id,
    label,
    campo,
    tabela,
    inputType: 'text',
    group: 'sap-partner',
  }
}

/** Campos base do parceiro */
const PARTNER_BASE: FieldTemplate[] = [
  partnerField('p-cod_antigo', 'Cód. antigo', 'cod_antigo', 'PARCEIRO'),
  partnerField('p-tipo', 'Tipo', 'tipo', 'PARCEIRO'),
  partnerField('p-funcao', 'Função', 'funcao', 'PARCEIRO'),
  partnerField('p-grupo_contas', 'Grupo contas', 'grupo_contas', 'PARCEIRO'),
  partnerField('p-agr_contas', 'Agr. contas', 'agr_contas', 'PARCEIRO'),
  partnerField('p-sexo', 'Sexo', 'sexo', 'PARCEIRO'),
  partnerField('p-nome_nome_fantasia', 'Nome / Nome fantasia', 'nome_nome_fantasia', 'PARCEIRO'),
  partnerField('p-sobrenome_razao_sozial', 'Sobrenome / Razão social', 'sobrenome_razao_sozial', 'PARCEIRO'),
  partnerField('p-nome3', 'Nome 3', 'nome3', 'PARCEIRO'),
  partnerField('p-nome4', 'Nome 4', 'nome4', 'PARCEIRO'),
  partnerField('p-termo_pesquisa1', 'Termo pesquisa 1', 'termo_pesquisa1', 'PARCEIRO'),
  partnerField('p-termo_pesquisa2', 'Termo pesquisa 2', 'termo_pesquisa2', 'PARCEIRO'),
  partnerField('p-vocativo', 'Vocativo', 'vocativo', 'PARCEIRO'),
  partnerField('p-nro_identif', 'Nro. identificação', 'nro_identif', 'PARCEIRO'),
]

/** Endereço */
const PARTNER_ENDERECO: FieldTemplate[] = [
  partnerField('p-rua', 'Rua', 'rua', 'ENDERECO'),
  partnerField('p-rua2', 'Rua 2', 'rua2', 'ENDERECO'),
  partnerField('p-numero', 'Número', 'numero', 'ENDERECO'),
  partnerField('p-complemento', 'Complemento', 'complemento', 'ENDERECO'),
  partnerField('p-bairro', 'Bairro', 'bairro', 'ENDERECO'),
  partnerField('p-cep', 'CEP', 'cep', 'ENDERECO'),
  partnerField('p-cidade', 'Cidade', 'cidade', 'ENDERECO'),
  partnerField('p-estado', 'Estado', 'estado', 'ENDERECO'),
  partnerField('p-pais', 'País', 'pais', 'ENDERECO'),
]

/** Comunicação */
const PARTNER_COMUNICACAO: FieldTemplate[] = [
  partnerField('p-telefone', 'Telefone', 'telefone', 'COMUNICACAO'),
  partnerField('p-telefone2', 'Telefone 2', 'telefone2', 'COMUNICACAO'),
  partnerField('p-telefone3', 'Telefone 3', 'telefone3', 'COMUNICACAO'),
  partnerField('p-celular', 'Celular', 'celular', 'COMUNICACAO'),
  partnerField('p-email', 'E-mail', 'email', 'COMUNICACAO'),
  partnerField('p-observacoes', 'Observações', 'observacoes', 'COMUNICACAO'),
  partnerField('p-data_nascimento', 'Data nascimento', 'data_nascimento', 'COMUNICACAO'),
  partnerField('p-data_fundacao', 'Data fundação', 'data_fundacao', 'COMUNICACAO'),
]

/** Identificação */
const PARTNER_IDENTIFICACAO: FieldTemplate[] = [
  partnerField('p-cpf', 'CPF', 'cpf', 'IDENTIFICACAO'),
  partnerField('p-cnpj', 'CNPJ', 'cnpj', 'IDENTIFICACAO'),
  partnerField('p-incr_estatual', 'Inscr. estadual', 'incr_estatual', 'IDENTIFICACAO'),
  partnerField('p-inscr_municipal', 'Inscr. municipal', 'inscr_municipal', 'IDENTIFICACAO'),
  partnerField('p-tipo_id_ident', 'Tipo ID ident.', 'tipo_id_ident', 'IDENTIFICACAO'),
  partnerField('p-numero_id', 'Número ID', 'numero_id', 'IDENTIFICACAO'),
]

/** Setor Industrial */
const PARTNER_SETOR_IND: FieldTemplate[] = [
  partnerField('p-chave_setor_ind', 'Chave setor ind.', 'chave_setor_ind', 'SETOR_IND'),
  partnerField('p-cod_setor_ind', 'Cód. setor ind.', 'cod_setor_ind', 'SETOR_IND'),
  partnerField('p-setor_ind_padrao', 'Setor ind. padrão', 'setor_ind_padrao', 'SETOR_IND'),
]

/** Pagamentos */
const PARTNER_PAGAMENTOS: FieldTemplate[] = [
  partnerField('p-cod_banco', 'Cód. banco', 'cod_banco', 'PAGAMENTOS'),
  partnerField('p-cod_agencia', 'Cód. agência', 'cod_agencia', 'PAGAMENTOS'),
  partnerField('p-dig_agencia', 'Díg. agência', 'dig_agencia', 'PAGAMENTOS'),
  partnerField('p-cod_conta', 'Cód. conta', 'cod_conta', 'PAGAMENTOS'),
  partnerField('p-dig_conta', 'Díg. conta', 'dig_conta', 'PAGAMENTOS'),
  partnerField('p-favorecido', 'Favorecido', 'favorecido', 'PAGAMENTOS'),
  partnerField('p-cpf_favorecido', 'CPF favorecido', 'cpf_favorecido', 'PAGAMENTOS'),
]

/** Cliente Empresa */
const PARTNER_CLIENTE_EMPRESA: FieldTemplate[] = [
  partnerField('p-centro', 'Centro', 'centro', 'CLIENTE_EMPRESA'),
  partnerField('p-empresa', 'Empresa', 'empresa', 'CLIENTE_EMPRESA'),
  partnerField('p-conta_conciliacao', 'Conta conciliação', 'conta_conciliacao', 'CLIENTE_EMPRESA'),
  partnerField('p-cond_pgto', 'Cond. pgto', 'cond_pgto', 'CLIENTE_EMPRESA'),
  partnerField('p-chv_ordenacao', 'Chv. ordenação', 'chv_ordenacao', 'CLIENTE_EMPRESA'),
  partnerField('p-grp_admin_tesouraria', 'Grp. admin tesouraria', 'grp_admin_tesouraria', 'CLIENTE_EMPRESA'),
  partnerField('p-ajus_valor', 'Ajus. valor', 'ajus_valor', 'CLIENTE_EMPRESA'),
  partnerField('p-form_pgto', 'Form. pgto', 'form_pgto', 'CLIENTE_EMPRESA'),
  partnerField('p-banco_empresa_cliente', 'Banco empresa cliente', 'banco_empresa_cliente', 'CLIENTE_EMPRESA'),
  partnerField('p-verificar_fatura_duplicada', 'Verif. fatura duplicada', 'verificar_fatura_duplicada', 'CLIENTE_EMPRESA'),
  partnerField('p-procedimento_advertencia', 'Proced. advertencia', 'procedimento_advertencia', 'CLIENTE_EMPRESA'),
  partnerField('p-responsavel_advertencia', 'Respons. advertencia', 'responsavel_advertencia', 'CLIENTE_EMPRESA'),
]

/** Vendas e Distribuição */
const PARTNER_VENDAS_DIST: FieldTemplate[] = [
  partnerField('p-org_vendas', 'Org. vendas', 'org_vendas', 'VENDAS_DIST'),
  partnerField('p-canal_distr', 'Canal distr.', 'canal_distr', 'VENDAS_DIST'),
  partnerField('p-setor_ativ', 'Setor ativ.', 'setor_ativ', 'VENDAS_DIST'),
  partnerField('p-regiao_vendas', 'Região vendas', 'regiao_vendas', 'VENDAS_DIST'),
  partnerField('p-prioridade_remessa', 'Prioridade remessa', 'prioridade_remessa', 'VENDAS_DIST'),
  partnerField('p-incoterms', 'Incoterms', 'incoterms', 'VENDAS_DIST'),
  partnerField('p-local_inco1', 'Local inco 1', 'local_inco1', 'VENDAS_DIST'),
  partnerField('p-grp_class_cont_cli', 'Grp. class cont. cli', 'grp_class_cont_cli', 'VENDAS_DIST'),
  partnerField('p-class_fiscal', 'Class. fiscal', 'class_fiscal', 'VENDAS_DIST'),
  partnerField('p-moeda_cliente', 'Moeda cliente', 'moeda_cliente', 'VENDAS_DIST'),
  partnerField('p-esquema_cliente', 'Esquema cliente', 'esquema_cliente', 'VENDAS_DIST'),
  partnerField('p-grupo_preco', 'Grupo preço', 'grupo_preco', 'VENDAS_DIST'),
  partnerField('p-lista_preco', 'Lista preço', 'lista_preco', 'VENDAS_DIST'),
  partnerField('p-compensacao', 'Compensação', 'compensacao', 'VENDAS_DIST'),
  partnerField('p-icms', 'ICMS', 'icms', 'VENDAS_DIST'),
  partnerField('p-ipi', 'IPI', 'ipi', 'VENDAS_DIST'),
  partnerField('p-subst_fiscal', 'Subst. fiscal', 'subst_fiscal', 'VENDAS_DIST'),
  partnerField('p-cfop', 'CFOP', 'cfop', 'VENDAS_DIST'),
  partnerField('p-contrib_icms', 'Contrib. ICMS', 'contrib_icms', 'VENDAS_DIST'),
  partnerField('p-tp_princ_set_ind', 'Tp. princ. set. ind.', 'tp_princ_set_ind', 'VENDAS_DIST'),
  partnerField('p-agrupamento_ordens', 'Agrupamento ordens', 'agrupamento_ordens', 'VENDAS_DIST'),
]

/** Vendas (cliente) */
const PARTNER_VENDAS: FieldTemplate[] = [
  partnerField('p-vendas_grupo_clientes', 'Vendas grupo clientes', 'vendas_grupo_clientes', 'VENDAS'),
  partnerField('p-vendas_escritorio_de_vendas', 'Vendas escritório', 'vendas_escritorio_de_vendas', 'VENDAS'),
  partnerField('p-vendas_equipe_de_vendas', 'Vendas equipe', 'vendas_equipe_de_vendas', 'VENDAS'),
  partnerField('p-vendas_atributo_1', 'Vendas atributo 1', 'vendas_atributo_1', 'VENDAS'),
  partnerField('p-vendas_atributo_2', 'Vendas atributo 2', 'vendas_atributo_2', 'VENDAS'),
  partnerField('p-vendas_sociedade_parceiro', 'Vendas sociedade parceiro', 'vendas_sociedade_parceiro', 'VENDAS'),
  partnerField('p-vendas_centro_fornecedor', 'Vendas centro fornecedor', 'vendas_centro_fornecedor', 'VENDAS'),
  partnerField('p-condicao_expedicao', 'Condição expedição', 'condicao_expedicao', 'VENDAS'),
  partnerField('p-vendas_relevante_liquidacao', 'Vendas relevante liquidação', 'vendas_relevante_liquidacao', 'VENDAS'),
  partnerField('p-relevante_crr', 'Relevante CRR', 'relevante_crr', 'VENDAS'),
  partnerField('p-perfil_cliente_bayer', 'Perfil cliente Bayer', 'perfil_cliente_bayer', 'VENDAS'),
]

/** Fornecedor Empresa */
const PARTNER_FORNECEDOR_EMPRESA: FieldTemplate[] = [
  partnerField('p-fe-centro', 'Centro (FE)', 'centro', 'FORNECEDOR_EMPRESA'),
  partnerField('p-fe-empresa', 'Empresa (FE)', 'empresa', 'FORNECEDOR_EMPRESA'),
  partnerField('p-fe-conta_conciliacao', 'Conta conciliação (FE)', 'conta_conciliacao', 'FORNECEDOR_EMPRESA'),
  partnerField('p-fe-grp_admin_tesouraria', 'Grp. admin tesouraria (FE)', 'grp_admin_tesouraria', 'FORNECEDOR_EMPRESA'),
  partnerField('p-fe-minorit', 'Minorit', 'minorit', 'FORNECEDOR_EMPRESA'),
  partnerField('p-fe-cond_pgto', 'Cond. pgto (FE)', 'cond_pgto', 'FORNECEDOR_EMPRESA'),
  partnerField('p-fe-form_pgto', 'Form. pgto (FE)', 'form_pgto', 'FORNECEDOR_EMPRESA'),
  partnerField('p-fe-banco_empresa_fornecedor', 'Banco empresa fornecedor', 'banco_empresa_fornecedor', 'FORNECEDOR_EMPRESA'),
  partnerField('p-fe-verificar_fatura_duplicada', 'Verif. fatura duplicada (FE)', 'verificar_fatura_duplicada', 'FORNECEDOR_EMPRESA'),
  partnerField('p-fe-procedimento_advertencia', 'Proced. advertencia (FE)', 'procedimento_advertencia', 'FORNECEDOR_EMPRESA'),
  partnerField('p-fe-responsavel_advertencia', 'Respons. advertencia (FE)', 'responsavel_advertencia', 'FORNECEDOR_EMPRESA'),
  partnerField('p-fe-contrib_icms', 'Contrib. ICMS (FE)', 'contrib_icms', 'FORNECEDOR_EMPRESA'),
  partnerField('p-fe-tp_princ_set_ind', 'Tp. princ. set. ind. (FE)', 'tp_princ_set_ind', 'FORNECEDOR_EMPRESA'),
]

/** Fornecedor Compras */
const PARTNER_FORNECEDOR_COMPRAS: FieldTemplate[] = [
  partnerField('p-org_compras', 'Org. compras', 'org_compras', 'FORNECEDOR_COMPRAS'),
  partnerField('p-moeda_pedido', 'Moeda pedido', 'moeda_pedido', 'FORNECEDOR_COMPRAS'),
  partnerField('p-fc-cond_pgto', 'Cond. pgto (FC)', 'cond_pgto', 'FORNECEDOR_COMPRAS'),
  partnerField('p-vers_incoterms', 'Vers. incoterms', 'vers_incoterms', 'FORNECEDOR_COMPRAS'),
  partnerField('p-fc-incoterms', 'Incoterms (FC)', 'incoterms', 'FORNECEDOR_COMPRAS'),
  partnerField('p-fc-local_inco1', 'Local inco 1 (FC)', 'local_inco1', 'FORNECEDOR_COMPRAS'),
  partnerField('p-fc-compensacao', 'Compensação (FC)', 'compensacao', 'FORNECEDOR_COMPRAS'),
  partnerField('p-marc_preco_forn', 'Marc. preço forn.', 'marc_preco_forn', 'FORNECEDOR_COMPRAS'),
]

/** Fornecedor IRF */
const PARTNER_FORNECEDOR_IRF: FieldTemplate[] = [
  partnerField('p-ctg_irf_1', 'Ctg. IRF 1', 'ctg_irf_1', 'FORNECEDOR_IRF'),
  partnerField('p-codigo_irf_1', 'Código IRF 1', 'codigo_irf_1', 'FORNECEDOR_IRF'),
]

/** Relação de BPS */
const PARTNER_BPS: FieldTemplate[] = [
  partnerField('p-cod_produtor', 'Cód. produtor', 'cod_produtor', 'BPS'),
  partnerField('p-tp_relacao', 'Tp. relação', 'tp_relacao', 'BPS'),
  partnerField('p-cod_propriedade', 'Cód. propriedade', 'cod_propriedade', 'BPS'),
  partnerField('p-valid_date_from', 'Válido de', 'valid_date_from', 'BPS'),
  partnerField('p-valid_date_to', 'Válido até', 'valid_date_to', 'BPS'),
  partnerField('p-caract_lixo', 'Caract. lixo', 'caract_lixo', 'BPS'),
]

/** Função de parceiro - Cliente */
const PARTNER_FUNCAO_CLIENTE: FieldTemplate[] = [
  partnerField('p-fp-partner', 'Partner', 'partner', 'FUNCAO_CLIENTE'),
  partnerField('p-fp-acao', 'Ação', 'acao', 'FUNCAO_CLIENTE'),
  partnerField('p-fp-funcao', 'Função', 'funcao', 'FUNCAO_CLIENTE'),
  partnerField('p-organ_vendas', 'Org. vendas', 'organ_vendas', 'FUNCAO_CLIENTE'),
  partnerField('p-fp-canal_distr', 'Canal distr.', 'canal_distr', 'FUNCAO_CLIENTE'),
  partnerField('p-fp-setor_ativ', 'Setor ativ.', 'setor_ativ', 'FUNCAO_CLIENTE'),
  partnerField('p-fp-parceiro', 'Parceiro', 'parceiro', 'FUNCAO_CLIENTE'),
]

/** Função de parceiro - Fornecedor */
const PARTNER_FUNCAO_FORNECEDOR: FieldTemplate[] = [
  partnerField('p-fpf-partner', 'Partner (forn.)', 'partner', 'FUNCAO_FORNECEDOR'),
  partnerField('p-fpf-acao', 'Ação (forn.)', 'acao', 'FUNCAO_FORNECEDOR'),
  partnerField('p-fpf-funcao', 'Função (forn.)', 'funcao', 'FUNCAO_FORNECEDOR'),
  partnerField('p-organ_compras', 'Org. compras', 'organ_compras', 'FUNCAO_FORNECEDOR'),
  partnerField('p-fpf-parceiro', 'Parceiro (forn.)', 'parceiro', 'FUNCAO_FORNECEDOR'),
]

/** Dados de Crédito */
const PARTNER_CREDITO: FieldTemplate[] = [
  partnerField('p-crd-partner', 'Partner (créd.)', 'partner', 'CREDITO'),
  partnerField('p-role', 'Role', 'role', 'CREDITO'),
  partnerField('p-limit_rule', 'Limit rule', 'limit_rule', 'CREDITO'),
  partnerField('p-risk_class', 'Risk class', 'risk_class', 'CREDITO'),
  partnerField('p-check_rule', 'Check rule', 'check_rule', 'CREDITO'),
  partnerField('p-credit_group', 'Credit group', 'credit_group', 'CREDITO'),
  partnerField('p-segment', 'Segment', 'segment', 'CREDITO'),
  partnerField('p-credit_limit', 'Credit limit', 'credit_limit', 'CREDITO'),
  partnerField('p-limit_valid_date', 'Limit valid date', 'limit_valid_date', 'CREDITO'),
  partnerField('p-follow_up_dt', 'Follow-up date', 'follow_up_dt', 'CREDITO'),
  partnerField('p-xblocked', 'Blocked', 'xblocked', 'CREDITO'),
  partnerField('p-infocategory', 'Info category', 'infocategory', 'CREDITO'),
  partnerField('p-infotype', 'Info type', 'infotype', 'CREDITO'),
  partnerField('p-check_relevant', 'Check relevant', 'check_relevant', 'CREDITO'),
  partnerField('p-amount', 'Amount', 'amount', 'CREDITO'),
  partnerField('p-currency', 'Currency', 'currency', 'CREDITO'),
  partnerField('p-date_from', 'Date from', 'date_from', 'CREDITO'),
  partnerField('p-date_to', 'Date to', 'date_to', 'CREDITO'),
  partnerField('p-date_follow_up', 'Date follow-up', 'date_follow_up', 'CREDITO'),
  partnerField('p-text', 'Text', 'text', 'CREDITO'),
]

/** Collection Crédito */
const PARTNER_COLLECTION: FieldTemplate[] = [
  partnerField('p-coll-cod_antigo', 'Coll. Cód. antigo', 'cod_antigo', 'COLLECTION'),
  partnerField('p-coll-role', 'Coll. Role', 'role', 'COLLECTION'),
  partnerField('p-perfil', 'Perfil', 'perfil', 'COLLECTION'),
  partnerField('p-coll-segment', 'Coll. Segment', 'segment', 'COLLECTION'),
  partnerField('p-grupo', 'Grupo', 'grupo', 'COLLECTION'),
  partnerField('p-resp', 'Responsável', 'resp', 'COLLECTION'),
]

export const PARTNER_FIELD_GROUPS: { key: string; title: string; templates: FieldTemplate[] }[] = [
  { key: 'PARCEIRO', title: 'Parceiro (base)', templates: PARTNER_BASE },
  { key: 'ENDERECO', title: 'Endereço', templates: PARTNER_ENDERECO },
  { key: 'COMUNICACAO', title: 'Comunicação', templates: PARTNER_COMUNICACAO },
  { key: 'IDENTIFICACAO', title: 'Identificação', templates: PARTNER_IDENTIFICACAO },
  { key: 'SETOR_IND', title: 'Setor Industrial', templates: PARTNER_SETOR_IND },
  { key: 'PAGAMENTOS', title: 'Pagamentos', templates: PARTNER_PAGAMENTOS },
  { key: 'CLIENTE_EMPRESA', title: 'Cliente Empresa', templates: PARTNER_CLIENTE_EMPRESA },
  { key: 'VENDAS_DIST', title: 'Vendas e Distribuição', templates: PARTNER_VENDAS_DIST },
  { key: 'VENDAS', title: 'Vendas', templates: PARTNER_VENDAS },
  { key: 'FORNECEDOR_EMPRESA', title: 'Fornecedor Empresa', templates: PARTNER_FORNECEDOR_EMPRESA },
  { key: 'FORNECEDOR_COMPRAS', title: 'Fornecedor Compras', templates: PARTNER_FORNECEDOR_COMPRAS },
  { key: 'FORNECEDOR_IRF', title: 'Fornecedor IRF', templates: PARTNER_FORNECEDOR_IRF },
  { key: 'BPS', title: 'Relação de BPS', templates: PARTNER_BPS },
  { key: 'FUNCAO_CLIENTE', title: 'Função de parceiro - Cliente', templates: PARTNER_FUNCAO_CLIENTE },
  { key: 'FUNCAO_FORNECEDOR', title: 'Função de parceiro - Fornecedor', templates: PARTNER_FUNCAO_FORNECEDOR },
  { key: 'CREDITO', title: 'Dados de Crédito', templates: PARTNER_CREDITO },
  { key: 'COLLECTION', title: 'Collection Crédito', templates: PARTNER_COLLECTION },
]

export const ALL_PARTNER_FIELD_TEMPLATES: FieldTemplate[] = PARTNER_FIELD_GROUPS.flatMap(
  (g) => g.templates
)
