import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { MATERIAL_UNIT_OPTIONS, searchMaterialUnitOptions } from './material-unit-constants';

// ----------------------------------------------------------------------

export function MaterialUnitCombobox({ 
  value, 
  onChange, 
  label = 'Unidade de Medida',
  placeholder = 'Buscar unidade...',
  error,
  helperText,
  ...other 
}) {
  const selectedOption = useMemo(() => {
    if (!value) return null;
    return MATERIAL_UNIT_OPTIONS.find((opt) => opt.code === value) || null;
  }, [value]);

  const handleChange = (event, newValue) => {
    onChange(newValue?.code || '');
  };

  return (
    <Autocomplete
      value={selectedOption}
      onChange={handleChange}
      options={MATERIAL_UNIT_OPTIONS}
      getOptionLabel={(option) => option.label || ''}
      isOptionEqualToValue={(option, val) => option.code === val?.code}
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
            sx={{ mr: 1, minWidth: 50 }} 
            color="primary"
            variant="outlined"
          />
          {option.label}
        </Box>
      )}
      filterOptions={(options, { inputValue }) => 
        searchMaterialUnitOptions(inputValue)
      }
      {...other}
    />
  );
}

