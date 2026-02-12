import { useState, useCallback, useEffect, useRef } from 'react';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import Tooltip from '@mui/material/Tooltip';

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

import {
  getOrganizationIntegrations,
  deleteOrganizationIntegration,
  syncOrganizationIntegration,
} from 'src/actions/integrations';

import { IntegrationFormDialog } from '../integration-form-dialog';
import { IntegrationTableRow } from '../integration-table-row';
import { IntegrationTableSkeleton } from '../integration-table-skeleton';

// ----------------------------------------------------------------------

function mapApiIntegrationToRow(api) {
  return {
    id: api.id,
    name: api.name ?? '-',
    url: api.url ?? '-',
    type: api.type ?? 'input',
    process: api.process ?? 'domain',
    authType: api.authType ?? 'NO_AUTH',
    status: api.status ?? 'inactive',
    lastSync: api.lastSync ?? 'never',
  };
}

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nome', width: 180 },
  { id: 'url', label: 'URL', width: 220 },
  { id: 'type', label: 'Tipo', width: 90 },
  { id: 'process', label: 'Processo', width: 100 },
  { id: 'authType', label: 'Autenticação', width: 110 },
  { id: 'status', label: 'Status', width: 90 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function IntegrationListView() {
  const table = useTable();

  const confirm = useBoolean();
  const formDialog = useBoolean();

  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [syncingId, setSyncingId] = useState(null);
  const [formEditId, setFormEditId] = useState(null);

  const prevOrgRef = useRef(organizationId);

  const loadIntegrations = useCallback(() => {
    if (!organizationId) {
      setTableData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getOrganizationIntegrations(organizationId)
      .then((list) => {
        setTableData(Array.isArray(list) ? list.map(mapApiIntegrationToRow) : []);
      })
      .catch((err) => {
        setError(err?.message || 'Erro ao carregar integrações');
        setTableData([]);
        toast.error(err?.message || 'Erro ao carregar integrações');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [organizationId]);

  useEffect(() => {
    if (organizationId && organizationId !== prevOrgRef.current) {
      prevOrgRef.current = organizationId;
      table.onResetPage();
      table.onSelectAllRows(false, []);
    }
  }, [organizationId, table.onResetPage, table.onSelectAllRows]);

  useEffect(() => {
    loadIntegrations();
  }, [loadIntegrations]);

  const totalCount = tableData.length;
  const dataInPage = rowInPage(tableData, table.page, table.rowsPerPage);
  const notFound = !loading && !error && !tableData.length;

  const handleDeleteRow = useCallback(
    (id) => {
      if (!organizationId) return;

      deleteOrganizationIntegration(organizationId, id)
        .then(() => {
          toast.success('Integração excluída com sucesso!');
          setTableData((prev) => prev.filter((row) => row.id !== id));
          table.onUpdatePageDeleteRow(dataInPage.length);
        })
        .catch((err) => {
          toast.error(err?.message || 'Erro ao excluir integração');
        });
    },
    [organizationId, dataInPage.length, table]
  );

  const handleSyncRow = useCallback(
    (id) => {
      if (!organizationId) return;

      setSyncingId(id);
      syncOrganizationIntegration(organizationId, id)
        .then(() => {
          toast.success('Sincronização iniciada!');
          loadIntegrations();
        })
        .catch((err) => {
          toast.error(err?.message || 'Erro ao sincronizar');
        })
        .finally(() => {
          setSyncingId(null);
        });
    },
    [organizationId, loadIntegrations]
  );

  const handleDeleteRows = useCallback(() => {
    if (!organizationId || !table.selected.length) return;

    setBulkDeleting(true);
    const promises = table.selected.map((integrationId) =>
      deleteOrganizationIntegration(organizationId, integrationId)
    );

    Promise.all(promises)
      .then(() => {
        toast.success('Integração(s) excluída(s) com sucesso!');
        setTableData((prev) => prev.filter((row) => !table.selected.includes(row.id)));
        table.onUpdatePageDeleteRows({
          totalRowsInPage: dataInPage.length,
          totalRowsFiltered: tableData.length,
        });
        table.onSelectAllRows(false, []);
      })
      .catch((err) => {
        toast.error(err?.message || 'Erro ao excluir integrações');
      })
      .finally(() => {
        setBulkDeleting(false);
        confirm.onFalse();
      });
  }, [
    organizationId,
    table.selected,
    tableData.length,
    dataInPage.length,
    table,
    confirm,
  ]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Integrações"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Integrações', href: paths.dashboard.integration.list },
            { name: 'Listar' },
          ]}
          action={
            <Button
              variant="contained"
              disabled={!organizationId}
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                setFormEditId(null);
                formDialog.onTrue();
              }}
            >
              Nova integração
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
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 880 }}>
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
                    <IntegrationTableSkeleton
                      rows={table.rowsPerPage}
                      dense={table.dense}
                    />
                  ) : (
                    dataInPage.map((row) => (
                      <IntegrationTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => {
                          setFormEditId(row.id);
                          formDialog.onTrue();
                        }}
                        onSync={
                          row.process === 'domain'
                            ? () => handleSyncRow(row.id)
                            : undefined
                        }
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
            integração(ões)?
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

      <IntegrationFormDialog
        open={formDialog.value}
        onClose={() => {
          formDialog.onFalse();
          setFormEditId(null);
        }}
        organizationId={organizationId}
        editId={formEditId}
        onSuccess={loadIntegrations}
      />
    </>
  );
}
