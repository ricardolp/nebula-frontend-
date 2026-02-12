import { useState, useCallback, useEffect, useRef } from 'react';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { getOrganizationRoles, deleteOrganizationRole } from 'src/actions/roles';
import { fDate } from 'src/utils/format-time';

import { RoleFormDialog } from '../role-form-dialog';
import { RoleTableRow } from '../role-table-row';
import { RoleTableSkeleton } from '../role-table-skeleton';

// ----------------------------------------------------------------------

function mapApiRoleToRow(apiRole) {
  const perms = Array.isArray(apiRole.permissions) ? apiRole.permissions : [];
  return {
    id: apiRole.id,
    name: apiRole.name ?? '-',
    slug: apiRole.slug ?? '-',
    permissions: perms,
    permissionsLabel: perms.length ? perms.join(', ') : '-',
    updatedAtFormatted: apiRole.updatedAt ? fDate(apiRole.updatedAt) : '-',
    ...apiRole,
  };
}

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nome', width: 200 },
  { id: 'slug', label: 'Slug', width: 160 },
  { id: 'permissionsLabel', label: 'Permissões', width: 280 },
  { id: 'updatedAtFormatted', label: 'Atualizado em', width: 120 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function RoleListView() {
  const table = useTable();

  const confirm = useBoolean();
  const formDialog = useBoolean();

  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const prevOrgRef = useRef(organizationId);

  const loadRoles = useCallback(() => {
    if (!organizationId) {
      setTableData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getOrganizationRoles(organizationId)
      .then((list) => {
        setTableData(Array.isArray(list) ? list.map(mapApiRoleToRow) : []);
      })
      .catch((err) => {
        setError(err?.message || 'Erro ao carregar roles');
        setTableData([]);
        toast.error(err?.message || 'Erro ao carregar roles');
      })
      .finally(() => setLoading(false));
  }, [organizationId]);

  useEffect(() => {
    if (organizationId && organizationId !== prevOrgRef.current) {
      prevOrgRef.current = organizationId;
      table.onResetPage();
      table.onSelectAllRows(false, []);
    }
  }, [organizationId, table.onResetPage, table.onSelectAllRows]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const totalCount = tableData.length;
  const dataInPage = rowInPage(tableData, table.page, table.rowsPerPage);
  const notFound = !loading && !error && !tableData.length;

  const handleDeleteRow = useCallback(
    (id) => {
      if (!organizationId) return;

      deleteOrganizationRole(organizationId, id)
        .then(() => {
          toast.success('Role excluído com sucesso!');
          setTableData((prev) => prev.filter((row) => row.id !== id));
          table.onUpdatePageDeleteRow(dataInPage.length);
        })
        .catch((err) => {
          toast.error(err?.message || 'Erro ao excluir role');
        });
    },
    [organizationId, dataInPage.length, table]
  );

  const handleDeleteRows = useCallback(() => {
    if (!organizationId || !table.selected.length) return;

    setBulkDeleting(true);
    const promises = table.selected.map((roleId) =>
      deleteOrganizationRole(organizationId, roleId)
    );

    Promise.all(promises)
      .then(() => {
        toast.success('Role(s) excluído(s) com sucesso!');
        setTableData((prev) => prev.filter((row) => !table.selected.includes(row.id)));
        table.onUpdatePageDeleteRows({
          totalRowsInPage: dataInPage.length,
          totalRowsFiltered: tableData.length,
        });
        table.onSelectAllRows(false, []);
      })
      .catch((err) => {
        toast.error(err?.message || 'Erro ao excluir roles');
      })
      .finally(() => {
        setBulkDeleting(false);
        confirm.onFalse();
      });
  }, [organizationId, table.selected, tableData.length, dataInPage.length, table, confirm]);

  const handleEditRow = useCallback((row) => {
    setEditingRole(row);
    formDialog.onTrue();
  }, [formDialog]);

  const handleFormSuccess = useCallback(() => {
    setEditingRole(null);
    formDialog.onFalse();
    loadRoles();
  }, [loadRoles, formDialog]);

  const handleFormClose = useCallback(() => {
    setEditingRole(null);
    formDialog.onFalse();
  }, [formDialog]);

  const handleNewRole = useCallback(() => {
    setEditingRole(null);
    formDialog.onTrue();
  }, [formDialog]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Roles"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Acessos', href: paths.dashboard.user.list },
            { name: 'Roles' },
          ]}
          action={
            <Button
              variant="contained"
              disabled={!organizationId}
              startIcon={<Iconify icon="solar:add-circle-bold-duotone" />}
              onClick={handleNewRole}
            >
              Novo role
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
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

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 720 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {loading ? (
                    <RoleTableSkeleton
                      rows={table.rowsPerPage}
                      dense={table.dense}
                    />
                  ) : (
                    dataInPage.map((row) => (
                      <RoleTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onEditRow={() => handleEditRow(row)}
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
            role(s)?
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

      <RoleFormDialog
        open={formDialog.value}
        onClose={handleFormClose}
        organizationId={organizationId}
        editRole={editingRole}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}
