import { useParams } from 'react-router-dom';
import { BusinessPartnerFormView } from 'src/sections/business-partner/view/business-partner-form-view';

// ----------------------------------------------------------------------

export default function BusinessPartnerEditPage() {
  const { id } = useParams();
  return <BusinessPartnerFormView partnerId={id} />;
}
