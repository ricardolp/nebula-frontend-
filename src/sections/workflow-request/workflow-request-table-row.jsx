import { useNavigate } from 'react-router-dom';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

const PRIORIDADE_LABEL = {
  urgente: 'Urgente',
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

const STATUS_OPTIONS = {
  pending: { label: 'Pendente', color: 'warning' },
  approved: { label: 'Aprovado', color: 'success' },
  rejected: { label: 'Rejeitado', color: 'error' },
};

// ----------------------------------------------------------------------

export function WorkflowRequestTableRow({
  row,
  organizationId,
  currentUserOrganizationRoleId,
  onOpenProcessDialog,
  showProcessar = false,
}) {
  const navigate = useNavigate();
  const popover = usePopover();

  const handleView = () => {
    popover.onClose();
    navigate(`${paths.dashboard.workflowRequests.root}/${row.id}`);
  };

  const handleProcessar = () => {
    popover.onClose();
    onOpenProcessDialog?.(row.id);
  };

  const statusOpt = STATUS_OPTIONS[row.status] || { label: row.status, color: 'default' };
  const prioridadeLabel = PRIORIDADE_LABEL[row.prioridade] || row.prioridade || '—';

  return (
    <>
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
      <TableCell sx={{ whiteSpace: 'nowrap', maxWidth: 220 }}>
        {row.titulo || row.descricao || '—'}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.workflow?.name || row.workflowId?.slice(0, 8) || '—'}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.submittedByUser?.name || row.submittedByUser?.email || '—'}
      </TableCell>

      <TableCell>
        <Chip
          size="small"
          label={statusOpt.label}
          color={statusOpt.color}
          variant="soft"
        />
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{prioridadeLabel}</TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.slaDueAt ? fDateTime(row.slaDueAt) : '—'}
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {row.createdAt ? fDateTime(row.createdAt) : '—'}
      </TableCell>

      <TableCell align="right">
        <IconButton
          color={popover.open ? 'inherit' : 'default'}
          onClick={popover.onOpen}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
    <CustomPopover
      open={popover.open}
      anchorEl={popover.anchorEl}
      onClose={popover.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem onClick={handleView}>
          <Iconify icon="solar:eye-bold" />
          Visualizar
        </MenuItem>
        {showProcessar && (
          <MenuItem onClick={handleProcessar} disabled={!organizationId}>
            <Iconify icon="solar:check-circle-bold" />
            Processar
          </MenuItem>
        )}
      </MenuList>
    </CustomPopover>
    </>
  );
}
