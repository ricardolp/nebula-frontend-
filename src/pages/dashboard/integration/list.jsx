import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { IntegrationListView } from 'src/sections/integration/view';

// ----------------------------------------------------------------------

const metadata = { title: `Integrações | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <IntegrationListView />
    </>
  );
}
