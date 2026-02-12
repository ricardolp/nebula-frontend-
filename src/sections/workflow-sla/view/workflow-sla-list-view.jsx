import { useState, useCallback, useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { useTable } from 'src/components/table';
import { useAuthContext } from 'src/auth/hooks';

import { Iconify } from 'src/components/iconify';
import { DashboardContent } from 'src/layouts/dashboard';
import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { getOrganizationWorkflowSlas } from 'src/actions/workflow-slas';

import { WorkflowSlaTableRow } from '../workflow-sla-table-row';
import { WorkflowSlaTableSkeleton } from '../workflow-sla-table-skeleton';
import { WorkflowSlaFormDialog } from '../workflow-sla-form-dialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'workflowType', label: 'Tipo de workflow', width: 160 },
  { id: 'priority', label: 'Prioridade', width: 120 },
  { id: 'hours', label: 'Horas (SLA)', width: 100 },
  { id: 'createdAt', label: 'Criado em', width: 160 },
  { id: 'updatedAt', label: 'Atualizado em', width: 160 },
];

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export function WorkflowSlaListView() {
  const table = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });
  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slaFormOpen, setSlaFormOpen] = useState(false);

  const prevOrgRef = useRef(organizationId);

  const loadSlas = useCallback(() => {
    if (!organizationId) {
      setTableData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getOrganizationWorkflowSlas(organizationId)
      .then((slas) => setTableData(Array.isArray(slas) ? slas : []))
      .catch((err) => {
        setError(err?.message || 'Erro ao carregar SLAs');
        setTableData([]);
        toast.error(err?.message || 'Erro ao carregar SLAs');
      })
      .finally(() => setLoading(false));
  }, [organizationId]);

  const handleSlaFormSuccess = useCallback(() => {
    loadSlas();
  }, [loadSlas]);

  useEffect(() => {
    if (organizationId && organizationId !== prevOrgRef.current) {
      prevOrgRef.current = organizationId;
      table.onResetPage();
    }
  }, [organizationId, table.onResetPage]);

  useEffect(() => {
    loadSlas();
  }, [loadSlas]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const notFound = !loading && !error && !tableData.length;

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="SLAs de workflow"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Workflows', href: paths.dashboard.workflows.root },
            { name: 'SLAs' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => setSlaFormOpen(true)}
              disabled={!organizationId}
            >
              Novo SLA
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <WorkflowSlaFormDialog
          open={slaFormOpen}
          onClose={() => setSlaFormOpen(false)}
          organizationId={organizationId}
          onSuccess={handleSlaFormSuccess}
        />

        <Card>
          <Box sx={{ position: 'relative' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 720 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={table.onSort}
                />

                <TableBody>
                  {loading ? (
                    <WorkflowSlaTableSkeleton
                      rows={table.rowsPerPage}
                      dense={table.dense}
                    />
                  ) : (
                    dataInPage.map((row) => <WorkflowSlaTableRow key={row.id} row={row} />)
                  )}

                  {!loading && (
                    <TableEmptyRows
                      height={table.dense ? 56 : 56 + 20}
                      emptyRows={emptyRows(
                        table.page,
                        table.rowsPerPage,
                        tableData.length
                      )}
                    />
                  )}

                  <TableNoData notFound={notFound || !!error} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>
    </>
  );
}
