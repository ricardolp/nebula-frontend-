import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';

import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import { createOrganizationWorkflowSla } from 'src/actions/workflow-slas';

// ----------------------------------------------------------------------

const WORKFLOW_TYPE_OPTIONS = [
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

const PRIORITY_OPTIONS = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
  { value: 'urgente', label: 'Urgente' },
];

// ----------------------------------------------------------------------

function OptionCard({ value, selected, label, description, icon, color, onClick }) {
  return (
    <Card
      variant="outlined"
      sx={{
        flex: 1,
        minWidth: 140,
        maxWidth: 220,
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
      <CardActionArea onClick={() => onClick(value)} sx={{ p: 2, height: '100%' }}>
        <Stack spacing={1} alignItems="center" sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
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

export function WorkflowSlaFormDialog({ open, onClose, organizationId, onSuccess }) {
  const [workflowType, setWorkflowType] = useState('');
  const [priority, setPriority] = useState('baixa');
  const [hours, setHours] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setWorkflowType('');
    setPriority('baixa');
    setHours('');
    setSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleHoursChange = useCallback((e) => {
    const v = e.target.value;
    if (v === '' || /^\d+$/.test(v)) setHours(v);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!organizationId || !workflowType) {
      toast.error('Selecione o tipo de workflow.');
      return;
    }
    const hoursNum = parseInt(hours, 10);
    if (Number.isNaN(hoursNum) || hoursNum < 1) {
      toast.error('Informe um número válido de horas (mínimo 1).');
      return;
    }

    const payload = {
      workflowType,
      priority: priority || 'baixa',
      hours: hoursNum,
    };

    setSubmitting(true);
    try {
      await createOrganizationWorkflowSla(organizationId, payload);
      toast.success('SLA criado com sucesso.');
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast.error(err?.message || 'Erro ao criar SLA.');
    } finally {
      setSubmitting(false);
    }
  }, [organizationId, workflowType, priority, hours, onSuccess, handleClose]);

  const canSubmit = !!workflowType && !!priority && hours !== '' && parseInt(hours, 10) >= 1;

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
            <Iconify icon="solar:clock-circle-bold-duotone" width={28} />
          </Box>
          <Box>
            <DialogTitle sx={{ p: 0, typography: 'h6' }}>Novo SLA</DialogTitle>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Defina o tipo de workflow, prioridade e prazo em horas
            </Typography>
          </Box>
        </Stack>
      </Box>

      <DialogContent sx={{ pt: 2, pb: 1 }}>
        <Stack spacing={2.5} sx={{ py: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
              Tipo de workflow
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {WORKFLOW_TYPE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  value={opt.value}
                  selected={workflowType === opt.value}
                  onClick={setWorkflowType}
                  {...opt}
                />
              ))}
            </Stack>
          </Box>

          <FormControl fullWidth>
            <InputLabel id="workflow-sla-priority-label">Prioridade</InputLabel>
            <Select
              labelId="workflow-sla-priority-label"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              input={<OutlinedInput label="Prioridade" />}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Horas (SLA)"
            type="number"
            value={hours}
            onChange={handleHoursChange}
            onBlur={() => {
              if (hours !== '' && parseInt(hours, 10) < 1) setHours('1');
            }}
            inputProps={{ min: 1, step: 1 }}
            placeholder="Ex: 24"
            helperText="Prazo em horas para atendimento do SLA (mínimo 1)"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <LoadingButton
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit}
          loading={submitting}
        >
          Criar SLA
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
