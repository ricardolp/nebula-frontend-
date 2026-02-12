import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { signInWithPassword } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'E-mail é obrigatório!' })
    .email({ message: 'Informe um e-mail válido!' }),
  password: zod
    .string()
    .min(1, { message: 'Senha é obrigatória!' })
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const password = useBoolean();

  const defaultValues = {
    email: 'admin@nebula.dev',
    password: 'admin123',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : error);
    }
  });

  const handleLoginWithPassword = () => {
    setShowPassword(true);
  };

  const handleLoginWithMicrosoft = () => {
    // Redirecionar para o endpoint de autenticação Microsoft
    // Substitua pela URL real do seu backend/API de autenticação Microsoft
    const microsoftAuthUrl = import.meta.env.VITE_MICROSOFT_AUTH_URL || '/api/auth/microsoft';
    window.location.href = microsoftAuthUrl;
  };

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Entrar na sua conta</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text name="email" label="E-mail" InputLabelProps={{ shrink: true }} />

      {showPassword && (
        <Stack spacing={1.5}>
          <Link
            component={RouterLink}
            href="#"
            variant="body2"
            color="inherit"
            sx={{ alignSelf: 'flex-end' }}
          >
            Esqueceu a senha?
          </Link>

          <Field.Text
            name="password"
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            type={password.value ? 'text' : 'password'}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      )}

      {!showPassword ? (
        <Stack spacing={2}>
          <Button
            fullWidth
            color="inherit"
            size="large"
            variant="outlined"
            onClick={handleLoginWithMicrosoft}
            startIcon={<Iconify icon="mdi:microsoft" width={24} />}
          >
            Entrar com Entra ID
          </Button>

          <Button
            fullWidth
            color="inherit"
            size="large"
            variant="contained"
            onClick={handleLoginWithPassword}
          >
            Entrar com senha
          </Button>
        </Stack>
      ) : (
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          loadingIndicator="Entrando..."
        >
          Entrar
        </LoadingButton>
      )}
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
