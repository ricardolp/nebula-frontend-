import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// -------------------------------------- --------------------------------

export function MaterialsViewSkeleton({ ...other }) {
  return (
    <Box {...other}>
      {/* Breadcrumbs skeleton */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1}>
          <Skeleton sx={{ width: 80, height: 20 }} />
          <Skeleton sx={{ width: 20, height: 20 }} />
          <Skeleton sx={{ width: 100, height: 20 }} />
          <Skeleton sx={{ width: 20, height: 20 }} />
          <Skeleton sx={{ width: 120, height: 20 }} />
        </Stack>
        <Stack direction="row" spacing={1}>
          <Skeleton sx={{ width: 100, height: 36, borderRadius: 1 }} />
          <Skeleton sx={{ width: 80, height: 36, borderRadius: 1 }} />
        </Stack>
      </Stack>

      <Card>
        {/* Tabs skeleton */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={0} variant="scrollable" scrollButtons="auto" sx={{ px: 3 }}>
            {[...Array(7)].map((_, index) => (
              <Tab
                key={index}
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Skeleton variant="circular" sx={{ width: 20, height: 20 }} />
                    <Skeleton sx={{ width: 120, height: 20 }} />
                  </Stack>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/* Content skeleton */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Informações Principais */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Skeleton sx={{ width: 200, height: 24, mb: 3 }} />
                <Stack spacing={2}>
                  {[...Array(8)].map((_, index) => (
                    <Box key={index}>
                      <Skeleton sx={{ width: 150, height: 16, mb: 0.5 }} />
                      <Skeleton sx={{ width: 200, height: 20 }} />
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>

            {/* Unidades e Medidas */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3 }}>
                <Skeleton sx={{ width: 200, height: 24, mb: 3 }} />
                <Stack spacing={2}>
                  {[...Array(9)].map((_, index) => (
                    <Box key={index}>
                      <Skeleton sx={{ width: 150, height: 16, mb: 0.5 }} />
                      <Skeleton sx={{ width: 180, height: 20 }} />
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>

            {/* Informações de Auditoria */}
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Skeleton sx={{ width: 200, height: 24, mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      {[...Array(3)].map((_, index) => (
                        <Box key={index}>
                          <Skeleton sx={{ width: 120, height: 16, mb: 0.5 }} />
                          <Skeleton sx={{ width: 100, height: 20 }} />
                        </Box>
                      ))}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      {[...Array(2)].map((_, index) => (
                        <Box key={index}>
                          <Skeleton sx={{ width: 100, height: 16, mb: 0.5 }} />
                          <Skeleton sx={{ width: 200, height: 20 }} />
                        </Box>
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
}

MaterialsViewSkeleton.propTypes = {};

// ----------------------------------------------------------------------

export function MaterialsViewCardSkeleton({ ...other }) {
  return (
    <Card sx={{ p: 3 }} {...other}>
      <Skeleton sx={{ width: 200, height: 24, mb: 3 }} />
      <Stack spacing={2}>
        {[...Array(6)].map((_, index) => (
          <Box key={index}>
            <Skeleton sx={{ width: 150, height: 16, mb: 0.5 }} />
            <Skeleton sx={{ width: 200, height: 20 }} />
          </Box>
        ))}
      </Stack>
    </Card>
  );
}

MaterialsViewCardSkeleton.propTypes = {};

// ----------------------------------------------------------------------

export function MaterialsViewFieldSkeleton({ ...other }) {
  return (
    <Box {...other}>
      <Skeleton sx={{ width: 120, height: 16, mb: 0.5 }} />
      <Skeleton sx={{ width: 180, height: 20 }} />
    </Box>
  );
}

MaterialsViewFieldSkeleton.propTypes = {};
