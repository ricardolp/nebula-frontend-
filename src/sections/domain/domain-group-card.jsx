import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function DomainGroupCard({ tabela, count }) {
  return (
    <Card>
      <Stack sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {tabela}
        </Typography>
        <Stack
          spacing={0.5}
          direction="row"
          alignItems="center"
          sx={{ color: 'text.secondary', typography: 'body2', mb: 2 }}
        >
          <Iconify width={18} icon="solar:database-bold" />
          {count} {count === 1 ? 'registro' : 'registros'}
        </Stack>
        <Button
          component={RouterLink}
          href={paths.dashboard.domains.list(tabela)}
          variant="soft"
          color="primary"
          endIcon={<Iconify icon="eva:arrow-forward-fill" />}
        >
          Ver dados
        </Button>
      </Stack>
    </Card>
  );
}
