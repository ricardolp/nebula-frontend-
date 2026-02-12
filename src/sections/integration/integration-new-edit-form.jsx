import { z as zod } from 'zod';
import { useMemo, useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import {
  createOrganizationIntegration,
  updateOrganizationIntegration,
} from 'src/actions/integrations';

import {
  IntegrationStepper,
  StepType,
  StepProcess,
  StepAuth,
  StepAuthConfig,
  StepUrlAndParams,
} from './integration-form-steps';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
];

const STEPS = ['type', 'process', 'auth', 'url'];

const IntegrationSchema = zod.object({
  name: zod.string().min(1, 'Nome é obrigatório'),
  url: zod.string().min(1, 'URL é obrigatória').refine((v) => v.startsWith('http'), 'URL deve começar com http'),
  type: zod.enum(['input', 'output']),
  process: zod.enum(['material', 'domain', 'partner']),
  authType: zod.enum(['NO_AUTH', 'BASIC', 'BEARER_TOKEN', 'API_KEY', 'JWT_BEARER']),
  username: zod.string().optional(),
  password: zod.string().optional(),
  token: zod.string().optional(),
  apiKey: zod.string().optional(),
  headerName: zod.string().optional(),
  secret: zod.string().optional(),
  algorithm: zod.string().optional(),
  status: zod.enum(['active', 'inactive']).optional(),
  headers: zod.array(zod.object({ key: zod.string(), value: zod.string() })).optional(),
  queryParams: zod.array(zod.object({ key: zod.string(), value: zod.string() })).optional(),
});

// ----------------------------------------------------------------------

function objToKeyValueArray(obj) {
  if (!obj || typeof obj !== 'object') return [{ key: '', value: '' }];
  const entries = Object.entries(obj);
  if (entries.length === 0) return [{ key: '', value: '' }];
  return entries.map(([key, value]) => ({ key, value: String(value ?? '') }));
}

function keyValueArrayToObj(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const obj = {};
  arr.forEach(({ key, value }) => {
    const k = (key || '').trim();
    if (k) obj[k] = value ?? '';
  });
  return Object.keys(obj).length > 0 ? obj : null;
}

function buildAuthConfig(values) {
  const { authType, username, password, token, apiKey, headerName, secret, algorithm } = values;
  if (authType === 'NO_AUTH') return null;
  if (authType === 'BASIC') return { username: username || '', password: password || '' };
  if (authType === 'BEARER_TOKEN') return { token: token || '' };
  if (authType === 'API_KEY') return { apiKey: apiKey || '', headerName: headerName || '' };
  if (authType === 'JWT_BEARER') return { secret: secret || '', algorithm: algorithm || 'HS256' };
  return null;
}

function buildPayload(values, isEdit) {
  const authConfig = buildAuthConfig(values);
  const payload = {
    name: values.name,
    url: values.url || undefined,
    type: values.type,
    process: values.process,
    authType: values.authType,
  };
  if (authConfig !== null) payload.authConfig = authConfig;
  const headers = keyValueArrayToObj(values.headers);
  if (headers) payload.headers = headers;
  const queryParams = keyValueArrayToObj(values.queryParams);
  if (queryParams) payload.queryParams = queryParams;
  if (isEdit) payload.status = values.status;
  return payload;
}

// ----------------------------------------------------------------------

const STEP_FIELDS = {
  0: ['type'],
  1: ['process'],
  2: ['authType', 'username', 'password', 'token', 'apiKey', 'headerName', 'secret', 'algorithm'],
  3: ['name', 'url'],
};

// ----------------------------------------------------------------------

export function IntegrationNewEditForm({
  currentIntegration,
  onSuccess,
  onCancel,
  inDialog = false,
}) {
  const router = useRouter();
  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;
  const isEdit = !!currentIntegration?.id;

  const defaultValues = useMemo(
    () => ({
      name: currentIntegration?.name ?? '',
      url: currentIntegration?.url ?? '',
      type: currentIntegration?.type ?? 'input',
      process: currentIntegration?.process ?? 'domain',
      authType: currentIntegration?.authType ?? 'NO_AUTH',
      username: currentIntegration?.authConfig?.username ?? '',
      password: currentIntegration?.authConfig?.password ?? '',
      token: currentIntegration?.authConfig?.token ?? '',
      apiKey: currentIntegration?.authConfig?.apiKey ?? '',
      headerName: currentIntegration?.authConfig?.headerName ?? '',
      secret: currentIntegration?.authConfig?.secret ?? '',
      algorithm: currentIntegration?.authConfig?.algorithm ?? 'HS256',
      status: currentIntegration?.status ?? 'inactive',
      headers: objToKeyValueArray(currentIntegration?.headers),
      queryParams: objToKeyValueArray(currentIntegration?.queryParams),
    }),
    [currentIntegration]
  );

  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(IntegrationSchema),
    defaultValues,
  });

  const {
    watch,
    trigger,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const authType = watch('authType');

  const handleNext = useCallback(
    async (stepIndex) => {
      const fields = STEP_FIELDS[stepIndex];
      const valid = fields ? await trigger(fields) : true;
      if (valid) setActiveStep((s) => Math.min(s + 1, STEPS.length - 1));
    },
    [trigger]
  );

  const handleBack = useCallback(() => {
    setActiveStep((s) => Math.max(s - 1, 0));
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    if (!organizationId) {
      toast.error('Selecione uma organização.');
      return;
    }
    try {
      const payload = buildPayload(data, isEdit);
      if (isEdit) {
        await updateOrganizationIntegration(organizationId, currentIntegration.id, payload);
        toast.success('Integração atualizada com sucesso!');
      } else {
        await createOrganizationIntegration(organizationId, payload);
        toast.success('Integração criada com sucesso!');
      }
      if (inDialog && onSuccess) {
        onSuccess();
      } else {
        router.push(paths.dashboard.integration.list);
      }
    } catch (err) {
      toast.error(err?.message ?? 'Erro ao salvar integração');
    }
  });

  const isLastStep = activeStep === STEPS.length - 1;

  const Wrapper = inDialog ? Box : Card;
  const wrapperSx = inDialog ? {} : { p: 3 };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Wrapper sx={wrapperSx}>
        <IntegrationStepper activeStep={activeStep} />

        <Box
          sx={{
            py: 3,
            px: 1,
            minHeight: 280,
            borderRadius: 1.5,
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {activeStep === 0 && <StepType />}
          {activeStep === 1 && <StepProcess />}
          {activeStep === 2 && (
            <>
              <StepAuth />
              <StepAuthConfig authType={authType} Field={Field} />
            </>
          )}
          {activeStep === 3 && (
            <>
              <StepUrlAndParams Field={Field} control={control} />
              {isEdit && (
                <Box sx={{ mt: 3 }}>
                  <Field.Select name="status" label="Status">
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Field.Select>
                </Box>
              )}
            </>
          )}
        </Box>

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button
            type="button"
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Voltar
          </Button>
          <Stack direction="row" spacing={1.5}>
            {!isLastStep ? (
              <Button type="button" variant="contained" onClick={() => handleNext(activeStep)}>
                Próximo
              </Button>
            ) : (
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!organizationId}
              >
                {isEdit ? 'Salvar alterações' : 'Criar integração'}
              </LoadingButton>
            )}
            <Button
              type="button"
              variant="outlined"
              onClick={inDialog && onCancel ? onCancel : () => router.push(paths.dashboard.integration.list)}
            >
              Cancelar
            </Button>
          </Stack>
        </Stack>
      </Wrapper>
    </Form>
  );
}
