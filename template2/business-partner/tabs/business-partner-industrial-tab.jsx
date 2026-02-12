import { Box, Grid, Stack, Typography , MenuItem } from '@mui/material';

import { RHFTextField, Field } from 'src/components/hook-form';


// ----------------------------------------------------------------------

/**
 * Aba de Setor Industrial
 * Campos relacionados ao setor industrial
 */
export function BusinessPartnerIndustrialTab() {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Setor Industrial
      </Typography>

      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <RHFTextField
              name="chave_setor_ind"
              label="Chave Setor Industrial"
              placeholder="Ex: IND001"
              helperText="Chave única do setor industrial"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <RHFTextField
              name="cod_setor_ind"
              label="Código Setor Industrial"
              placeholder="Ex: 12345"
              helperText="Código do setor industrial"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Field.Select
              name="setor_ind_padrao"
              label="Setor Industrial Padrão"
              placeholder="Selecione o setor"
              helperText="Setor industrial padrão"
            >
              <MenuItem value="AGRICULTURA">Agricultura</MenuItem>
              <MenuItem value="INDUSTRIA">Indústria</MenuItem>
              <MenuItem value="SERVICOS">Serviços</MenuItem>
              <MenuItem value="COMERCIO">Comércio</MenuItem>
              <MenuItem value="CONSTRUCAO">Construção</MenuItem>
              <MenuItem value="TECNOLOGIA">Tecnologia</MenuItem>
              <MenuItem value="SAUDE">Saúde</MenuItem>
              <MenuItem value="EDUCACAO">Educação</MenuItem>
              <MenuItem value="FINANCEIRO">Financeiro</MenuItem>
              <MenuItem value="OUTRO">Outro</MenuItem>
            </Field.Select>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
