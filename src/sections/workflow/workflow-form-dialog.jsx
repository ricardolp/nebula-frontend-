import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CardActionArea from '@mui/material/CardActionArea';
import LoadingButton from '@mui/lab/LoadingButton';

import { alpha } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import { createOrganizationWorkflow } from 'src/actions/workflows';

// ----------------------------------------------------------------------

const TYPE_OPTIONS = [
  {
    value: 'material',
    label: 'Material',
    description: 'Workflow para entidade material',
    icon: 'solar:box-bold-duotone',
    color: 'primary',
  },
  {
    value: 'partner',
    label: 'Partner',
    description: 'Workflow para entidade parceiro',
    icon: 'solar:users-group-rounded-bold-duotone',
    color: 'secondary',
  },
];

const ACTION_OPTIONS = [
  {
    value: 'create',
    label: 'Criação',
    description: 'Fluxo de criação',
    icon: 'solar:file-add-bold-duotone',
    color: 'success',
  },
  {
    value: 'update',
    label: 'Atualização',
    description: 'Fluxo de atualização',
    icon: 'solar:pen-bold-duotone',
    color: 'info',
  },
];

// ----------------------------------------------------------------------

function OptionCard({ value, selected, label, description, icon, color, onClick }) {
  return (
    <Card
      variant="outlined"
      sx={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        borderWidth: 2,
        borderColor: selected ? `${color}.main` : 'divider',
        bgcolor: selected ? (theme) => alpha(theme.palette[color].main, 0.08) : 'background.paper',
        transition: (theme) =>
          theme.transitions.create(['border-color', 'background-color', 'box-shadow'], {
            duration: theme.transitions.duration.short,
          }),
        '&:hover': {
          borderColor: `${color}.main`,
          bgcolor: (theme) => alpha(theme.palette[color].main, 0.04),
          boxShadow: (theme) => `0 0 0 1px ${theme.palette[color].main}`,
        },
      }}
    >
      <CardActionArea onClick={() => onClick(value)} sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={1} alignItems="center" justifyContent="center" sx={{ textAlign: 'center', minHeight: 100, flex: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) =>
                alpha(theme.palette[color].main, selected ? 0.24 : 0.12),
              color: `${color}.main`,
            }}
          >
            <Iconify icon={icon} width={28} />
          </Box>
          <Typography variant="subtitle2">{label}</Typography>
          {description && (
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
              {description}
            </Typography>
          )}
        </Stack>
      </CardActionArea>
    </Card>
  );
}

// ----------------------------------------------------------------------

export function WorkflowFormDialog({ open, onClose, organizationId, onSuccess }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [type, setType] = useState('');
  const [action, setAction] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setStep(0);
    setType('');
    setAction('');
    setName('');
    setSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleNext = useCallback(() => {
    if (step === 0 && type) setStep(1);
  }, [step, type]);

  const handleBack = useCallback(() => {
    setStep(0);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!organizationId || !type || !action) return;

    const payload = {
      type,
      action,
      name: name.trim() || `Workflow ${type === 'material' ? 'Material' : 'Partner'} - ${action === 'create' ? 'Criação' : 'Atualização'}`,
    };

    setSubmitting(true);
    try {
      const workflow = await createOrganizationWorkflow(organizationId, payload);
      toast.success('Workflow criado com sucesso.');
      onSuccess?.();
      handleClose();
      const workflowId = workflow?.id;
      if (workflowId) {
        navigate(paths.dashboard.workflows.edit(workflowId));
      }
    } catch (err) {
      toast.error(err?.message || 'Erro ao criar workflow.');
    } finally {
      setSubmitting(false);
    }
  }, [organizationId, type, action, name, onSuccess, handleClose, navigate]);

  const canNext = step === 0 && !!type;
  const canSubmit = step === 1 && !!type && !!action;

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
            <Iconify icon="solar:widget-5-bold-duotone" width={28} />
          </Box>
          <Box>
            <DialogTitle sx={{ p: 0, typography: 'h6' }}>
              Novo workflow
            </DialogTitle>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {step === 0
                ? 'Selecione o tipo de entidade'
                : 'Defina a ação e o nome do workflow'}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <DialogContent sx={{ pt: 2, pb: 1 }}>
        {step === 0 && (
          <Stack spacing={2} sx={{ py: 1 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Qual tipo de entidade este workflow atende?
            </Typography>
            <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
              {TYPE_OPTIONS.map((opt) => (
                <Grid item xs={12} sm={6} key={opt.value} sx={{ display: 'flex' }}>
                  <OptionCard
                    value={opt.value}
                    selected={type === opt.value}
                    onClick={setType}
                    {...opt}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        )}

        {step === 1 && (
          <Stack spacing={2.5} sx={{ py: 1 }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
                Qual a ação do workflow?
              </Typography>
              <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
                {ACTION_OPTIONS.map((opt) => (
                  <Grid item xs={12} sm={6} key={opt.value} sx={{ display: 'flex' }}>
                    <OptionCard
                      value={opt.value}
                      selected={action === opt.value}
                      onClick={setAction}
                      {...opt}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <TextField
              fullWidth
              label="Nome do workflow"
              placeholder={`Ex: Workflow ${type === 'material' ? 'Material' : 'Partner'} - Criação`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText="Opcional. Se vazio, um nome padrão será gerado."
            />
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        {step === 1 ? (
          <>
            <Button onClick={handleBack} color="inherit">
              Voltar
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button onClick={handleClose} color="inherit">
              Cancelar
            </Button>
            <LoadingButton
              variant="contained"
              onClick={handleSubmit}
              disabled={!canSubmit}
              loading={submitting}
            >
              Criar workflow
            </LoadingButton>
          </>
        ) : (
          <>
            <Button onClick={handleClose} color="inherit">
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleNext} disabled={!canNext}>
              Continuar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
