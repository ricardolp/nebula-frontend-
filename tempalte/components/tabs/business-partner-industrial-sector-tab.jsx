import { Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {Object} props.form - Form instance from react-hook-form
 * @param {boolean} props.disabled - Se true, desabilita todos os campos
 */
export function BusinessPartnerIndustrialSectorTab({ form, disabled = false }) {
  const { control } = form;

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h6">
          Setor Industrial
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="setorIndustrial.chaveSetorInd"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Chave Setor Industrial"
                  placeholder="Chave do setor industrial"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="setorIndustrial.codSetorInd"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Código Setor Industrial"
                  placeholder="Código do setor industrial"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="setorIndustrial.setorIndPadrao"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Setor Industrial Padrão"
                  placeholder="Setor industrial padrão"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
