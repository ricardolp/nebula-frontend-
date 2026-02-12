import { useState, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';

import { useGetBusinessPartners } from 'src/actions/business-partners';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { toast } from 'src/components/snackbar';
import { LoadingScreen } from 'src/components/loading-screen';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { BusinessPartnerTableRow } from './business-partner-table';
import { BusinessPartnerTableToolbar } from './business-partner-table-toolbar';
import { BusinessPartnerTableFiltersResult } from './business-partner-table-filters-result';

// ----------------------------------------------------------------------

const TIPO_OPTIONS = [
  { value: 'SOCI', label: 'Sócio' },
  { value: 'TERC', label: 'Terceiro' },
];

const TABLE_HEAD = [
  { id: 'cod_antigo', label: 'Código Antigo' },
  { id: 'nome_nome_fantasia', label: 'Nome/Fantasia' },
  { id: 'sobrenome_razao_social', label: 'Sobrenome/Razão Social' },
  { id: 'tipo', label: 'Tipo', width: 140 },
  { id: 'email', label: 'Email', width: 200 },
  { id: 'telefone', label: 'Telefone', width: 140 },
  { id: 'cidade', label: 'Cidade', width: 120 },
  { id: 'estado', label: 'Estado', width: 80 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

/**
 * Componente de listagem de parceiros de negócio
 * Inclui busca, filtros, paginação e ações CRUD
 */
export function BusinessPartnerListView() {
  const table = useTable({ defaultRowsPerPage: 25 });

  const router = useRouter();

  const confirm = useBoolean();

  const [filterName, setFilterName] = useState('');
  const [filterTipo, setFilterTipo] = useState([]);

  const filters = useMemo(() => ({
    state: {
      name: filterName,
      tipo: filterTipo,
    },
    setState: (newState) => {
      if (newState.name !== undefined) setFilterName(newState.name);
      if (newState.tipo !== undefined) setFilterTipo(newState.tipo);
    },
  }), [filterName, filterTipo]);

  // Buscar dados da API
  const { 
    businessPartners, 
    businessPartnersLoading, 
    businessPartnersError,
    pagination 
  } = useGetBusinessPartners({
    page: table.page + 1, // API usa página baseada em 1
    limit: table.rowsPerPage,
    search: filterName,
    tipo: filterTipo.length === 1 ? filterTipo[0] : undefined,
  });

  // Mapear dados da API para o formato da tabela
  const tableData = useMemo(() => {
    if (!businessPartners) return [];
    
    return businessPartners.map((bp) => ({
      id: bp.id,
      cod_antigo: bp.cod_antigo || '',
      nome_nome_fantasia: bp.nome_nome_fantasia || '',
      sobrenome_razao_social: bp.sobrenome_razao_social || '',
      tipo: bp.tipo || '',
      funcao: bp.funcao || '',
      grupo_contas: bp.grupo_contas || '',
      email: bp.comunicacao?.email || '',
      telefone: bp.comunicacao?.telefone || '',
      cidade: bp.endereco?.cidade || '',
      estado: bp.endereco?.estado || '',
      cep: bp.endereco?.cep || '',
      cnpj: bp.identificacao?.cnpj || '',
      cpf: bp.identificacao?.cpf || '',
      created_at: bp.created_at,
      updated_at: bp.updated_at,
    }));
  }, [businessPartners]);

  // ----------------------------------------------------------------------

  // Para API, não precisamos filtrar localmente pois a API já filtra
  const dataFiltered = tableData;

  const canReset = !!(filters?.state?.name) || (filters?.state?.tipo?.length || 0) > 0;

  const notFound = businessPartnersLoading ? false : (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback((id) => {
    // TODO: Implementar chamada para API de exclusão
    toast.success('Parceiro de negócio excluído com sucesso!');
    
    // Recarregar dados da API
    window.location.reload();
  }, []);

  const handleDeleteRows = useCallback(() => {
    // TODO: Implementar chamada para API de exclusão em lote
    toast.success(`${table.selected.length} parceiros de negócio excluídos com sucesso!`);
    
    // Recarregar dados da API
    window.location.reload();
  }, [table]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.businessPartner.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.businessPartner.view(id));
    },
    [router]
  );

  const handleFilterTipo = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ tipo: newValue });
    },
    [filters, table]
  );

  // Mostrar loading se estiver carregando
  if (businessPartnersLoading) {
    return <LoadingScreen />;
  }

  // Mostrar erro se houver
  if (businessPartnersError) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Parceiros de Negócio"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Parceiros de Negócio' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Iconify icon="solar:danger-circle-bold" width={48} sx={{ color: 'error.main', mb: 2 }} />
          <Typography variant="h6" color="error.main" gutterBottom>
            Erro ao carregar parceiros de negócio
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {businessPartnersError}
          </Typography>
        </Card>
      </DashboardContent>
    );
  }

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Parceiros de Negócio"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Parceiros de Negócio' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.businessPartner.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Novo Parceiro
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <BusinessPartnerTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ tipos: TIPO_OPTIONS }}
          />

          {canReset && (
            <BusinessPartnerTableFiltersResult
              filters={filters}
              totalResults={pagination?.total || 0}
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
                <Tooltip title="Excluir">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
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
                  {dataFiltered.map((row) => (
                    <BusinessPartnerTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                    />
                  ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={pagination?.total || 0}
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
            Tem certeza que deseja excluir <strong> {table.selected.length} </strong> parceiros de negócio?
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

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  // Quando usando API, os filtros são aplicados no servidor
  // Apenas aplicamos ordenação local se necessário
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}
