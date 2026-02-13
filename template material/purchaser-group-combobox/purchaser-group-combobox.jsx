import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { PURCHASER_GROUP_OPTIONS, searchPurchaserGroupOptions } from './purchaser-group-constants';

/**
 * ComboBox para seleção de Grupo de Compradores
 */
export function PurchaserGroupCombobox({ 
  value, 
  onChange, 
  label = 'Grupo de Compradores',
  placeholder = 'Buscar grupo...',
  error,
  helperText,
  disabled = false,
  ...other 
}) {
  const selectedOption = useMemo(() => {
    if (!value) return null;
    return PURCHASER_GROUP_OPTIONS.find((opt) => opt.code === value) || null;
  }, [value]);

  const handleChange = (event, newValue) => {
    onChange(newValue?.code || '');
  };

  return (
    <Autocomplete
      value={selectedOption}
      onChange={handleChange}
      options={PURCHASER_GROUP_OPTIONS}
      getOptionLabel={(option) => `${option.code} - ${option.label}`}
      isOptionEqualToValue={(option, val) => option.code === val?.code}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
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
        searchPurchaserGroupOptions(inputValue)
      }
      {...other}
    />
  );
}

