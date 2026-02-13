import { useState, useMemo } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { SAP_DEPOT_OPTIONS, searchSapDepotOptions, getSapDepotLabel, validateResponseMessage } from './sap-depot-constants';

// ----------------------------------------------------------------------

/**
 * Combobox para seleção de depósitos SAP
 * 
 * @param {Object} props
 * @param {string} props.value - Valor selecionado (código do depósito)
 * @param {function} props.onChange - Callback chamado quando o valor muda
 * @param {string} props.label - Label do campo
 * @param {string} props.placeholder - Placeholder do campo
 * @param {boolean} props.disabled - Se o campo está desabilitado
 * @param {boolean} props.required - Se o campo é obrigatório
 * @param {string} props.helperText - Texto de ajuda
 * @param {boolean} props.error - Se há erro no campo
 * @param {string} props.size - Tamanho do campo ('small' | 'medium')
 * @param {boolean} props.fullWidth - Se ocupa toda a largura disponível
 * @param {boolean} props.searchable - Se permite busca (default: true)
 * @param {Array} props.filteredOptions - Opções filtradas customizadas
 * @param {function} props.onSearchChange - Callback quando a busca muda
 * @param {function} props.onSuccess - Callback chamado quando a validação de resposta é bem-sucedida
 * @param {function} props.onResponseValidation - Função para validar mensagens de resposta
 * @param {Object} props.slotProps - Props adicionais para componentes internos
 */
export function SapDepotCombobox({
  value,
  onChange,
  label = 'Armazenagem',
  placeholder = 'Selecione um depósito...',
  disabled = false,
  required = false,
  helperText,
  error = false,
  size = 'medium',
  fullWidth = true,
  searchable = true,
  filteredOptions,
  onSearchChange,
  onSuccess,
  onResponseValidation,
  slotProps = {},
  ...other
}) {
  const [searchTerm, setSearchTerm] = useState('');


  // Opções filtradas baseadas na busca ou opções customizadas
  const options = useMemo(() => {
    if (filteredOptions) return filteredOptions;
    return searchSapDepotOptions(searchTerm);
  }, [filteredOptions, searchTerm]);

  // Valor atual formatado para o Autocomplete
  const currentValue = useMemo(() => {
    if (!value) return null;
    
    // Primeiro, tenta encontrar nas opções padrão
    const foundOption = SAP_DEPOT_OPTIONS.find(option => option.value === value);
    if (foundOption) return foundOption;
    
    // Se não encontrou, mas o valor tem 18 ou 40 caracteres, cria uma opção dinâmica
    if (validateResponseMessage(value)) {
      return {
        value,
        label: `${value} - Depósito Válido (${value.length} caracteres)`
      };
    }
    
    return null;
  }, [value]);

  const handleChange = (event, newValue) => {
    const selectedValue = newValue?.value || '';
    onChange?.(selectedValue);
    
    // Se há uma função de validação customizada, use ela
    if (onResponseValidation) {
      const isValid = onResponseValidation(selectedValue);
      if (isValid && onSuccess) {
        onSuccess(selectedValue);
      }
    } else if (validateResponseMessage(selectedValue) && onSuccess) {
      // Validação padrão: verificar se o valor selecionado contém números de 18 ou 40 caracteres
      onSuccess(selectedValue);
    }
  };

  // Determinar se deve mostrar erro
  const shouldShowError = useMemo(() => {
    if (error) return true; // Se há erro explícito, mostra
    if (!value) return false; // Se não há valor, não mostra erro
    
    // Se o valor tem 18 ou 40 caracteres, não mostra erro (é válido)
    if (validateResponseMessage(value)) return false;
    
    // Se o valor não está nas opções e não é válido, mostra erro
    const foundOption = SAP_DEPOT_OPTIONS.find(option => option.value === value);
    return !foundOption;
  }, [error, value]);

  const handleInputChange = (event, newInputValue) => {
    setSearchTerm(newInputValue);
    onSearchChange?.(newInputValue);
  };

  return (
    <Autocomplete
      {...other}
      value={currentValue}
      onChange={handleChange}
      onInputChange={handleInputChange}
      options={options}
      getOptionLabel={(option) => option.label || ''}
      isOptionEqualToValue={(option, optionValue) => option.value === optionValue?.value}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      filterOptions={(opts) => opts} // Desabilita filtro interno, usamos nosso próprio
      renderInput={(inputParams) => (
        <TextField
          {...inputParams}
          label={label}
          placeholder={placeholder}
          required={required}
          error={shouldShowError}
          helperText={shouldShowError ? 'Depósito inválido' : helperText}
          InputProps={{
            ...inputParams.InputProps,
            ...slotProps.inputProps,
          }}
          inputProps={{
            ...inputParams.inputProps,
            ...slotProps.inputProps,
          }}
          {...slotProps.textField}
        />
      )}
      renderOption={(optionProps, option) => (
        <Box component="li" {...optionProps}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {option.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.label.replace(`${option.value} - `, '')}
            </Typography>
          </Box>
        </Box>
      )}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            '& .MuiAutocomplete-paper': {
              maxHeight: 300,
            },
          },
          ...slotProps.popper,
        },
        ...slotProps,
      }}
    />
  );
}

// ----------------------------------------------------------------------

/**
 * Hook para usar com React Hook Form
 */
export function useSapDepotCombobox() {
  return {
    getLabel: getSapDepotLabel,
    searchOptions: searchSapDepotOptions,
    allOptions: SAP_DEPOT_OPTIONS,
  };
}
