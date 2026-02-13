import { Controller, useFormContext } from 'react-hook-form';

import { SapDepotCombobox } from './sap-depot-combobox';

// ----------------------------------------------------------------------

/**
 * Combobox para seleção de depósitos SAP integrado com React Hook Form
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
 * @param {function} props.onSuccess - Callback chamado quando a validação de resposta é bem-sucedida
 * @param {function} props.onResponseValidation - Função para validar mensagens de resposta
 * @param {Object} props.slotProps - Props adicionais para componentes internos
 */
export function RHFSapDepotCombobox({
  name,
  label = 'Armazenagem',
  placeholder = 'Selecione um depósito...',
  disabled = false,
  required = false,
  helperText,
  size = 'medium',
  fullWidth = true,
  searchable = true,
  filteredOptions,
  onSearchChange,
  onSuccess,
  onResponseValidation,
  slotProps = {},
  ...other
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <SapDepotCombobox
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
          onSuccess={onSuccess}
          onResponseValidation={onResponseValidation}
          slotProps={slotProps}
          {...other}
        />
      )}
    />
  );
}
