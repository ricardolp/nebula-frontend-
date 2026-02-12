import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export function InviteTableSkeleton({ rows = 5, dense, ...other }) {
  return (
    <>
      {[...Array(rows)].map((_, index) => (
        <TableRow key={index} {...other}>
          <TableCell padding="checkbox">
            <Skeleton variant="rectangular" sx={{ width: 20, height: 20, borderRadius: 1 }} />
          </TableCell>

          <TableCell>
            <Skeleton sx={{ width: 180, height: 16 }} />
          </TableCell>

          <TableCell>
            <Skeleton sx={{ width: 140, height: 16 }} />
          </TableCell>

          <TableCell>
            <Skeleton sx={{ width: 120, height: 16 }} />
          </TableCell>

          <TableCell>
            <Skeleton sx={{ width: 100, height: 16 }} />
          </TableCell>

          <TableCell>
            <Stack direction="row" spacing={1}>
              <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
            </Stack>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
