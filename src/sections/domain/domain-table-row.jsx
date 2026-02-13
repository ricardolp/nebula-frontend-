import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function DomainTableRow({ row }) {
  const statusColor = row.status === 'active' ? 'success' : 'default';

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
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.tabela ?? '-'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.campo ?? '-'}</TableCell>
      <TableCell sx={{ maxWidth: 280 }} title={row.descricaoCampo ?? ''}>
        {row.descricaoCampo ?? '-'}
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.valor ?? '-'}</TableCell>
      <TableCell>
        <Label variant="soft" color={statusColor}>
          {row.status ?? '-'}
        </Label>
      </TableCell>
    </TableRow>
  );
}
