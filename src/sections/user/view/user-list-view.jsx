import { useState, useCallback, useEffect, useRef } from 'react';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { useAuthContext } from 'src/auth/hooks';

import { varAlpha } from 'src/theme/styles';
import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
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

import { getOrganizationUsers, updateOrganizationUser } from 'src/actions/users';

import { UserTableRow } from '../user-table-row';
import { UserTableSkeleton } from '../user-table-skeleton';
import { UserTableToolbar } from '../user-table-toolbar';
import { UserTableFiltersResult } from '../user-table-filters-result';

// Mapeia usuário da API para o formato da tabela
function mapApiUserToRow(apiUser) {
  const firstOrg = apiUser.organizations?.[0];
  return {
    id: apiUser.id,
    name: apiUser.name ?? '-',
    email: apiUser.email ?? '-',
    avatarUrl: apiUser.avatar ?? undefined,
    company: firstOrg?.organization?.name ?? '-',
    role: firstOrg?.organizationRole?.name ?? apiUser.role ?? '-',
    organizationRoleId: firstOrg?.organizationRole?.id ?? firstOrg?.organizationRoleId ?? null,
    status: apiUser.status ?? 'active',
  };
}

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'suspended', label: 'Suspenso' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Nome' },
  { id: 'company', label: 'Empresa', width: 220 },
  { id: 'role', label: 'Função', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function UserListView() {
  const table = useTable();

  const confirm = useBoolean();

  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const filters = useSetState({ name: '', role: [], status: 'all' });
  const prevOrgRef = useRef(organizationId);

  // Ao mudar organização: reset da tabela (página 0, seleção) para recarregar dados da nova org
  useEffect(() => {
    if (organizationId && organizationId !== prevOrgRef.current) {
      prevOrgRef.current = organizationId;
      table.onResetPage();
      table.onSelectAllRows(false, []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- table ref is stable
  }, [organizationId, table.onResetPage, table.onSelectAllRows]);

  // Buscar usuários da API (paginado)
  useEffect(() => {
    if (!organizationId) {
      setTableData([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const skip = table.page * table.rowsPerPage;
    const take = table.rowsPerPage;

    getOrganizationUsers(organizationId, { skip, take })
      .then(({ users, total }) => {
        if (!cancelled) {
          setTableData(users.map(mapApiUserToRow));
          setTotalCount(total);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || 'Erro ao carregar usuários');
          setTableData([]);
          setTotalCount(0);
          toast.error(err?.message || 'Erro ao carregar usuários');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Cleanup: mark as cancelled so state is not updated after unmount
    /* eslint-disable consistent-return */
    return () => {
      cancelled = true;
    };
    /* eslint-enable consistent-return */
  }, [organizationId, table.page, table.rowsPerPage]);

  // Roles únicos para o filtro (a partir dos dados ou padrão)
  const rolesOptions = [...new Set(tableData.map((u) => u.role).filter(Boolean))];

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name || filters.state.role.length > 0 || filters.state.status !== 'all';

  const notFound = !loading && !error && (((!dataFiltered.length && canReset) || !dataFiltered.length));

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Excluído com sucesso!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleUserUpdated = useCallback(() => {
    const skip = table.page * table.rowsPerPage;
    const take = table.rowsPerPage;
    getOrganizationUsers(organizationId, { skip, take })
      .then(({ users, total }) => {
        setTableData(users.map(mapApiUserToRow));
        setTotalCount(total);
      })
      .catch((err) => {
        toast.error(err?.message || 'Erro ao atualizar lista');
      });
  }, [organizationId, table.page, table.rowsPerPage]);

  const handleBulkStatusChange = useCallback(
    (newStatus) => {
      setBulkProcessing(true);
      const promises = table.selected.map((userId) =>
        updateOrganizationUser(organizationId, userId, { status: newStatus })
      );
      Promise.all(promises)
        .then(() => {
          toast.success(
            newStatus === 'active'
              ? 'Usuário(s) ativado(s) com sucesso!'
              : 'Usuário(s) desativado(s) com sucesso!'
          );
          handleUserUpdated();
          table.onSelectAllRows(false, []);
        })
        .catch((err) => {
          toast.error(err?.message || 'Erro ao atualizar status');
        })
        .finally(() => {
          setBulkProcessing(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- table ref is stable
    [organizationId, table.selected, handleUserUpdated, table.onSelectAllRows]
  );


  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Usuários"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Usuários' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'inactive' && 'default') ||
                      (tab.value === 'suspended' && 'error') ||
                      'default'
                    }
                  >
                    {['active', 'inactive', 'suspended'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: rolesOptions }}
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
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
                  {bulkProcessing && (
                    <CircularProgress size={24} color="primary" sx={{ mr: 0.5 }} />
                  )}
                  <Tooltip title="Ativar">
                    <IconButton
                      color="primary"
                      disabled={bulkProcessing}
                      onClick={() => handleBulkStatusChange('active')}
                    >
                      <Iconify icon="solar:user-check-bold" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Desativar">
                    <IconButton
                      color="primary"
                      disabled={bulkProcessing}
                      onClick={() => handleBulkStatusChange('inactive')}
                    >
                      <Iconify icon="solar:user-minus-bold" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      color="primary"
                      disabled={bulkProcessing}
                      onClick={confirm.onTrue}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
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
                    <UserTableSkeleton rows={table.rowsPerPage} dense={table.dense} />
                  ) : (
                    dataFiltered.map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        organizationId={organizationId}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onUserUpdated={handleUserUpdated}
                      />
                    ))
                  )}

                  {!loading && (
                      <TableEmptyRows
                      height={table.dense ? 56 : 56 + 20}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, totalCount)}
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
            Tem certeza que deseja excluir <strong>{table.selected.length}</strong> item(ns)?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Excluir
          </Button>
        }
      />

    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}
