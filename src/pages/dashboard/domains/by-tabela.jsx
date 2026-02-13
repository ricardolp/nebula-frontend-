import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { DomainsByTabelaView } from 'src/sections/domain/view/domains-by-tabela-view';

// ----------------------------------------------------------------------

export default function Page() {
  const { tabela } = useParams();

  const metadata = {
    title: tabela ? `Domínios ${tabela} | Dashboard - ${CONFIG.site.name}` : `Domínios | Dashboard - ${CONFIG.site.name}`,
  };

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <DomainsByTabelaView tabela={tabela} />
    </>
  );
}
