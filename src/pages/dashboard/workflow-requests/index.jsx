import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { WorkflowRequestListView } from 'src/sections/workflow-request/view';

// ----------------------------------------------------------------------

const metadata = { title: `Solicitações | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <WorkflowRequestListView />
    </>
  );
}
