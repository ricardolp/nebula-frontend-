import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import { DashboardContent } from 'src/layouts/dashboard';
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

import { getOrganizationBps, sendBpToSap } from 'src/actions/bps';

import { BusinessPartnerListRow } from 'src/sections/business-partner/business-partner-table-row';
import { BusinessPartnerTableSkeleton } from 'src/sections/business-partner/business-partner-table-skeleton';
import { BusinessPartnerNewDialog } from 'src/sections/business-partner/business-partner-new-dialog';

// ----------------------------------------------------------------------
// Mapeia BP da API para o formato da tabela
// ----------------------------------------------------------------------

function mapApiBpToRow(apiBp) {
  const endereco = apiBp.endereco && typeof apiBp.endereco === 'object' ? apiBp.endereco : {};
  const comunicacao = apiBp.comunicacao && typeof apiBp.comunicacao === 'object' ? apiBp.comunicacao : {};
  const primeiroEmail = Array.isArray(comunicacao.emails) && comunicacao.emails[0]
    ? comunicacao.emails[0]
    : comunicacao.email ?? null;

  return {
    id: apiBp.id,
    codigoAntigo: apiBp.codigoAntigo ?? '-',
    tipo: apiBp.tipo ?? null,
    funcao: apiBp.funcao ?? null,
    nomeFantasia: apiBp.nomeNomeFantasia ?? null,
    razaoSocial: apiBp.sobrenomeRazaoSocial ?? null,
    cidade: endereco.cidade ?? '-',
    estado: endereco.estado ?? endereco.uf ?? '-',
    email: primeiroEmail ?? '-',
    createdAt: apiBp.createdAt ?? null,
  };
}

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'codigoAntigo', label: 'Cód. antigo', width: 100 },
  { id: 'tipo', label: 'Tipo', width: 60 },
  { id: 'funcao', label: 'Função', width: 80 },
  { id: 'nomeFantasia', label: 'Nome / Nome fantasia', width: 200 },
  { id: 'cidade', label: 'Cidade', width: 140 },
  { id: 'estado', label: 'UF', width: 60 },
  { id: 'email', label: 'E-mail', width: 200 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export default function BusinessPartnersListPage() {
  const table = useTable({ defaultOrderBy: 'nomeFantasia' });
  const navigate = useNavigate();

  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [sendToSapDialogOpen, setSendToSapDialogOpen] = useState(false);
  const [sendToSapDialogStatus, setSendToSapDialogStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [sendToSapDialogError, setSendToSapDialogError] = useState(null);

  const prevOrgRef = useRef(organizationId);

  const loadBps = useCallback(() => {
    if (!organizationId) {
      setTableData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getOrganizationBps(organizationId)
      .then((list) => {
        setTableData(Array.isArray(list) ? list.map(mapApiBpToRow) : []);
      })
      .catch((err) => {
        setError(err?.message || 'Erro ao carregar parceiros');
        setTableData([]);
        toast.error(err?.message || 'Erro ao carregar parceiros');
      })
      .finally(() => setLoading(false));
  }, [organizationId]);

  useEffect(() => {
    if (organizationId && organizationId !== prevOrgRef.current) {
      prevOrgRef.current = organizationId;
      table.onResetPage();
    }
  }, [organizationId, table.onResetPage]);

  useEffect(() => {
    loadBps();
  }, [loadBps]);

  const dataFiltered = tableData.slice().sort(
    getComparator(table.order, table.orderBy)
  );
  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const totalCount = tableData.length;
  const notFound = !loading && !error && !tableData.length;

  const handleNew = () => {
    setNewDialogOpen(true);
  };

  const handleNewDialogConfirm = ({ tipo, funcao }) => {
    navigate(paths.dashboard.businessPartners.new, { state: { tipo, funcao } });
  };

  const handleEditRow = (id) => {
    navigate(paths.dashboard.businessPartners.edit(id));
  };

  const handleSendToSapRow = useCallback(
    (bpId) => {
      if (!organizationId) return;

      setSendToSapDialogOpen(true);
      setSendToSapDialogStatus('loading');
      setSendToSapDialogError(null);

      sendBpToSap(organizationId, bpId)
        .then(() => {
          setSendToSapDialogStatus('success');
          loadBps();
        })
        .catch((err) => {
          setSendToSapDialogStatus('error');
          setSendToSapDialogError(err?.message || 'Erro ao enviar para o SAP');
        });
    },
    [organizationId, loadBps]
  );

  const handleCloseSendToSapDialog = useCallback(() => {
    setSendToSapDialogOpen(false);
    setSendToSapDialogStatus('idle');
    setSendToSapDialogError(null);
  }, []);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Business Partner"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Business Partner', href: paths.dashboard.businessPartners.root },
        ]}
        action={
          <Button
            variant="contained"
            disabled={!organizationId}
            startIcon={<Iconify icon="solar:add-circle-bold-duotone" />}
            onClick={handleNew}
          >
            Novo parceiro
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Box sx={{ position: 'relative' }}>
          <Scrollbar sx={{ minHeight: 444 }}>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                onSort={table.onSort}
              />

              <TableBody>
                {loading ? (
                  <BusinessPartnerTableSkeleton
                    rows={table.rowsPerPage}
                    dense={table.dense}
                  />
                ) : (
                  dataInPage.map((row) => (
                    <BusinessPartnerListRow
                      key={row.id}
                      row={row}
                      onEditRow={() => handleEditRow(row.id)}
                      onSendToSap={handleSendToSapRow}
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

      <BusinessPartnerNewDialog
        open={newDialogOpen}
        onClose={() => setNewDialogOpen(false)}
        onConfirm={handleNewDialogConfirm}
      />

      <Dialog
        open={sendToSapDialogOpen}
        onClose={sendToSapDialogStatus === 'loading' ? undefined : handleCloseSendToSapDialog}
        disableEscapeKeyDown={sendToSapDialogStatus === 'loading'}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {sendToSapDialogStatus === 'loading' && 'Enviar para SAP'}
          {sendToSapDialogStatus === 'success' && 'Processado com sucesso'}
          {sendToSapDialogStatus === 'error' && 'Erro'}
        </DialogTitle>
        <DialogContent>
          {sendToSapDialogStatus === 'loading' && (
            <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Enviando para o SAP, aguarde...
              </Typography>
            </Stack>
          )}
          {sendToSapDialogStatus === 'success' && (
            <Typography variant="body2">
              Processado com sucesso. Verifique o log de integração.
            </Typography>
          )}
          {sendToSapDialogStatus === 'error' && (
            <Typography variant="body2" color="error">
              {sendToSapDialogError}
            </Typography>
          )}
        </DialogContent>
        {(sendToSapDialogStatus === 'success' || sendToSapDialogStatus === 'error') && (
          <DialogActions>
            <Button variant="contained" onClick={handleCloseSendToSapDialog}>
              Fechar
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </DashboardContent>
  );
}
