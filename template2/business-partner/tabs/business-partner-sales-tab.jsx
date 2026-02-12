import { Box, Grid, Stack, Typography, FormControlLabel, Checkbox } from '@mui/material';

import { RHFTextField } from 'src/components/hook-form';


// ----------------------------------------------------------------------

export function BusinessPartnerSalesTab({ isView = false }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Vendas
      </Typography>

      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <RHFTextField
              name="vendas_grupo_clientes"
              label="Grupo de Clientes"
              placeholder="Grupo de clientes"
              helperText="Grupo de clientes"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="vendas_escritorio_vendas"
              label="Escritório de Vendas"
              placeholder="Escritório de vendas"
              helperText="Escritório de vendas responsável"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="vendas_equipe_vendas"
              label="Equipe de Vendas"
              placeholder="Equipe de vendas"
              helperText="Equipe de vendas responsável"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="vendas_atributo_1"
              label="Atributo 1"
              placeholder="Atributo personalizado"
              helperText="Atributo personalizado de vendas"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="vendas_atributo_2"
              label="Atributo 2"
              placeholder="Atributo personalizado"
              helperText="Atributo personalizado de vendas"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="vendas_sociedade_parceiro"
              label="Sociedade Parceiro"
              placeholder="Sociedade parceiro"
              helperText="Sociedade parceiro"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="vendas_centro_fornecedor"
              label="Centro Fornecedor"
              placeholder="Centro fornecedor"
              helperText="Centro fornecedor"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="condicao_expedicao"
              label="Condição de Expedição"
              placeholder="Condição de expedição"
              helperText="Condição de expedição"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="perfil_cliente_bayer"
              label="Perfil Cliente Bayer"
              placeholder="Perfil do cliente"
              helperText="Perfil do cliente Bayer"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <FormControlLabel
                control={<Checkbox name="vendas_relevante_liquidacao" disabled={isView} />}
                label="Relevante Liquidação"
              />
              <FormControlLabel
                control={<Checkbox name="relevante_crr" disabled={isView} />}
                label="Relevante CRR"
              />
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
