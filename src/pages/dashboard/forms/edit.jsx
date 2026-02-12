import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { FormEditView } from 'src/sections/form/view/form-edit-view';

// ----------------------------------------------------------------------

const metadata = { title: `Editar formulário | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <FormEditView formId={id} />
    </>
  );
}
