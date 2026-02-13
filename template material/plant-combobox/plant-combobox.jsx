import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { PLANT_OPTIONS, searchPlantOptions } from './plant-constants';

export function PlantCombobox({ 
  value, 
  onChange, 
  label = 'Centro (Plant)',
  placeholder = 'Buscar centro...',
  error,
  helperText,
  ...other 
}) {
  const selectedOption = useMemo(() => {
    if (!value) return null;
    return PLANT_OPTIONS.find((opt) => opt.code === value) || null;
  }, [value]);

  const handleChange = (event, newValue) => {
    onChange(newValue?.code || '');
  };

  return (
    <Autocomplete
      value={selectedOption}
      onChange={handleChange}
      options={PLANT_OPTIONS}
      getOptionLabel={(option) => `${option.code} - ${option.label}`}
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
            sx={{ mr: 1, minWidth: 60 }} 
            color="primary"
            variant="outlined"
          />
          {option.label}
        </Box>
      )}
      filterOptions={(options, { inputValue }) => 
        searchPlantOptions(inputValue)
      }
      {...other}
    />
  );
}

