import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { FormCreateView } from 'src/sections/form/view/form-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Novo formulário | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <FormCreateView />
    </>
  );
}
