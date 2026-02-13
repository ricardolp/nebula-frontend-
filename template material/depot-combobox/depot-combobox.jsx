import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { getDepotsByPlant, searchDepotOptions } from './depot-constants';

export function DepotCombobox({ 
  value, 
  onChange, 
  plantValue,  // Novo parâmetro: código do centro selecionado
  label = 'Depósito',
  placeholder = 'Buscar depósito...',
  error,
  helperText,
  disabled,
  ...other 
}) {
  // Obtém as opções de depósito baseado no centro selecionado
  const depotOptions = useMemo(() => getDepotsByPlant(plantValue), [plantValue]);

  const selectedOption = useMemo(() => {
    if (!value || depotOptions.length === 0) return null;
    return depotOptions.find((opt) => opt.code === value) || null;
  }, [value, depotOptions]);

  const handleChange = (event, newValue) => {
    onChange(newValue?.code || '');
  };

  // Desabilita se não houver centro selecionado
  const isDisabled = disabled || !plantValue || depotOptions.length === 0;

  return (
    <Autocomplete
      value={selectedOption}
      onChange={handleChange}
      options={depotOptions}
      disabled={isDisabled}
      getOptionLabel={(option) => `${option.code} - ${option.label}`}
      isOptionEqualToValue={(option, val) => option.code === val?.code}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={isDisabled ? 'Selecione um centro primeiro...' : placeholder}
          error={error}
          helperText={
            !plantValue 
              ? 'Selecione um centro primeiro' 
              : depotOptions.length === 0 
              ? 'Nenhum depósito disponível para este centro'
              : error?.message || helperText
          }
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.code}>
          <Chip 
            label={option.code} 
            size="small" 
            sx={{ mr: 1, minWidth: 60 }} 
            color="primary"
            variant="outlined"
          />
          {option.label}
        </Box>
      )}
      filterOptions={(options, { inputValue }) => 
        searchDepotOptions(plantValue, inputValue)
      }
      noOptionsText={
        !plantValue 
          ? 'Selecione um centro primeiro' 
          : 'Nenhum depósito encontrado'
      }
      {...other}
    />
  );
}
