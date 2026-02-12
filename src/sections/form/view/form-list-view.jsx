import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CardActionArea from '@mui/material/CardActionArea';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import { alpha } from '@mui/material/styles';

import { varAlpha } from 'src/theme/styles';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { useAuthContext } from 'src/auth/hooks';

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

import {
  getOrganizationForms,
  deleteOrganizationForm,
  createOrganizationForm,
  patchOrganizationForm,
} from 'src/actions/forms';

import { FormTableRow } from '../form-table-row';
import { FormTableSkeleton } from '../form-table-skeleton';
import { FormTableToolbar } from '../form-table-toolbar';
import { FormTableFiltersResult } from '../form-table-filters-result';

// ----------------------------------------------------------------------

function mapApiFormToRow(apiForm) {
  const fields = Array.isArray(apiForm.fields) ? apiForm.fields : [];
  return {
    id: apiForm.id,
    name: apiForm.name ?? null,
    organizationId: apiForm.organizationId,
    entity: apiForm.entity ?? null,
    status: apiForm.status ?? 'active',
    createdAt: apiForm.createdAt,
    updatedAt: apiForm.updatedAt,
    fieldsCount: fields.length,
    fields,
    ...apiForm,
  };
}

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
];

const TABLE_HEAD = [
  { id: 'name', label: 'Nome', width: 220 },
  { id: 'entity', label: 'Entidade', width: 120 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'fieldsCount', label: 'Campos', width: 80 },
  { id: 'updatedAt', label: 'Atualizado em', width: 160 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------
// Card selecionável para entidade (igual à popup de integrações)
// ----------------------------------------------------------------------

const ENTITY_OPTIONS = [
  {
    value: 'material',
    label: 'Material',
    description: 'Catálogo de materiais',
    icon: 'solar:box-bold-duotone',
    color: 'primary',
  },
  {
    value: 'partner',
    label: 'Parceiro',
    description: 'Parceiros de negócio',
    icon: 'solar:users-group-rounded-bold-duotone',
    color: 'warning',
  },
];

function EntityOptionCard({ option, selected, onClick }) {
  const { value, label, description, icon, color } = option;
  const isSelected = selected === value;

  return (
    <Card
      variant="outlined"
      sx={{
        flex: 1,
        minWidth: 120,
        maxWidth: 200,
        borderWidth: 2,
        borderColor: isSelected ? `${color}.main` : 'divider',
        bgcolor: isSelected ? (theme) => alpha(theme.palette[color].main, 0.08) : 'background.paper',
        transition: (theme) =>
          theme.transitions.create(['border-color', 'background-color', 'box-shadow'], {
            duration: theme.transitions.duration.short,
          }),
        '&:hover': {
          borderColor: `${color}.main`,
          bgcolor: (theme) => alpha(theme.palette[color].main, 0.04),
          boxShadow: (theme) => `0 0 0 1px ${theme.palette[color].main}`,
        },
      }}
    >
      <CardActionArea onClick={() => onClick(value)} sx={{ p: 2, height: '100%' }}>
        <Stack spacing={1} alignItems="center" sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) => alpha(theme.palette[color].main, isSelected ? 0.24 : 0.12),
              color: `${color}.main`,
            }}
          >
            <Iconify icon={icon} width={28} />
          </Box>
          <Typography variant="subtitle2">{label}</Typography>
          {description && (
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
              {description}
            </Typography>
          )}
        </Stack>
      </CardActionArea>
    </Card>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;

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
      (row) => row.name && row.name.toLowerCase().indexOf(keyword) !== -1
    );
  }

  if (status !== 'all') {
    data = data.filter((row) => (row.status ?? 'active') === status);
  }

  return data;
}

// ----------------------------------------------------------------------

export function FormListView() {
  const table = useTable({ defaultOrderBy: 'name' });
  const navigate = useNavigate();
  const confirm = useBoolean();

  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkStatusProcessing, setBulkStatusProcessing] = useState(false);
  const [newFormOpen, setNewFormOpen] = useState(false);
  const [newFormName, setNewFormName] = useState('');
  const [newFormEntity, setNewFormEntity] = useState('material');
  const [newFormSubmitting, setNewFormSubmitting] = useState(false);

  const filters = useSetState({
    name: '',
    status: 'all',
  });

  const prevOrgRef = useRef(organizationId);

  const loadForms = useCallback(() => {
    if (!organizationId) {
      setTableData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getOrganizationForms(organizationId)
      .then((list) => {
        setTableData(Array.isArray(list) ? list.map(mapApiFormToRow) : []);
      })
      .catch((err) => {
        setError(err?.message || 'Erro ao carregar formulários');
        setTableData([]);
        toast.error(err?.message || 'Erro ao carregar formulários');
      })
      .finally(() => setLoading(false));
  }, [organizationId]);

  useEffect(() => {
    if (organizationId && organizationId !== prevOrgRef.current) {
      prevOrgRef.current = organizationId;
      table.onResetPage();
      table.onSelectAllRows(false, []);
      filters.onResetState();
    }
  }, [organizationId, table.onResetPage, table.onSelectAllRows, filters.onResetState]);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const totalCount = dataFiltered.length;

  const canReset =
    !!filters.state.name || filters.state.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || (!loading && !error && !tableData.length);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const handleDeleteRow = useCallback(
    (id) => {
      if (!organizationId) return;

      deleteOrganizationForm(organizationId, id)
        .then(() => {
          toast.success('Formulário excluído com sucesso!');
          setTableData((prev) => prev.filter((row) => row.id !== id));
          table.onUpdatePageDeleteRow(dataInPage.length);
        })
        .catch((err) => {
          toast.error(err?.message || 'Erro ao excluir formulário');
        });
    },
    [organizationId, dataInPage.length, table]
  );

  const handleDeleteRows = useCallback(() => {
    if (!organizationId || !table.selected.length) return;

    setBulkDeleting(true);
    const promises = table.selected.map((formId) =>
      deleteOrganizationForm(organizationId, formId)
    );

    Promise.all(promises)
      .then(() => {
        toast.success('Formulário(s) excluído(s) com sucesso!');
        setTableData((prev) => prev.filter((row) => !table.selected.includes(row.id)));
        table.onUpdatePageDeleteRows({
          totalRowsInPage: dataInPage.length,
          totalRowsFiltered: dataFiltered.length,
        });
        table.onSelectAllRows(false, []);
      })
      .catch((err) => {
        toast.error(err?.message || 'Erro ao excluir formulários');
      })
      .finally(() => {
        setBulkDeleting(false);
        confirm.onFalse();
      });
  }, [organizationId, table.selected, dataInPage.length, dataFiltered.length, table, confirm]);

  const handleEditRow = useCallback((row) => {
    navigate(paths.dashboard.forms.edit(row.id));
  }, [navigate]);

  const handleStatusChange = useCallback(
    (formId, newStatus) => {
      if (!organizationId || !formId) return;
      patchOrganizationForm(organizationId, formId, { status: newStatus })
        .then(() => {
          toast.success(
            newStatus === 'active' ? 'Formulário ativado!' : 'Formulário desativado!'
          );
          setTableData((prev) =>
            prev.map((row) => (row.id === formId ? { ...row, status: newStatus } : row))
          );
        })
        .catch((err) => {
          toast.error(err?.message || 'Erro ao atualizar status');
        });
    },
    [organizationId]
  );

  const handleBulkStatusChange = useCallback(
    (newStatus) => {
      if (!organizationId || !table.selected.length) return;
      setBulkStatusProcessing(true);
      const promises = table.selected.map((formId) =>
        patchOrganizationForm(organizationId, formId, { status: newStatus })
      );
      Promise.all(promises)
        .then(() => {
          toast.success(
            newStatus === 'active'
              ? 'Formulário(s) ativado(s) com sucesso!'
              : 'Formulário(s) desativado(s) com sucesso!'
          );
          setTableData((prev) =>
            prev.map((row) =>
              table.selected.includes(row.id) ? { ...row, status: newStatus } : row
            )
          );
          table.onSelectAllRows(false, []);
        })
        .catch((err) => {
          toast.error(err?.message || 'Erro ao atualizar status');
        })
        .finally(() => {
          setBulkStatusProcessing(false);
        });
    },
    [organizationId, table.selected, table.onSelectAllRows]
  );

  const handleNewFormOpen = useCallback(() => {
    setNewFormName('');
    setNewFormEntity('material');
    setNewFormOpen(true);
  }, []);

  const handleNewFormClose = useCallback(() => {
    if (!newFormSubmitting) {
      setNewFormOpen(false);
      setNewFormName('');
      setNewFormEntity('material');
    }
  }, [newFormSubmitting]);

  const handleNewFormSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (!organizationId) {
        toast.error('Selecione uma organização.');
        return;
      }
      const trimmedName = newFormName.trim();
      if (!trimmedName) {
        toast.error('Informe o nome do formulário.');
        return;
      }
      setNewFormSubmitting(true);
      try {
        const result = await createOrganizationForm(organizationId, {
          name: trimmedName,
          entity: newFormEntity,
        });
        toast.success('Formulário criado com sucesso!');
        setNewFormOpen(false);
        setNewFormName('');
        setNewFormEntity('material');
        const formId = result?.data?.form?.id;
        if (formId) {
          navigate(paths.dashboard.forms.edit(formId));
        } else {
          loadForms();
        }
      } catch (err) {
        toast.error(err?.message || 'Erro ao criar formulário.');
      } finally {
        setNewFormSubmitting(false);
      }
    },
    [organizationId, newFormName, newFormEntity, loadForms]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Formulários"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Formulários' },
          ]}
          action={
            <Button
              variant="contained"
              disabled={!organizationId}
              startIcon={<Iconify icon="solar:add-circle-bold-duotone" />}
              onClick={handleNewFormOpen}
            >
              Novo formulário
            </Button>
          }
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
                      (tab.value === 'all' || tab.value === filters.state.status) ? 'filled' : 'soft'
                    }
                    color={
                      (tab.value === 'active' && 'success') ||
                      (tab.value === 'inactive' && 'default') ||
                      'default'
                    }
                  >
                    {['active', 'inactive'].includes(tab.value)
                      ? tableData.filter((row) => (row.status ?? 'active') === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <FormTableToolbar filters={filters} onResetPage={table.onResetPage} />

          {canReset && (
            <FormTableFiltersResult
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
                  {(bulkDeleting || bulkStatusProcessing) && (
                    <CircularProgress size={24} color="primary" sx={{ mr: 0.5 }} />
                  )}
                  <Tooltip title="Ativar">
                    <IconButton
                      color="primary"
                      disabled={bulkDeleting || bulkStatusProcessing}
                      onClick={() => handleBulkStatusChange('active')}
                    >
                      <Iconify icon="solar:user-check-bold" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Desativar">
                    <IconButton
                      color="primary"
                      disabled={bulkDeleting || bulkStatusProcessing}
                      onClick={() => handleBulkStatusChange('inactive')}
                    >
                      <Iconify icon="solar:user-minus-bold" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      color="error"
                      disabled={bulkDeleting || bulkStatusProcessing}
                      onClick={() => confirm.onTrue()}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 920 }}>
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
                    <FormTableSkeleton
                      rows={table.rowsPerPage}
                      dense={table.dense}
                    />
                  ) : (
                    dataInPage.map((row) => (
                      <FormTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onEditRow={handleEditRow}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onStatusChange={handleStatusChange}
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
            formulário(s)?
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

      <Dialog open={newFormOpen} onClose={handleNewFormClose} maxWidth="xs" fullWidth>
        <form onSubmit={handleNewFormSubmit}>
          <DialogTitle>Novo formulário</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <TextField
                autoFocus
                fullWidth
                label="Nome do formulário"
                value={newFormName}
                onChange={(e) => setNewFormName(e.target.value)}
              />
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Qual tipo de entidade?
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                  {ENTITY_OPTIONS.map((opt) => (
                    <EntityOptionCard
                      key={opt.value}
                      option={opt}
                      selected={newFormEntity}
                      onClick={setNewFormEntity}
                    />
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleNewFormClose} disabled={newFormSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={newFormSubmitting}>
              {newFormSubmitting ? 'Salvando…' : 'Salvar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
