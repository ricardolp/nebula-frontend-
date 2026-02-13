import MenuItem from '@mui/material/MenuItem';
import { RHFSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const MATL_TYPE_OPTIONS = [
  { value: 'FERT', label: 'FERT - Produto Acabado' },
  { value: 'HALB', label: 'HALB - Semiacabado' },
  { value: 'ROH', label: 'ROH - Matéria-prima' },
  { value: 'HIBE', label: 'HIBE - Material de embalagem' },
  { value: 'VERP', label: 'VERP - Material de embalagem' },
];

export function RHFSapMaterialTypeCombobox({
  name,
  label = 'Tipo de Material',
  placeholder = 'Selecione o tipo de material...',
  helperText,
  required,
  ...other
}) {
  return (
    <RHFSelect
      name={name}
      label={label}
      helperText={helperText}
      required={!!required}
      {...other}
    >
      <MenuItem value="">
        <em>{placeholder}</em>
      </MenuItem>
      {MATL_TYPE_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </RHFSelect>
  );
}
