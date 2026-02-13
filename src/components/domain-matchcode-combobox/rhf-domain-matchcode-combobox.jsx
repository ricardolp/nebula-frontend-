import { Controller, useFormContext } from 'react-hook-form';

import { DomainMatchcodeCombobox } from './domain-matchcode-combobox';

// ----------------------------------------------------------------------

/**
 * DomainMatchcodeCombobox integrado com React Hook Form
 */
export function RHFDomainMatchcodeCombobox({
  name,
  tabela,
  organizationId,
  queryParams,
  label = 'Agrupamento de contas',
  placeholder = 'Buscar...',
  disabled = false,
  required = false,
  helperText,
  size = 'medium',
  fullWidth = true,
  take = 20,
  valueKey = 'valor',
  slotProps = {},
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DomainMatchcodeCombobox
          tabela={tabela}
          value={field.value}
          onChange={(val) => field.onChange(val)}
          organizationId={organizationId}
          queryParams={queryParams}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          helperText={error ? error?.message : helperText}
          error={!!error}
          size={size}
          fullWidth={fullWidth}
          take={take}
          valueKey={valueKey}
          slotProps={slotProps}
          {...other}
        />
      )}
    />
  );
}
