import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';
import { RHFTextField, Field } from 'src/components/hook-form';
import { MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { toast } from 'src/components/snackbar';

import { searchCep, applyCepMask } from 'src/services/cep-api';

import { BUSINESS_PARTNER_FORM_OPTIONS } from '../business-partner-form-schema';

// ----------------------------------------------------------------------

/**
 * Aba de Endereço
 * Campos de endereço completo com busca de CEP
 */
export function BusinessPartnerAddressTab({ isView = false }) {
  const { setValue, watch, trigger } = useFormContext();
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  const handleSearchCep = useCallback(async () => {
    if (isView) return;
    
    const cep = watch('cep');
    
    if (!cep) {
      toast.error('Digite um CEP para buscar');
      return;
    }

    try {
      setIsSearchingCep(true);
      
      const cepData = await searchCep(cep);
      
      // Preenche os campos do formulário com os dados encontrados
      setValue('rua', cepData.logradouro);
      setValue('bairro', cepData.bairro);
      setValue('cidade', cepData.localidade);
      setValue('estado', cepData.uf);
      setValue('cep', applyCepMask(cepData.cep));
      
      // Força a atualização dos campos
      trigger('rua');
      trigger('bairro');
      trigger('cidade');
      trigger('estado');
      trigger('cep');
      
      toast.success('Endereço encontrado e preenchido automaticamente!');
      
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast.error(error.message || 'Erro ao buscar CEP');
    } finally {
      setIsSearchingCep(false);
    }
  }, [isView, setValue, watch, trigger]);

  // Componente customizado para CEP com máscara
  const CepField = useCallback(() => {
    const cepValue = watch('cep');
    
    return (
      <RHFTextField
        name="cep"
        label="CEP"
        placeholder="00000-000"
        helperText="Digite o CEP para busca automática"
        value={applyCepMask(cepValue || '')}
        onChange={(event) => {
          const maskedValue = applyCepMask(event.target.value);
          setValue('cep', maskedValue, { shouldValidate: true });
        }}
        InputProps={{
          readOnly: isView,
          endAdornment: !isView ? (
            <Button
              size="small"
              onClick={handleSearchCep}
              disabled={isSearchingCep}
              startIcon={
                isSearchingCep ? (
                  <CircularProgress size={16} />
                ) : (
                  <Iconify icon="solar:magnifer-linear" />
                )
              }
            >
              {isSearchingCep ? 'Buscando...' : 'Buscar'}
            </Button>
          ) : undefined,
        }}
      />
    );
  }, [isView, isSearchingCep, watch, setValue, handleSearchCep]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Endereço
      </Typography>

      <Stack spacing={3}>
        {/* CEP e Busca */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main' }}>
            Localização
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <CepField />
            </Grid>
          </Grid>
        </Box>

        {/* Endereço Principal */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Endereço Principal
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <RHFTextField
                name="rua"
                label="Rua / Logradouro"
                placeholder="Ex: Rua das Flores, 123"
                helperText="Nome da rua, avenida, etc."
                InputProps={{
                  readOnly: isView,
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <RHFTextField
                name="numero"
                label="Número"
                placeholder="123"
                helperText="Número do endereço"
                InputProps={{
                  readOnly: isView,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="rua2"
                label="Rua 2 / Complemento"
                placeholder="Ex: Apto 45, Bloco B"
                helperText="Complemento do endereço"
                InputProps={{
                  readOnly: isView,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="complemento"
                label="Complemento Adicional"
                placeholder="Ex: Próximo ao shopping"
                helperText="Informações adicionais do endereço"
                InputProps={{
                  readOnly: isView,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="bairro"
                label="Bairro"
                placeholder="Ex: Centro"
                helperText="Nome do bairro"
                InputProps={{
                  readOnly: isView,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="cidade"
                label="Cidade"
                placeholder="Ex: São Paulo"
                helperText="Nome da cidade"
                InputProps={{
                  readOnly: isView,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Field.Select
                name="estado"
                label="Estado (UF)"
                placeholder="Selecione o estado"
                helperText="Unidade federativa"
                disabled={isView}
              >
                {BUSINESS_PARTNER_FORM_OPTIONS.estado.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>

            <Grid item xs={12} md={6}>
              <Field.Select
                name="pais"
                label="País"
                placeholder="Selecione o país"
                helperText="País de residência"
                disabled={isView}
              >
                {BUSINESS_PARTNER_FORM_OPTIONS.pais.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
}
