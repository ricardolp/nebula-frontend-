import { useState } from 'react';

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

import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { inviteUser } from 'src/actions/users';

// ----------------------------------------------------------------------

export function InviteUserDialog({ open, onClose, organizationId, onSuccess }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    setEmail('');
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email?.trim() || !organizationId) return;

    setLoading(true);
    try {
      await inviteUser(email.trim(), organizationId);
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      toast.error(err?.message ?? 'Erro ao enviar convite');
    } finally {
      setLoading(false);
    }
  };

  if (!organizationId) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      {success ? (
        <Box sx={{ py: 5, px: 3, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
              background: (t) =>
                `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.2)} 0%, ${alpha(t.palette.success.main, 0.2)} 100%)`,
              color: 'success.main',
            }}
          >
            <Iconify icon="solar:check-circle-bold-duotone" width={40} />
          </Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Convite enviado!
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Um e-mail foi enviado para <strong>{email}</strong> com as instruções para aceitar o
            convite e participar da organização.
          </Typography>
          <Button variant="contained" onClick={handleClose} color="primary">
            Fechar
          </Button>
        </Box>
      ) : (
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
                <Iconify icon="solar:user-plus-bold-duotone" width={28} />
              </Box>
              <Box>
                <DialogTitle sx={{ p: 0, typography: 'h6' }}>Convidar usuário</DialogTitle>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Envie um convite por e-mail
                </Typography>
              </Box>
            </Stack>

            <DialogContent sx={{ pt: 0, px: 0, pb: 0 }}>
              <TextField
                fullWidth
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@empresa.com"
                required
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:letter-bold-duotone" width={24} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 1.5,
                  },
                }}
              />
            </DialogContent>

            <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button variant="outlined" color="inherit" onClick={handleClose}>
                Cancelar
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
                disabled={!email?.trim()}
                startIcon={!loading ? <Iconify icon="solar:send-bold" /> : null}
              >
                Enviar convite
              </LoadingButton>
            </Stack>
          </Box>
        </form>
      )}
    </Dialog>
  );
}
