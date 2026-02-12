import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { updateOrganizationUser } from 'src/actions/users';
import { toast } from 'src/components/snackbar';

import { UserQuickEditForm } from './user-quick-edit-form';

// ----------------------------------------------------------------------

export function UserTableRow({
  row,
  selected,
  organizationId,
  onSelectRow,
  onDeleteRow,
  onUserUpdated,
}) {
  const confirm = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();

  const [isProcessing, setIsProcessing] = useState(false);

  const openQuickEdit = () => {
    quickEdit.onTrue();
    popover.onClose();
  };

  const handleStatusChange = (newStatus) => {
    popover.onClose();
    setIsProcessing(true);
    updateOrganizationUser(organizationId, row.id, { status: newStatus })
      .then(() => {
        toast.success(
          newStatus === 'active' ? 'Usuário ativado!' : 'Usuário desativado!'
        );
        onUserUpdated();
      })
      .catch((err) => {
        toast.error(err?.message || 'Erro ao atualizar status');
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  return (
    <>
      <TableRow
        hover
        selected={selected}
        aria-checked={selected}
        aria-busy={isProcessing}
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
          ...(isProcessing && {
            opacity: 0.7,
            pointerEvents: 'none',
          }),
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.name} src={row.avatarUrl} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link color="inherit" onClick={openQuickEdit} sx={{ cursor: 'pointer' }}>
                {row.name}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.company}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.role}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.status === 'active' && 'success') ||
              (row.status === 'inactive' && 'default') ||
              (row.status === 'suspended' && 'error') ||
              'default'
            }
          >
            {{ active: 'Ativo', inactive: 'Inativo', suspended: 'Suspenso' }[row.status] ??
              row.status}
          </Label>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {isProcessing && <CircularProgress size={24} sx={{ mr: 0.5 }} />}
            <Tooltip title="Edição rápida" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                disabled={isProcessing}
                onClick={quickEdit.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>

            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              disabled={isProcessing}
              onClick={popover.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      {isProcessing && (
        <TableRow>
          <TableCell colSpan={6} sx={{ py: 0, px: 0, borderBottom: 'none', verticalAlign: 'top' }}>
            <LinearProgress sx={{ height: 2 }} />
          </TableCell>
        </TableRow>
      )}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {row.status === 'active' ? (
            <MenuItem onClick={() => handleStatusChange('inactive')}>
              <Iconify icon="solar:user-minus-bold" />
              Desativar
            </MenuItem>
          ) : (
            <MenuItem onClick={() => handleStatusChange('active')}>
              <Iconify icon="solar:user-check-bold" />
              Ativar
            </MenuItem>
          )}

          <MenuItem onClick={openQuickEdit}>
            <Iconify icon="solar:pen-bold" />
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

      <UserQuickEditForm
        currentUser={row}
        organizationId={organizationId}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
        onSuccess={onUserUpdated}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Excluir"
        content="Tem certeza que deseja excluir?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Excluir
          </Button>
        }
      />
    </>
  );
}
