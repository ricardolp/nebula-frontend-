// Mapeamento de Centro -> Depósitos
// Cada centro tem seus próprios depósitos específicos
export const DEPOT_BY_PLANT = {
  '0001': [
    { code: '0001', label: 'Lager 0001' },
    { code: '0088', label: 'Lager 0088 (WM)' },
    { code: '0200', label: 'SCM-EWM' },
  ],
  '0003': [
    { code: '0001', label: 'Lager 0001' },
    { code: '0088', label: 'Lager 0088 (WM)' },
  ],
  '1410': [
    { code: '141A', label: 'Std. storage 1' },
    { code: '141B', label: 'Std. storage 2' },
    { code: '141C', label: 'Raw mat. stoloc.' },
    { code: '141E', label: 'KANBAN' },
    { code: '141R', label: 'Returns' },
    { code: 'GRA1', label: 'Grãos' },
  ],
  '1510': [
    { code: '141A', label: 'Std. storage 1' },
    { code: '141B', label: 'Std. storage 2' },
    { code: '141C', label: 'Raw mat. stoloc.' },
    { code: '141E', label: 'KANBAN' },
    { code: '141R', label: 'Returns' },
    { code: 'GRA1', label: 'Grãos' },
  ],
  '1710': [
    { code: '141A', label: 'Std. storage 1' },
    { code: '141B', label: 'Std. storage 2' },
    { code: '141C', label: 'Raw mat. stoloc.' },
    { code: '141E', label: 'KANBAN' },
    { code: '141R', label: 'Returns' },
    { code: '171A', label: 'Std. storage 1' },
    { code: '171B', label: 'Std. storage 2' },
    { code: '171C', label: 'Raw Materials' },
    { code: '171D', label: 'EWM Rec. on Dock' },
    { code: '171E', label: 'KANBAN' },
    { code: '171F', label: 'Residual SLoc' },
    { code: '171Q', label: 'Main Tank' },
    { code: '171R', label: 'Returns' },
    { code: '171S', label: 'EWM Av. for Sale' },
    { code: '171T', label: 'Day Tank' },
    { code: 'GRA1', label: 'Grãos' },
  ],
  'A001': [
    { code: 'AL01', label: 'EWM ALMO Entrada' },
    { code: 'AL03', label: 'Almox. Estoque' },
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'DE01', label: 'EWM Recebimento' },
    { code: 'DT01', label: 'Dep. transitório' },
    { code: 'DV01', label: 'Devoluções' },
    { code: 'E001', label: 'EWM Venda/Transf' },
    { code: 'E002', label: 'EWM Almoxarifado' },
    { code: 'MN01', label: 'Manut. Produção' },
    { code: 'PI01', label: 'Posto Interno' },
    { code: 'RE01', label: 'Ret. Embalagem' },
    { code: 'S001', label: 'Depósito Grãos' },
    { code: 'TD01', label: 'INS Trocas' },
    { code: 'TE01', label: 'INS Terce/Espec' },
    { code: 'VB01', label: 'INS Espec/Venda' },
  ],
  'A002': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A003': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A005': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A008': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A010': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A011': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A013': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A015': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A018': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A019': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A020': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
  ],
  'A021': [
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A022': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A023': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A024': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A026': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A027': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A031': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A032': [
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A033': [
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A034': [
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A035': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'DV01', label: 'INS Devoluções' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A037': [
    { code: 'D001', label: 'Depósito' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A039': [
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A042': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A043': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A044': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A046': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A052': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'DV01', label: 'INS Devoluções' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A053': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A055': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A056': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A057': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A058': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A060': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A062': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A063': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A064': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A065': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A066': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A067': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A068': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A069': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A070': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A071': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A072': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A074': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A075': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A077': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DV01', label: 'INS Devoluções' },
  ],
  'A098': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A100': [
    { code: 'D001', label: 'Depósito' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A104': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A105': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A106': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A107': [
    { code: 'D001', label: 'Depósito' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A109': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A110': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A111': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A112': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A114': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A115': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A116': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A117': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A118': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A119': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A120': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A121': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A122': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A123': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DV01', label: 'INS Devoluções' },
  ],
  'A124': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A125': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'DAOB', label: 'Dep. Armaz Oblig' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A126': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A143': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A145': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A146': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A147': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A148': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A151': [
    { code: 'D001', label: 'Depósito' },
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'A156': [
    { code: 'DA01', label: 'Dep. Armazenagem' },
    { code: 'S001', label: 'Depósito Grãos' },
  ],
  'AFC1': [
    { code: 'D001', label: 'Depósito' },
  ],
  'E028': [
    { code: 'D001', label: 'Depósito' },
    { code: 'R001', label: 'Revenda' },
  ],
  'F029': [
    { code: 'D001', label: 'EWM Recebimento' },
    { code: 'D003', label: 'Matéria Prima' },
    { code: 'DF01', label: 'Depósito Fab 1' },
    { code: 'DF02', label: 'Depósito Fab 2' },
    { code: 'DT01', label: 'Dep. transitório' },
    { code: 'DVA1', label: 'Devolução Alibem' },
    { code: 'E001', label: 'EWM Venda/Transf' },
    { code: 'EX01', label: 'Robô EXP 1' },
    { code: 'EX02', label: 'Robô EXP 2' },
    { code: 'M001', label: 'Moega 01' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'IT01': [
    { code: 'S001', label: 'Silo 01' },
    { code: 'S002', label: 'Silo 02' },
    { code: 'S003', label: 'Silo 03' },
    { code: 'S004', label: 'Silo 04' },
    { code: 'S005', label: 'Silo 05' },
    { code: 'S006', label: 'Silo 06' },
    { code: 'S007', label: 'Silo 07' },
    { code: 'S008', label: 'Silo 08' },
    { code: 'S009', label: 'Silo 09' },
    { code: 'S010', label: 'Silo 10' },
  ],
  'L049': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L050': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L051': [
    { code: 'DT01', label: 'Dep. transitório' },
    { code: 'ES02', label: 'Estoque externo' },
  ],
  'L078': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L079': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L080': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L081': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L082': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L083': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L084': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L085': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L086': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L087': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L088': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L089': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L090': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L091': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L092': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L093': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L094': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L096': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L099': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L102': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L103': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L135': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L136': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L138': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L140': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L141': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L142': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L150': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L152': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'L155': [
    { code: 'CO01', label: 'Condicional' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S006': [
    { code: 'P001', label: 'Padaria' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S007': [
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S009': [
    { code: 'P001', label: 'Padaria' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S014': [
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S017': [
    { code: 'P001', label: 'Padaria' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S038': [
    { code: 'D001', label: 'Depósito' },
    { code: 'D002', label: 'Depósito Sede' },
    { code: 'D005', label: 'Depósito Madelar' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S040': [
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S041': [
    { code: 'P001', label: 'Padaria' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S047': [
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S059': [
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S095': [
    { code: 'P001', label: 'Padaria' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S127': [
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S129': [
    { code: 'P001', label: 'Padaria' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S130': [
    { code: 'P001', label: 'Padaria' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S132': [
    { code: 'P001', label: 'Padaria' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S144': [
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'S153': [
    { code: 'P001', label: 'Padaria' },
    { code: 'R001', label: 'Revenda' },
    { code: 'TD01', label: 'Trocas' },
  ],
  'T097': [
    { code: 'CM01', label: 'DIESEL S500' },
    { code: 'CM02', label: 'DIESEL S10' },
  ],
  'TR01': [
    { code: 'AL02', label: 'Almox. Transp' },
    { code: 'PI02', label: 'Posto Interno' },
  ],
  'TR02': [
    { code: 'D001', label: 'Depósito' },
  ],
  'TR03': [
    { code: 'D001', label: 'Depósito' },
    { code: 'PI02', label: 'Posto Interno' },
  ],
  'U012': [
    { code: 'D001', label: 'EWM Recebimento' },
    { code: 'DT01', label: 'Dep. transitório' },
    { code: 'E001', label: 'EWM Venda/Transf' },
    { code: 'ES01', label: 'Estoque' },
    { code: 'M001', label: 'Moega 01' },
    { code: 'M002', label: 'Moega 02' },
    { code: 'M003', label: 'Moega 03' },
    { code: 'M004', label: 'Moega 04' },
    { code: 'M005', label: 'Moega 05' },
    { code: 'M006', label: 'Moega 06' },
    { code: 'P001', label: 'Beneficiamento' },
    { code: 'S001', label: 'Silo 01' },
    { code: 'S002', label: 'Silo 02' },
    { code: 'S003', label: 'Silo 03' },
    { code: 'S004', label: 'Silo 04' },
    { code: 'S005', label: 'Silo 05' },
    { code: 'S006', label: 'Silo 06' },
    { code: 'S007', label: 'Silo 07' },
    { code: 'S008', label: 'Silo 08' },
    { code: 'S009', label: 'Silo 09' },
    { code: 'S010', label: 'Silo 10' },
    { code: 'S011', label: 'Silo 11' },
    { code: 'S012', label: 'Silo 12' },
    { code: 'S013', label: 'Silo 13' },
    { code: 'S014', label: 'Silo 14' },
    { code: 'S015', label: 'Silo 15' },
    { code: 'S016', label: 'Silo 16' },
    { code: 'S017', label: 'Silo 17' },
    { code: 'S018', label: 'Silo 18' },
    { code: 'S019', label: 'Silo 19' },
    { code: 'S020', label: 'Silo 20' },
    { code: 'S021', label: 'Silo 21' },
    { code: 'S022', label: 'Silo 22' },
    { code: 'S023', label: 'Silo 23' },
    { code: 'S024', label: 'Silo 24' },
    { code: 'S025', label: 'Silo 25' },
    { code: 'S026', label: 'Silo 26' },
    { code: 'S027', label: 'Silo 27' },
    { code: 'S028', label: 'Silo 28' },
    { code: 'S029', label: 'Silo 29' },
    { code: 'S030', label: 'Silo 30' },
    { code: 'SP01', label: 'Pulmão 1' },
    { code: 'SP02', label: 'Pulmão 2' },
    { code: 'SP03', label: 'Pulmão 3' },
    { code: 'SP04', label: 'Pulmão 4' },
    { code: 'SP05', label: 'Pulmão 5' },
    { code: 'SP06', label: 'Pulmão 6' },
    { code: 'SS01', label: 'Silo secador 1' },
    { code: 'SS02', label: 'Silo secador 2' },
    { code: 'SU01', label: 'Descarte/Sucata' },
  ],
  'V101': [
    { code: 'D001', label: 'Depósito' },
  ],
};

// Função para obter depósitos de um centro específico
export function getDepotsByPlant(plantCode) {
  if (!plantCode) return [];
  return DEPOT_BY_PLANT[plantCode] || [];
}

// Função para buscar depósitos por termo (dentro de um centro)
export function searchDepotOptions(plantCode, searchTerm = '') {
  const depots = getDepotsByPlant(plantCode);
  
  if (!searchTerm) return depots;
  
  const term = searchTerm.toLowerCase();
  return depots.filter(
    (option) =>
      option.code.toLowerCase().includes(term) ||
      option.label.toLowerCase().includes(term)
  );
}

// Função para obter label do depósito pelo código (dentro de um centro)
export function getDepotLabel(plantCode, depotCode) {
  if (!depotCode) return '';
  const depots = getDepotsByPlant(plantCode);
  const option = depots.find((opt) => opt.code === depotCode);
  return option ? `${option.code} - ${option.label}` : depotCode;
}
