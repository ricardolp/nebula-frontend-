import { useNavigate } from 'react-router-dom';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function WorkflowTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}) {
  const confirm = useBoolean();
  const popover = usePopover();
  const navigate = useNavigate();

  const handleEdit = () => {
    popover.onClose();
    if (onEditRow) {
      onEditRow(row);
    } else {
      navigate(paths.dashboard.workflows.edit(row.id));
    }
  };

  return (
    <>
      <TableRow
        hover
        selected={selected}
        aria-checked={selected}
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
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.name || `Workflow ${row.type}`}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Chip
            size="small"
            label={row.type || '-'}
            variant="filled"
            color={row.type === 'material' ? 'primary' : row.type === 'partner' ? 'secondary' : 'default'}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Chip
            size="small"
            label={row.action || '-'}
            variant="filled"
            color={row.action === 'create' ? 'success' : row.action === 'update' ? 'info' : 'default'}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.stepsCount ?? 0}</TableCell>

        <TableCell>
          <Tooltip title="Mais ações" placement="top" arrow>
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={popover.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold-duotone" />
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Excluir
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Excluir workflow"
        content="Tem certeza que deseja excluir este workflow?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
              onDeleteRow();
            }}
          >
            Excluir
          </Button>
        }
      />
    </>
  );
}
