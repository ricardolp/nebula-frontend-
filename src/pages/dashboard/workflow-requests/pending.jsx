import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { paths } from 'src/routes/paths';
import { WorkflowRequestListView } from 'src/sections/workflow-request/view';

// ----------------------------------------------------------------------

const metadata = { title: `Pendentes | Solicitações | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <WorkflowRequestListView
        initialFilter="pending_my_approval"
        heading="Pendentes"
        breadcrumbLinks={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Solicitações', href: paths.dashboard.workflowRequests.root },
          { name: 'Pendentes' },
        ]}
      />
    </>
  );
}
