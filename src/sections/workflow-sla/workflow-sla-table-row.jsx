import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Chip from '@mui/material/Chip';

import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

const WORKFLOW_TYPE_LABEL = {
  material: 'Material',
  partner: 'Parceiro',
};

const PRIORITY_LABEL = {
  urgente: 'Urgente',
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

const PRIORITY_COLOR = {
  urgente: 'error',
  alta: 'warning',
  media: 'info',
  baixa: 'default',
};

// ----------------------------------------------------------------------

export function WorkflowSlaTableRow({ row }) {
  const workflowTypeLabel = WORKFLOW_TYPE_LABEL[row.workflowType] ?? row.workflowType ?? '—';
  const priorityLabel = PRIORITY_LABEL[row.priority] ?? row.priority ?? '—';
  const priorityColor = PRIORITY_COLOR[row.priority] ?? 'default';

  return (
    <TableRow
      hover
      tabIndex={-1}
      sx={{
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        animation: 'fadeIn 0.35s ease-out',
        transition: (theme) =>
          theme.transitions.create(['opacity', 'background-color'], {
            duration: theme.transitions.duration.shorter,
          }),
      }}
    >
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Chip
          size="small"
          label={workflowTypeLabel}
          variant="filled"
          color={row.workflowType === 'material' ? 'primary' : row.workflowType === 'partner' ? 'secondary' : 'default'}
        />
      </TableCell>

      <TableCell>
        <Chip size="small" label={priorityLabel} color={priorityColor} variant="soft" />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.hours != null ? `${row.hours}h` : '—'}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.createdAt ? fDateTime(row.createdAt) : '—'}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.updatedAt ? fDateTime(row.updatedAt) : '—'}
      </TableCell>
    </TableRow>
  );
}
