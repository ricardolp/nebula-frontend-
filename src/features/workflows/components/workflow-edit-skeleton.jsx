import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

export function WorkflowEditSkeleton() {
  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Skeleton variant="text" sx={{ width: 220, height: 36 }} />
        <Stack direction="row" spacing={1.5}>
          <Skeleton variant="rounded" sx={{ width: 96, height: 36, borderRadius: 1 }} />
          <Skeleton variant="rounded" sx={{ width: 96, height: 36, borderRadius: 1 }} />
        </Stack>
      </Box>

      <Card sx={{ p: 3 }}>
        <Skeleton variant="text" sx={{ width: 160, height: 24, mb: 2.5 }} />
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Skeleton variant="rounded" sx={{ width: 180, height: 40, borderRadius: 1 }} />
          <Skeleton variant="rounded" sx={{ width: 180, height: 40, borderRadius: 1 }} />
          <Skeleton variant="rounded" sx={{ width: 260, height: 40, borderRadius: 1, flex: 1 }} />
        </Stack>
      </Card>

      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Skeleton variant="text" sx={{ width: 180, height: 24 }} />
          <Skeleton variant="rounded" sx={{ width: 140, height: 36, borderRadius: 1 }} />
        </Box>
        <Stack spacing={1.5}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" sx={{ height: 72, borderRadius: 1.5 }} />
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}
