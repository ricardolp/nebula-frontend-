import { Controller, useFormContext } from 'react-hook-form';

import { SalesOrgCombobox } from './sales-org-combobox';

export function RHFSalesOrgCombobox({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <SalesOrgCombobox
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
