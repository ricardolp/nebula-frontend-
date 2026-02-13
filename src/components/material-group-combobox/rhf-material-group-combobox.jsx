import { Controller, useFormContext } from 'react-hook-form';

import { MaterialGroupCombobox } from './material-group-combobox';

export function RHFMaterialGroupCombobox({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MaterialGroupCombobox
          {...other}
          value={field.value}
          onChange={(value) => field.onChange(value)}
          error={!!error}
          helperText={error?.message || helperText}
        />
      )}
    />
  );
}
