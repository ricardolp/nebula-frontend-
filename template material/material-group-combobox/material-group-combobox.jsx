import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { MATERIAL_GROUP_OPTIONS, searchMaterialGroupOptions } from './material-group-constants';

export function MaterialGroupCombobox({ 
  value, 
  onChange, 
  label = 'Grupo de Mercadorias',
  placeholder = 'Buscar grupo...',
  error,
  helperText,
  ...other 
}) {
  const selectedOption = useMemo(() => {
    if (!value) return null;
    return MATERIAL_GROUP_OPTIONS.find((opt) => opt.code === value) || null;
  }, [value]);

  const handleChange = (event, newValue) => {
    onChange(newValue?.code || '');
  };

  return (
    <Autocomplete
      value={selectedOption}
      onChange={handleChange}
      options={MATERIAL_GROUP_OPTIONS}
      getOptionLabel={(option) => `${option.code} - ${option.label.split(' - ')[0]}`}
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
      renderOption={(props, option) => {
        const [shortLabel, fullLabel] = option.label.split(' - ');
        return (
          <Box component="li" {...props} key={option.code}>
            <Chip 
              label={option.code} 
              size="small" 
              sx={{ mr: 1, minWidth: 90 }} 
              color="primary"
              variant="outlined"
            />
            <Box>
              <Box component="span" sx={{ fontWeight: 600 }}>{shortLabel}</Box>
              {fullLabel && (
                <Box component="span" sx={{ ml: 0.5, color: 'text.secondary', fontSize: '0.875rem' }}>
                  - {fullLabel}
                </Box>
              )}
            </Box>
          </Box>
        );
      }}
      filterOptions={(options, { inputValue }) => 
        searchMaterialGroupOptions(inputValue)
      }
      {...other}
    />
  );
}

