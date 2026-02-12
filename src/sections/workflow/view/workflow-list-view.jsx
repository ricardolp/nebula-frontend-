import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { useAuthContext } from 'src/auth/hooks';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { getOrganizationWorkflows, deleteOrganizationWorkflow } from 'src/actions/workflows';

import { WorkflowAnalytic } from '../workflow-analytic';
import { WorkflowTableRow } from '../workflow-table-row';
import { WorkflowTableSkeleton } from '../workflow-table-skeleton';
import { WorkflowTableToolbar } from '../workflow-table-toolbar';
import { WorkflowTableFiltersResult } from '../workflow-table-filters-result';
import { WorkflowFormDialog } from '../workflow-form-dialog';

// ----------------------------------------------------------------------

function mapApiWorkflowToRow(apiWorkflow) {
  const steps = Array.isArray(apiWorkflow.steps) ? apiWorkflow.steps : [];
  return {
    id: apiWorkflow.id,
    name: apiWorkflow.name ?? null,
    type: apiWorkflow.type ?? '-',
    action: apiWorkflow.action ?? '-',
    stepsCount: steps.length,
    ...apiWorkflow,
  };
}

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nome', width: 220 },
  { id: 'type', label: 'Tipo', width: 120 },
  { id: 'action', label: 'Ação', width: 120 },
  { id: 'stepsCount', label: 'Passos', width: 80 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, type, action } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let data = stabilizedThis.map((el) => el[0]);

  if (name) {
    const keyword = name.toLowerCase();
    data = data.filter(
      (row) =>
        (row.name && row.name.toLowerCase().indexOf(keyword) !== -1) ||
        (row.type && String(row.type).toLowerCase().indexOf(keyword) !== -1)
    );
  }

  if (type !== 'all') {
    data = data.filter((row) => row.type === type);
  }

  if (action !== 'all') {
    data = data.filter((row) => row.action === action);
  }

  return data;
}

// ----------------------------------------------------------------------

export function WorkflowListView() {
  const theme = useTheme();
  const table = useTable({ defaultOrderBy: 'name' });
  const navigate = useNavigate();
  const confirm = useBoolean();

  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [workflowFormOpen, setWorkflowFormOpen] = useState(false);

  const filters = useSetState({
    name: '',
    type: 'all',
    action: 'all',
  });

  const prevOrgRef = useRef(organizationId);

  const loadWorkflows = useCallback(() => {
    if (!organizationId) {
      setTableData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getOrganizationWorkflows(organizationId)
      .then((list) => {
        setTableData(Array.isArray(list) ? list.map(mapApiWorkflowToRow) : []);
      })
      .catch((err) => {
        setError(err?.message || 'Erro ao carregar workflows');
        setTableData([]);
        toast.error(err?.message || 'Erro ao carregar workflows');
      })
      .finally(() => setLoading(false));
  }, [organizationId]);

  useEffect(() => {
    if (organizationId !== prevOrgRef.current) {
      prevOrgRef.current = organizationId;
      // Mostrar skeleton imediatamente ao trocar de organização
      setLoading(true);
      setTableData([]);
      setError(null);
      table.onResetPage();
      table.onSelectAllRows(false, []);
      filters.onResetState();
    }
  }, [organizationId, table.onResetPage, table.onSelectAllRows, filters.onResetState]);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const totalCount = dataFiltered.length;

  const canReset =
    !!filters.state.name ||
    filters.state.type !== 'all' ||
    filters.state.action !== 'all';

  const notFound = (!dataFiltered.length && canReset) || (!loading && !error && !tableData.length);

  const getWorkflowLength = (typeOrAction, field = 'type') =>
    tableData.filter((item) => item[field] === typeOrAction).length;

  const getPercentByType = (type) =>
    tableData.length ? (getWorkflowLength(type, 'type') / tableData.length) * 100 : 0;

  const getPercentByAction = (action) =>
    tableData.length ? (getWorkflowLength(action, 'action') / tableData.length) * 100 : 0;

  const TABS = [
    { value: 'all', label: 'Todos', color: 'default', count: tableData.length },
    {
      value: 'material',
      label: 'Material',
      color: 'primary',
      count: getWorkflowLength('material', 'type'),
    },
    {
      value: 'partner',
      label: 'Partner',
      color: 'secondary',
      count: getWorkflowLength('partner', 'type'),
    },
    {
      value: 'create',
      label: 'Criação',
      color: 'success',
      count: getWorkflowLength('create', 'action'),
    },
    {
      value: 'update',
      label: 'Atualização',
      color: 'info',
      count: getWorkflowLength('update', 'action'),
    },
  ];

  const handleDeleteRow = useCallback(
    (id) => {
      if (!organizationId) return;

      deleteOrganizationWorkflow(organizationId, id)
        .then(() => {
          toast.success('Workflow excluído com sucesso!');
          setTableData((prev) => prev.filter((row) => row.id !== id));
          table.onUpdatePageDeleteRow(dataInPage.length);
        })
        .catch((err) => {
          toast.error(err?.message || 'Erro ao excluir workflow');
        });
    },
    [organizationId, dataInPage.length, table]
  );

  const handleDeleteRows = useCallback(() => {
    if (!organizationId || !table.selected.length) return;

    setBulkDeleting(true);
    const promises = table.selected.map((workflowId) =>
      deleteOrganizationWorkflow(organizationId, workflowId)
    );

    Promise.all(promises)
      .then(() => {
        toast.success('Workflow(s) excluído(s) com sucesso!');
        setTableData((prev) => prev.filter((row) => !table.selected.includes(row.id)));
        table.onUpdatePageDeleteRows({
          totalRowsInPage: dataInPage.length,
          totalRowsFiltered: dataFiltered.length,
        });
        table.onSelectAllRows(false, []);
      })
      .catch((err) => {
        toast.error(err?.message || 'Erro ao excluir workflows');
      })
      .finally(() => {
        setBulkDeleting(false);
        confirm.onFalse();
      });
  }, [organizationId, table.selected, dataInPage.length, dataFiltered.length, table, confirm]);

  const handleEditRow = useCallback((row) => {
    navigate(paths.dashboard.workflows.edit(row.id));
  }, [navigate]);

  const handleNewWorkflow = useCallback(() => {
    setWorkflowFormOpen(true);
  }, []);

  const handleWorkflowFormSuccess = useCallback(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  const tabValue =
    filters.state.type !== 'all'
      ? filters.state.type
      : filters.state.action !== 'all'
        ? filters.state.action
        : 'all';

  const handleFilterTab = useCallback(
    (event, newValue) => {
      table.onResetPage();
      if (newValue === 'all') {
        filters.setState({ type: 'all', action: 'all' });
      } else if (newValue === 'material' || newValue === 'partner') {
        filters.setState({ type: newValue, action: 'all' });
      } else {
        filters.setState({ type: 'all', action: newValue });
      }
    },
    [filters, table]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Workflows"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Workflows' },
          ]}
          action={
            <Button
              variant="contained"
              disabled={!organizationId}
              startIcon={<Iconify icon="solar:add-circle-bold-duotone" />}
              onClick={handleNewWorkflow}
            >
              Novo workflow
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <WorkflowFormDialog
          open={workflowFormOpen}
          onClose={() => setWorkflowFormOpen(false)}
          organizationId={organizationId}
          onSuccess={handleWorkflowFormSuccess}
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar sx={{ minHeight: 108 }}>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <WorkflowAnalytic
                title="Total"
                total={tableData.length}
                percent={100}
                icon="solar:bill-list-bold-duotone"
                color={theme.vars.palette.info.main}
              />
              <WorkflowAnalytic
                title="Material"
                total={getWorkflowLength('material', 'type')}
                percent={getPercentByType('material')}
                icon="solar:box-bold-duotone"
                color={theme.vars.palette.primary.main}
              />
              <WorkflowAnalytic
                title="Partner"
                total={getWorkflowLength('partner', 'type')}
                percent={getPercentByType('partner')}
                icon="solar:users-group-rounded-bold-duotone"
                color={theme.vars.palette.secondary.main}
              />
              <WorkflowAnalytic
                title="Criação"
                total={getWorkflowLength('create', 'action')}
                percent={getPercentByAction('create')}
                icon="solar:file-add-bold-duotone"
                color={theme.vars.palette.success.main}
              />
              <WorkflowAnalytic
                title="Atualização"
                total={getWorkflowLength('update', 'action')}
                percent={getPercentByAction('update')}
                icon="solar:pen-bold-duotone"
                color={theme.vars.palette.info.main}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            value={tabValue}
            onChange={handleFilterTab}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={tab.value === tabValue ? 'filled' : 'soft'}
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <WorkflowTableToolbar filters={filters} onResetPage={table.onResetPage} />

          {canReset && (
            <WorkflowTableFiltersResult
              filters={filters}
              onResetPage={table.onResetPage}
              onResetAll={() => {
                filters.onResetState();
                table.onResetPage();
              }}
              totalResults={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {bulkDeleting && (
                    <CircularProgress size={24} color="primary" sx={{ mr: 0.5 }} />
                  )}
                  <Tooltip title="Excluir">
                    <IconButton
                      color="error"
                      disabled={bulkDeleting}
                      onClick={() => confirm.onTrue()}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 720 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {loading ? (
                    <WorkflowTableSkeleton
                      rows={table.rowsPerPage}
                      dense={table.dense}
                    />
                  ) : (
                    dataInPage.map((row) => (
                      <WorkflowTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onEditRow={handleEditRow}
                        onDeleteRow={() => handleDeleteRow(row.id)}
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Excluir"
        content={
          <>
            Tem certeza que deseja excluir <strong>{table.selected.length}</strong>{' '}
            workflow(s)?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            disabled={bulkDeleting}
            onClick={() => handleDeleteRows()}
          >
            Excluir
          </Button>
        }
      />
    </>
  );
}
