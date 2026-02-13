import { Controller, useFormContext } from 'react-hook-form';

import { SapMaterialTypeCombobox } from './sap-material-type-combobox';

// ----------------------------------------------------------------------

/**
 * Combobox para seleção de tipos de material SAP integrado com React Hook Form
 * 
 * @param {Object} props
 * @param {string} props.name - Nome do campo no formulário
 * @param {string} props.label - Label do campo
 * @param {string} props.placeholder - Placeholder do campo
 * @param {boolean} props.disabled - Se o campo está desabilitado
 * @param {boolean} props.required - Se o campo é obrigatório
 * @param {string} props.helperText - Texto de ajuda
 * @param {string} props.size - Tamanho do campo ('small' | 'medium')
 * @param {boolean} props.fullWidth - Se ocupa toda a largura disponível
 * @param {boolean} props.searchable - Se permite busca (default: true)
 * @param {Array} props.filteredOptions - Opções filtradas customizadas
 * @param {function} props.onSearchChange - Callback quando a busca muda
 * @param {Object} props.slotProps - Props adicionais para componentes internos
 */
export function RHFSapMaterialTypeCombobox({
  name,
  label = 'Tipo de Material',
  placeholder = 'Selecione um tipo de material...',
  disabled = false,
  required = false,
  helperText,
  size = 'medium',
  fullWidth = true,
  searchable = true,
  filteredOptions,
  onSearchChange,
  slotProps = {},
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <SapMaterialTypeCombobox
          {...field}
          label={label}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          helperText={error ? error?.message : helperText}
          error={!!error}
          size={size}
          fullWidth={fullWidth}
          searchable={searchable}
          filteredOptions={filteredOptions}
          onSearchChange={onSearchChange}
          slotProps={slotProps}
          {...other}
        />
      )}
    />
  );
}
