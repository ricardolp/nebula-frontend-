import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DomainsGroupedView } from 'src/sections/domain/view/domains-grouped-view';

// ----------------------------------------------------------------------

const metadata = { title: `Domínios | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <DomainsGroupedView />
    </>
  );
}
