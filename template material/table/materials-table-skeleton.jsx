import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export function MaterialsTableSkeleton({ amount = 10, ...other }) {
  return [...Array(amount)].map((_, index) => (
    <TableRow key={index} {...other}>
      <TableCell>
        <Box sx={{ py: 2 }}>
          <Skeleton sx={{ width: 120, height: 20, mb: 1 }} />
          <Skeleton sx={{ width: 200, height: 16 }} />
        </Box>
      </TableCell>
      
      <TableCell>
        <Skeleton sx={{ width: 100, height: 20 }} />
      </TableCell>
      
      <TableCell>
        <Skeleton sx={{ width: 80, height: 24, borderRadius: 1.5 }} />
      </TableCell>
      
      <TableCell>
        <Skeleton sx={{ width: 250, height: 20 }} />
      </TableCell>
      
      <TableCell>
        <Skeleton sx={{ width: 80, height: 20 }} />
      </TableCell>
      
      <TableCell>
        <Skeleton sx={{ width: 80, height: 20 }} />
      </TableCell>
      
      <TableCell>
        <Skeleton sx={{ width: 100, height: 20 }} />
      </TableCell>
      
      <TableCell>
        <Skeleton sx={{ width: 60, height: 24, borderRadius: 1.5 }} />
      </TableCell>
      
      <TableCell>
        <Skeleton sx={{ width: 120, height: 20 }} />
      </TableCell>
      
      <TableCell align="center">
        <Stack direction="row" spacing={1}>
          <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
          <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
          <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
          <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
        </Stack>
      </TableCell>
    </TableRow>
  ));
}

MaterialsTableSkeleton.propTypes = {
  amount: PropTypes.number,
};

// ----------------------------------------------------------------------

export function MaterialsDataGridSkeleton({ amount = 10, ...other }) {
  return [...Array(amount)].map((_, index) => (
    <Box key={index} sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }} {...other}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Skeleton sx={{ width: 24, height: 24 }} />
        
        <Box sx={{ flex: 1 }}>
          <Skeleton sx={{ width: 120, height: 20, mb: 1 }} />
          <Skeleton sx={{ width: 200, height: 16 }} />
        </Box>
        
        <Skeleton sx={{ width: 100, height: 20 }} />
        <Skeleton sx={{ width: 80, height: 24, borderRadius: 1.5 }} />
        <Skeleton sx={{ width: 250, height: 20 }} />
        <Skeleton sx={{ width: 80, height: 20 }} />
        <Skeleton sx={{ width: 80, height: 20 }} />
        <Skeleton sx={{ width: 100, height: 20 }} />
        <Skeleton sx={{ width: 60, height: 24, borderRadius: 1.5 }} />
        <Skeleton sx={{ width: 120, height: 20 }} />
        
        <Stack direction="row" spacing={1}>
          <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
          <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
          <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
        </Stack>
      </Stack>
    </Box>
  ));
}

MaterialsDataGridSkeleton.propTypes = {
  amount: PropTypes.number,
};
