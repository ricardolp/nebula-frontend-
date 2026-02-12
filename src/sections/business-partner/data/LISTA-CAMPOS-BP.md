# Lista de todos os campos do formulário Business Partner

Referência: template (tabs) + `field-templates.js` (schema BP).

---

## 1. Dados Básicos (General)

| Campo (form) | Label |
|--------------|--------|
| tipo | Tipo |
| funcao | Função |
| agrContas | Agrupamento de Contas |
| vocativo | Vocativo |
| nomeNomeFantasia | Nome / Nome Fantasia |
| sobrenomeRazaoSocial | Sobrenome / Razão Social |
| nome3 | Nome 3 |
| nome4 | Nome 4 |
| dataNascimentoFundacao | Data de Nascimento/Fundação |
| sexo | Gênero |
| termoPesquisa1 | Termo de Pesquisa 1 |
| termoPesquisa2 | Termo de Pesquisa 2 |

*(field-templates: codigoAntigo, tipo, funcao, grupo_contas, agr_contas, sexo, nome_nome_fantasia, sobrenome_razao_social, nome3, nome4, termo_pesquisa1, termo_pesquisa2, vocativo)*

## 3. Endereço (Address)

| Campo (form) | Label |
|--------------|--------|
| endereco.cep | CEP |
| endereco.rua | Rua |
| endereco.numero | Número |
| endereco.rua2 | Rua 2 |
| endereco.complemento | Complemento |
| endereco.bairro | Bairro |
| endereco.cidade | Cidade |
| endereco.estado | Estado |
| endereco.pais | País |

*(field-templates: rua, rua2, numero, complemento, bairro, cep, cidade, estado, pais)*

---

## 4. Comunicação (Communication)

| Campo (form) | Label |
|--------------|--------|
| comunicacao.telefone | Telefone |
| comunicacao.telefone2 | Telefone 2 |
| comunicacao.telefone3 | Telefone 3 |
| comunicacao.celular | Celular |
| comunicacao.email | E-mail |
| comunicacao.observacoes | Observações |

*(field-templates também: data_nascimento, data_fundacao)*

---

## 5. Identificação (Identification)

| Campo (form) | Label |
|--------------|--------|
| identificacao.cpf | CPF |
| identificacao.cnpj | CNPJ |
| identificacao.inscrEstatual | Inscrição Estadual |
| identificacao.inscrMunicipal | Inscrição Municipal |
| identificacao.tipoIdIdent | Tipo de Identificação |
| identificacao.numeroId | Número de Identificação |

*(field-templates: cpf, cnpj, incr_estatual, inscr_municipal, tipo_id_ident, numero_id)*

---

## 6. Setor Industrial (Industrial Sector)

| Campo (form) | Label |
|--------------|--------|
| setorIndustrial.chaveSetorInd | Chave Setor Industrial |
| setorIndustrial.codSetorInd | Código Setor Industrial |
| setorIndustrial.setorIndPadrao | Setor Industrial Padrão |

*(field-templates: chave_setor_ind, cod_setor_ind, setor_ind_padrao)*

---

## 7. Pagamentos (Payments)

| Campo (form) | Label |
|--------------|--------|
| pagamentos.codBanco | Código do Banco |
| pagamentos.codAgencia | Código da Agência |
| pagamentos.digAgencia | Dígito da Agência |
| pagamentos.codConta | Código da Conta |
| pagamentos.digConta | Dígito da Conta |
| pagamentos.favorecido | Favorecido |
| pagamentos.cpfFavorecido | CPF do Favorecido |

*(field-templates: cod_banco, cod_agencia, dig_agencia, cod_conta, dig_conta, favorecido, cpf_favorecido)*

---

## 8. Funções de Parceiro (Partner Functions)

| Campo (form) | Label |
|--------------|--------|
| funcoesParceiro.funcaoParceiro | Função do Parceiro |
| funcoesParceiro.autorizacao | Autorização |
| funcoesParceiro.validadeInicio | Validade Início |
| funcoesParceiro.validadeFim | Validade Fim |

---

## 9. Dados Adicionais (Additional Data)

| Campo (form) | Label |
|--------------|--------|
| dadosAdicionais.referenciaExterna | Referência Externa |
| dadosAdicionais.codigoAntigo | Código Antigo |
| dadosAdicionais.observacoes | Observações |
| dadosAdicionais.informacoesComplementares | Informações Complementares |

---

## 10. Compras (Purchases) – Fornecedor

### Dados básicos do fornecedor (objeto `fornecedor`)

| Campo | Label |
|-------|--------|
| fornecedor.devolucao | Devolução (checkbox) |
| fornecedor.revFatBasEm | Revisão Fatura Baseada em Entrada de Mercadoria (checkbox) |
| fornecedor.revFatBasServ | Revisão Fatura Baseada em Serviço (checkbox) |
| fornecedor.relevanteLiquidacao | Relevante para Liquidação (checkbox) |
| fornecedor.pedidoAutom | Pedido Automático (checkbox) |
| fornecedor.tipoNfe | Tipo NFe (checkbox) |
| fornecedor.tipoImposto | Tipo Imposto (checkbox) |
| fornecedor.simplesNacional | Simples Nacional (checkbox) |
| fornecedor.grpEsqForn | Grupo Esquema Fornecedor |
| fornecedor.cntrleConfir | Controle de Confirmação |
| fornecedor.regimePisCofins | Regime PIS/COFINS |
| fornecedor.optanteSimples | Optante Simples |
| fornecedor.recebedorAlternativo | Recebedor Alternativo |

### Fornecedor Compras (array `fornecedorCompras[]`)

| Campo | Label |
|-------|--------|
| orgCompras | Organização de Compras |
| moedaPedido | Moeda do Pedido |
| condPgto | Condição de Pagamento |
| versIncoterms | Versão Incoterms |
| incoterms | Incoterms |
| localInco1 | Local Incoterms |
| compensacao | Compensação (checkbox) |
| marcPrecoForn | Marcação de Preço Fornecedor |

### Fornecedor Empresas (array `fornecedorEmpresas[]`)

| Campo | Label |
|-------|--------|
| centro | Centro |
| empresa | Empresa |
| contaConciliacao | Conta de Conciliação |
| grpAdminTesouraria | Grupo Administração de Tesouraria |
| minorit | Minoritário |
| condPgto | Condição de Pagamento |
| formPgto | Forma de Pagamento |
| bancoEmpresaFornecedor | Banco Empresa Fornecedor |
| verificarFaturaDuplicada | Verificar Fatura Duplicada |
| procedimentoAdvertencia | Procedimento de Advertência |
| responsavelAdvertencia | Responsável por Advertência |
| contribIcms | Contribuição ICMS |
| tpPrincSetInd | Tipo Principal Setor Industrial |

### Fornecedor IRF (array `fornecedorIrf[]`)

| Campo | Label |
|-------|--------|
| ctgIrf | Categoria IRF |
| codigoIrf | Código IRF |

---

## 11. Vendas (Sales) – Cliente

### Cliente Vendas (array `clienteVendas[]`)

| Campo | Label |
|-------|--------|
| orgVendas | Organização de Vendas |
| canalDistr | Canal de Distribuição |
| setorAtiv | Setor de Atividade |
| regiaoVendas | Região de Vendas |
| prioridadeRemessa | Prioridade de Remessa |
| incoterms | Incoterms |
| localInco1 | Local Incoterms |
| grpClassContCli | Grupo Classificação Conta Cliente |
| classFiscal | Classificação Fiscal |
| moedaCliente | Moeda do Cliente |
| esquemaCliente | Esquema do Cliente |
| grupoPreco | Grupo de Preço |
| listaPreco | Lista de Preços |
| compensacao | Compensação (checkbox) |
| icms | ICMS |
| ipi | IPI |
| substFiscal | Substituição Fiscal |
| cfop | CFOP |
| contribIcms | Contribuição ICMS |
| tpPrincSetInd | Tipo Principal Setor Industrial |
| agrupamentoOrdens | Agrupamento de Ordens (checkbox) |
| vendasGrupoClientes | Grupo de Clientes de Vendas |
| vendasEscritorioVendas | Escritório de Vendas |
| vendasEquipeVendas | Equipe de Vendas |
| vendasAtributo1 | Atributo de Vendas 1 |
| vendasAtributo2 | Atributo de Vendas 2 |
| vendasSociedadeParceiro | Sociedade Parceiro |
| vendasCentroFornecedor | Centro Fornecedor |
| condicaoExpedicao | Condição de Expedição |
| vendasRelevanteliquidacao | Liquidação Relevante (checkbox) |
| relevanteCrr | CRR Relevante (checkbox) |
| perfilClienteBayer | Perfil do Cliente Bayer |

### Cliente Empresas (array `clienteEmpresas[]`)

| Campo | Label |
|-------|--------|
| centro | Centro |
| empresa | Empresa |
| contaConciliacao | Conta de Conciliação |
| condPgto | Condição de Pagamento |
| chvOrdenacao | Chave de Ordenação |
| grpAdminTesouraria | Grupo Administração de Tesouraria |
| ajusValor | Ajuste de Valor |
| formPgto | Forma de Pagamento |
| bancoEmpresaCliente | Banco Empresa Cliente |
| verificarFaturaDuplicada | Verificar Fatura Duplicada |
| procedimentoAdvertencia | Procedimento de Advertência |
| responsavelAdvertencia | Responsável por Advertência |

---

## 12. Dados de Crédito (Credit Data) – array `dadosCredito[]`

| Campo | Label |
|-------|--------|
| partner | Parceiro |
| role | Função |
| limitRule | Regra de Limite |
| riskClass | Classe de Risco |
| checkRule | Regra de Verificação |
| creditGroup | Grupo de Crédito |
| segment | Segmento |
| creditLimit | Limite de Crédito |
| limitValidDate | Data de Validade do Limite |
| followUpDt | Data de Acompanhamento |
| xblocked | Bloqueado |
| infocategory | Categoria de Informação |
| infotype | Tipo de Informação |
| checkRelevant | Verificação Relevante |
| amount | Valor |
| currency | Moeda |
| dateFrom | Data Inicial |
| dateTo | Data Final |
| dateFollowUp | Data de Acompanhamento |
| text | Texto/Observações |

---

## 13. Credit Collection – array `collection[]`

| Campo | Label |
|-------|--------|
| codAntigo | Código Antigo |
| role | Função |
| perfil | Perfil |
| segment | Segmento |
| grupo | Grupo |
| resp | Responsável |

---

## Resumo por aba

| Aba | Qtd. campos (fixos) | Arrays |
|-----|---------------------|--------|
| Dados Básicos | 12 | — |
| Informações Gerais | 25 | — |
| Endereço | 9 | — |
| Comunicação | 6 | — |
| Identificação | 6 | — |
| Setor Industrial | 3 | — |
| Pagamentos | 7 | — |
| Funções de Parceiro | 4 | — |
| Dados Adicionais | 4 | — |
| Compras | 14 + 8 + 13 + 2 | fornecedorCompras, fornecedorEmpresas, fornecedorIrf |
| Vendas | 33 + 12 | clienteVendas, clienteEmpresas |
| Dados de Crédito | 19 por item | dadosCredito |
| Credit Collection | 6 por item | collection |

**Total aproximado (campos únicos / nomes):** ~170+ nomes de campo (sem contar repetições em arrays).
