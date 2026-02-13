import { Controller, useFormContext } from 'react-hook-form';

import { DistChannelCombobox } from './dist-channel-combobox';

export function RHFDistChannelCombobox({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DistChannelCombobox
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

