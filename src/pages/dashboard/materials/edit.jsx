import { useParams } from 'react-router-dom';
import { MaterialsEditView } from 'src/sections/material/view';

// ----------------------------------------------------------------------

export default function MaterialEditPage() {
  const { id } = useParams();
  return <MaterialsEditView id={id} />;
}
