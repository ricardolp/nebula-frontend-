import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function MaterialsTableFiltersResult({
  filters,
  totalResults,
  sx,
  ...other
}) {
  const handleRemoveStatus = useCallback((value) => {
    const newStatus = filters.state.status.filter((item) => item !== value);
    filters.setField('status', newStatus);
  }, [filters]);

  const handleRemoveTipo = useCallback((value) => {
    const newTipo = filters.state.matl_type.filter((item) => item !== value);
    filters.setField('matl_type', newTipo);
  }, [filters]);

  const handleResetFilters = useCallback(() => {
    filters.setState({ status: [], matl_type: [] });
  }, [filters]);

  return (
    <Stack spacing={1.5} sx={{ p: 3, ...sx }} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{totalResults}</strong>
        <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
          {' '}materiais encontrados
        </Box>
      </Box>

      <Stack flexWrap="wrap" direction="row" spacing={1}>
        {filters.state.status.map((status) => (
          <Chip
            key={status}
            size="small"
            label={`Status: ${status}`}
            onDelete={() => handleRemoveStatus(status)}
            deleteIcon={<Iconify icon="solar:close-circle-bold" />}
          />
        ))}

        {filters.state.matl_type.map((tipo) => (
          <Chip
            key={tipo}
            size="small"
            label={`Tipo: ${tipo}`}
            onDelete={() => handleRemoveTipo(tipo)}
            deleteIcon={<Iconify icon="solar:close-circle-bold" />}
          />
        ))}

        <Button
          color="error"
          size="small"
          onClick={handleResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Limpar
        </Button>
      </Stack>
    </Stack>
  );
}
