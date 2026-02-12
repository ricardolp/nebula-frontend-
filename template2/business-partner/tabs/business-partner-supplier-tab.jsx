import { Box, Checkbox, FormControlLabel, Grid, Stack, Typography , MenuItem } from '@mui/material';

import { RHFTextField, Field } from 'src/components/hook-form';


// ----------------------------------------------------------------------

export function BusinessPartnerSupplierTab() {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Fornecedor IRF
      </Typography>

      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <RHFTextField
              name="rev_fat_bas_em"
              label="Revisão Fatura Base"
              placeholder="Ex: 001"
              helperText="Revisão da fatura base"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="grp_esq_forn"
              label="Grupo Esquema Fornecedor"
              placeholder="Ex: GRP001"
              helperText="Grupo do esquema fornecedor"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Field.Select
              name="regime_pis_cofins"
              label="Regime PIS/COFINS"
              placeholder="Selecione o regime"
              helperText="Regime de PIS/COFINS"
            >
              <MenuItem value="CUMULATIVO">Cumulativo</MenuItem>
              <MenuItem value="NAO_CUMULATIVO">Não Cumulativo</MenuItem>
            </Field.Select>
          </Grid>

          <Grid item xs={12} md={6}>
            <Field.Select
              name="tipo_imposto"
              label="Tipo de Imposto"
              placeholder="Selecione o tipo"
              helperText="Tipo de imposto"
            >
              <MenuItem value="ICMS">ICMS</MenuItem>
              <MenuItem value="IPI">IPI</MenuItem>
              <MenuItem value="ISS">ISS</MenuItem>
              <MenuItem value="PIS">PIS</MenuItem>
              <MenuItem value="COFINS">COFINS</MenuItem>
            </Field.Select>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={<Checkbox name="devolucao" />}
                label="Devolução"
              />
              <FormControlLabel
                control={<Checkbox name="relevante_liquidacao" />}
                label="Relevante Liquidação"
              />
              <FormControlLabel
                control={<Checkbox name="optante_simples" />}
                label="Optante Simples"
              />
              <FormControlLabel
                control={<Checkbox name="simples_nacional" />}
                label="Simples Nacional"
              />
              <FormControlLabel
                control={<Checkbox name="recebedor_alternativo" />}
                label="Recebedor Alternativo"
              />
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
