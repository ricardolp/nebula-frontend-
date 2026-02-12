import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { WorkflowSlaListView } from 'src/sections/workflow-sla/view';

// ----------------------------------------------------------------------

const metadata = { title: `SLAs de workflow | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <WorkflowSlaListView />
    </>
  );
}
