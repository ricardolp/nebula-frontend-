import { useCallback, useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';

import { toast } from 'src/components/snackbar';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { createOrganizationForm } from 'src/actions/forms';

// ----------------------------------------------------------------------

export function FormCreateView() {
  const router = useRouter();
  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.forms.root);
  }, [router]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!organizationId) {
        toast.error('Selecione uma organização.');
        return;
      }

      const trimmedName = name.trim();
      if (!trimmedName) {
        toast.error('Informe o nome do formulário.');
        return;
      }

      setIsSubmitting(true);
      try {
        await createOrganizationForm(organizationId, { name: trimmedName });
        toast.success('Formulário criado com sucesso!');
        router.push(paths.dashboard.forms.root);
      } catch (error) {
        toast.error(error?.message || 'Erro ao criar formulário.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [organizationId, name, router]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Novo formulário"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Formulários', href: paths.dashboard.forms.root },
          { name: 'Novo formulário' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card sx={{ p: 3, maxWidth: 640 }}>
        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Nome do formulário"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />

            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button type="button" variant="outlined" onClick={handleCancel} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Salvar
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </DashboardContent>
  );
}

