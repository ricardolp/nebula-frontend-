import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';

import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function MaterialWorkSchedulingTab() {
  return (
    <Stack spacing={3}>
      {/* Produção */}
      <Card>
        <CardHeader title="Produção" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="production_scheduler"
                label="Programador de Produção"
                placeholder="Ex: 001"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="prodprof"
                label="Perfil de Produção"
                placeholder="Ex: 000001"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Tolerâncias */}
      <Card>
        <CardHeader title="Tolerâncias" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="under_tol"
                label="Tolerância Negativa (%)"
                type="number"
                placeholder="0"
                inputProps={{ min: 0, max: 100, step: '0.01' }}
                helperText="Percentual de tolerância para entrega incompleta"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="over_tol"
                label="Tolerância Positiva (%)"
                type="number"
                placeholder="0"
                inputProps={{ min: 0, max: 100, step: '0.01' }}
                helperText="Percentual de tolerância para entrega excedente"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Custeio */}
      <Card>
        <CardHeader title="Custeio" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Checkbox name="no_costing" label="Sem Custeio" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="lot_size"
                label="Tamanho de Lote para Custeio"
                type="number"
                placeholder="0"
              />
            </Grid>
            <Grid item xs={12}>
              <Field.Text
                name="specprocty"
                label="Tipo de Aquisição Especial"
                placeholder="Ex: 50"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Nº de Série */}
      <Card>
        <CardHeader title="Nº de Série" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field.Text
                name="serno_prof"
                label="Perfil de Nº de Série"
                placeholder="Ex: 0001"
                helperText="Perfil para controle de números de série"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* PRT (Equipamento de Produção) */}
      <Card>
        <CardHeader title="PRT - Equipamento de Produção" />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="prt_usage"
                label="Utilização de PRT"
                placeholder="Ex: 00001"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="ctrl_key"
                label="Chave de Controle"
                placeholder="Ex: PP01"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

