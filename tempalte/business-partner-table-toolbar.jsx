import { useCallback, useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {Object} props.filters - Filter state object
 * @param {Object} props.options - Filter options (tipos)
 * @param {Function} props.onResetPage - Reset page callback
 */
export function BusinessPartnerTableToolbar({ filters, options, onResetPage }) {
  const popover = usePopover();
  
  // Estado local para o input (atualiza instantaneamente)
  const [searchValue, setSearchValue] = useState(filters.state.name);

  // Sincroniza com o filtro externo quando ele mudar externamente
  useEffect(() => {
    setSearchValue(filters.state.name);
  }, [filters.state.name]);

  // Debounce: atualiza o filtro global após 500ms sem digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.state.name) {
        onResetPage();
        filters.setState({ name: searchValue });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, filters, onResetPage]);

  const handleFilterName = useCallback(
    (event) => {
      setSearchValue(event.target.value);
    },
    []
  );

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleFilterTipo = useCallback(
    (event) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage();
      filters.setState({ tipo: newValue });
    },
    [filters, onResetPage]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel htmlFor="business-partner-filter-tipo-select-label">Tipo</InputLabel>
          <Select
            multiple
            value={filters.state.tipo}
            onChange={handleFilterTipo}
            input={<OutlinedInput label="Tipo" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'business-partner-filter-tipo-select-label' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            {options.tipos.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.state.tipo.includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={searchValue}
            onChange={handleFilterName}
            placeholder="Buscar por nome, CNPJ/CPF, telefone..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: searchValue && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    edge="end"
                    sx={{ mr: -0.5 }}
                  >
                    <Iconify icon="eva:close-fill" width={18} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            Import
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}

