import { Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {Object} props.form - Form instance from react-hook-form
 * @param {boolean} props.disabled - Se true, desabilita todos os campos
 */
// Função para aplicar máscara de telefone
const formatPhoneNumber = (value) => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

// Função para aplicar máscara de celular
const formatCellPhone = (value) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export function BusinessPartnerCommunicationTab({ form, disabled = false }) {
  const { control } = form;

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="comunicacao.telefone"
              control={control}
              render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Telefone"
                placeholder="(00) 0000-0000"
                fullWidth
                disabled={disabled}
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  field.onChange(formatted);
                }}
              />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="comunicacao.telefone2"
              control={control}
              render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Telefone 2"
                placeholder="(00) 0000-0000"
                fullWidth
                disabled={disabled}
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  field.onChange(formatted);
                }}
              />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="comunicacao.telefone3"
              control={control}
              render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Telefone 3"
                placeholder="(00) 0000-0000"
                fullWidth
                disabled={disabled}
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  field.onChange(formatted);
                }}
              />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="comunicacao.celular"
              control={control}
              render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Celular"
                placeholder="(00) 00000-0000"
                fullWidth
                disabled={disabled}
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => {
                  const formatted = formatCellPhone(e.target.value);
                  field.onChange(formatted);
                }}
              />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="comunicacao.email"
              control={control}
              render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Email"
                placeholder="email@exemplo.com"
                type="email"
                fullWidth
                disabled={disabled}
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ shrink: true }}
              />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="comunicacao.observacoes"
              control={control}
              render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Observações"
                placeholder="Observações de contato"
                multiline
                rows={3}
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
