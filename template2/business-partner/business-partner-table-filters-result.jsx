
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * Componente para exibir filtros aplicados e permitir reset
 */
export function BusinessPartnerTableFiltersResult({
  filters,
  onResetPage,
  totalResults,
  sx,
  ...other
}) {
  const handleRemoveTipo = (tipoToRemove) => {
    if (filters && filters.setState) {
      const newTipo = filters.state.tipo.filter((tipo) => tipo !== tipoToRemove);
      filters.setState({
        tipo: newTipo,
      });
      onResetPage();
    }
  };

  const handleRemoveName = () => {
    if (filters && filters.setState) {
      filters.setState({
        name: '',
      });
      onResetPage();
    }
  };

  const canReset = !!(filters?.state?.name) || (filters?.state?.tipo?.length || 0) > 0;

  if (!canReset) {
    return null;
  }

  return (
    <Paper
      sx={{
        p: 2,
        ...sx,
      }}
      {...other}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {totalResults} resultado(s) encontrado(s)
        </Typography>

        <Button
          color="error"
          onClick={() => {
            if (filters && filters.setState) {
              filters.setState({
                name: '',
                tipo: [],
              });
              onResetPage();
            }
          }}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Limpar
        </Button>
      </Stack>

      <Stack flexWrap="wrap" direction="row" spacing={1}>
        {!!(filters?.state?.name) && (
          <Chip
            size="small"
            label={`Nome: ${filters.state.name}`}
            onDelete={handleRemoveName}
          />
        )}

        {(filters?.state?.tipo || []).map((tipo) => (
          <Chip
            key={tipo}
            size="small"
            label={`Tipo: ${tipo}`}
            onDelete={() => handleRemoveTipo(tipo)}
          />
        ))}
      </Stack>
    </Paper>
  );
}
