import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function MaterialsTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  onToggleStatus,
}) {

  return (
    <TableRow
      hover
      selected={selected}
      onClick={() => onSelectRow()}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell>{row.material}</TableCell>
      <TableCell>{row.codigo_sap || '-'}</TableCell>
      <TableCell>
        <Chip
          label={row.matl_type}
          size="small"
          color={row.matl_type === 'FERT' ? 'primary' : 'default'}
        />
      </TableCell>
      <TableCell>{row.matl_desc}</TableCell>
      <TableCell>{row.division}</TableCell>
      <TableCell>{row.plant}</TableCell>
      <TableCell>{row.sales_org}</TableCell>
      <TableCell>
        <Chip
          label={row.isActive === '1' ? 'Ativo' : 'Inativo'}
          size="small"
          color={row.isActive === '1' ? 'success' : 'error'}
        />
      </TableCell>
      <TableCell>{row.createdAt}</TableCell>
      <TableCell align="center">
        <Stack direction="row" spacing={1}>
          <Tooltip title="Visualizar">
            <IconButton onClick={() => onViewRow(row.id)}>
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton onClick={() => onEditRow(row.id)}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
          <Tooltip title={row.isActive === '1' ? 'Desativar' : 'Ativar'}>
            <IconButton
              color={row.isActive === '1' ? 'warning' : 'success'}
              onClick={() => onToggleStatus(row.id)}
            >
              <Iconify icon={row.isActive === '1' ? 'solar:eye-closed-bold' : 'solar:eye-bold'} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              color="error"
              onClick={() => onDeleteRow(row.id)}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

MaterialsTableRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string,
    material: PropTypes.string,
    matl_desc: PropTypes.string,
    matl_type: PropTypes.string,
    isActive: PropTypes.string,
    created_at: PropTypes.string,
  }),
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onToggleStatus: PropTypes.func,
};

// ----------------------------------------------------------------------

export function RenderCellMaterial({ params, onViewRow }) {
  const { material, matl_desc } = params.row;

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="subtitle2" sx={{ cursor: 'pointer' }} onClick={onViewRow}>
        {material}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {matl_desc}
      </Typography>
    </Box>
  );
}

RenderCellMaterial.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.shape({
      material: PropTypes.string,
      matl_desc: PropTypes.string,
    }),
  }),
  onViewRow: PropTypes.func,
};

// ----------------------------------------------------------------------

export function RenderCellStatus({ params }) {
  const { isActive } = params.row;

  return (
    <Chip
      label={isActive === '1' ? 'Ativo' : 'Inativo'}
      size="small"
      color={isActive === '1' ? 'success' : 'error'}
    />
  );
}

RenderCellStatus.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.shape({
      isActive: PropTypes.string,
    }),
  }),
};

// ----------------------------------------------------------------------

export function RenderCellType({ params }) {
  const { matl_type } = params.row;

  const getTypeLabel = (type) => {
    const typeMap = {
      FERT: 'Produto Acabado',
      HALB: 'Semiacabado',
      ROH: 'Matéria-prima',
      HIBE: 'Material de embalagem',
      VERP: 'Material de embalagem',
    };
    return typeMap[type] || type;
  };

  const getTypeColor = (type) => {
    const colorMap = {
      FERT: 'primary',
      HALB: 'secondary',
      ROH: 'warning',
      HIBE: 'info',
      VERP: 'info',
    };
    return colorMap[type] || 'default';
  };

  return (
    <Chip
      label={getTypeLabel(matl_type)}
      size="small"
      color={getTypeColor(matl_type)}
    />
  );
}

RenderCellType.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.shape({
      matl_type: PropTypes.string,
    }),
  }),
};

// ----------------------------------------------------------------------

export function RenderCellCreatedAt({ params }) {
  const { createdAt } = params.row;

  return (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {fDate(createdAt)}
    </Typography>
  );
}

RenderCellCreatedAt.propTypes = {
  params: PropTypes.shape({
    row: PropTypes.shape({
      createdAt: PropTypes.string,
    }),
  }),
};
