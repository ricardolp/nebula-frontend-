import { useParams } from 'react-router-dom';
import { MaterialsViewPage } from 'src/sections/material/view';

// ----------------------------------------------------------------------

export default function MaterialViewPage() {
  const { id } = useParams();
  return <MaterialsViewPage id={id} />;
}
