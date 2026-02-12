import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { WorkflowListView } from 'src/sections/workflow/view/workflow-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Workflows | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <WorkflowListView />
    </>
  );
}
