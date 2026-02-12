import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { IntegrationCreateView } from 'src/sections/integration/view';

// ----------------------------------------------------------------------

const metadata = { title: `Nova integração | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <IntegrationCreateView />
    </>
  );
}
