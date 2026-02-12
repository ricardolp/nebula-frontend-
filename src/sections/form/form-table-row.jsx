import { useNavigate } from 'react-router-dom';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

const ENTITY_LABELS = { material: 'Material', partner: 'Parceiro' };
const STATUS_LABELS = { active: 'Ativo', inactive: 'Inativo' };

export function FormTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
  onStatusChange,
}) {
  const confirm = useBoolean();
  const popover = usePopover();
  const navigate = useNavigate();

  const handleEdit = () => {
    popover.onClose();
    if (onEditRow) {
      onEditRow(row);
    } else {
      navigate(paths.dashboard.forms.edit(row.id));
    }
  };

  const fieldsCount = Array.isArray(row.fields) ? row.fields.length : 0;
  const updatedAtFormatted = row.updatedAt ? fDateTime(row.updatedAt) : '-';
  const entityLabel = ENTITY_LABELS[row.entity] ?? row.entity ?? '-';
  const status = row.status ?? 'active';
  const statusLabel = STATUS_LABELS[status] ?? status;

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
          {row.name || 'Formulário sem nome'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{entityLabel}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={
              (status === 'active' && 'success') ||
              (status === 'inactive' && 'default') ||
              'default'
            }
          >
            {statusLabel}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{fieldsCount}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{updatedAtFormatted}</TableCell>

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
          {onStatusChange &&
            (status === 'active' ? (
              <MenuItem
                onClick={() => {
                  popover.onClose();
                  onStatusChange(row.id, 'inactive');
                }}
              >
                <Iconify icon="solar:user-minus-bold" />
                Desativar
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  popover.onClose();
                  onStatusChange(row.id, 'active');
                }}
              >
                <Iconify icon="solar:user-check-bold" />
                Ativar
              </MenuItem>
            ))}
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
        title="Excluir formulário"
        content="Tem certeza que deseja excluir este formulário?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
              onDeleteRow?.();
            }}
          >
            Excluir
          </Button>
        }
      />
    </>
  );
}
