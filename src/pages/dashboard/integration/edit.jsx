import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { IntegrationEditView } from 'src/sections/integration/view';

// ----------------------------------------------------------------------

const metadata = { title: `Editar integração | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <IntegrationEditView id={id} />
    </>
  );
}
