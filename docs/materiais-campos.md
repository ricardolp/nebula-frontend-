# Campos de Materiais Disponíveis

Documentação de todos os campos do cadastro de materiais, organizados por aba/seção.

---

## Tab 1: Dados Básicos

| Campo (API/Form) | Descrição | Obrigatório |
|------------------|-----------|-------------|
| `material` | Código do material | Sim |
| `codigoSap` | Código SAP (gerado após integração) | Não |
| `status` | Status atual do material | Não |
| `matlDesc` | Descrição do material | Não |
| `indSector` | Setor industrial | Sim |
| `matlType` | Tipo de material | Sim |
| `oldMatNo` | Material antigo | Não |
| `stdDescr` | Descrição padrão | Não |
| `basicMatl` | Material básico | Não |
| `plRefMat` | Material de referência | Não |
| `document` | Documento relacionado | Não |
| `langu` | Idioma | Não |

---

## Tab 2: Classificação

| Campo (API/Form) | Descrição | Obrigatório |
|------------------|-----------|-------------|
| `matlGroup` | Grupo de material | Sim |
| `extmatlgrp` | Grupo externo | Não |
| `division` | Divisão | Não |
| `prodHier` | Hierarquia de produto | Não |
| `itemCat` | Categoria de item | Não |
| `matGrpSm` | Grupo de mercadorias | Não |
| `purStatus` | Status de compras | Não |
| `batchMgmt` | Gestão de lotes | Não |
| `eanUpc` | EAN/UPC | Não |
| `physicalCommodity` | Mercadoria física | Não |
| `abcId` | ABC ID | Não |

---

## Tab 3: Unidades e Medidas

| Campo (API/Form) | Descrição | Obrigatório |
|------------------|-----------|-------------|
| `baseUom` | Unidade de medida base | Sim |
| `altUnit` | Unidade alternativa | Não |
| `fatorAltUnit` | Fator unidade alternativa | Não |
| `fatorBaseUom` | Fator unidade base | Não |
| `grossWt` | Peso bruto | Não |
| `netWeight` | Peso líquido | Não |
| `unitOfWt` | Unidade de peso | Não |
| `volume` | Volume | Não |
| `volumeunit` | Unidade de volume | Não |

---

## Tab 4: Compras

| Campo (API/Form) | Descrição | Obrigatório |
|------------------|-----------|-------------|
| `plant` | Centro (Plant) | Não |
| `purGroup` | Grupo de compras | Não |
| `purStatusMarc` | Status compras (centro) | Não |
| `poUnit` | Unidade de ordem | Não |
| `autoPOrd` | Ordem automática | Não |
| `purValkey` | Chave de avaliação | Não |
| `poText` | Texto ordem de compra | Não |
| `storConds` | Condições de armazenagem | Não |
| `minremlife` | Vida útil mínima | Não |
| `shelfLife` | Vida útil total | Não |
| `periodIndExpirationDate` | Período ind. validade | Não |
| `sledBbd` | SLED/BBD | Não |

---

## Tab 5: Planejamento (MRP)

| Campo (API/Form) | Descrição | Obrigatório |
|------------------|-----------|-------------|
| `mrpType` | Tipo de MRP | Não |
| `mrpCtrler` | Controlador MRP | Não |
| `mrpGroup` | Grupo MRP | Não |
| `reorderPt` | Ponto de reabastecimento | Não |
| `lotsizekey` | Tamanho do lote | Não |
| `minlotsize` | Lote mínimo | Não |
| `maxlotsize` | Lote máximo | Não |
| `fixedLot` | Lote fixo | Não |
| `roundVal` | Valor de arredondamento | Não |
| `servLevel` | Nível de serviço | Não |
| `maxStock` | Estoque máximo | Não |
| `safetyStk` | Estoque de segurança | Não |
| `minSafetyStk` | Estoque seg. mínimo | Não |
| `covprofile` | Perfil de cobertura | Não |
| `bwdCons` | Consumo retroativo | Não |
| `consummode` | Modo de consumo | Não |
| `fwdCons` | Consumo futuro | Não |
| `replentime` | Tempo de reabastecimento | Não |
| `depReqId` | ID requisição dependente | Não |
| `planStrgp` | Grupo de estratégia | Não |

---

## Tab 6: Produção

| Campo (API/Form) | Descrição | Obrigatório |
|------------------|-----------|-------------|
| `procType` | Tipo de procurement | Não |
| `spproctype` | Tipo proc. especial | Não |
| `backflush` | Backflushing | Não |
| `jitRelvt` | JIT relevante | Não |
| `bulkMat` | Material a granel | Não |
| `batchentry` | Entrada de lote | Não |
| `inhseprodt` | Produção interna | Não |
| `plndDelry` | Prazo de entrega | Não |
| `grPrTime` | Tempo processamento GR | Não |
| `ppcPlCal` | Calendário PPC | Não |
| `smKey` | Chave SM | Não |
| `assyScrap` | Sucata de montagem | Não |
| `compScrap` | Sucata de componente | Não |
| `repmanprof` | Perfil rep. manufatura | Não |
| `repManuf` | Fabricante repetitivo | Não |
| `productionScheduler` | Programador de produção | Não |
| `prodprof` | Perfil de produção | Não |
| `underTol` | Tolerância inferior | Não |
| `overTol` | Tolerância superior | Não |
| `noCosting` | Sem custeio | Não |
| `sernoProf` | Perfil nº série | Não |
| `lotSize` | Tamanho de lote | Não |
| `specprocty` | Tipo proc. especial | Não |
| `prtUsage` | Uso de impressão | Não |
| `ctrlKey` | Chave de controle | Não |
| `dbText` | Texto BD | Não |

---

## Tab 7: Armazenagem

| Campo (API/Form) | Descrição | Obrigatório |
|------------------|-----------|-------------|
| `stgeLoc` | Depósito | Não |
| `ctrlCode` | Código de controle | Não |
| `stgeBin` | Área de armazenagem | Não |
| `availcheck` | Verificação disponibilidade | Não |
| `transGrp` | Grupo de transporte | Não |
| `loadinggrp` | Grupo de carregamento | Não |
| `countryori` | País de origem | Não |
| `profitCtr` | Centro de lucro | Não |
| `shMatTyp` | Tipo mat. envio | Não |
| `matCfop` | CFOP do material | Não |
| `sdText` | Texto SD | Não |
| `issStLoc` | Local emissão | Não |
| `supplyArea` | Área de suprimento | Não |
| `slocExprc` | Local exprc | Não |

---

## Tab 8: Vendas/Distribuição (principal + aninhado)

### No objeto principal

| Campo (API/Form) | Descrição | Obrigatório |
|------------------|-----------|-------------|
| `salesOrg` | Organização vendas | Não |
| `distrChan` | Canal de distribuição | Não |

### Objeto aninhado `salesDistribution`

| Campo (API/Form) | Descrição | Obrigatório |
|------------------|-----------|-------------|
| `vkorg` | Organização Vendas | Não |
| `vtweg` | Canal de Distribuição | Não |
| `spart` | Setor de Atividade | Não |
| `dwerk` | Centro Fornecedor | Não |
| `lgort` | Depósito | Não |
| `prctr` | Centro de Lucro | Não |
| `ktgrm` | Grupo Conta Cliente | Não |
| `salesUnit` | Unidade de Vendas | Não |
| `minOrder` | Qtd Mínima Pedido | Não |
| `minDely` | Prazo Entrega Mínimo | Não |
| `delyUnit` | Unidade Prazo | Não |
| `taxType1` | Tipo Imposto 1 | Não |
| `taxclass1` | Classificação Fiscal 1 | Não |
| `matlStats` | Status Material | Não |
| `rebateGrp` | Grupo Rebate | Não |
| `commGroup` | Grupo Comissão | Não |
| `matPrGrp` | Grupo Preço Material | Não |
| `acctAssgt` | Atribuição Conta | Não |
| `cashDisc` | Desconto à Vista | Não |
| `roundProf` | Perfil Arredondamento | Não |

---

## Tab 9: Controlling/Custos (principal + aninhado)

### No objeto principal

| Campo (API/Form) | Descrição | Obrigatório |
|------------------|-----------|-------------|
| `valArea` | Área de avaliação | Não |
| `valClass` | Classe de avaliação | Não |

### Objeto aninhado `controlling`

| Campo (API/Form) | Descrição | Obrigatório |
|------------------|-----------|-------------|
| `bwkey` | Área de Avaliação | Não |
| `bwtar` | Tipo de Avaliação | Não |
| `matKlass` | Classe de Material | Não |
| `valArea` | Área Valorização | Não |
| `valClass` | Classe Valorização | Não |
| `priceCtrl` | Controle de Preço (S=standard, V=moving) | Não |
| `stdPrice` | Preço Standard | Não |
| `priceUnit` | Unidade de Preço | Não |
| `movingPrice` | Preço Médio Móvel | Não |
| `priceDate` | Data do Preço | Não |
| `mlActive` | ML Ativo | Não |
| `mlSettle` | ML Liquidação | Não |
| `originMat` | Material Origem | Não |
| `originGroup` | Grupo Origem | Não |
| `overheadGrp` | Grupo Overhead | Não |
| `profitCtr2` | Centro Lucro 2 | Não |
| `qtyStruct` | Estrutura Qtd | Não |
| `inHouse` | Produção Interna | Não |
| `matUsage` | Uso do Material | Não |
| `plndprice1` | Preço Planejado 1 | Não |
| `plndprdate1` | Data Preço Plan. 1 | Não |
| `plndprice2` | Preço Planejado 2 | Não |
| `plndprdate2` | Data Preço Plan. 2 | Não |
| `plndprice3` | Preço Planejado 3 | Não |
| `plndprdate3` | Data Preço Plan. 3 | Não |

---

## Campos do Sistema

| Campo (API/Form) | Descrição | Obrigatório |
|------------------|-----------|-------------|
| `createdBy` | Criado por | Não |
| `isActive` | Ativo | Não |
| `statusIntegracao` | Status de integração | Não |
| `createdAt` | Data de criação (somente leitura) | - |
| `id` | ID do material (somente leitura) | - |

---

## Resumo por tipo

- **Obrigatórios:** `material`, `indSector`, `matlType`, `matlGroup`, `baseUom`
- **Booleanos:** `batchMgmt`, `physicalCommodity`, `autoPOrd`, `backflush`, `jitRelvt`, `bulkMat`, `noCosting`, `isActive`; em controlling: `mlActive`, `mlSettle`, `originMat`, `qtyStruct`, `inHouse`
- **Numéricos:** pesos, volumes, lotes, prazos, preços, tolerâncias (conforme schema)
- **Texto:** demais campos string

Referência: `src/sections/material/schema/materials-schema.js`
