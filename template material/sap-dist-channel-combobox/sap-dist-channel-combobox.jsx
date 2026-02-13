import { useState, useMemo } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { SAP_DIST_CHANNEL_OPTIONS, searchSapDistChannelOptions, getSapDistChannelLabel } from './sap-dist-channel-constants';

// ----------------------------------------------------------------------

/**
 * Combobox para seleção de canais de distribuição SAP
 * 
 * @param {Object} props
 * @param {string} props.value - Valor selecionado (código do canal de distribuição)
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
 * @param {Object} props.slotProps - Props adicionais para componentes internos
 */
export function SapDistChannelCombobox({
  value,
  onChange,
  label = 'Canal de Distribuição',
  placeholder = 'Selecione um canal de distribuição...',
  disabled = false,
  required = false,
  helperText,
  error = false,
  size = 'medium',
  fullWidth = true,
  searchable = true,
  filteredOptions,
  onSearchChange,
  slotProps = {},
  ...other
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Opções filtradas baseadas na busca ou opções customizadas
  const options = useMemo(() => {
    if (filteredOptions) return filteredOptions;
    return searchSapDistChannelOptions(searchTerm);
  }, [filteredOptions, searchTerm]);

  // Valor atual formatado para o Autocomplete
  const currentValue = useMemo(() => {
    if (!value) return null;
    return SAP_DIST_CHANNEL_OPTIONS.find(option => option.value === value) || null;
  }, [value]);

  const handleChange = (event, newValue) => {
    onChange?.(newValue?.value || '');
  };

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
          error={error}
          helperText={helperText}
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
export function useSapDistChannelCombobox() {
  return {
    getLabel: getSapDistChannelLabel,
    searchOptions: searchSapDistChannelOptions,
    allOptions: SAP_DIST_CHANNEL_OPTIONS,
  };
}
