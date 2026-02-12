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
export function BusinessPartnerIdentificationTab({ form, disabled = false }) {
  const { control, setValue, watch } = form;

  const formatCpf = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCnpj = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  // Watch dos campos CPF e CNPJ para validação mútua
  const cpfValue = watch('identificacao.cpf');
  const cnpjValue = watch('identificacao.cnpj');

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h6">
          Identificação
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="identificacao.cpf"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="CPF"
                  placeholder="000.000.000-00"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    maxLength: 14,
                  }}
                    onChange={(e) => {
                      const formatted = formatCpf(e.target.value);
                      field.onChange(formatted);
                      
                      // Se CPF for preenchido, limpa CNPJ
                      if (formatted.replace(/\D/g, '').length === 11) {
                        setValue('identificacao.cnpj', '');
                      }
                    }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="identificacao.cnpj"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="CNPJ"
                  placeholder="00.000.000/0000-00"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    maxLength: 18,
                  }}
                    onChange={(e) => {
                      const formatted = formatCnpj(e.target.value);
                      field.onChange(formatted);
                      
                      // Se CNPJ for preenchido, limpa CPF e seta gênero como Organização
                      if (formatted.replace(/\D/g, '').length === 14) {
                        setValue('identificacao.cpf', '');
                        setValue('sexo', 'O'); // O = Organização (Pessoa Jurídica)
                        setValue('vocativo', '0003'); // 0003 = Empresa
                      }
                    }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="identificacao.inscrEstatual"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Inscrição Estadual"
                  placeholder="Inscrição estadual"
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
            <Controller
              name="identificacao.inscrMunicipal"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Inscrição Municipal"
                  placeholder="Inscrição municipal"
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
            <Controller
              name="identificacao.tipoIdIdent"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Tipo de Identificação"
                  placeholder="Tipo de identificação"
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
            <Controller
              name="identificacao.numeroId"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Número de Identificação"
                  placeholder="Número de identificação"
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
