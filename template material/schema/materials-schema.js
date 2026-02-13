import { z as zod } from 'zod';

// ----------------------------------------------------------------------

// Função utilitária para campos opcionais que podem ser null
const optionalString = () => zod.string().nullable().optional().or(zod.literal(''));
const optionalBoolean = () => zod.boolean().nullable().optional();
const optionalNumber = () => zod.coerce.string().nullable().optional().or(zod.literal('')); // Aceita number e converte para string

// Schema para Sales Distribution (objeto aninhado)
export const salesDistributionSchema = zod.object({
  // Tab 8: Vendas/Distribuição
  vkorg: optionalString(),           // Organização Vendas
  vtweg: optionalString(),           // Canal de Distribuição
  spart: optionalString(),           // Setor de Atividade
  dwerk: optionalString(),           // Centro Fornecedor - Opcional
  lgort: optionalString(),           // Depósito - Opcional
  prctr: optionalString(),           // Centro de Lucro
  ktgrm: optionalString(),           // Grupo Conta Cliente
  salesUnit: optionalString(),       // Unidade de Vendas
  minOrder: optionalNumber(),        // Qtd Mínima Pedido (número)
  minDely: optionalNumber(),         // Prazo Entrega Mínimo (número)
  delyUnit: optionalString(),        // Unidade Prazo
  taxType1: optionalString(),        // Tipo Imposto 1
  taxclass1: optionalString(),       // Classificação Fiscal 1
  matlStats: optionalString(),       // Status Material
  rebateGrp: optionalString(),       // Grupo Rebate
  commGroup: optionalString(),       // Grupo Comissão
  matPrGrp: optionalString(),        // Grupo Preço Material
  acctAssgt: optionalString(),       // Atribuição Conta
  cashDisc: optionalNumber(),        // Desconto à Vista (número/percentual)
  roundProf: optionalString(),       // Perfil Arredondamento
});

// Schema para Controlling (objeto aninhado)
export const controllingSchema = zod.object({
  // Tab 9: Controlling/Custos
  bwkey: optionalString(),           // Área de Avaliação
  bwtar: optionalString(),           // Tipo de Avaliação
  matKlass: optionalString(),        // Classe de Material
  valArea: optionalString(),         // Área Valorização
  valClass: optionalString(),        // Classe Valorização
  priceCtrl: optionalString(),       // Controle de Preço (S=standard, V=moving)
  stdPrice: optionalNumber(),        // Preço Standard (número)
  priceUnit: optionalNumber(),       // Unidade de Preço (número)
  movingPrice: optionalNumber(),     // Preço Médio Móvel (número)
  priceDate: optionalString(),       // Data do Preço
  mlActive: optionalBoolean(),       // ML Ativo
  mlSettle: optionalBoolean(),       // ML Liquidação
  originMat: optionalBoolean(),      // Material Origem
  originGroup: optionalString(),     // Grupo Origem
  overheadGrp: optionalString(),     // Grupo Overhead
  profitCtr2: optionalString(),      // Centro Lucro 2
  qtyStruct: optionalBoolean(),      // Estrutura Qtd
  inHouse: optionalBoolean(),        // Produção Interna
  matUsage: optionalString(),        // Uso do Material
  plndprice1: optionalNumber(),      // Preço Planejado 1 (número)
  plndprdate1: optionalString(),     // Data Preço Plan. 1
  plndprice2: optionalNumber(),      // Preço Planejado 2 (número)
  plndprdate2: optionalString(),     // Data Preço Plan. 2
  plndprice3: optionalNumber(),      // Preço Planejado 3 (número)
  plndprdate3: optionalString(),     // Data Preço Plan. 3
});

// Schema principal com todos os 147 campos organizados por tabs
export const materialsSchema = zod.object({
  // ========== TAB 1: DADOS BÁSICOS ==========
  material: zod.string().min(1, 'Código do material é obrigatório'),
  codigoSap: optionalString(),        // Código SAP (gerado após integração)
  status: optionalString(),           // Status atual do material
  matlDesc: optionalString(),         // Descrição do material
  indSector: zod.string().min(1, 'Setor industrial é obrigatório'),  // Setor industrial (OBRIGATÓRIO)
  matlType: zod.string().min(1, 'Tipo de material é obrigatório'),   // Tipo de material (OBRIGATÓRIO)
  oldMatNo: optionalString(),         // Material antigo
  stdDescr: optionalString(),         // Descrição padrão
  basicMatl: optionalString(),        // Material básico
  plRefMat: optionalString(),         // Material de referência
  document: optionalString(),         // Documento relacionado
  langu: optionalString(),            // Idioma

  // ========== TAB 2: CLASSIFICAÇÃO ==========
  matlGroup: zod.string().min(1, 'Grupo de material é obrigatório'),  // Grupo de material (OBRIGATÓRIO)
  extmatlgrp: optionalString(),       // Grupo externo
  division: optionalString(),         // Divisão
  prodHier: optionalString(),         // Hierarquia de produto
  itemCat: optionalString(),          // Categoria de item
  matGrpSm: optionalString(),         // Grupo de mercadorias (opcional)
  purStatus: optionalString(),        // Status de compras
  batchMgmt: optionalBoolean(),       // Gestão de lotes
  eanUpc: optionalString(),           // EAN/UPC
  physicalCommodity: optionalBoolean(), // Mercadoria física
  abcId: optionalString(),            // ABC ID

  // ========== TAB 3: UNIDADES E MEDIDAS ==========
  baseUom: zod.string().min(1, 'Unidade de medida base é obrigatória'),  // Unidade base (OBRIGATÓRIO)
  altUnit: optionalString(),          // Unidade alternativa
  fatorAltUnit: optionalNumber(),     // Fator unid. alternativa (número convertido para string)
  fatorBaseUom: optionalNumber(),     // Fator unid. base (número convertido para string)
  grossWt: optionalNumber(),          // Peso bruto (número convertido para string)
  netWeight: optionalNumber(),        // Peso líquido (número convertido para string)
  unitOfWt: optionalString(),         // Unidade de peso
  volume: optionalNumber(),           // Volume (número convertido para string)
  volumeunit: optionalString(),       // Unidade de volume

  // ========== TAB 4: COMPRAS ==========
  plant: optionalString(),            // Centro (Plant) - Opcional
  purGroup: optionalString(),         // Grupo de compras
  purStatusMarc: optionalString(),    // Status compras (centro)
  poUnit: optionalString(),           // Unidade de ordem
  autoPOrd: optionalBoolean(),        // Ordem automática
  purValkey: optionalString(),        // Chave de avaliação
  poText: optionalString(),           // Texto ordem de compra
  storConds: optionalString(),        // Condições de armazenagem
  minremlife: optionalNumber(),       // Vida útil mínima (número)
  shelfLife: optionalNumber(),        // Vida útil total (número)
  periodIndExpirationDate: optionalString(), // Período ind. validade
  sledBbd: optionalString(),          // SLED/BBD

  // ========== TAB 5: PLANEJAMENTO (MRP) ==========
  mrpType: optionalString(),          // Tipo de MRP
  mrpCtrler: optionalString(),        // Controlador MRP
  mrpGroup: optionalString(),         // Grupo MRP
  reorderPt: optionalNumber(),        // Ponto de reabastecimento (número)
  lotsizekey: optionalString(),       // Tamanho do lote
  minlotsize: optionalNumber(),       // Lote mínimo (número)
  maxlotsize: optionalNumber(),       // Lote máximo (número)
  fixedLot: optionalNumber(),         // Lote fixo (número)
  roundVal: optionalNumber(),         // Valor de arredondamento (número)
  servLevel: optionalNumber(),        // Nível de serviço (número)
  maxStock: optionalNumber(),         // Estoque máximo (número)
  safetyStk: optionalNumber(),        // Estoque de segurança (número)
  minSafetyStk: optionalNumber(),     // Estoque seg. mínimo (número)
  covprofile: optionalString(),       // Perfil de cobertura
  bwdCons: optionalNumber(),          // Consumo retroativo (número)
  consummode: optionalString(),       // Modo de consumo
  fwdCons: optionalNumber(),          // Consumo futuro (número)
  replentime: optionalNumber(),       // Tempo de reabastecimento (número)
  depReqId: optionalString(),         // ID requisição dependente
  planStrgp: optionalString(),        // Grupo de estratégia

  // ========== TAB 6: PRODUÇÃO ==========
  procType: optionalString(),         // Tipo de procurement
  spproctype: optionalString(),       // Tipo proc. especial
  backflush: optionalBoolean(),       // Backflushing
  jitRelvt: optionalBoolean(),        // JIT relevante
  bulkMat: optionalBoolean(),         // Material a granel
  batchentry: optionalString(),       // Entrada de lote
  inhseprodt: optionalNumber(),       // Produção interna (número)
  plndDelry: optionalNumber(),        // Prazo de entrega (número)
  grPrTime: optionalNumber(),         // Tempo processamento GR (número)
  ppcPlCal: optionalString(),         // Calendário PPC
  smKey: optionalString(),            // Chave SM
  assyScrap: optionalNumber(),        // Sucata de montagem (número/percentual)
  compScrap: optionalNumber(),        // Sucata de componente (número/percentual)
  repmanprof: optionalString(),       // Perfil rep. manufatura
  repManuf: optionalString(),         // Fabricante repetitivo
  productionScheduler: optionalString(), // Programador de produção
  prodprof: optionalString(),         // Perfil de produção
  underTol: optionalNumber(),         // Tolerância inferior (número/percentual)
  overTol: optionalNumber(),          // Tolerância superior (número/percentual)
  noCosting: optionalBoolean(),       // Sem custeio
  sernoProf: optionalString(),        // Perfil nº série
  lotSize: optionalNumber(),          // Tamanho de lote (número)
  specprocty: optionalString(),       // Tipo proc. especial
  prtUsage: optionalString(),         // Uso de impressão
  ctrlKey: optionalString(),          // Chave de controle
  dbText: optionalString(),           // Texto BD

  // ========== TAB 7: ARMAZENAGEM ==========
  stgeLoc: optionalString(),          // Depósito
  ctrlCode: optionalString(),         // Código de controle
  stgeBin: optionalString(),          // Área de armazenagem
  availcheck: optionalString(),       // Verificação disponibilidade
  transGrp: optionalString(),         // Grupo de transporte
  loadinggrp: optionalString(),       // Grupo de carregamento
  countryori: optionalString(),       // País de origem
  profitCtr: optionalString(),        // Centro de lucro
  shMatTyp: optionalString(),         // Tipo mat. envio
  matCfop: optionalString(),          // CFOP do material
  sdText: optionalString(),           // Texto SD
  issStLoc: optionalString(),         // Local emissão
  supplyArea: optionalString(),       // Área de suprimento
  slocExprc: optionalString(),        // Local exprc

  // ========== TAB 8: VENDAS/DISTRIBUIÇÃO ==========
  // Campos que podem estar no objeto principal ou no aninhado
  salesOrg: optionalString(),         // Organização vendas
  distrChan: optionalString(),        // Canal de distribuição

  // ========== TAB 9: CONTROLLING/CUSTOS ==========
  // Campos que podem estar no objeto principal ou no aninhado
  valArea: optionalString(),          // Área de avaliação
  valClass: optionalString(),         // Classe de avaliação
  
  // ========== CAMPOS DO SISTEMA ==========
  createdBy: optionalString(),        // Criado por
  isActive: optionalBoolean(),        // Ativo
  statusIntegracao: optionalString(), // Status de integração
  
  // ========== OBJETOS ANINHADOS ==========
  salesDistribution: salesDistributionSchema.optional(),
  controlling: controllingSchema.optional(),
  
  // Arrays (manter compatibilidade com versão antiga)
  salesDistributions: zod.array(salesDistributionSchema).default([]),
  controllings: zod.array(controllingSchema).default([]),
});

// Valores padrão - todos vazios para preenchimento manual
export const materialsDefaultValues = {
  // Tab 1: Dados Básicos
  material: '',
  codigoSap: '',
  status: '',
  matlDesc: '',
  indSector: '',
  matlType: '',
  oldMatNo: '',
  stdDescr: '',
  basicMatl: '',
  plRefMat: '',
  document: '',
  langu: '',

  // Tab 2: Classificação
  matlGroup: '',
  extmatlgrp: '',
  division: '',
  prodHier: '',
  itemCat: '',
  matGrpSm: '',
  purStatus: '',
  batchMgmt: false,
  eanUpc: '',
  physicalCommodity: false,
  abcId: '',

  // Tab 3: Unidades e Medidas
  baseUom: '',
  altUnit: '',
  fatorAltUnit: '',
  fatorBaseUom: '',
  grossWt: '',
  netWeight: '',
  unitOfWt: '',
  volume: '',
  volumeunit: '',

  // Tab 4: Compras
  plant: '',
  purGroup: '',
  purStatusMarc: '',
  poUnit: '',
  autoPOrd: false,
  purValkey: '',
  poText: '',
  storConds: '',
  minremlife: '',
  shelfLife: '',
  periodIndExpirationDate: '',
  sledBbd: '',

  // Tab 5: Planejamento (MRP)
  mrpType: '',
  mrpCtrler: '',
  mrpGroup: '',
  reorderPt: '',
  lotsizekey: '',
  minlotsize: '',
  maxlotsize: '',
  fixedLot: '',
  roundVal: '',
  servLevel: '',
  maxStock: '',
  safetyStk: '',
  minSafetyStk: '',
  covprofile: '',
  bwdCons: '',
  consummode: '',
  fwdCons: '',
  replentime: '',
  depReqId: '',
  planStrgp: '',

  // Tab 6: Produção
  procType: '',
  spproctype: '',
  backflush: false,
  jitRelvt: false,
  bulkMat: false,
  batchentry: '',
  inhseprodt: '',
  plndDelry: '',
  grPrTime: '',
  ppcPlCal: '',
  smKey: '',
  assyScrap: '',
  compScrap: '',
  repmanprof: '',
  repManuf: '',
  productionScheduler: '',
  prodprof: '',
  underTol: '',
  overTol: '',
  noCosting: false,
  sernoProf: '',
  lotSize: '',
  specprocty: '',
  prtUsage: '',
  ctrlKey: '',
  dbText: '',

  // Tab 7: Armazenagem
  stgeLoc: '',
  ctrlCode: '',
  stgeBin: '',
  availcheck: '',
  transGrp: '',
  loadinggrp: '',
  countryori: '',
  profitCtr: '',
  shMatTyp: '',
  matCfop: '',
  sdText: '',
  issStLoc: '',
  supplyArea: '',
  slocExprc: '',

  // Tab 8: Vendas/Distribuição
  salesOrg: '',
  distrChan: '',

  // Tab 9: Controlling/Custos
  valArea: '',
  valClass: '',

  // Campos do sistema
  createdBy: '',
  isActive: true,
  statusIntegracao: '',

  // Objetos aninhados
  salesDistribution: {
    vkorg: '',
    vtweg: '',
    spart: '',
    dwerk: '',
    lgort: '',
    prctr: '',
    ktgrm: '',
    salesUnit: '',
    minOrder: '',
    minDely: '',
    delyUnit: '',
    taxType1: '',
    taxclass1: '',
    matlStats: '',
    rebateGrp: '',
    commGroup: '',
    matPrGrp: '',
    acctAssgt: '',
    cashDisc: '',
    roundProf: '',
  },
  controlling: {
    bwkey: '',
    bwtar: '',
    matKlass: '',
    valArea: '',
    valClass: '',
    priceCtrl: '',
    stdPrice: '',
    priceUnit: '',
    movingPrice: '',
    priceDate: '',
    mlActive: false,
    mlSettle: false,
    originMat: false,
    originGroup: '',
    overheadGrp: '',
    profitCtr2: '',
    qtyStruct: false,
    inHouse: false,
    matUsage: '',
  plndprice1: '',
  plndprdate1: '',
  plndprice2: '',
  plndprdate2: '',
  plndprice3: '',
  plndprdate3: '',
  },

  // Arrays (compatibilidade)
  salesDistributions: [],
  controllings: [],
};


