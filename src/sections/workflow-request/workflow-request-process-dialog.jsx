import { useState, useCallback, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import LoadingButton from '@mui/lab/LoadingButton';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { PhoneInput } from 'src/components/phone-input';
import { toast } from 'src/components/snackbar';
import { useTabs } from 'src/hooks/use-tabs';

import {
  getOrganizationWorkflowRequest,
  approveOrganizationWorkflowRequest,
  patchOrganizationBp,
} from 'src/actions/workflow-requests';
import { getOrganizationMe } from 'src/actions/users';
import { getOrganizationFormFields } from 'src/actions/forms';

import { getFieldWidgetConfig, WIDGET_TYPES, SELECT_OPTIONS } from 'src/sections/business-partner/data/field-widget-config';
import { PARTNER_FIELD_TEMPLATES } from 'src/sections/form/data/field-templates';
import { buildBpPayloadFromForm } from 'src/sections/business-partner/data/form-values-to-bp-payload';
import { formatCep, formatCpf, formatCnpj } from 'src/lib/masks';

function getLabelForField(campo, tabela) {
  const list = PARTNER_FIELD_TEMPLATES || [];
  const exact = list.find(
    (x) => x.campo === campo && (x.tabela === tabela || (tabela && x.tabela?.toLowerCase() === tabela.toLowerCase()))
  );
  if (exact) return exact.label;
  const byCampo = list.find((x) => x.campo === campo);
  return byCampo?.label ?? campo;
}

// Labels e ícones por tabela (aba), alinhados ao BP
const TAB_LABEL_ICON = {
  general: { label: 'Dados Básicos', icon: 'solar:user-bold' },
  address: { label: 'Endereço', icon: 'solar:map-point-bold' },
  communication: { label: 'Comunicação', icon: 'solar:chat-round-bold' },
  identification: { label: 'Identificação', icon: 'solar:id-verification-bold' },
  'industrial-sector': { label: 'Setor Industrial', icon: 'solar:buildings-bold' },
  payments: { label: 'Pagamentos', icon: 'solar:credit-card-bold' },
  'partner-functions': { label: 'Funções de Parceiro', icon: 'solar:settings-bold' },
  'additional-data': { label: 'Dados Adicionais', icon: 'solar:document-text-bold' },
  purchases: { label: 'Compras', icon: 'solar:cart-bold' },
  sales: { label: 'Vendas', icon: 'solar:shop-bold' },
  'credit-data': { label: 'Dados de Crédito', icon: 'solar:shield-check-bold' },
  'credit-collection': { label: 'Credit Collection', icon: 'solar:bill-list-bold' },
};

function getTabLabelAndIcon(tabela) {
  const key = (tabela || 'general').toLowerCase().trim();
  const found = TAB_LABEL_ICON[key];
  if (found) return { label: found.label, icon: found.icon };
  const label = key ? key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Dados';
  return { label, icon: 'solar:document-text-bold' };
}

// ----------------------------------------------------------------------
// Renderização de campo (tipos, máscaras e validações iguais ao BP)
// ----------------------------------------------------------------------

function StepFormField({ field, value, onChange }) {
  const { widget, options } = getFieldWidgetConfig(field.campo);
  const label = getLabelForField(field.campo, field.tabela);
  const placeholder = field.tabela || '';
  const val = value ?? '';

  if (widget === WIDGET_TYPES.CHECKBOX) {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={Boolean(val)}
            onChange={(e) => onChange(e.target.checked)}
          />
        }
        label={label}
      />
    );
  }

  if (widget === WIDGET_TYPES.SELECT) {
    const selectOptions = options ?? SELECT_OPTIONS[field.campo];
    return (
      <FormControl fullWidth size="small">
        <InputLabel id={`label-${field.id}`}>{label}</InputLabel>
        <Select
          labelId={`label-${field.id}`}
          value={val}
          label={label}
          onChange={(e) => onChange(e.target.value)}
        >
          <MenuItem value=""><em>Selecione</em></MenuItem>
          {(selectOptions ?? []).map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (widget === WIDGET_TYPES.DATE) {
    return (
      <DatePicker
        label={label}
        value={val ? dayjs(val) : null}
        onChange={(date) => onChange(date ? dayjs(date).format('YYYY-MM-DD') : '')}
        slotProps={{ textField: { fullWidth: true, size: 'small' } }}
      />
    );
  }

  if (widget === WIDGET_TYPES.MASK_PHONE) {
    return (
      <Box sx={{ minWidth: 0, width: '100%' }}>
        <PhoneInput
          label={label}
          fullWidth
          size="small"
          value={val}
          onChange={(v) => onChange(v ?? '')}
          placeholder={placeholder}
        />
      </Box>
    );
  }

  if (widget === WIDGET_TYPES.MASK_CPF) {
    return (
      <TextField
        fullWidth
        size="small"
        label={label}
        value={String(val)}
        onChange={(e) => onChange(formatCpf(e.target.value))}
        placeholder="000.000.000-00"
        inputProps={{ maxLength: 14 }}
        InputLabelProps={{ shrink: true }}
      />
    );
  }

  if (widget === WIDGET_TYPES.MASK_CNPJ) {
    return (
      <TextField
        fullWidth
        size="small"
        label={label}
        value={String(val)}
        onChange={(e) => onChange(formatCnpj(e.target.value))}
        placeholder="00.000.000/0000-00"
        inputProps={{ maxLength: 18 }}
        InputLabelProps={{ shrink: true }}
      />
    );
  }

  if (widget === WIDGET_TYPES.MASK_CEP) {
    return (
      <TextField
        fullWidth
        size="small"
        label={label}
        value={String(val)}
        onChange={(e) => onChange(formatCep(e.target.value))}
        placeholder="00000-000"
        inputProps={{ maxLength: 9 }}
        InputLabelProps={{ shrink: true }}
      />
    );
  }

  if (widget === WIDGET_TYPES.NUMBER) {
    return (
      <TextField
        fullWidth
        size="small"
        label={label}
        value={val === '' || val == null ? '' : String(val)}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        type="number"
        placeholder={placeholder}
        InputLabelProps={{ shrink: true }}
      />
    );
  }

  if (widget === WIDGET_TYPES.EMAIL) {
    return (
      <TextField
        fullWidth
        size="small"
        label={label}
        value={String(val)}
        onChange={(e) => onChange(e.target.value)}
        type="email"
        placeholder={placeholder}
        InputLabelProps={{ shrink: true }}
      />
    );
  }

  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      value={String(val)}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      InputLabelProps={{ shrink: true }}
    />
  );
}

// ----------------------------------------------------------------------

export function WorkflowRequestProcessDialog({
  open,
  onClose,
  requestId,
  organizationId,
  currentUserOrganizationRoleId: currentUserOrganizationRoleIdProp,
  onSuccess,
}) {
  const [request, setRequest] = useState(null);
  const [userRoleId, setUserRoleId] = useState(currentUserOrganizationRoleIdProp ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [loadingFields, setLoadingFields] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const roleId = currentUserOrganizationRoleIdProp ?? userRoleId;

  const stepsForUser = request?.steps
    ? [...request.steps]
        .sort((a, b) => (a.workflowStep?.order ?? 0) - (b.workflowStep?.order ?? 0))
        .filter(
          (s) =>
            s.status === 'pending' &&
            s.workflowStep &&
            (roleId == null || roleId === '' || s.workflowStep.organizationRoleId === roleId)
        )
    : [];

  const loadData = useCallback(() => {
    if (!open || !requestId || !organizationId) {
      setRequest(null);
      setUserRoleId(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setRequest(null);
    setUserRoleId(null);
    setSelectedStep(null);
    setFormFields([]);
    setFormValues({});

    const loadMe =
      currentUserOrganizationRoleIdProp == null
        ? getOrganizationMe(organizationId).then((data) => {
            setUserRoleId(data?.organizationRoleId ?? null);
          })
        : Promise.resolve();

    Promise.all([
      getOrganizationWorkflowRequest(organizationId, requestId),
      loadMe,
    ])
      .then(([req]) => {
        setRequest(req);
      })
      .catch((err) => {
        setError(err?.message || 'Erro ao carregar solicitação');
        toast.error(err?.message || 'Erro ao carregar solicitação');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    open,
    requestId,
    organizationId,
    currentUserOrganizationRoleIdProp,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectStep = useCallback(
    (step) => {
      setSelectedStep(step);
      const formId =
        step?.workflowStep?.formId ?? step?.workflowStep?.form?.id;
      if (!formId || !organizationId) {
        setFormFields([]);
        setFormValues({});
        return;
      }
      setLoadingFields(true);
      setFormFields([]);
      setFormValues({});
      getOrganizationFormFields(organizationId, formId)
        .then((fields) => {
          const sorted = [...(fields || [])].sort(
            (a, b) => (a.sequencia ?? 0) - (b.sequencia ?? 0)
          );
          setFormFields(sorted);
          const initial = {};
          sorted.forEach((f) => {
            initial[f.campo] = '';
          });
          setFormValues(initial);
        })
        .catch(() => {
          setFormFields([]);
          toast.error('Erro ao carregar campos do formulário');
        })
        .finally(() => {
          setLoadingFields(false);
        });
    },
    [organizationId]
  );

  const handleClose = useCallback(() => {
    setRequest(null);
    setSelectedStep(null);
    setFormFields([]);
    setFormValues({});
    setError(null);
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    if (!organizationId || !requestId || !selectedStep) return;

    setSubmitting(true);
    try {
      const bpId = request?.bpId;
      if (bpId && formFields.length > 0) {
        const bpPayload = buildBpPayloadFromForm(formFields, formValues);
        await patchOrganizationBp(organizationId, bpId, bpPayload);
      }
      await approveOrganizationWorkflowRequest(organizationId, requestId, {
        workflowStepId: selectedStep.workflowStepId ?? selectedStep.id,
        status: 'approved',
        comments: formValues.comments ?? undefined,
        payload: formValues,
      });
      toast.success('Solicitação processada.');
      handleClose();
      onSuccess?.();
    } catch (err) {
      const message =
        (typeof err === 'object' && err?.error?.message) ||
        err?.message ||
        'Erro ao processar';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }, [
    organizationId,
    requestId,
    request,
    selectedStep,
    formFields,
    formValues,
    handleClose,
    onSuccess,
  ]);

  const updateFormValue = useCallback((campo, value) => {
    setFormValues((prev) => ({ ...prev, [campo]: value }));
  }, []);

  // Agrupa campos por tabela (aba); apenas os campos que existem no form
  const tabsFromFields = useMemo(() => {
    if (!formFields.length) return [];
    const byTab = {};
    formFields.forEach((f) => {
      const tabValue = (f.tabela || 'general').trim() || 'general';
      if (!byTab[tabValue]) byTab[tabValue] = [];
      byTab[tabValue].push(f);
    });
    Object.keys(byTab).forEach((k) => {
      byTab[k].sort((a, b) => (a.sequencia ?? 0) - (b.sequencia ?? 0));
    });
    const minSeq = (arr) => Math.min(...arr.map((f) => f.sequencia ?? 0));
    return Object.entries(byTab)
      .map(([value, fields]) => ({
        value,
        ...getTabLabelAndIcon(value),
        fields,
      }))
      .sort((a, b) => minSeq(a.fields) - minSeq(b.fields));
  }, [formFields]);

  const firstTabValue = tabsFromFields[0]?.value ?? 'general';
  const tabsState = useTabs(firstTabValue);

  // Garantir que a aba atual existe quando tabsFromFields muda (ex.: após carregar campos)
  useEffect(() => {
    if (tabsFromFields.length > 0 && !tabsFromFields.some((t) => t.value === tabsState.value)) {
      tabsState.setValue(tabsFromFields[0].value);
    }
  }, [tabsFromFields, tabsState.value, tabsState.setValue]);

  const currentTabFields = useMemo(
    () => tabsFromFields.find((t) => t.value === tabsState.value)?.fields ?? [],
    [tabsFromFields, tabsState.value]
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Processar solicitação</DialogTitle>
      <DialogContent>
        {loading && (
          <Stack spacing={2}>
            <Skeleton variant="text" width="80%" height={32} />
            <Skeleton variant="rectangular" height={120} />
            <Skeleton variant="rectangular" height={80} />
          </Stack>
        )}

        {!loading && error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && request && (
          <Stack spacing={2}>
            {stepsForUser.length === 0 ? (
              <Alert severity="info">
                Nenhum passo disponível para seu perfil.
              </Alert>
            ) : (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  Selecione o passo a processar
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {stepsForUser.map((step) => {
                    const formName =
                      step.workflowStep?.form?.name ?? 'Formulário';
                    const roleName =
                      step.workflowStep?.organizationRole?.name ?? 'Perfil';
                    const order = step.workflowStep?.order ?? '?';
                    const isSelected =
                      selectedStep?.workflowStepId === step.workflowStepId ||
                      selectedStep?.id === step.id;
                    return (
                      <Button
                        key={step.id}
                        variant={isSelected ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleSelectStep(step)}
                      >
                        Passo {order} · {formName} ({roleName})
                      </Button>
                    );
                  })}
                </Stack>

                {selectedStep && (
                  <Box sx={{ pt: 1 }}>
                    {loadingFields ? (
                      <Stack spacing={1}>
                        <Skeleton variant="text" height={40} />
                        <Skeleton variant="text" height={40} />
                        <Skeleton variant="text" height={40} />
                      </Stack>
                    ) : formFields.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Este passo não possui formulário ou os campos não foram
                        carregados.
                      </Typography>
                    ) : (
                      <Box sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: 'hidden' }}>
                        <Tabs
                          value={tabsFromFields.some((t) => t.value === tabsState.value) ? tabsState.value : firstTabValue}
                          onChange={(_, v) => tabsState.setValue(v)}
                          variant="scrollable"
                          scrollButtons="auto"
                          allowScrollButtonsMobile
                          sx={{
                            px: 2,
                            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                            minHeight: 48,
                          }}
                        >
                          {tabsFromFields.map((tab) => (
                            <Tab
                              key={tab.value}
                              value={tab.value}
                              icon={<Iconify icon={tab.icon} width={20} />}
                              iconPosition="start"
                              label={tab.label}
                              sx={{ minHeight: 48, textTransform: 'none' }}
                            />
                          ))}
                        </Tabs>
                        <Box sx={{ p: 2 }}>
                          <Scrollbar
                            sx={{
                              maxHeight: 420,
                              '& .simplebar-content-wrapper': { overflowX: 'hidden' },
                              '& .simplebar-content': { overflowX: 'hidden', minWidth: 0 },
                            }}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                {tabsFromFields.find((t) => t.value === tabsState.value)?.label ?? 'Dados'}
                              </Typography>
                              <Grid container spacing={2}>
                                {currentTabFields.map((field) => (
                                  <Grid item xs={12} sm={6} key={field.id}>
                                    <StepFormField
                                      field={field}
                                      value={formValues[field.campo]}
                                      onChange={(v) => updateFormValue(field.campo, v)}
                                    />
                                  </Grid>
                                ))}
                              </Grid>
                            </LocalizationProvider>
                          </Scrollbar>
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <LoadingButton
          variant="contained"
          onClick={handleSubmit}
          loading={submitting}
          disabled={
            !selectedStep ||
            formFields.length === 0 ||
            loadingFields
          }
          startIcon={<Iconify icon="solar:diskette-bold" />}
        >
          Salvar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
