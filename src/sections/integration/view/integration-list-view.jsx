import { useState, useCallback, useEffect, useRef } from 'react';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

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
  getIntegrationLogs,
} from 'src/actions/integrations';

import { fDateTime } from 'src/utils/format-time';
import { Label } from 'src/components/label';

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
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncDialogStatus, setSyncDialogStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [syncDialogError, setSyncDialogError] = useState(null);

  const [logsDialogOpen, setLogsDialogOpen] = useState(false);
  const [logsDialogIntegrationName, setLogsDialogIntegrationName] = useState('');
  const [logsDialogIntegrationId, setLogsDialogIntegrationId] = useState(null);
  const [logsDialogLogs, setLogsDialogLogs] = useState([]);
  const [logsDialogLoading, setLogsDialogLoading] = useState(false);

  const [payloadDialogOpen, setPayloadDialogOpen] = useState(false);
  const [payloadDialogTitle, setPayloadDialogTitle] = useState('');
  const [payloadDialogContent, setPayloadDialogContent] = useState('');

  const prevOrgRef = useRef(organizationId);

  const formatPayload = useCallback((payload) => {
    if (payload == null) return '(vazio)';
    try {
      return typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
    } catch {
      return String(payload);
    }
  }, []);

  const handleOpenPayload = useCallback((title, payload) => {
    setPayloadDialogTitle(title);
    setPayloadDialogContent(formatPayload(payload));
    setPayloadDialogOpen(true);
  }, [formatPayload]);

  const handleClosePayloadDialog = useCallback(() => {
    setPayloadDialogOpen(false);
    setPayloadDialogTitle('');
    setPayloadDialogContent('');
  }, []);

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

      setSyncDialogOpen(true);
      setSyncDialogStatus('loading');
      setSyncDialogError(null);
      setSyncingId(id);

      syncOrganizationIntegration(organizationId, id)
        .then(() => {
          setSyncDialogStatus('success');
          loadIntegrations();
        })
        .catch((err) => {
          setSyncDialogStatus('error');
          setSyncDialogError(err?.message || 'Erro ao sincronizar');
        })
        .finally(() => {
          setSyncingId(null);
        });
    },
    [organizationId, loadIntegrations]
  );

  const handleCloseSyncDialog = useCallback(() => {
    setSyncDialogOpen(false);
    setSyncDialogStatus('idle');
    setSyncDialogError(null);
  }, []);

  const handleOpenLogs = useCallback(
    (integrationId, integrationName) => {
      if (!organizationId || !integrationId) return;
      setLogsDialogIntegrationId(integrationId);
      setLogsDialogIntegrationName(integrationName ?? 'Integração');
      setLogsDialogOpen(true);
      setLogsDialogLogs([]);
      setLogsDialogLoading(true);
      getIntegrationLogs(organizationId, integrationId, { skip: 0, take: 20 })
        .then((logs) => setLogsDialogLogs(Array.isArray(logs) ? logs : []))
        .catch(() => setLogsDialogLogs([]))
        .finally(() => setLogsDialogLoading(false));
    },
    [organizationId]
  );

  const handleCloseLogsDialog = useCallback(() => {
    setLogsDialogOpen(false);
    setLogsDialogIntegrationId(null);
    setLogsDialogIntegrationName('');
    setLogsDialogLogs([]);
  }, []);

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
                        onLogs={() => handleOpenLogs(row.id, row.name)}
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

      <Dialog
        open={syncDialogOpen}
        onClose={syncDialogStatus === 'loading' ? undefined : handleCloseSyncDialog}
        disableEscapeKeyDown={syncDialogStatus === 'loading'}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {syncDialogStatus === 'loading' && 'Sincronização'}
          {syncDialogStatus === 'success' && 'Sincronização'}
          {syncDialogStatus === 'error' && 'Erro'}
        </DialogTitle>
        <DialogContent>
          {syncDialogStatus === 'loading' && (
            <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Carregando dados, aguarde...
              </Typography>
            </Stack>
          )}
          {syncDialogStatus === 'success' && (
            <Typography variant="body2">Efetuado com sucesso.</Typography>
          )}
          {syncDialogStatus === 'error' && (
            <Typography variant="body2" color="error">
              {syncDialogError}
            </Typography>
          )}
        </DialogContent>
        {(syncDialogStatus === 'success' || syncDialogStatus === 'error') && (
          <DialogActions>
            <Button variant="contained" onClick={handleCloseSyncDialog}>
              Fechar
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <Dialog
        open={logsDialogOpen}
        onClose={handleCloseLogsDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>Logs de integração — {logsDialogIntegrationName}</DialogTitle>
        <DialogContent dividers>
          {logsDialogLoading ? (
            <Stack spacing={2} alignItems="center" sx={{ py: 3 }}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Carregando logs...
              </Typography>
            </Stack>
          ) : (
            <TableContainer sx={{ minHeight: 200 }}>
              <Table size="small" stickyHeader>
                <TableHeadCustom
                  headLabel={[
                    { id: 'status', label: 'Status', width: 100 },
                    { id: 'createdAt', label: 'Data/Hora', width: 160 },
                    { id: 'httpMethod', label: 'Método', width: 70 },
                    { id: 'statusCode', label: 'Código', width: 70 },
                    { id: 'responseTimeMs', label: 'Tempo (ms)', width: 90 },
                    { id: 'errorMessage', label: 'Mensagem', width: 200 },
                    { id: 'actions', label: 'Payload', width: 120 },
                  ]}
                />
                <TableBody>
                  {logsDialogLogs.length === 0 && !logsDialogLoading && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Nenhum log encontrado.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {logsDialogLogs.map((log) => {
                    const statusColor =
                      log.status === 'success'
                        ? 'success'
                        : log.status === 'timeout'
                          ? 'warning'
                          : 'error';
                    const statusLabel =
                      log.status === 'success'
                        ? 'Sucesso'
                        : log.status === 'timeout'
                          ? 'Timeout'
                          : 'Erro';
                    return (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          <Label variant="soft" color={statusColor}>
                            {statusLabel}
                          </Label>
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {log.createdAt
                            ? fDateTime(log.createdAt, 'DD/MM/YYYY HH:mm:ss')
                            : '-'}
                        </TableCell>
                        <TableCell>{log.httpMethod ?? '-'}</TableCell>
                        <TableCell>{log.statusCode ?? '-'}</TableCell>
                        <TableCell>{log.responseTimeMs ?? '-'}</TableCell>
                        <TableCell
                          sx={{
                            maxWidth: 280,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={log.errorMessage ?? ''}
                        >
                          {log.errorMessage ?? '-'}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <Stack direction="row" spacing={0.25}>
                            <Tooltip title="Ver payload de envio" placement="top" arrow>
                              <IconButton
                                size="small"
                                color="inherit"
                                onClick={() =>
                                  handleOpenPayload(
                                    'Payload de envio',
                                    log.requestPayload
                                  )
                                }
                              >
                                <Iconify icon="solar:upload-minimalistic-bold" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Ver payload de retorno" placement="top" arrow>
                              <IconButton
                                size="small"
                                color="inherit"
                                onClick={() =>
                                  handleOpenPayload(
                                    'Payload de retorno',
                                    log.responsePayload
                                  )
                                }
                              >
                                <Iconify icon="solar:download-minimalistic-bold" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseLogsDialog}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={payloadDialogOpen}
        onClose={handleClosePayloadDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>{payloadDialogTitle}</DialogTitle>
        <DialogContent dividers>
          <Scrollbar sx={{ maxHeight: 400 }}>
            <Box
              component="pre"
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.neutral',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {payloadDialogContent}
            </Box>
          </Scrollbar>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClosePayloadDialog}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
