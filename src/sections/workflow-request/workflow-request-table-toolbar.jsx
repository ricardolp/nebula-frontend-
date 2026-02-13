import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

// ----------------------------------------------------------------------

const FILTER_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'pending_my_approval', label: 'Aguardam meu perfil' },
  { value: 'submitted_by_me', label: 'Que eu enviei' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendente' },
  { value: 'approved', label: 'Aprovado' },
  { value: 'rejected', label: 'Rejeitado' },
];

// ----------------------------------------------------------------------

export function WorkflowRequestTableToolbar({
  filters,
  onResetPage,
  workflowOptions = [],
}) {
  const handleFilterChange = useCallback(
    (key, value) => {
      onResetPage();
      filters.setState({ [key]: value });
    },
    [filters, onResetPage]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 220 } }}>
        <InputLabel id="workflow-request-filter-label">Exibir</InputLabel>
        <Select
          labelId="workflow-request-filter-label"
          value={filters.state.filter}
          onChange={(e) => handleFilterChange('filter', e.target.value)}
          input={<OutlinedInput label="Exibir" />}
        >
          {FILTER_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel id="workflow-request-workflow-label">Workflow</InputLabel>
        <Select
          labelId="workflow-request-workflow-label"
          value={filters.state.workflowId || 'all'}
          onChange={(e) =>
            handleFilterChange('workflowId', e.target.value === 'all' ? '' : e.target.value)
          }
          input={<OutlinedInput label="Workflow" />}
        >
          <MenuItem value="all">Todos</MenuItem>
          {workflowOptions.map((w) => (
            <MenuItem key={w.id} value={w.id}>
              {w.name || `${w.type} / ${w.action}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 140 } }}>
        <InputLabel id="workflow-request-status-label">Status</InputLabel>
        <Select
          labelId="workflow-request-status-label"
          value={filters.state.status || 'all'}
          onChange={(e) =>
            handleFilterChange('status', e.target.value === 'all' ? '' : e.target.value)
          }
          input={<OutlinedInput label="Status" />}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}
