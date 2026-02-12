import { z as zod } from 'zod';
import { useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { getOrganizationRoles } from 'src/actions/roles';
import { updateOrganizationUser } from 'src/actions/users';
import { Form, Field } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------

const USER_STATUS_OPTIONS_PT = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'suspended', label: 'Suspenso' },
];

// ----------------------------------------------------------------------

export const UserQuickEditSchema = zod.object({
  name: zod.string().min(1, { message: 'Nome é obrigatório' }),
  email: zod
    .string()
    .min(1, { message: 'E-mail é obrigatório' })
    .email({ message: 'E-mail inválido' }),
  status: zod.string().min(1, { message: 'Status é obrigatório' }),
  organizationRoleId: zod.string().optional(),
});

// ----------------------------------------------------------------------

export function UserQuickEditForm({ currentUser, organizationId, open, onClose, onSuccess }) {
  const [rolesOptions, setRolesOptions] = useState([]);

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name ?? '',
      email: currentUser?.email ?? '',
      status: currentUser?.status ?? 'active',
      organizationRoleId: currentUser?.organizationRoleId ?? '',
    }),
    [currentUser]
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Carregar roles ao abrir o dialog
  useEffect(() => {
    if (open && organizationId) {
      getOrganizationRoles(organizationId)
        .then((roles) => setRolesOptions(Array.isArray(roles) ? roles : []))
        .catch(() => setRolesOptions([]));
    }
  }, [open, organizationId]);

  // Reset form quando currentUser ou open mudam
  useEffect(() => {
    if (open && currentUser) {
      reset(defaultValues);
    }
  }, [open, currentUser, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (!organizationId || !currentUser?.id) {
      toast.error('Dados insuficientes para editar');
      return;
    }

    try {
      const payload = {
        name: data.name,
        status: data.status,
      };
      if (data.email) payload.email = data.email;
      if (data.organizationRoleId) payload.organizationRoleId = data.organizationRoleId;

      await updateOrganizationUser(organizationId, currentUser.id, payload);

      toast.success('Usuário atualizado com sucesso');
      reset();
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error(error?.message ?? 'Erro ao atualizar usuário');
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { maxWidth: 480 } }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Editar usuário</DialogTitle>

        <DialogContent>
          <Box
            rowGap={2.5}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{ xs: '1fr', sm: '1fr' }}
            sx={{ pt: 1 }}
          >
            <Field.Text name="name" label="Nome" />
            <Field.Text name="email" label="E-mail" type="email" />

            <Field.Select name="status" label="Status">
              {USER_STATUS_OPTIONS_PT.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Field.Select>

            <Field.Select name="organizationRoleId" label="Função">
              <MenuItem value="">
                <em>Nenhuma</em>
              </MenuItem>
              {rolesOptions.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name ?? role.slug ?? role.id}
                </MenuItem>
              ))}
            </Field.Select>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Salvar
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
