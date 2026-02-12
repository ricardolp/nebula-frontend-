import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';

// ----------------------------------------------------------------------

const AUTH_TYPE_LABELS = {
  NO_AUTH: 'Sem auth',
  BASIC: 'Basic',
  BEARER_TOKEN: 'Bearer',
  API_KEY: 'API Key',
  JWT_BEARER: 'JWT Bearer',
};

const TYPE_LABELS = { input: 'Entrada', output: 'Saída' };

const PROCESS_LABELS = { material: 'Material', domain: 'Domínio', partner: 'Parceiro' };

// ----------------------------------------------------------------------

export function IntegrationTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onSync,
}) {
  const confirm = useBoolean();
  const popover = usePopover();

  const statusColor = row.status === 'active' ? 'success' : 'default';

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

        <TableCell sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {row.url}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {TYPE_LABELS[row.type] ?? row.type}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {PROCESS_LABELS[row.process] ?? row.process}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {AUTH_TYPE_LABELS[row.authType] ?? row.authType}
        </TableCell>

        <TableCell>
          <Label variant="soft" color={statusColor}>
            {row.status === 'active' ? 'Ativo' : 'Inativo'}
          </Label>
        </TableCell>

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
              onEditRow?.(row.id);
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>
          {row.process === 'domain' && (
            <MenuItem
              onClick={() => {
                popover.onClose();
                onSync?.(row.id);
              }}
            >
              <Iconify icon="solar:refresh-bold" />
              Sincronizar
            </MenuItem>
          )}
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
        title="Excluir integração"
        content="Tem certeza que deseja excluir esta integração?"
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
