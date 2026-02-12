import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { getOrganizationIntegration } from 'src/actions/integrations';

import { IntegrationNewEditForm } from './integration-new-edit-form';

// ----------------------------------------------------------------------

export function IntegrationFormDialog({ open, onClose, organizationId, editId, onSuccess }) {
  const [integration, setIntegration] = useState(null);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(editId);

  const loadIntegration = useCallback(() => {
    if (!organizationId || !editId) {
      setIntegration(null);
      return;
    }
    setLoading(true);
    getOrganizationIntegration(organizationId, editId)
      .then((data) => setIntegration(data ?? {}))
      .catch(() => setIntegration(null))
      .finally(() => setLoading(false));
  }, [organizationId, editId]);

  useEffect(() => {
    if (open) {
      if (editId) {
        loadIntegration();
      } else {
        setIntegration(null);
      }
    }
  }, [open, editId, loadIntegration]);

  const handleSuccess = useCallback(() => {
    onSuccess?.();
    onClose();
  }, [onSuccess, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!organizationId) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          maxHeight: '90vh',
        },
      }}
    >
      <Box
        sx={{
          py: 2,
          px: 3,
          background: (t) =>
            `linear-gradient(180deg, ${alpha(t.palette.primary.main, 0.08)} 0%, transparent 100%)`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
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
            <Iconify icon="solar:link-square-bold-duotone" width={28} />
          </Box>
          <Box>
            <DialogTitle sx={{ p: 0, typography: 'h6' }}>
              {isEdit ? 'Editar integração' : 'Nova integração'}
            </DialogTitle>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {isEdit ? 'Altere os dados da integração' : 'Preencha os passos para criar a integração'}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <DialogContent sx={{ pt: 2, pb: 3 }}>
        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <IntegrationNewEditForm
            currentIntegration={integration}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            inDialog
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
