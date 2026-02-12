import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiStepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardActionArea from '@mui/material/CardActionArea';

import { useFieldArray, useFormContext } from 'react-hook-form';

import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const STEPS = [
  { label: 'Tipo', description: 'Entrada ou saída' },
  { label: 'Processo', description: 'Material, domínio ou parceiro' },
  { label: 'Autenticação', description: 'Tipo e credenciais' },
  { label: 'URL e parâmetros', description: 'Endpoint, headers e query params' },
];

export function IntegrationStepper({ activeStep }) {
  return (
    <MuiStepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
      {STEPS.map((step, index) => (
        <Step key={step.label}>
          <StepLabel
            StepIconComponent={({ active, completed }) => (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  color: 'text.disabled',
                  typography: 'subtitle2',
                  bgcolor: 'action.disabledBackground',
                  ...(active && { bgcolor: 'primary.main', color: 'primary.contrastText' }),
                  ...(completed && { bgcolor: 'primary.main', color: 'primary.contrastText' }),
                }}
              >
                {completed ? (
                  <Iconify width={18} icon="mingcute:check-fill" />
                ) : (
                  <Box sx={{ typography: 'subtitle2' }}>{index + 1}</Box>
                )}
              </Box>
            )}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ typography: 'subtitle2' }}>{step.label}</Box>
              <Box sx={{ typography: 'caption', color: 'text.secondary' }}>
                {step.description}
              </Box>
            </Box>
          </StepLabel>
        </Step>
      ))}
    </MuiStepper>
  );
}

// ----------------------------------------------------------------------
// Card selecionável (substitui radio)
// ----------------------------------------------------------------------

function OptionCard({ name, value, label, description, icon, color }) {
  const { setValue, watch } = useFormContext();
  const current = watch(name);

  const isSelected = current === value;

  const handleClick = () => {
    setValue(name, value, { shouldValidate: true });
  };

  return (
    <Card
      variant="outlined"
      sx={{
        flex: 1,
        minWidth: 120,
        maxWidth: 200,
        borderWidth: 2,
        borderColor: isSelected ? `${color}.main` : 'divider',
        bgcolor: isSelected ? (theme) => alpha(theme.palette[color].main, 0.08) : 'background.paper',
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
      <CardActionArea onClick={handleClick} sx={{ p: 2, height: '100%' }}>
        <Stack spacing={1} alignItems="center" sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => alpha(theme.palette[color].main, isSelected ? 0.24 : 0.12),
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

const TYPES = [
  {
    value: 'input',
    label: 'Entrada',
    description: 'Recebe dados',
    icon: 'solar:inbox-in-bold-duotone',
    color: 'success',
  },
  {
    value: 'output',
    label: 'Saída',
    description: 'Envia dados',
    icon: 'solar:inbox-out-bold-duotone',
    color: 'info',
  },
];

export function StepType() {
  return (
    <Stack spacing={2} sx={{ py: 1 }}>
      <Typography variant="subtitle1" fontWeight={600}>
        Como essa integração se comporta?
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {TYPES.map((opt) => (
          <OptionCard key={opt.value} name="type" {...opt} />
        ))}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

const PROCESSES = [
  {
    value: 'material',
    label: 'Material',
    description: 'Catálogo de materiais',
    icon: 'solar:box-bold-duotone',
    color: 'primary',
  },
  {
    value: 'domain',
    label: 'Domínio',
    description: 'Códigos e domínios (SAP)',
    icon: 'solar:list-bold-duotone',
    color: 'secondary',
  },
  {
    value: 'partner',
    label: 'Parceiro',
    description: 'Parceiros de negócio',
    icon: 'solar:users-group-rounded-bold-duotone',
    color: 'warning',
  },
];

export function StepProcess() {
  return (
    <Stack spacing={2} sx={{ py: 1 }}>
      <Typography variant="subtitle1" fontWeight={600}>
        Qual tipo de processo essa integração atende?
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {PROCESSES.map((opt) => (
          <OptionCard key={opt.value} name="process" {...opt} />
        ))}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

const AUTH_TYPES = [
  {
    value: 'NO_AUTH',
    label: 'Sem auth',
    description: 'Nenhuma autenticação',
    icon: 'solar:lock-unlocked-bold-duotone',
    color: 'success',
  },
  {
    value: 'BASIC',
    label: 'Basic',
    description: 'Usuário e senha',
    icon: 'solar:user-id-bold-duotone',
    color: 'primary',
  },
  {
    value: 'BEARER_TOKEN',
    label: 'Bearer',
    description: 'Token no header',
    icon: 'solar:key-bold-duotone',
    color: 'info',
  },
  {
    value: 'API_KEY',
    label: 'API Key',
    description: 'Chave no header',
    icon: 'solar:key-minimalistic-square-2-bold-duotone',
    color: 'success',
  },
  {
    value: 'JWT_BEARER',
    label: 'JWT Bearer',
    description: 'JWT assinado',
    icon: 'solar:lock-password-bold-duotone',
    color: 'warning',
  },
];

export function StepAuth() {
  return (
    <Stack spacing={2} sx={{ py: 1 }}>
      <Typography variant="subtitle1" fontWeight={600}>
        Como a API exige autenticação?
      </Typography>
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        {AUTH_TYPES.map((opt) => (
          <OptionCard key={opt.value} name="authType" {...opt} />
        ))}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function StepAuthConfig({ authType, Field }) {
  if (authType === 'NO_AUTH') return null;

  if (authType === 'BASIC') {
    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Field.Text name="username" label="Usuário" />
        <Field.Text name="password" label="Senha" type="password" />
      </Stack>
    );
  }

  if (authType === 'BEARER_TOKEN') {
    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Field.Text name="token" label="Token" type="password" />
      </Stack>
    );
  }

  if (authType === 'API_KEY') {
    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Field.Text name="headerName" label="Nome do header" placeholder="X-Api-Key" />
        <Field.Text name="apiKey" label="Chave API" type="password" />
      </Stack>
    );
  }

  if (authType === 'JWT_BEARER') {
    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Field.Text name="secret" label="Secret" type="password" />
        <Field.Text name="algorithm" label="Algoritmo" placeholder="HS256" />
      </Stack>
    );
  }

  return null;
}

// ----------------------------------------------------------------------
// Step 4: URL, nome, headers e query params dinâmicos
// ----------------------------------------------------------------------

export function StepUrlAndParams({ Field, control }) {
  const headers = useFieldArray({ control, name: 'headers' });
  const queryParams = useFieldArray({ control, name: 'queryParams' });

  return (
    <Stack spacing={3} sx={{ py: 2 }}>
      <Box>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
          Endpoint e identificação
        </Typography>
        <Stack spacing={2}>
          <Field.Text name="name" label="Nome da integração" required />
          <Field.Text name="url" label="URL base" placeholder="https://api.exemplo.com/v1" required />
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Headers (opcional)
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          Adicione quantos headers precisar.
        </Typography>
        <Stack spacing={1.5}>
          {headers.fields.map((field, index) => (
            <Stack key={field.id} direction="row" spacing={1} alignItems="flex-start">
              <Field.Text
                name={`headers.${index}.key`}
                placeholder="Nome do header"
                size="small"
                sx={{ minWidth: 140 }}
              />
              <Field.Text
                name={`headers.${index}.value`}
                placeholder="Valor"
                size="small"
                sx={{ flex: 1 }}
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => headers.remove(index)}
                sx={{ mt: 0.5 }}
              >
                <Iconify icon="mingcute:delete-line" />
              </IconButton>
            </Stack>
          ))}
          <Button
            type="button"
            variant="outlined"
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => headers.append({ key: '', value: '' })}
          >
            Adicionar header
          </Button>
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Query params (opcional)
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          Ex: format=json, sap-client=100
        </Typography>
        <Stack spacing={1.5}>
          {queryParams.fields.map((field, index) => (
            <Stack key={field.id} direction="row" spacing={1} alignItems="flex-start">
              <Field.Text
                name={`queryParams.${index}.key`}
                placeholder="Nome do parâmetro"
                size="small"
                sx={{ minWidth: 140 }}
              />
              <Field.Text
                name={`queryParams.${index}.value`}
                placeholder="Valor"
                size="small"
                sx={{ flex: 1 }}
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => queryParams.remove(index)}
                sx={{ mt: 0.5 }}
              >
                <Iconify icon="mingcute:delete-line" />
              </IconButton>
            </Stack>
          ))}
          <Button
            type="button"
            variant="outlined"
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => queryParams.append({ key: '', value: '' })}
          >
            Adicionar query param
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
