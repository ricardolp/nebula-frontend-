import { useState, useMemo } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

import { searchPlantOptions } from '../constants/plant-options';

// ----------------------------------------------------------------------

export function PlantSelect({ 
  value, 
  onChange, 
  label = 'Centro', 
  required = false, 
  error = false, 
  helperText = '',
  disabled = false,
  size = 'medium',
  ...other 
}) {
  const [inputValue, setInputValue] = useState('');

  // Filtrar opções baseado no input
  const filteredOptions = useMemo(() => searchPlantOptions(inputValue), [inputValue]);

  const handleChange = (event, newValue) => onChange(newValue);

  const handleInputChange = (event, newInputValue) => setInputValue(newInputValue);

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={filteredOptions}
      getOptionLabel={(option) => option?.label || ''}
      isOptionEqualToValue={(option, value3) => option?.value === value3?.value}
      disabled={disabled}
      size={size}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          placeholder="Digite para buscar centro..."
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Chip
              label={option.value}
              size="small"
              sx={{ 
                mr: 1, 
                minWidth: 60,
                fontSize: '0.75rem',
                height: 20
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                {option.label}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      renderTags={(selectedValue, getTagProps) =>
        selectedValue ? (
          <Chip
            {...getTagProps({ index: 0 })}
            label={`${selectedValue.value} - ${selectedValue.label.split(' - ')[1] || selectedValue.label}`}
            size="small"
            color="primary"
            variant="soft"
          />
        ) : null
      }
      noOptionsText="Nenhum centro encontrado"
      loadingText="Carregando centros..."
      {...other}
    />
  );
}
