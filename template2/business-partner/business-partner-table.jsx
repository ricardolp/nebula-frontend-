
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// Removido - agora usa TableHeadCustom do projeto

// ----------------------------------------------------------------------

/**
 * Linha da tabela de parceiros de negócio
 */
export function BusinessPartnerTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const getTipoLabel = (tipo) => {
    const tipos = {
      SOCI: 'Sócio',
      TERC: 'Terceiro',
    };
    return tipos[tipo] || tipo;
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onSelectRow} />
      </TableCell>

      <TableCell>{row.cod_antigo}</TableCell>

      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box>
            <Box sx={{ typography: 'subtitle2' }}>
              {row.nome_nome_fantasia || '-'}
            </Box>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ typography: 'body2' }}>
          {row.sobrenome_razao_social || '-'}
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ typography: 'body2' }}>
          {getTipoLabel(row.tipo)}
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ typography: 'body2' }}>
          {row.email || '-'}
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ typography: 'body2' }}>
          {row.telefone || '-'}
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ typography: 'body2' }}>
          {row.cidade || '-'}
        </Box>
      </TableCell>

      <TableCell>
        <Box sx={{ typography: 'body2' }}>
          {row.estado || '-'}
        </Box>
      </TableCell>

      <TableCell align="center">
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Tooltip title="Visualizar">
            <IconButton onClick={onViewRow} color="info">
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Editar">
            <IconButton onClick={onEditRow} color="primary">
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Excluir">
            <IconButton onClick={onDeleteRow} color="error">
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
}

// ----------------------------------------------------------------------
