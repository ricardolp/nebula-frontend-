import { Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
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
export function BusinessPartnerCustomFieldsTab({ form, disabled = false }) {
  const { control } = form;

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Grid container spacing={3}>
          {/* Seção: Dados Básicos */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
              Dados Básicos
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="camposZ.zz1TipoBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Tipo"
                  placeholder="Tipo do parceiro"
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
              name="camposZ.zz1SituacaoBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Situação"
                  placeholder="Situação atual"
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
              name="camposZ.zz1EnquadramentoBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Enquadramento"
                  placeholder="Enquadramento"
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
              name="camposZ.zz1NascfundacaoBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Nascimento/Fundação"
                  placeholder="Data de nascimento ou fundação"
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
              name="camposZ.zz1InicioatividadeBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Início da Atividade"
                  placeholder="Data de início da atividade"
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
              name="camposZ.zz1FimatividadeBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Fim da Atividade"
                  placeholder="Data de fim da atividade"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Seção: Atividade */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', mt: 2 }}>
              Atividade
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="camposZ.zz1AtivprincipalBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Atividade Principal"
                  placeholder="Atividade principal"
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
              name="camposZ.zz1AtividadeBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Atividade"
                  placeholder="Descrição da atividade"
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
              name="camposZ.zz1CodigodeatividadeBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Código de Atividade"
                  placeholder="Código da atividade"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Seção: Localização */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', mt: 2 }}>
              Localização
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="camposZ.zz1LocalidadeBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Localidade"
                  placeholder="Localidade"
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
              name="camposZ.zz1LatitudeBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Latitude"
                  placeholder="Coordenada de latitude"
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
              name="camposZ.zz1LongitudeBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Longitude"
                  placeholder="Coordenada de longitude"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Seção: Áreas */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', mt: 2 }}>
              Áreas
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="camposZ.zz1AreadapcafBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Área DAPCAF"
                  placeholder="Área DAPCAF"
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
              name="camposZ.zz1AreacultivadaBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Área Cultivada"
                  placeholder="Área cultivada"
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
              name="camposZ.zz1AreatotaldamatricBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Área Total da Matrícula"
                  placeholder="Área total da matrícula"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Seção: Certificações */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', mt: 2 }}>
              Certificações
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="camposZ.zz1DapcafBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="DAPCAF"
                  placeholder="Número DAPCAF"
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
              name="camposZ.zz1NdapcafBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Número DAPCAF"
                  placeholder="Número DAPCAF"
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
              name="camposZ.zz1RenasemBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="RENASEM"
                  placeholder="Número RENASEM"
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
              name="camposZ.zz1CertificadodigitalBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Certificado Digital"
                  placeholder="Status do certificado digital"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Seção: Pessoal */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', mt: 2 }}>
              Pessoal
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="camposZ.zz1FuncColabBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Funcionários/Colaboradores"
                  placeholder="Número de funcionários"
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
              name="camposZ.zz1ColaboradorativoBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value === true || field.value === 'true' || field.value === '1'}
                      onChange={(e) => field.onChange(e.target.checked)}
                      disabled={disabled}
                      color="primary"
                    />
                  }
                  label="Colaborador Ativo"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="camposZ.zz1GrauinstrucaoBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Grau de Instrução"
                  placeholder="Grau de instrução"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Seção: Representantes */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary', mt: 2 }}>
              Representantes
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="camposZ.zz1RepcomexterninsumoBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Representante Comercial Externo Insumo"
                  placeholder="Representante comercial"
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
              name="camposZ.zz1RepcomexternracaoBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Representante Comercial Externo Ração"
                  placeholder="Representante comercial"
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
              name="camposZ.zz1RepcomercialinternBus"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Representante Comercial Interno"
                  placeholder="Representante comercial interno"
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
