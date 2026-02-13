import { Controller, useFormContext } from 'react-hook-form';

import { SectorCombobox } from './sector-combobox';

export function RHFSectorCombobox({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <SectorCombobox
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
