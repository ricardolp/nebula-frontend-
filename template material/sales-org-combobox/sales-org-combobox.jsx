import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { SALES_ORG_OPTIONS, searchSalesOrgOptions } from './sales-org-constants';

export function SalesOrgCombobox({ 
  value, 
  onChange, 
  label = 'Organização de Vendas',
  placeholder = 'Buscar organização...',
  error,
  helperText,
  ...other 
}) {
  const selectedOption = useMemo(() => {
    if (!value) return null;
    return SALES_ORG_OPTIONS.find((opt) => opt.code === value) || null;
  }, [value]);

  const handleChange = (event, newValue) => {
    onChange(newValue?.code || '');
  };

  return (
    <Autocomplete
      value={selectedOption}
      onChange={handleChange}
      options={SALES_ORG_OPTIONS}
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
        searchSalesOrgOptions(inputValue)
      }
      {...other}
    />
  );
}

