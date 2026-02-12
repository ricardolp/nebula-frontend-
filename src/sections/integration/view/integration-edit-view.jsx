import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { toast } from 'src/components/snackbar';

import { getOrganizationIntegration } from 'src/actions/integrations';

import { IntegrationNewEditForm } from '../integration-new-edit-form';

// ----------------------------------------------------------------------

export function IntegrationEditView({ id }) {
  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [integration, setIntegration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organizationId || !id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getOrganizationIntegration(organizationId, id)
      .then((data) => {
        setIntegration(typeof data === 'object' && data !== null ? data : {});
      })
      .catch((err) => {
        toast.error(err?.message ?? 'Erro ao carregar integração');
        setIntegration(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [organizationId, id]);

  if (loading) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Carregando..."
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Integrações', href: paths.dashboard.integration.list },
            { name: 'Editar' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      </DashboardContent>
    );
  }

  if (!integration) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Integração não encontrada"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Integrações', href: paths.dashboard.integration.list },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Editar integração"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Integrações', href: paths.dashboard.integration.list },
          { name: integration.name ?? 'Editar' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <IntegrationNewEditForm currentIntegration={integration} />
    </DashboardContent>
  );
}
