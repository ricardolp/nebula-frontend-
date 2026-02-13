import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';
import { RHFPlantCombobox } from 'src/components/plant-combobox';

// ----------------------------------------------------------------------

// TAB 4: COMPRAS
// Informações relacionadas a compras e procurement

// As opções de centro/plant agora vêm do combobox com 150+ opções

const PUR_GROUP_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '001', label: '001 - Group 001' },
  { value: '002', label: '002 - Group 002' },
  { value: '003', label: '003 - Group 003' },
  { value: '005', label: '005 - Transportation Srv' },
  { value: 'CMM', label: 'CMM - Grãos' },
  { value: 'G01', label: 'G01 - Compras Padaria' },
  { value: 'G02', label: 'G02 - Compras Açougue' },
  { value: 'G03', label: 'G03 - Compras Fruteira' },
  { value: 'G04', label: 'G04 - Compras Mercearia' },
  { value: 'G05', label: 'G05 - Saúde Animal' },
  { value: 'G08', label: 'G08 - Defensivos' },
  { value: 'G09', label: 'G09 - Corretivos' },
  { value: 'G10', label: 'G10 - Fertilizantes' },
  { value: 'G11', label: 'G11 - Leite' },
  { value: 'G12', label: 'G12 - Sementes' },
  { value: 'G13', label: 'G13 - Mecânica' },
  { value: 'G14', label: 'G14 - Elétrica' },
  { value: 'G15', label: 'G15 - Civil' },
];

const PUR_STATUS_CENTER_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '01', label: '01 - Design' },
  { value: '02', label: '02 - Design e plano' },
  { value: '03', label: '03 - Utilizar' },
  { value: '04', label: '04 - Controle peças obsoletas' },
  { value: '05', label: '05 - Obsoleto' },
  { value: 'Z1', label: 'Z1 - Fora de linha' },
  { value: 'Z2', label: 'Z2 - VLE' },
  { value: 'Z3', label: 'Z3 - Falta fornecedor' },
];

const STORAGE_CONDITION_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '01', label: '01 - Temperatura Ambiente' },
  { value: '02', label: '02 - Refrigerado' },
  { value: '03', label: '03 - Congelado' },
  { value: '04', label: '04 - Ambiente Controlado' },
];

const PERIOD_IND_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: 'D', label: 'D - Dias' },
  { value: 'W', label: 'W - Semanas' },
  { value: 'M', label: 'M - Meses' },
  { value: 'Y', label: 'Y - Anos' },
];

// ----------------------------------------------------------------------

export function MaterialPurchasingTab() {
  return (
    <Stack spacing={3}>
      {/* Centro e Grupo de Compras */}
      <Card>
        <CardHeader 
          title="Centro e Grupo de Compras" 
          subheader="Configurações de centro e grupo de compradores"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFPlantCombobox
                name="plant"
                label="Centro (Plant)"
                placeholder="Buscar centro..."
                helperText="Centro/planta SAP"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="purGroup" label="Grupo de Compras">
                {PUR_GROUP_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12}>
              <Field.Select name="purStatusMarc" label="Status de Compras do Centro">
                {PUR_STATUS_CENTER_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Ordem de Compra */}
      <Card>
        <CardHeader 
          title="Ordem de Compra" 
          subheader="Configurações para pedidos de compra"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="poUnit"
                label="Unidade de Ordem"
                placeholder="Ex: PC, UN, KG"
                helperText="Unidade de medida para pedidos"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Checkbox 
                name="autoPOrd" 
                label="Ordem Automática"
                helperText="Geração automática de ordem de compra"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="purValkey"
                label="Chave de Avaliação"
                placeholder="Chave de avaliação"
                helperText="Chave para avaliação de compras"
              />
            </Grid>
            <Grid item xs={12}>
              <Field.Text
                name="poText"
                label="Texto Ordem de Compra"
                placeholder="Texto padrão para ordens de compra"
                multiline
                rows={2}
                helperText="Texto que aparecerá nas ordens de compra"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Condições de Armazenagem */}
      <Card>
        <CardHeader 
          title="Condições de Armazenagem" 
          subheader="Requisitos de armazenamento"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="storConds" label="Condições de Armazenagem">
                {STORAGE_CONDITION_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Vida Útil */}
      <Card>
        <CardHeader 
          title="Vida Útil e Validade" 
          subheader="Controle de validade do material"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="minremlife"
                label="Vida Útil Mínima"
                type="number"
                placeholder="0"
                helperText="Vida útil mínima remanescente (em dias)"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="shelfLife"
                label="Vida Útil Total"
                type="number"
                placeholder="0"
                helperText="Vida útil total do material (em dias)"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="periodIndExpirationDate" label="Período Indicador de Validade">
                {PERIOD_IND_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="sledBbd"
                label="SLED/BBD"
                placeholder="SLED/BBD"
                helperText="Shelf Life Expiration Date / Best Before Date"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}
