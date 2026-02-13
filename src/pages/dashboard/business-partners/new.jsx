import { useLocation } from 'react-router-dom';

import { BusinessPartnerFormView } from 'src/sections/business-partner/view/business-partner-form-view';

// ----------------------------------------------------------------------

export default function BusinessPartnerNewPage() {
  const location = useLocation();
  const state = location.state || {};
  return (
    <BusinessPartnerFormView
      initialTipo={state.tipo}
      initialFuncao={state.funcao}
    />
  );
}
