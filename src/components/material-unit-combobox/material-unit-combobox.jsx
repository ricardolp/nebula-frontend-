import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { UNIT_OPTIONS } from './unit-options';

// ----------------------------------------------------------------------

export function RHFMaterialUnitCombobox({
  name,
  label = 'Unidade',
  placeholder = 'Buscar unidade...',
  helperText,
  required,
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value = field.value;
        const option = typeof value === 'string'
          ? UNIT_OPTIONS.find((opt) => opt.value === value) || null
          : value;

        return (
          <Autocomplete
            value={option}
            onChange={(event, newValue) => {
              field.onChange(newValue ? newValue.value : '');
            }}
            onBlur={field.onBlur}
            options={UNIT_OPTIONS}
            getOptionLabel={(opt) => (opt?.label ? `${opt.value} - ${opt.label}` : '')}
            isOptionEqualToValue={(opt, val) => opt?.value === val?.value}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={!!error}
                helperText={error ? error?.message : helperText}
                required={!!required}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password',
                }}
              />
            )}
            {...other}
          />
        );
      }}
    />
  );
}
