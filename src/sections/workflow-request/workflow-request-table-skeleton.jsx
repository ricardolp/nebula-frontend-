import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

export function WorkflowRequestTableSkeleton({ rows = 5, dense, ...other }) {
  return (
    <>
      {[...Array(rows)].map((_, index) => (
        <TableRow key={index} {...other}>
          <TableCell>
            <Skeleton sx={{ width: 180, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 120, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 100, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 80, height: 24, borderRadius: 1 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 50, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 100, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 100, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 64, height: 32, borderRadius: 1 }} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
