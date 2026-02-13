import { Controller, useFormContext } from 'react-hook-form';

import { PurchaserGroupCombobox } from './purchaser-group-combobox';

/**
 * ComboBox de Grupo de Compradores integrado com React Hook Form
 */
export function RHFPurchaserGroupCombobox({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <PurchaserGroupCombobox
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

