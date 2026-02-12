import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * Toolbar da tabela de parceiros de negócio
 * Inclui busca, filtros e ações em lote
 */
export function BusinessPartnerTableToolbar({
  filters,
  onResetPage,
  options,
}) {
  const [openFilter, setOpenFilter] = useState(null);

  const handleOpenFilter = (event) => {
    setOpenFilter(event.currentTarget);
  };

  const handleCloseFilter = () => {
    setOpenFilter(null);
  };

  const handleFilterTipo = (event) => {
    const {value} = event.target;
    if (filters && filters.setState) {
      filters.setState({
        tipo: typeof value === 'string' ? value.split(',') : value,
      });
      onResetPage();
    }
  };

  const handleFilterName = (event) => {
    if (filters && filters.setState) {
      filters.setState({
        name: event.target.value,
      });
      onResetPage();
    }
  };

  return (
    <Box
      sx={{
        py: 2.5,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ width: 1 }}
      >
        <TextField
          fullWidth
          value={filters?.state?.name || ''}
          onChange={handleFilterName}
          placeholder="Buscar por código, nome, email ou cidade..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="outlined"
          startIcon={<Iconify icon="ic:round-filter-list" />}
          onClick={handleOpenFilter}
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
          Filtros
        </Button>
      </Stack>

      <Popover
        open={!!openFilter}
        anchorEl={openFilter}
        onClose={handleCloseFilter}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 200, p: 1 },
        }}
      >
        <TextField
          select
          fullWidth
          size="small"
          label="Tipo"
          value={filters?.state?.tipo || []}
          onChange={handleFilterTipo}
          SelectProps={{
            multiple: true,
            renderValue: (selected) => selected.join(', '),
          }}
        >
          {options?.tipos?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Popover>
    </Box>
  );
}
