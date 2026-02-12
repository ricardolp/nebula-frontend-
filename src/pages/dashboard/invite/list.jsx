import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { InviteListView } from 'src/sections/invite/view/invite-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Convites | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <InviteListView />
    </>
  );
}
