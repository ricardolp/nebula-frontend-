import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

/**
 * Skeleton loader para a tabela de Business Partners
 * Simula a estrutura da tabela com linhas de skeleton
 */
export function BusinessPartnerTableSkeleton({ rows = 5 }) {
  return (
    <>
      {[...Array(rows)].map((_, index) => (
        <TableRow key={index}>
          {/* Checkbox */}
          <TableCell padding="checkbox">
            <Skeleton variant="rectangular" width={18} height={18} sx={{ borderRadius: 0.5 }} />
          </TableCell>

          {/* Nome / Razão Social */}
          <TableCell>
            <Stack spacing={0.5}>
              <Skeleton sx={{ width: '80%', height: 18 }} />
              <Skeleton sx={{ width: '60%', height: 14 }} />
            </Stack>
          </TableCell>

          {/* CNPJ/CPF */}
          <TableCell>
            <Skeleton sx={{ width: 140, height: 18 }} />
          </TableCell>

          {/* Telefone */}
          <TableCell>
            <Skeleton sx={{ width: 120, height: 18 }} />
          </TableCell>

          {/* Tipo */}
          <TableCell>
            <Skeleton sx={{ width: 60, height: 24, borderRadius: 1.5 }} />
          </TableCell>

          {/* Status */}
          <TableCell>
            <Skeleton sx={{ width: 70, height: 24, borderRadius: 1.5 }} />
          </TableCell>

          {/* Ações */}
          <TableCell align="right">
            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
              <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
              <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
            </Stack>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

