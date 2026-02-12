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

import { getPendingInvites, deleteInvite } from 'src/actions/invites';
import { fDate } from 'src/utils/format-time';

import { InviteUserDialog } from 'src/sections/user/invite-user-dialog';

import { InviteTableRow } from '../invite-table-row';
import { InviteTableSkeleton } from '../invite-table-skeleton';

// ----------------------------------------------------------------------

function mapApiInviteToRow(apiInvite) {
  return {
    id: apiInvite.id,
    email: apiInvite.email ?? '-',
    organizationName: apiInvite.organization?.name ?? '-',
    createdByName: apiInvite.createdBy?.name ?? apiInvite.createdBy?.email ?? '-',
    expiresAtFormatted: apiInvite.expiresAt ? fDate(apiInvite.expiresAt) : '-',
  };
}

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'email', label: 'Email', width: 220 },
  { id: 'organizationName', label: 'Organização', width: 180 },
  { id: 'createdByName', label: 'Criado por', width: 160 },
  { id: 'expiresAtFormatted', label: 'Expira em', width: 120 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export function InviteListView() {
  const table = useTable();

  const confirm = useBoolean();
  const inviteDialog = useBoolean();

  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const prevOrgRef = useRef(organizationId);

  useEffect(() => {
    if (organizationId && organizationId !== prevOrgRef.current) {
      prevOrgRef.current = organizationId;
      table.onResetPage();
      table.onSelectAllRows(false, []);
    }
  }, [organizationId, table.onResetPage, table.onSelectAllRows]);

  useEffect(() => {
    let cancelled = false;

    if (!organizationId) {
      setTableData([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);

    getPendingInvites(organizationId)
      .then((list) => {
        if (!cancelled) {
          setTableData(Array.isArray(list) ? list.map(mapApiInviteToRow) : []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || 'Erro ao carregar convites');
          setTableData([]);
          toast.error(err?.message || 'Erro ao carregar convites');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  const totalCount = tableData.length;
  const dataInPage = rowInPage(tableData, table.page, table.rowsPerPage);
  const notFound = !loading && !error && !tableData.length;

  const handleDeleteRow = useCallback(
    (id) => {
      if (!organizationId) return;

      deleteInvite(organizationId, id)
        .then(() => {
          toast.success('Convite excluído com sucesso!');
          setTableData((prev) => prev.filter((row) => row.id !== id));
          table.onUpdatePageDeleteRow(dataInPage.length);
        })
        .catch((err) => {
          toast.error(err?.message || 'Erro ao excluir convite');
        });
    },
    [organizationId, dataInPage.length, table]
  );

  const handleDeleteRows = useCallback(() => {
    if (!organizationId || !table.selected.length) return;

    setBulkDeleting(true);
    const promises = table.selected.map((inviteId) =>
      deleteInvite(organizationId, inviteId)
    );

    Promise.all(promises)
      .then(() => {
        toast.success('Convite(s) excluído(s) com sucesso!');
        setTableData((prev) => prev.filter((row) => !table.selected.includes(row.id)));
        table.onUpdatePageDeleteRows({
          totalRowsInPage: dataInPage.length,
          totalRowsFiltered: tableData.length,
        });
        table.onSelectAllRows(false, []);
      })
      .catch((err) => {
        toast.error(err?.message || 'Erro ao excluir convites');
      })
      .finally(() => {
        setBulkDeleting(false);
        confirm.onFalse();
      });
  }, [organizationId, table.selected, tableData.length, dataInPage.length, table, confirm]);

  const handleInviteSuccess = useCallback(() => {
    if (!organizationId) return;
    getPendingInvites(organizationId).then((list) => {
      setTableData(Array.isArray(list) ? list.map(mapApiInviteToRow) : []);
    });
  }, [organizationId]);

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Convites"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Acessos', href: paths.dashboard.user.list },
            { name: 'Convites' },
          ]}
          action={
            <Button
              variant="contained"
              disabled={!organizationId}
              startIcon={<Iconify icon="solar:letter-bold-duotone" />}
              onClick={inviteDialog.onTrue}
            >
              Convidar
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
                    <InviteTableSkeleton
                      rows={table.rowsPerPage}
                      dense={table.dense}
                    />
                  ) : (
                    dataInPage.map((row) => (
                      <InviteTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
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
            convite(s)?
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

      <InviteUserDialog
        open={inviteDialog.value}
        onClose={inviteDialog.onFalse}
        organizationId={organizationId}
        onSuccess={handleInviteSuccess}
      />
    </>
  );
}
