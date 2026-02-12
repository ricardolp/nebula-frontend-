import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export function WorkflowSlaTableSkeleton({ rows = 5, dense, ...other }) {
  return (
    <>
      {[...Array(rows)].map((_, index) => (
        <TableRow key={index} {...other}>
          <TableCell>
            <Skeleton sx={{ width: 80, height: 24, borderRadius: 1 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 70, height: 24, borderRadius: 1 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 48, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 140, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 140, height: 16 }} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
