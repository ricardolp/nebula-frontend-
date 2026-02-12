import { Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Field } from 'src/components/hook-form';
import { CustomCombobox } from 'src/components/custom-combobox';

import { funcaoParceiroOptions } from '../../schemas/business-partner-schema';

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {Object} props.form - Form instance from react-hook-form
 * @param {boolean} props.disabled - Se true, desabilita todos os campos
 */
export function BusinessPartnerPartnerFunctionsTab({ form, disabled = false }) {
  const { control } = form;

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h6">
          Funções de Parceiro
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="funcoesParceiro.funcaoParceiro"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomCombobox
                  label="Função do Parceiro"
                  disabled={disabled}
                  placeholder="Selecionar função..."
                  options={funcaoParceiroOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="funcoesParceiro.autorizacao"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Autorização"
                  placeholder="Autorização"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Field.DatePicker
              name="funcoesParceiro.validadeInicio"
              label="Validade Início"
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Field.DatePicker
              name="funcoesParceiro.validadeFim"
              label="Validade Fim"
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
