import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';

import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { fDateTime } from 'src/utils/format-time';

import { approveOrganizationWorkflowRequest } from 'src/actions/workflow-requests';

// ----------------------------------------------------------------------

const PRIORIDADE_LABEL = {
  urgente: 'Urgente',
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

const STATUS_OPTIONS = {
  pending: { label: 'Pendente', color: 'warning', icon: 'solar:clock-circle-bold-duotone' },
  approved: { label: 'Aprovado', color: 'success', icon: 'solar:check-circle-bold-duotone' },
  rejected: { label: 'Rejeitado', color: 'error', icon: 'solar:close-circle-bold-duotone' },
};

const STEP_STATUS = {
  pending: { label: 'Pendente', color: 'default', icon: 'solar:clock-circle-bold' },
  approved: { label: 'Aprovado', color: 'success', icon: 'solar:check-circle-bold' },
  rejected: { label: 'Rejeitado', color: 'error', icon: 'solar:close-circle-bold' },
};

// ----------------------------------------------------------------------

function SlaIndicator({ slaDueAt, status }) {
  if (!slaDueAt || status !== 'pending') return null;

  const due = new Date(slaDueAt);
  const now = new Date();
  const isOverdue = due < now;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const total = due - startOfToday;
  const elapsed = due - now;
  const percent =
    total > 0 ? Math.max(0, Math.min(100, 100 - (elapsed / total) * 100)) : 100;

  return (
    <Card sx={{ p: 2, bgcolor: (t) => alpha(isOverdue ? t.palette.error.main : t.palette.primary.main, 0.08) }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
        <Iconify
          icon={isOverdue ? 'solar:clock-circle-bold-duotone' : 'solar:clock-circle-bold-duotone'}
          width={24}
          color={isOverdue ? 'error.main' : 'primary.main'}
        />
        <Typography variant="subtitle1" fontWeight={600}>
          SLA {isOverdue ? 'vencido' : 'em andamento'}
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Prazo: {fDateTime(slaDueAt, 'DD/MM/YYYY HH:mm')}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={isOverdue ? 100 : percent}
        color={isOverdue ? 'error' : 'primary'}
        sx={{ height: 6, borderRadius: 1 }}
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

export function WorkflowRequestDetailsView({
  request,
  organizationId,
  onBack,
  onSuccess,
  currentUserOrganizationRoleId = null,
}) {
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const statusOpt = STATUS_OPTIONS[request.status] || STATUS_OPTIONS.pending;
  const prioridadeLabel = PRIORIDADE_LABEL[request.prioridade] || request.prioridade || '—';

  const stepsSorted = [...(request.steps || [])].sort(
    (a, b) => (a.workflowStep?.order ?? 0) - (b.workflowStep?.order ?? 0)
  );

  const currentStepOrder = request.currentStepOrder ?? 0;
  const pendingStepRecord = stepsSorted.find(
    (s) => s.workflowStep?.order === currentStepOrder && s.status === 'pending'
  );
  const canApprove =
    request.status === 'pending' &&
    pendingStepRecord &&
    pendingStepRecord.workflowStep;

  const stepRoleId = pendingStepRecord?.workflowStep?.organizationRoleId ?? null;
  const stepRoleName = pendingStepRecord?.workflowStep?.organizationRole?.name ?? 'exigido';
  const userHasStepRole =
    currentUserOrganizationRoleId == null ||
    currentUserOrganizationRoleId === '' ||
    currentUserOrganizationRoleId === stepRoleId;

  const handleApprove = useCallback(async () => {
    if (!canApprove || !pendingStepRecord || !organizationId) return;

    setSubmitting(true);
    try {
      await approveOrganizationWorkflowRequest(organizationId, request.id, {
        workflowStepId: pendingStepRecord.workflowStepId,
        status: 'approved',
        comments: comments?.trim() || undefined,
      });
      toast.success('Solicitação aprovada.');
      setComments('');
      onSuccess?.();
    } catch (err) {
      toast.error(err?.message ?? 'Erro ao aprovar.');
    } finally {
      setSubmitting(false);
    }
  }, [canApprove, pendingStepRecord, organizationId, request.id, comments, onSuccess]);

  const handleReject = useCallback(async () => {
    if (!canApprove || !pendingStepRecord || !organizationId) return;

    setSubmitting(true);
    try {
      await approveOrganizationWorkflowRequest(organizationId, request.id, {
        workflowStepId: pendingStepRecord.workflowStepId,
        status: 'rejected',
        comments: comments?.trim() || undefined,
      });
      toast.success('Solicitação rejeitada.');
      setComments('');
      onSuccess?.();
    } catch (err) {
      toast.error(err?.message ?? 'Erro ao rejeitar.');
    } finally {
      setSubmitting(false);
    }
  }, [canApprove, pendingStepRecord, organizationId, request.id, comments, onSuccess]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" paragraph>
            Detalhes da solicitação
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visualize dados, SLA, passos e perfis de aprovação.
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Iconify icon="eva:arrow-back-fill" />} onClick={onBack}>
          Voltar
        </Button>
      </Stack>

      <SlaIndicator slaDueAt={request.slaDueAt} status={request.status} />

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Resumo
        </Typography>
        <Stack spacing={2} sx={{ maxWidth: 640 }}>
          <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Título:
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {request.titulo || '—'}
            </Typography>
          </Stack>
          <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Workflow:
            </Typography>
            <Typography variant="body1">
              {request.workflow?.name || request.workflowId}
            </Typography>
          </Stack>
          <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Solicitante:
            </Typography>
            <Typography variant="body1">
              {request.submittedByUser?.name || request.submittedByUser?.email || request.submittedBy || '—'}
            </Typography>
          </Stack>
          <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Prioridade:
            </Typography>
            <Chip size="small" label={prioridadeLabel} variant="soft" />
          </Stack>
          <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Status:
            </Typography>
            <Chip
              size="small"
              label={statusOpt.label}
              color={statusOpt.color}
              variant="soft"
              icon={<Iconify icon={statusOpt.icon} width={16} />}
            />
          </Stack>
          <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Criado em:
            </Typography>
            <Typography variant="body2">
              {request.createdAt ? fDateTime(request.createdAt, 'DD/MM/YYYY HH:mm') : '—'}
            </Typography>
          </Stack>
        </Stack>
      </Card>

      {(request.descricao || request.motivo) && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Descrição e motivo
          </Typography>
          <Stack spacing={2}>
            {request.descricao && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Descrição
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {request.descricao}
                </Typography>
              </Box>
            )}
            {request.motivo && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Motivo
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {request.motivo}
                </Typography>
              </Box>
            )}
          </Stack>
        </Card>
      )}

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Passos e aprovações
        </Typography>
        <Stack spacing={2}>
          {stepsSorted.map((step) => {
            const stepStatus = STEP_STATUS[step.status] || STEP_STATUS.pending;
            const roleName = step.workflowStep?.organizationRole?.name || 'Perfil';
            const formName = step.workflowStep?.form?.name;

            return (
              <Box
                key={step.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  bgcolor: (theme) =>
                    step.status === 'approved'
                      ? alpha(theme.palette.success.main, 0.04)
                      : step.status === 'rejected'
                        ? alpha(theme.palette.error.main, 0.04)
                        : 'background.neutral',
                }}
              >
                <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1.5} sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">
                    Passo {step.workflowStep?.order ?? '?'}
                    {formName ? ` · ${formName}` : ''}
                  </Typography>
                  <Chip
                    size="small"
                    label={roleName}
                    variant="outlined"
                    icon={<Iconify icon="solar:user-id-bold" width={14} />}
                  />
                  <Chip
                    size="small"
                    label={stepStatus.label}
                    color={stepStatus.color}
                    variant="soft"
                    icon={<Iconify icon={stepStatus.icon} width={14} />}
                  />
                </Stack>
                {step.approvedAt && (
                  <Typography variant="caption" color="text.secondary">
                    {step.status === 'approved' ? 'Aprovado' : 'Rejeitado'} em{' '}
                    {fDateTime(step.approvedAt, 'DD/MM/YYYY HH:mm')}
                    {step.approvedBy && ` · ID aprovador: ${step.approvedBy}`}
                  </Typography>
                )}
                {step.comments && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {step.comments}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Stack>
      </Card>

      {request.payload && Object.keys(request.payload).length > 0 && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Dados enviados (payload)
          </Typography>
          <Stack spacing={1}>
            {Object.entries(request.payload).map(([key, value]) => (
              <Box key={key} sx={{ py: 1, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
                <Typography variant="caption" color="text.secondary">
                  {key}
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  {String(value ?? '')}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Card>
      )}

      {canApprove && !userHasStepRole && (
        <Alert severity="info" icon={<Iconify icon="solar:shield-user-bold" width={24} />}>
          Apenas usuários com o perfil <strong>{stepRoleName}</strong> podem aprovar este passo.
          Use a tela específica de preenchimento do formulário para preencher e aprovar.
        </Alert>
      )}

      {canApprove && userHasStepRole && (
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Aprovar ou rejeitar
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Perfil: {pendingStepRecord?.workflowStep?.organizationRole?.name}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Comentários (opcional)"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Comentários para o solicitante"
            sx={{ mb: 2 }}
          />
          <Stack direction="row" spacing={1.5}>
            <LoadingButton
              variant="contained"
              color="success"
              onClick={handleApprove}
              loading={submitting}
              startIcon={<Iconify icon="solar:check-circle-bold" />}
            >
              Aprovar
            </LoadingButton>
            <LoadingButton
              variant="contained"
              color="error"
              onClick={handleReject}
              loading={submitting}
              startIcon={<Iconify icon="solar:close-circle-bold" />}
            >
              Rejeitar
            </LoadingButton>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
