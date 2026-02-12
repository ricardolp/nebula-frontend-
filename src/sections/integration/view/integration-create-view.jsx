import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { IntegrationNewEditForm } from '../integration-new-edit-form';

// ----------------------------------------------------------------------

export function IntegrationCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Nova integração"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Integrações', href: paths.dashboard.integration.list },
          { name: 'Nova integração' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <IntegrationNewEditForm />
    </DashboardContent>
  );
}
