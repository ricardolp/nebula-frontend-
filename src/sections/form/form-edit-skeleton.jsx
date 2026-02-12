import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function FormEditSkeleton() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Editar formulário"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Formulários', href: paths.dashboard.forms.root },
          { name: 'Editar' },
        ]}
        sx={{ mb: 3 }}
      />

      <Skeleton variant="rounded" sx={{ width: 480, height: 56, mb: 3 }} />

      <Stack direction="row" spacing={2} sx={{ minHeight: 560 }}>
        {/* Coluna esquerda: biblioteca */}
        <Card variant="outlined" sx={{ width: 280, flexShrink: 0, overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Skeleton sx={{ width: 180, height: 20, mb: 0.5 }} />
            <Skeleton sx={{ width: 140, height: 16 }} />
          </Box>
          <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant="rounded" sx={{ height: 56, borderRadius: 1 }} />
            ))}
          </Box>
        </Card>

        {/* Coluna direita: canvas */}
        <Card
          variant="outlined"
          sx={{
            flex: 1,
            minWidth: 0,
            borderStyle: 'dashed',
            borderWidth: 2,
            bgcolor: 'action.hover',
            minHeight: 520,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Skeleton sx={{ width: 260, height: 20, mb: 2 }} />
            <Stack spacing={1}>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} variant="rounded" sx={{ height: 56, borderRadius: 1 }} />
              ))}
            </Stack>
          </Box>
        </Card>
      </Stack>
    </DashboardContent>
  );
}
