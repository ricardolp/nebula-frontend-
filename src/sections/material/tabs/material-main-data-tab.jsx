import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';
import { RHFSapMaterialTypeCombobox } from 'src/components/sap-material-type-combobox';

// ----------------------------------------------------------------------

// MATERIAL_TYPE_OPTIONS removido - agora usando SapMaterialTypeCombobox com todos os tipos SAP

const IND_SECTOR_OPTIONS = [
  { value: '1', label: '1 - Comércio' },
  { value: 'A', label: 'A - Constr.instal.industriais' },
  { value: 'C', label: 'C - Química' },
  { value: 'I', label: 'I - Indústria mineira' },
  { value: 'M', label: 'M - Engenharia mecânica' },
  { value: 'O', label: 'O - Indústria petrolífera' },
  { value: 'P', label: 'P - Indústria farmacêutica' },
];

const BASE_UOM_OPTIONS = [
  { value: 'UN', label: 'UN - Unidade' },
  { value: 'PC', label: 'PC - Peça' },
  { value: 'KG', label: 'KG - Quilograma' },
  { value: 'L', label: 'L - Litro' },
  { value: 'M', label: 'M - Metro' },
  { value: 'M2', label: 'M2 - Metro Quadrado' },
  { value: 'M3', label: 'M3 - Metro Cúbico' },
];

const DIVISION_OPTIONS = [
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

const STATUS_OPTIONS = [
  { value: '01', label: 'Ativo' },
  { value: '02', label: 'Bloqueado' },
  { value: '03', label: 'Inativo' },
];

const MATERIAL_GROUP_OPTIONS = [
  { value: 'ALM001001', label: 'ALM001001 - EXPEDIENTE' },
  { value: 'ALM001002', label: 'ALM001002 - GRAFICO' },
  { value: 'ALM001003', label: 'ALM001003 - HIGIENE E LIMPEZA' },
  { value: 'ALM001004', label: 'ALM001004 - PAPELARIA' },
  { value: 'ALM001005', label: 'ALM001005 - UNIFORMES ADM' },
  { value: 'ALM001006', label: 'ALM001006 - UNIFORMES OPER' },
  { value: 'ALM001007', label: 'ALM001007 - BRINDES' },
  { value: 'ALM001008', label: 'ALM001008 - SEGURANCA TI' },
  { value: 'ALM001009', label: 'ALM001009 - REDES TI' },
  { value: 'ALM001010', label: 'ALM001010 - INFORMATICA TI' },
  { value: 'ALM001011', label: 'ALM001011 - TELEFONIA TI' },
  { value: 'ALM001012', label: 'ALM001012 - BALANCA TI' },
  { value: 'ALM001013', label: 'ALM001013 - ENERGIA TI' },
  { value: 'ALM001014', label: 'ALM001014 - INFRAESTRUTURA TI' },
  { value: 'ALM001015', label: 'ALM001015 - CORREIAS' },
  { value: 'ALM001016', label: 'ALM001016 - FERRAGEM' },
  { value: 'ALM001017', label: 'ALM001017 - TINTAS' },
  { value: 'ALM001018', label: 'ALM001018 - ROLAMENTOS' },
  { value: 'ALM001019', label: 'ALM001019 - MATERIAIS TRABALHO' },
  { value: 'ALM001020', label: 'ALM001020 - PARAFUSOS' },
  { value: 'ALM001021', label: 'ALM001021 - EQUIPAMENTOS' },
  { value: 'ALM001022', label: 'ALM001022 - PNEUMATICOS' },
  { value: 'ALM001023', label: 'ALM001023 - INSTALAÇÃO' },
  { value: 'ALM001024', label: 'ALM001024 - CONDUTORES' },
  { value: 'ALM001025', label: 'ALM001025 - ILUMINAÇÃO' },
  { value: 'ALM001026', label: 'ALM001026 - AUTOMAÇÃO' },
  { value: 'ALM001027', label: 'ALM001027 - COMANDO E PROTECAO' },
  { value: 'ALM001028', label: 'ALM001028 - MOTORES E BOMBAS' },
  { value: 'ALM001029', label: 'ALM001029 - POLIA RODA DENTADA' },
  { value: 'ALM001030', label: 'ALM001030 - BORRACHARIA' },
  { value: 'ALM001031', label: 'ALM001031 - FILTRO E ÓLEO' },
  { value: 'ALM001032', label: 'ALM001032 - PEÇAS FROTA' },
  { value: 'ALM001033', label: 'ALM001033 - ELETRICA FROTA' },
  { value: 'ALM001034', label: 'ALM001034 - EPI' },
  { value: 'ALM001035', label: 'ALM001035 - SEGURANÇA' },
  { value: 'ALM001036', label: 'ALM001036 - ARMAZENAGEM' },
  { value: 'ALM001037', label: 'ALM001037 - USADOS GERAIS' },
  { value: 'ALM001038', label: 'ALM001038 - USADOS TI' },
  { value: 'COB001001', label: 'COB001001 - COMBUSTÍVEL' },
  { value: 'EMB001001', label: 'EMB001001 - EMBALAGENS' },
  { value: 'FER001001', label: 'FER001001 - FERRAM. E EQUIP.' },
  { value: 'GAS001001', label: 'GAS001001 - GAS' },
  { value: 'GRA001001', label: 'GRA001001 - CANOLA' },
  { value: 'GRA001002', label: 'GRA001002 - SOJA' },
  { value: 'GRA001003', label: 'GRA001003 - TRIGO' },
  { value: 'GRA001004', label: 'GRA001004 - MILHO' },
  { value: 'GRA001005', label: 'GRA001005 - TRIGUILHO' },
  { value: 'GRA001006', label: 'GRA001006 - TRITICALE' },
  { value: 'GRA001007', label: 'GRA001007 - CEVADA' },
  { value: 'GRA001008', label: 'GRA001008 - AVEIA' },
  { value: 'GRA001009', label: 'GRA001009 - FEIJÃO' },
  { value: 'GRA001010', label: 'GRA001010 - CENTEIO' },
  { value: 'GRA001011', label: 'GRA001011 - CARINATA' },
  { value: 'IMO001001', label: 'IMO001001 - IMOBILIZADOS' },
  { value: 'INS001001', label: 'INS001001 - CORRETIVOS' },
  { value: 'INS001002', label: 'INS001002 - DEFENSIVOS' },
  { value: 'INS001003', label: 'INS001003 - FERTILIZANTES' },
  { value: 'INS001004', label: 'INS001004 - SEM CAPIM SUDÃO' },
  { value: 'INS001005', label: 'INS001005 - SEMENTE CEVADA' },
  { value: 'INS001006', label: 'INS001006 - SEM AVEIA BRANCA' },
  { value: 'INS001007', label: 'INS001007 - SEM AVEIA PRETA' },
  { value: 'INS001008', label: 'INS001008 - SEMENTE AZEVEM' },
  { value: 'INS001009', label: 'INS001009 - SEM BRAQUIARIA' },
  { value: 'INS001010', label: 'INS001010 - SEMENTE CANOLA' },
  { value: 'INS001011', label: 'INS001011 - SEMENTE CENTEIO' },
  { value: 'INS001012', label: 'INS001012 - SEMENTE FEIJÃO' },
  { value: 'INS001013', label: 'INS001013 - SEMENTE GIRASSOL' },
  { value: 'INS001014', label: 'INS001014 - SEMENTE MILHETO' },
  { value: 'INS001015', label: 'INS001015 - SEM NABO FORRAG' },
  { value: 'INS001016', label: 'INS001016 - SEMENTE SORGO' },
  { value: 'INS001017', label: 'INS001017 - SEMENTE TREVO' },
  { value: 'INS001018', label: 'INS001018 - SEMENTE TRITICALE' },
  { value: 'INS001019', label: 'INS001019 - SEMENTE MILHO' },
  { value: 'INS001020', label: 'INS001020 - SEMENTE SOJA' },
  { value: 'INS001021', label: 'INS001021 - SEMENTE TRIGO' },
  { value: 'INS001022', label: 'INS001022 - SEMENTE MIX' },
  { value: 'LEN001001', label: 'LEN001001 - LENHA' },
  { value: 'LET001001', label: 'LET001001 - LEITE COMERCIO' },
  { value: 'SEM001001', label: 'SEM001001 - SEMI ACABADO' },
  { value: 'SEV001001', label: 'SEV001001 - SERV. ELETRICA' },
  { value: 'SEV001002', label: 'SEV001002 - SERV. PROJETOS' },
  { value: 'SEV001003', label: 'SEV001003 - SERV. MECANICA' },
  { value: 'SEV001004', label: 'SEV001004 - SERV. METALICA' },
  { value: 'SEV001005', label: 'SEV001005 - SERV. PREVENTIVA' },
  { value: 'SEV001006', label: 'SEV001006 - SERV. PPCI' },
  { value: 'SEV001007', label: 'SEV001007 - SERV. EQUIPAMENTO' },
  { value: 'SEV001008', label: 'SEV001008 - SERV. SILO METAL' },
  { value: 'SEV001009', label: 'SEV001009 - SERV. FLUXO GRÃOS' },
  { value: 'SEV001010', label: 'SEV001010 - SERV. FROTA' },
  { value: 'SEV001011', label: 'SEV001011 - SERV. IMOVEIS' },
  { value: 'SEV001012', label: 'SEV001012 - SERV. EN. ELETRICA' },
  { value: 'SEV001013', label: 'SEV001013 - SERV. AGUA' },
  { value: 'SEV001014', label: 'SEV001014 - SERV. INTERNET' },
  { value: 'SEV001015', label: 'SEV001015 - SERV. HIGIENIZAÇÃO' },
  { value: 'SEV001016', label: 'SEV001016 - SERV. LAVANDERIA' },
  { value: 'SEV001017', label: 'SEV001017 - SERV. AUDIOVISUAL' },
];

// ----------------------------------------------------------------------

export function MaterialMainDataTab({ isEdit = false }) {
  return (
    <Stack spacing={3}>
      {/* Identificação */}
      <Card>
        <CardHeader title="Identificação" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="material"
                label="Código do Material *"
                disabled={isEdit}
                placeholder="Ex: MAT001"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="codigo_sap"
                label="Código SAP"
                disabled
                helperText="Preenchido automaticamente após envio para SAP"
              />
            </Grid>
            <Grid item xs={12}>
              <Field.Text
                name="matl_desc"
                label="Descrição do Material *"
                placeholder="Descrição completa do material"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFSapMaterialTypeCombobox
                name="matl_type"
                label="Tipo de Material *"
                placeholder="Selecione um tipo de material..."
                required
                helperText="Selecione o tipo de material SAP"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="ind_sector" label="Sistema Setorial">
                {IND_SECTOR_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Unidades de Medida */}
      <Card>
        <CardHeader title="Unidades de Medida" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="base_uom" label="Unidade de Medida Base *">
                {BASE_UOM_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="alt_unit" label="Unidade de Medida Alternativa">
                {BASE_UOM_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="fator_alt_unit"
                label="Fator de Conversão Alt"
                type="number"
                placeholder="1"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="fator_base_uom"
                label="Fator de Conversão Base"
                type="number"
                placeholder="1"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Classificação */}
      <Card>
        <CardHeader title="Classificação" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="matl_group" label="Grupo de Mercadorias *">
                {MATERIAL_GROUP_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="division" label="Setor de Atividade *">
                {DIVISION_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="prod_hier"
                label="Hierarquia de Produto"
                placeholder="Ex: 001001"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="extmatlgrp"
                label="Grupo Externo de Materiais"
                placeholder="Opcional"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Referências */}
      <Card>
        <CardHeader title="Referências" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="old_mat_no"
                label="Nº Material Antigo"
                placeholder="Código anterior do material"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="basic_matl"
                label="Material Base"
                placeholder="Material de referência"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="pl_ref_mat"
                label="Material de Referência"
                placeholder="Referência de embalagem"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="ean_upc"
                label="Código EAN/UPC"
                placeholder="Código de barras"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader title="Status" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="status" label="Status do Material">
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="pur_status" label="Status de Compras">
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

