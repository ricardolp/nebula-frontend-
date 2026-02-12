import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { Iconify } from 'src/components/iconify';
import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

const TIPO_LABELS = { PF: 'Pessoa Física', PJ: 'Pessoa Jurídica' };
const FUNCAO_LABELS = { C: 'Cliente', F: 'Fornecedor', A: 'Cliente e Fornecedor' };

export function BusinessPartnerListRow({ row, onEditRow }) {
  const tipoLabel = TIPO_LABELS[row.tipo] ?? row.tipo ?? '-';
  const funcaoLabel = FUNCAO_LABELS[row.funcao] ?? row.funcao ?? '-';
  const nomeExibicao = row.nomeFantasia || row.razaoSocial || '-';
  const createdAtFormatted = row.createdAt ? fDateTime(row.createdAt) : '-';

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
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.codigoAntigo ?? '-'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{tipoLabel}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{funcaoLabel}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap', maxWidth: 200 }} title={nomeExibicao}>
        {nomeExibicao}
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.cidade ?? '-'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.estado ?? '-'}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap', maxWidth: 200 }} title={row.email}>
        {row.email ?? '-'}
      </TableCell>
      <TableCell>
        <Tooltip title="Editar" placement="top" arrow>
          <IconButton color="default" onClick={() => onEditRow?.(row.id)}>
            <Iconify icon="solar:pen-bold-duotone" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
