import { useState, useCallback, useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { EmptyContent } from 'src/components/empty-content';

import { getOrganizationDomains } from 'src/actions/domains';

import { DomainTableRow } from '../domain-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'tabela', label: 'Tabela', width: 100 },
  { id: 'campo', label: 'Campo', width: 120 },
  { id: 'descricaoCampo', label: 'Descrição', width: 280 },
  { id: 'valor', label: 'Valor', width: 120 },
  { id: 'status', label: 'Status', width: 100 },
];

const TAKE = 20;

// ----------------------------------------------------------------------

export function DomainsByTabelaView({ tabela }) {
  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const table = useTable({ defaultOrderBy: 'campo', defaultRowsPerPage: TAKE });
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prevParamsRef = useRef({
    organizationId: null,
    tabela: null,
    page: null,
    rowsPerPage: null,
  });

  const loadDomains = useCallback(() => {
    if (!organizationId || !tabela) {
      setDomains([]);
      setLoading(false);
      return;
    }
    const page = table.page;
    const skip = page * table.rowsPerPage;
    const take = table.rowsPerPage;
    setLoading(true);
    setError(null);
    getOrganizationDomains(organizationId, { tabela, skip, take })
      .then(({ domains: data }) => {
        setDomains(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err?.message || 'Erro ao carregar domínios');
        setDomains([]);
      })
      .finally(() => setLoading(false));
  }, [organizationId, tabela, table.page, table.rowsPerPage]);

  useEffect(() => {
    const prev = prevParamsRef.current;
    const same =
      prev.organizationId === organizationId &&
      prev.tabela === tabela &&
      prev.page === table.page &&
      prev.rowsPerPage === table.rowsPerPage;
    if (same) return;
    prevParamsRef.current = {
      organizationId,
      tabela,
      page: table.page,
      rowsPerPage: table.rowsPerPage,
    };
    loadDomains();
  }, [organizationId, tabela, table.page, table.rowsPerPage, loadDomains]);

  if (!tabela) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Domínios"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Domínios', href: paths.dashboard.domains.root },
            { name: 'Tabela' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <EmptyContent
          filled
          title="Tabela não informada"
          description="Selecione uma tabela na lista de domínios agrupados."
          sx={{ py: 10 }}
        />
      </DashboardContent>
    );
  }

  const notFound = !loading && !error && domains.length === 0;
  const totalCount =
    table.page * table.rowsPerPage +
    domains.length +
    (domains.length >= table.rowsPerPage ? 1 : 0);
  const emptyRowsCount = emptyRows(table.page, table.rowsPerPage, domains.length);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`Domínios: ${tabela ?? ''}`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Domínios', href: paths.dashboard.domains.root },
          { name: tabela ?? 'Tabela' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Card>
        <Box sx={{ position: 'relative' }}>
          <Scrollbar sx={{ minHeight: 400 }}>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 720 }}>
              <TableHeadCustom headLabel={TABLE_HEAD} />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  domains.map((row) => <DomainTableRow key={row.id} row={row} />)
                )}
                {!loading && (
                  <TableEmptyRows
                    height={table.dense ? 52 : 72}
                    emptyRows={emptyRowsCount}
                  />
                )}
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={totalCount}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 25]}
        />
      </Card>
    </DashboardContent>
  );
}
