import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

// ----------------------------------------------------------------------

export function MaterialsTableToolbar({
  filters,
  options,
}) {
  const { status, matl_type } = options;

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <Stack
        spacing={1}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        sx={{ width: 1 }}
      >
        <TextField
          fullWidth
          select
          label="Status"
          value={filters.state.status}
          onChange={(event) => filters.setState('status', event.target.value)}
          SelectProps={{
            multiple: true,
            renderValue: (selected) => selected.join(', '),
          }}
          sx={{
            maxWidth: { xs: 1, sm: 160 },
          }}
        >
          {status.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          label="Tipo"
          value={filters.state.matl_type}
          onChange={(event) => filters.setState('matl_type', event.target.value)}
          SelectProps={{
            multiple: true,
            renderValue: (selected) => selected.join(', '),
          }}
          sx={{
            maxWidth: { xs: 1, sm: 160 },
          }}
        >
          {matl_type.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
}
