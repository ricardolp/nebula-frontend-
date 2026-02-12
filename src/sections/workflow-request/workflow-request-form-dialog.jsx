import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import LoadingButton from '@mui/lab/LoadingButton';

import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import { createOrganizationWorkflowRequest } from 'src/actions/workflow-requests';

// ----------------------------------------------------------------------

const PRIORITY_OPTIONS = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
  { value: 'urgente', label: 'Urgente' },
];

// ----------------------------------------------------------------------

export function WorkflowRequestFormDialog({
  open,
  onClose,
  organizationId,
  workflows = [],
  onSuccess,
}) {
  const [workflowId, setWorkflowId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [prioridade, setPrioridade] = useState('media');
  const [descricao, setDescricao] = useState('');
  const [motivo, setMotivo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setWorkflowId('');
    setTitulo('');
    setPrioridade('media');
    setDescricao('');
    setMotivo('');
    setSubmitting(false);
  }, []);

  useEffect(() => {
    if (open) {
      setWorkflowId(workflows[0]?.id ?? '');
      setTitulo('');
      setPrioridade('media');
      setDescricao('');
      setMotivo('');
      setSubmitting(false);
    }
  }, [open, workflows]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleSubmit = useCallback(async () => {
    if (!organizationId) {
      toast.error('Organização não selecionada.');
      return;
    }
    if (!workflowId) {
      toast.error('Selecione um workflow.');
      return;
    }
    if (!titulo?.trim()) {
      toast.error('Informe o título da solicitação.');
      return;
    }

    setSubmitting(true);
    try {
      await createOrganizationWorkflowRequest(organizationId, {
        workflowId,
        titulo: titulo.trim(),
        prioridade: prioridade || 'media',
        descricao: descricao?.trim() ?? '',
        motivo: motivo?.trim() ?? '',
      });
      toast.success('Solicitação enviada com sucesso.');
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast.error(err?.message ?? 'Erro ao enviar solicitação.');
    } finally {
      setSubmitting(false);
    }
  }, [organizationId, workflowId, titulo, prioridade, descricao, motivo, onSuccess, handleClose]);

  const canSubmit =
    !!organizationId && !!workflowId && !!titulo?.trim();

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
            <Iconify icon="solar:document-add-bold-duotone" width={28} />
          </Box>
          <Box>
            <DialogTitle sx={{ p: 0, typography: 'h6' }}>
              Nova solicitação
            </DialogTitle>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Preencha os dados abaixo para enviar sua solicitação
            </Typography>
          </Box>
        </Stack>
      </Box>

      <DialogContent sx={{ pt: 2, pb: 1 }}>
        <Stack spacing={2.5} sx={{ py: 1 }}>
          <FormControl fullWidth required>
            <InputLabel id="workflow-request-workflow-label">Workflow</InputLabel>
            <Select
              labelId="workflow-request-workflow-label"
              value={workflowId}
              onChange={(e) => setWorkflowId(e.target.value)}
              input={<OutlinedInput label="Workflow" />}
            >
              {workflows.map((w) => (
                <MenuItem key={w.id} value={w.id}>
                  {w.name || `${w.type || ''} / ${w.action || ''}`.trim() || w.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            required
            label="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Solicitação de material XYZ"
            helperText="Resumo objetivo da solicitação"
          />

          <FormControl fullWidth>
            <InputLabel id="workflow-request-priority-label">Prioridade</InputLabel>
            <Select
              labelId="workflow-request-priority-label"
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
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
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Solicitação de material para novo produto"
            multiline
            rows={3}
            helperText="Detalhes do que está sendo solicitado"
          />

          <TextField
            fullWidth
            label="Motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ex: Expansão de linha de produção"
            multiline
            rows={2}
            helperText="Justificativa ou contexto da solicitação"
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
          Enviar solicitação
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
