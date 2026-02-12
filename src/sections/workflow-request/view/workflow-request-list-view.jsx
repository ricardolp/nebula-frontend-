import { useState, useCallback, useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';

import { useSetState } from 'src/hooks/use-set-state';

import { useAuthContext } from 'src/auth/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import {
  getOrganizationWorkflowRequests,
  getOrganizationWorkflowRequestsPendingMyApproval,
} from 'src/actions/workflow-requests';
import { getOrganizationWorkflows } from 'src/actions/workflows';
import { getOrganizationMe } from 'src/actions/users';

import { WorkflowRequestTableRow } from '../workflow-request-table-row';
import { WorkflowRequestTableSkeleton } from '../workflow-request-table-skeleton';
import { WorkflowRequestTableToolbar } from '../workflow-request-table-toolbar';
import { WorkflowRequestFormDialog } from '../workflow-request-form-dialog';
import { WorkflowRequestProcessDialog } from '../workflow-request-process-dialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'titulo', label: 'Título', width: 220 },
  { id: 'workflow', label: 'Workflow', width: 160 },
  { id: 'submittedBy', label: 'Solicitante', width: 140 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'prioridade', label: 'Prioridade', width: 100 },
  { id: 'slaDueAt', label: 'SLA', width: 140 },
  { id: 'createdAt', label: 'Data', width: 140 },
  { id: '', width: 88, align: 'right' },
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

export function WorkflowRequestListView({ initialFilter = 'all', heading = 'Solicitações', breadcrumbLinks } = {}) {
  const table = useTable({ defaultOrderBy: 'createdAt', defaultOrder: 'desc' });
  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workflows, setWorkflows] = useState([]);
  const [currentUserOrganizationRoleId, setCurrentUserOrganizationRoleId] = useState(null);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [processRequestId, setProcessRequestId] = useState(null);

  const filters = useSetState({
    filter: initialFilter,
    workflowId: '',
    status: '',
  });

  const prevOrgRef = useRef(organizationId);

  const loadWorkflows = useCallback(() => {
    if (!organizationId) {
      setWorkflows([]);
      return;
    }
    getOrganizationWorkflows(organizationId)
      .then((list) => setWorkflows(Array.isArray(list) ? list : []))
      .catch(() => setWorkflows([]));
  }, [organizationId]);

  const loadRequests = useCallback(() => {
    if (!organizationId) {
      setTableData([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const skip = table.page * table.rowsPerPage;
    const take = table.rowsPerPage;

    const isPendingMyApproval = initialFilter === 'pending_my_approval';

    const request = isPendingMyApproval
      ? getOrganizationWorkflowRequestsPendingMyApproval(organizationId, { skip, take })
      : getOrganizationWorkflowRequests(organizationId, {
          filter: filters.state.filter,
          workflowId: filters.state.workflowId || undefined,
          status: filters.state.status || undefined,
          skip,
          take,
        });

    request
      .then(({ requests, total }) => {
        setTableData(requests ?? []);
        setTotalCount(total ?? 0);
      })
      .catch((err) => {
        setError(err?.message || 'Erro ao carregar solicitações');
        setTableData([]);
        setTotalCount(0);
        toast.error(err?.message || 'Erro ao carregar solicitações');
      })
      .finally(() => setLoading(false));
  }, [
    organizationId,
    table.page,
    table.rowsPerPage,
    initialFilter,
    filters.state.filter,
    filters.state.workflowId,
    filters.state.status,
  ]);

  useEffect(() => {
    if (organizationId && organizationId !== prevOrgRef.current) {
      prevOrgRef.current = organizationId;
      table.onResetPage();
    }
  }, [organizationId, table.onResetPage]);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    if (!organizationId) {
      setCurrentUserOrganizationRoleId(null);
      return;
    }
    getOrganizationMe(organizationId)
      .then((data) => {
        setCurrentUserOrganizationRoleId(data?.organizationRoleId ?? null);
      })
      .catch(() => {
        setCurrentUserOrganizationRoleId(null);
      });
  }, [organizationId]);

  const [newRequestDialogOpen, setNewRequestDialogOpen] = useState(false);

  const handleOpenProcessDialog = useCallback((requestIdToProcess) => {
    setProcessRequestId(requestIdToProcess);
    setProcessDialogOpen(true);
  }, []);

  const handleCloseProcessDialog = useCallback(() => {
    setProcessRequestId(null);
    setProcessDialogOpen(false);
  }, []);

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
          heading={heading}
          links={
            breadcrumbLinks ?? [
              { name: 'Dashboard', href: paths.dashboard.root },
              { name: 'Solicitações' },
            ]
          }
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              disabled={!organizationId}
              onClick={() => setNewRequestDialogOpen(true)}
            >
              Nova solicitação
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <WorkflowRequestFormDialog
          open={newRequestDialogOpen}
          onClose={() => setNewRequestDialogOpen(false)}
          organizationId={organizationId}
          workflows={workflows}
          onSuccess={loadRequests}
        />

        <WorkflowRequestProcessDialog
          open={processDialogOpen && !!processRequestId}
          onClose={handleCloseProcessDialog}
          requestId={processRequestId}
          organizationId={organizationId}
          currentUserOrganizationRoleId={currentUserOrganizationRoleId}
          onSuccess={loadRequests}
        />

        <Card>
          <WorkflowRequestTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            workflowOptions={workflows}
          />

          <Box sx={{ position: 'relative' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={table.onSort}
                />

                <TableBody>
                  {loading ? (
                    <WorkflowRequestTableSkeleton
                      rows={table.rowsPerPage}
                      dense={table.dense}
                    />
                  ) : (
                    dataFiltered.map((row) => (
                      <WorkflowRequestTableRow
                        key={row.id}
                        row={row}
                        organizationId={organizationId}
                        currentUserOrganizationRoleId={currentUserOrganizationRoleId}
                        onOpenProcessDialog={handleOpenProcessDialog}
                        showProcessar={initialFilter === 'pending_my_approval'}
                      />
                    ))
                  )}

                  {!loading && (
                    <TableEmptyRows
                      height={table.dense ? 56 : 56 + 20}
                      emptyRows={emptyRows(
                        table.page,
                        table.rowsPerPage,
                        totalCount
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
            count={totalCount}
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
