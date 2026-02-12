import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogContent from '@mui/material/DialogContent';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { getRoleTypes } from 'src/actions/roles';
import {
  createOrganizationRole,
  updateOrganizationRole,
} from 'src/actions/roles';

// ----------------------------------------------------------------------

export function RoleFormDialog({
  open,
  onClose,
  organizationId,
  editRole = null,
  onSuccess,
}) {
  const isEdit = Boolean(editRole?.id);

  const [name, setName] = useState(editRole?.name ?? '');
  const [slug, setSlug] = useState(editRole?.slug ?? '');
  const [permissions, setPermissions] = useState(editRole?.permissions ?? []);
  const [permissionOptions, setPermissionOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadOptions = useCallback(() => {
    setLoadingOptions(true);
    getRoleTypes()
      .then((list) => {
        const opts = Array.isArray(list) ? list : [];
        setPermissionOptions(opts);
      })
      .finally(() => setLoadingOptions(false));
  }, []);

  useEffect(() => {
    if (open) {
      loadOptions();
      if (editRole) {
        setName(editRole.name ?? '');
        setSlug(editRole.slug ?? '');
        setPermissions(Array.isArray(editRole.permissions) ? [...editRole.permissions] : []);
      } else {
        setName('');
        setSlug('');
        setPermissions([]);
      }
    }
  }, [open, editRole, loadOptions]);

  const handleClose = () => {
    setName('');
    setSlug('');
    setPermissions([]);
    onClose();
  };

  const handleNameChange = (e) => {
    const v = e.target.value ?? '';
    setName(v);
    if (!isEdit && !slug) {
      setSlug(
        v
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name?.trim() || !organizationId) {
      toast.error('Nome é obrigatório');
      return;
    }

    const finalSlug = slug?.trim() || name.trim().toLowerCase().replace(/\s+/g, '-');
    setLoading(true);

    try {
      if (isEdit) {
        await updateOrganizationRole(organizationId, editRole.id, {
          name: name.trim(),
          slug: finalSlug,
          permissions,
        });
        toast.success('Role atualizado com sucesso!');
      } else {
        await createOrganizationRole(organizationId, {
          name: name.trim(),
          slug: finalSlug,
          permissions,
        });
        toast.success('Role criado com sucesso!');
      }
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast.error(err?.message ?? (isEdit ? 'Erro ao atualizar role' : 'Erro ao criar role'));
    } finally {
      setLoading(false);
    }
  };

  if (!organizationId) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            py: 3,
            px: 3,
            background: (t) =>
              `linear-gradient(180deg, ${alpha(t.palette.primary.main, 0.08)} 0%, transparent 100%)`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                color: 'primary.main',
              }}
            >
              <Iconify icon="solar:shield-user-bold-duotone" width={28} />
            </Box>
            <Box>
              <DialogTitle sx={{ p: 0, typography: 'h6' }}>
                {isEdit ? 'Editar role' : 'Novo role'}
              </DialogTitle>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isEdit ? 'Altere nome, slug e permissões' : 'Defina nome, slug e permissões'}
              </Typography>
            </Box>
          </Stack>

          <DialogContent sx={{ pt: 3, px: 0, pb: 0 }}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Nome"
                value={name}
                onChange={handleNameChange}
                placeholder="Ex: Editor Pleno"
                required
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:user-bold-duotone" width={24} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiInputBase-root': { borderRadius: 1.5 } }}
              />

              <TextField
                fullWidth
                label="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value ?? '')}
                placeholder="Ex: editor-pleno"
                helperText="Identificador único (URL-friendly)"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:link-bold-duotone" width={24} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiInputBase-root': { borderRadius: 1.5 } }}
              />

              <Autocomplete
                multiple
                options={(() => {
                  const byId = new Map(permissionOptions.map((o) => [o.id, o]));
                  const extra = (permissions || [])
                    .filter((id) => !byId.has(id))
                    .map((id) => ({ id, label: id }));
                  return [...permissionOptions, ...extra];
                })()}
                value={permissionOptions.filter((o) => permissions.includes(o.id)).concat(
                  (permissions || []).filter((id) => !permissionOptions.some((o) => o.id === id)).map((id) => ({ id, label: id }))
                )}
                onChange={(_, newValue) => setPermissions((newValue || []).map((o) => o.id))}
                getOptionLabel={(option) => (option?.label != null ? option.label : option?.id ?? String(option))}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                loading={loadingOptions}
                disableCloseOnSelect
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Permissões"
                    placeholder="Selecione as permissões"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <Iconify icon="solar:lock-key-bold-duotone" width={24} sx={{ color: 'text.disabled' }} />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      size="small"
                      label={option.label ?? option.id}
                    />
                  ))
                }
                sx={{ '& .MuiAutocomplete-inputRoot': { borderRadius: 1.5 } }}
              />
            </Stack>

            <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button variant="outlined" color="inherit" onClick={handleClose}>
                Cancelar
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
                disabled={!name?.trim()}
                startIcon={!loading ? <Iconify icon="solar:check-circle-bold" /> : null}
              >
                {isEdit ? 'Salvar' : 'Criar role'}
              </LoadingButton>
            </Stack>
          </DialogContent>
        </Box>
      </form>
    </Dialog>
  );
}
