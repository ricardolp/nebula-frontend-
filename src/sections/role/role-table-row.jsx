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

// ----------------------------------------------------------------------

export function RoleTableRow({
  row,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}) {
  const confirm = useBoolean();
  const popover = usePopover();

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

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Chip size="small" label={row.slug || '-'} variant="outlined" />
        </TableCell>

        <TableCell sx={{ maxWidth: 280 }}>
          {(() => {
            const perms = row.permissions || [];
            if (perms.length === 0) return '-';
            const firstTwo = perms.slice(0, 2).join(', ');
            const rest = perms.length - 2;
            return rest > 0 ? `${firstTwo}, +${rest}` : firstTwo;
          })()}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.updatedAtFormatted}</TableCell>

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
          <MenuItem
            onClick={() => {
              popover.onClose();
              onEditRow?.(row);
            }}
          >
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
        title="Excluir role"
        content="Tem certeza que deseja excluir este role?"
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
