import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const AVAILABILITY_CHECK_OPTIONS = [
  { value: '01', label: '01 - Verificação Individual' },
  { value: '02', label: '02 - Verificação Coletiva' },
  { value: 'KP', label: 'KP - Verificação ATP' },
];

const COUNTRY_OPTIONS = [
  { value: 'BR', label: 'BR - Brasil' },
  { value: 'US', label: 'US - Estados Unidos' },
  { value: 'DE', label: 'DE - Alemanha' },
  { value: 'CN', label: 'CN - China' },
];

const CFOP_OPTIONS = [
  { value: '01', label: '01 - Venda Normal' },
  { value: '02', label: '02 - Venda Interestadual' },
  { value: '03', label: '03 - Exportação' },
];

// ----------------------------------------------------------------------

export function MaterialSdCenterTab() {
  return (
    <Stack spacing={3}>
      {/* Verificação de Disponibilidade */}
      <Card>
        <CardHeader title="Verificação de Disponibilidade" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field.Select name="availcheck" label="Verificação de Disponibilidade">
                {AVAILABILITY_CHECK_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Transporte e Carga */}
      <Card>
        <CardHeader title="Transporte e Carga" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="trans_grp"
                label="Grupo de Transporte"
                placeholder="Ex: 0001"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="loadinggrp"
                label="Grupo de Carga"
                placeholder="Ex: 0001"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Origem e Centro */}
      <Card>
        <CardHeader title="Origem e Centro" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="countryori" label="País de Origem">
                {COUNTRY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="profit_ctr"
                label="Centro de Lucro"
                placeholder="Ex: 0000000001"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* CFOP */}
      <Card>
        <CardHeader title="CFOP" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field.Select name="mat_cfop" label="CFOP do Material">
                {CFOP_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Outros */}
      <Card>
        <CardHeader title="Outros Dados SD/Centro" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field.Text
                name="sh_mat_typ"
                label="Tipo de Material de Remessa"
                placeholder="Ex: 0001"
              />
            </Grid>
            <Grid item xs={12}>
              <Field.Text
                name="sd_text"
                label="Texto SD"
                multiline
                rows={3}
                placeholder="Texto adicional para vendas e distribuição"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

