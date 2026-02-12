import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

const metadata = { title: `Nova solicitação | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <DashboardContent>
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Nova solicitação
          </Typography>
          <Typography color="text.secondary">
            Selecione o workflow e preencha os dados do formulário.
          </Typography>
        </Box>
      </DashboardContent>
    </>
  );
}
