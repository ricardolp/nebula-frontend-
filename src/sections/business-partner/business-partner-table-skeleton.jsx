import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export function BusinessPartnerTableSkeleton({ rows = 5, dense, ...other }) {
  return (
    <>
      {[...Array(rows)].map((_, index) => (
        <TableRow key={index} {...other}>
          <TableCell>
            <Skeleton sx={{ width: 80, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 50, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 70, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 180, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 120, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 50, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton sx={{ width: 180, height: 16 }} />
          </TableCell>
          <TableCell>
            <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
