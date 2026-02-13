import { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * Modal para configurações de envio para SAP
 * Permite configurar opções como forceSync e integrationId
 */
export function SapSendModal({ open, onClose, onConfirm, loading = false }) {
  const [integrationId, setIntegrationId] = useState('');
  const [forceSync, setForceSync] = useState(false);

  const handleConfirm = () => {
    onConfirm({
      integrationId: integrationId.trim() || undefined,
      forceSync
    });
  };

  const handleClose = () => {
    // Reset form when closing
    setIntegrationId('');
    setForceSync(false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center">
          <Iconify icon="solar:upload-bold" width={24} />
          <Typography variant="h6">
            Enviar para o SAP
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Configure as opções para envio do parceiro de negócio para o SAP.
          </Typography>

          <TextField
            label="ID da Integração (opcional)"
            value={integrationId}
            onChange={(e) => setIntegrationId(e.target.value)}
            placeholder="Deixe vazio para usar integração padrão"
            fullWidth
            helperText="Especifique um ID de integração específico se necessário"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={forceSync}
                onChange={(e) => setForceSync(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Stack>
                <Typography variant="body2">
                  Forçar Sincronização
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Força a sincronização mesmo se já existir no SAP
                </Typography>
              </Stack>
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button 
          onClick={handleClose}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm}
          variant="contained"
          startIcon={<Iconify icon="solar:upload-bold" />}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar para SAP'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

