import { Controller, useFormContext } from 'react-hook-form';

import { MaterialUnitCombobox } from './material-unit-combobox';

// ----------------------------------------------------------------------

export function RHFMaterialUnitCombobox({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MaterialUnitCombobox
          {...field}
          onChange={(value) => field.onChange(value)}
          error={!!error}
          helperText={error?.message || helperText}
          {...other}
        />
      )}
    />
  );
}

