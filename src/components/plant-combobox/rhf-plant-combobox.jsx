import { Controller, useFormContext } from 'react-hook-form';

import { PlantCombobox } from './plant-combobox';

export function RHFPlantCombobox({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <PlantCombobox
          {...field}
          value={field.value}
          onChange={(value) => field.onChange(value)}
          error={!!error}
          helperText={error?.message || helperText}
          {...other}
        />
      )}
    />
  );
}
