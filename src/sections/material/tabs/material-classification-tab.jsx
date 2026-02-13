import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';
import { RHFMaterialGroupCombobox } from 'src/components/material-group-combobox';

// ----------------------------------------------------------------------

// TAB 2: CLASSIFICAÇÃO
// Códigos de classificação e categorização

// As opções de grupo de mercadorias agora vêm do combobox com 100+ opções

const DIVISION_OPTIONS = [
  { value: '', label: 'Nenhum' },
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

const ITEM_CATEGORY_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: 'NORM', label: 'NORM - Item normal' },
  { value: 'LEER', label: 'LEER - Item vazio' },
  { value: 'TEXT', label: 'TEXT - Item de texto' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '01', label: '01 - Ativo' },
  { value: '02', label: '02 - Bloqueado' },
  { value: '03', label: '03 - Inativo' },
];

const ABC_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: 'A', label: 'A - Alta rotatividade' },
  { value: 'B', label: 'B - Média rotatividade' },
  { value: 'C', label: 'C - Baixa rotatividade' },
];

// ----------------------------------------------------------------------

export function MaterialClassificationTab() {
  return (
    <Stack spacing={3}>
      {/* Grupos */}
      <Card>
        <CardHeader 
          title="Grupos de Material" 
          subheader="Classificação por grupos"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFMaterialGroupCombobox
                name="matlGroup"
                label="Grupo de Material *"
                placeholder="Buscar grupo de mercadorias..."
                helperText="Grupo de material SAP (obrigatório)"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="extmatlgrp"
                label="Grupo Externo"
                placeholder="Grupo externo de materiais"
                helperText="Grupo de material externo"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="matGrpSm"
                label="Grupo de Mercadorias"
                placeholder="Ex: GRP001"
                helperText="Grupo de mercadorias para vendas"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Hierarquia e Divisão */}
      <Card>
        <CardHeader 
          title="Hierarquia e Divisão" 
          subheader="Estrutura organizacional do material"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="division" label="Divisão">
                {DIVISION_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="prodHier"
                label="Hierarquia de Produto"
                placeholder="Ex: 001001"
                helperText="Hierarquia de produtos SAP"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Categorias */}
      <Card>
        <CardHeader 
          title="Categorias e Classificações" 
          subheader="Categorias e identificadores"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="itemCat" label="Categoria de Item">
                {ITEM_CATEGORY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="eanUpc"
                label="Código EAN/UPC"
                placeholder="Código de barras EAN/UPC"
                helperText="Código de barras internacional"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="abcId" label="Classificação ABC">
                {ABC_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Status e Controles */}
      <Card>
        <CardHeader 
          title="Status e Controles" 
          subheader="Status e indicadores de controle"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="purStatus" label="Status de Compras">
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Checkbox 
                name="batchMgmt" 
                label="Gestão de Lotes"
                helperText="Indica se o material possui gestão de lotes"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Checkbox 
                name="physicalCommodity" 
                label="Mercadoria Física"
                helperText="Indica se é uma mercadoria física"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

