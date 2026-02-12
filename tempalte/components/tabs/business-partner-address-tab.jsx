import { useState } from 'react';
import { Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import { CustomCombobox } from 'src/components/custom-combobox';
import { Iconify } from 'src/components/iconify';
import axios, { endpoints } from 'src/utils/axios';

import { paisOptions, estadoOptions } from '../../schemas/business-partner-schema';

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {Object} props.form - Form instance from react-hook-form
 * @param {boolean} props.disabled - Se true, desabilita todos os campos
 */
export function BusinessPartnerAddressTab({ form, disabled = false }) {
  const { control, setValue } = form;
  const [loadingCep, setLoadingCep] = useState(false);

  const handleCepSearch = async (cep) => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await axios.get(endpoints.utils.cep(cleanCep));
        
        // ViaCEP retorna os dados diretamente, sem wrapper
        if (response.data && !response.data.erro) {
          const cepData = response.data;
          
          setValue('endereco.rua', cepData.logradouro || '');
          setValue('endereco.bairro', cepData.bairro || '');
          setValue('endereco.cidade', cepData.localidade || '');
          setValue('endereco.estado', cepData.uf || '');
          setValue('endereco.pais', 'BR');
          
          // Preenche complemento se houver
          if (cepData.complemento) {
            setValue('endereco.complemento', cepData.complemento);
          }
        } else {
          console.error('CEP não encontrado');
          // Pode adicionar um toast de erro aqui se necessário
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        // Pode adicionar um toast de erro aqui se necessário
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const formatCep = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  return (
    <Box sx={{ p: 3, position: 'relative', overflow: 'visible' }}>
      {/* Loading Overlay com Blur */}
      {loadingCep && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            backdropFilter: 'blur(2px)',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              bgcolor: 'background.paper',
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <CircularProgress size={40} />
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ fontWeight: 600, color: 'text.primary' }}>
                Buscando CEP...
              </Box>
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', mt: 0.5 }}>
                Consultando endereço
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      <Stack spacing={3} sx={{ overflow: 'visible' }}>
        <Grid container spacing={3} sx={{ overflow: 'visible' }}>
          {/* CEP com botão de buscar */}
                 <Grid item xs={12}>
                   <Controller
                     name="endereco.cep"
                     control={control}
                     render={({ field, fieldState: { error } }) => (
                       <TextField
                         {...field}
                         label="CEP"
                         placeholder="00000-000"
                         fullWidth
                         disabled={disabled || loadingCep}
                         error={!!error}
                         helperText={error?.message}
                         InputLabelProps={{ shrink: true }}
                         inputProps={{
                           maxLength: 9,
                         }}
                         onChange={(e) => {
                           const formatted = formatCep(e.target.value);
                           field.onChange(formatted);
                           
                           // Auto-search when CEP is complete
                           if (formatted.replace(/\D/g, '').length === 8) {
                             handleCepSearch(formatted);
                           }
                         }}
                         InputProps={{
                           endAdornment: (
                             <InputAdornment position="end">
                               <Tooltip title={loadingCep ? 'Buscando...' : 'Buscar CEP'}>
                                 <span>
                                   <IconButton
                                     edge="end"
                                     onClick={() => handleCepSearch(field.value)}
                                     size="small"
                                     disabled={disabled || loadingCep || !field.value || field.value.replace(/\D/g, '').length !== 8}
                                   >
                                     {loadingCep ? (
                                       <CircularProgress size={20} />
                                     ) : (
                                       <Iconify icon="solar:magnifer-bold" width={20} />
                                     )}
                                   </IconButton>
                                 </span>
                               </Tooltip>
                             </InputAdornment>
                           ),
                         }}
                       />
                     )}
                   />
                 </Grid>

          {/* Rua | Número */}
          <Grid item xs={12} sm={8}>
            <Controller
              name="endereco.rua"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Rua"
                  placeholder="Nome da rua"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="endereco.numero"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Número"
                  placeholder="Número"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Rua2 | Complemento */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="endereco.rua2"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Rua 2"
                  placeholder="Informações adicionais da rua"
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
              name="endereco.complemento"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Complemento"
                  placeholder="Complemento"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Bairro */}
          <Grid item xs={12}>
            <Controller
              name="endereco.bairro"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Bairro"
                  placeholder="Bairro"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Cidade | Estado | País */}
          <Grid item xs={12} sm={4}>
            <Controller
              name="endereco.cidade"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Cidade"
                  placeholder="Cidade"
                  fullWidth
                  disabled={disabled}
                  error={!!error}
                  helperText={error?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

                 <Grid item xs={12} sm={4}>
                   <Controller
                     name="endereco.estado"
                     control={control}
                     render={({ field, fieldState: { error } }) => (
                       <CustomCombobox
                         label="Estado"
                         placeholder="Buscar estado..."
                         disabled={disabled}
                         options={estadoOptions}
                         value={field.value}
                         onChange={field.onChange}
                         error={!!error}
                         helperText={error?.message}
                       />
                     )}
                   />
                 </Grid>

                 <Grid item xs={12} sm={4}>
                   <Controller
                     name="endereco.pais"
                     control={control}
                     render={({ field, fieldState: { error } }) => (
                       <CustomCombobox
                         label="País"
                         placeholder="Buscar país..."
                         disabled={disabled}
                         options={paisOptions}
                         value={field.value}
                         onChange={field.onChange}
                         error={!!error}
                         helperText={error?.message}
                       />
                     )}
                   />
                 </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
