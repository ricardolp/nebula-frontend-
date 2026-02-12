import { Box, Grid, Stack, Typography } from '@mui/material';

import { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function BusinessPartnerPaymentTab({ isView = false }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Pagamentos
      </Typography>

      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <RHFTextField
              name="cod_banco"
              label="Código do Banco"
              placeholder="Ex: 001"
              helperText="Código do banco"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="cod_agencia"
              label="Código da Agência"
              placeholder="Ex: 1234"
              helperText="Código da agência"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="cod_conta"
              label="Código da Conta"
              placeholder="Ex: 12345-6"
              helperText="Código da conta"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="dig_conta"
              label="Dígito da Conta"
              placeholder="Ex: 7"
              helperText="Dígito verificador da conta"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="favorecido"
              label="Favorecido"
              placeholder="Ex: João Silva"
              helperText="Nome do favorecido"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="cpf_favorecido"
              label="CPF do Favorecido"
              placeholder="000.000.000-00"
              helperText="CPF do favorecido"
              InputProps={{
                readOnly: isView,
              }}
            />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
