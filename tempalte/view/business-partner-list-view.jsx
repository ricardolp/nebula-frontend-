import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import axios, { endpoints } from 'src/utils/axios';
import { DashboardContent } from 'src/layouts/dashboard';
import { varAlpha } from 'src/theme/styles';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Skeleton } from '@mui/material';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { BusinessPartnerTableRow } from '../business-partner-table-row';
import { BusinessPartnerTableToolbar } from '../business-partner-table-toolbar';
import { BusinessPartnerTableFiltersResult } from '../business-partner-table-filters-result';
import { BusinessPartnerTableSkeleton } from '../business-partner-table-skeleton';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INTEGRATED', label: 'Integrated' },
];

const TIPO_OPTIONS = ['SOCI', 'TERC'];

const TABLE_HEAD = [
  { id: 'nomeNomeFantasia', label: 'Nome / Razão Social' },
  { id: 'cnpj', label: 'CNPJ/CPF', width: 180 },
  { id: 'telefone', label: 'Telefone', width: 150 },
  { id: 'tipo', label: 'Tipo', width: 180 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

/**
 * Business Partner List View
 * Exibe listagem de parceiros de negócio com paginação e filtros
 */
export function BusinessPartnerListView() {
  const table = useTable();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    DRAFT: 0,
    ACTIVE: 0,
    INTEGRATED: 0,
  });

  const filters = useSetState({ name: '', tipo: [], status: 'all' });

  const canReset =
    !!filters.state.name || filters.state.tipo.length > 0 || filters.state.status !== 'all';

  const notFound = (!tableData.length && canReset) || !tableData.length;

  /**
   * Busca contagens por status
   * NOTA: Como registros vêm com status: null, tratamos null como DRAFT
   * e fazemos a contagem considerando os filtros aplicados (nome, tipo)
   */
  const fetchStatusCounts = useCallback(async () => {
    try {
      setLoadingCounts(true);
      
      // Busca TODOS os registros (com paginação grande) respeitando filtros de nome/tipo
      const params = { page: 1, limit: 10000 };
      if (filters.state.name) params.search = filters.state.name;
      if (filters.state.tipo.length > 0) params.tipo = filters.state.tipo.join(',');
      
      const response = await axios.get(endpoints.businessPartners.list, { params });
      let allData = response.data.data || [];
      
      // Aplica filtro de busca local também nas contagens
      if (filters.state.name) {
        const searchTerm = filters.state.name.toLowerCase();
        allData = allData.filter((item) => {
          const termo1 = (item.termo_pesquisa1 || '').toLowerCase();
          const termo2 = (item.termo_pesquisa2 || '').toLowerCase();
          const nome = (item.nome_nome_fantasia || '').toLowerCase();
          const razaoSocial = (item.sobrenome_razao_social || '').toLowerCase();
          const cnpj = (item.identificacao?.cnpj || '').toLowerCase();
          const cpf = (item.identificacao?.cpf || '').toLowerCase();
          const telefone = (item.comunicacao?.telefone || '').toLowerCase();
          
          return (
            termo1.includes(searchTerm) ||
            termo2.includes(searchTerm) ||
            nome.includes(searchTerm) ||
            razaoSocial.includes(searchTerm) ||
            cnpj.includes(searchTerm) ||
            cpf.includes(searchTerm) ||
            telefone.includes(searchTerm)
          );
        });
      }
      
      // Conta por status, tratando null como DRAFT
      const counts = { all: allData.length, DRAFT: 0, ACTIVE: 0, INTEGRATED: 0 };
      
      allData.forEach((item) => {
        // Normaliza o status: null ou vazio vira DRAFT
        const itemStatus = item.status || 'DRAFT';
        const normalizedStatus = itemStatus.toUpperCase();
        
        if (counts[normalizedStatus] !== undefined) {
          counts[normalizedStatus] += 1;
        }
      });

      setStatusCounts(counts);
    } catch (error) {
      console.error('Erro ao buscar contagens de status:', error);
      // Em caso de erro, usa o total geral
      setStatusCounts({
        all: totalItems,
        DRAFT: totalItems,
        ACTIVE: 0,
        INTEGRATED: 0,
      });
    } finally {
      setLoadingCounts(false);
    }
  }, [filters.state.name, filters.state.tipo, totalItems]);

  /**
   * Busca parceiros de negócio da API
   * IMPORTANTE: Como o backend não filtra por status (todos são null),
   * quando houver filtro de status, buscamos TODOS os registros e filtramos localmente
   */
  const fetchBusinessPartners = useCallback(async () => {
    try {
      setLoading(true);

      // Se houver filtro de status OU busca por nome, precisamos buscar todos e filtrar localmente
      const hasStatusFilter = filters.state.status !== 'all';
      const hasSearchFilter = !!filters.state.name;
      const needsLocalFilter = hasStatusFilter || hasSearchFilter;
      
      const params = needsLocalFilter
        ? { page: 1, limit: 10000 } // Busca todos para filtrar localmente
        : { page: table.page + 1, limit: table.rowsPerPage }; // Paginação normal

      // Adiciona filtros na query (backend também filtra o que conseguir)
      if (filters.state.name) {
        params.search = filters.state.name;
      }

      if (filters.state.tipo.length > 0) {
        params.tipo = filters.state.tipo.join(',');
      }

      const response = await axios.get(endpoints.businessPartners.list, { params });

      // A API retorna { data: [...], pagination: { total, page, ... } }
      if (response.data) {
        let businessPartners = response.data.data || [];
        
        // FILTRO LOCAL ADICIONAL: Busca em termo_pesquisa1 e termo_pesquisa2
        // (Reforça a busca do backend buscando também localmente)
        if (hasSearchFilter) {
          const searchTerm = filters.state.name.toLowerCase();
          businessPartners = businessPartners.filter((item) => {
            const termo1 = (item.termo_pesquisa1 || '').toLowerCase();
            const termo2 = (item.termo_pesquisa2 || '').toLowerCase();
            const nome = (item.nome_nome_fantasia || '').toLowerCase();
            const razaoSocial = (item.sobrenome_razao_social || '').toLowerCase();
            const cnpj = (item.identificacao?.cnpj || '').toLowerCase();
            const cpf = (item.identificacao?.cpf || '').toLowerCase();
            const telefone = (item.comunicacao?.telefone || '').toLowerCase();
            
            return (
              termo1.includes(searchTerm) ||
              termo2.includes(searchTerm) ||
              nome.includes(searchTerm) ||
              razaoSocial.includes(searchTerm) ||
              cnpj.includes(searchTerm) ||
              cpf.includes(searchTerm) ||
              telefone.includes(searchTerm)
            );
          });
        }
        
        // FILTRO LOCAL por status (tratando null como DRAFT)
        if (hasStatusFilter) {
          businessPartners = businessPartners.filter((item) => {
            const itemStatus = (item.status || 'DRAFT').toUpperCase();
            return itemStatus === filters.state.status;
          });
        }

        // Se houver qualquer filtro local, aplica paginação manual
        if (needsLocalFilter) {
          const startIndex = table.page * table.rowsPerPage;
          const endIndex = startIndex + table.rowsPerPage;
          const paginatedData = businessPartners.slice(startIndex, endIndex);
          
          setTableData(paginatedData);
          setTotalItems(businessPartners.length); // Total de registros filtrados
        } else {
          setTableData(businessPartners);
          setTotalItems(response.data.pagination?.total || 0);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar parceiros de negócio:', error);
      toast.error('Erro ao carregar parceiros de negócio');
    } finally {
      setLoading(false);
    }
  }, [table.page, table.rowsPerPage, filters.state]);

  useEffect(() => {
    fetchBusinessPartners();
    fetchStatusCounts();
  }, [fetchBusinessPartners, fetchStatusCounts]);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        await axios.delete(endpoints.businessPartners.delete(id));

        toast.success('Delete success!');

        fetchBusinessPartners();
        fetchStatusCounts();
      } catch (error) {
        console.error('Erro ao deletar parceiro de negócio:', error);
        toast.error('Erro ao deletar parceiro de negócio');
      }
    },
    [fetchBusinessPartners, fetchStatusCounts]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      await Promise.all(
        table.selected.map((id) => axios.delete(endpoints.businessPartners.delete(id)))
      );

      toast.success('Delete success!');

      table.onUpdatePageDeleteRows({
        totalRowsInPage: tableData.length,
        totalRowsFiltered: totalItems,
      });

      fetchBusinessPartners();
      fetchStatusCounts();
    } catch (error) {
      console.error('Erro ao deletar parceiros de negócio:', error);
      toast.error('Erro ao deletar parceiros de negócio');
    }
  }, [table, tableData.length, totalItems, fetchBusinessPartners, fetchStatusCounts]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.businessPartner.edit(id));
    },
    [router]
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
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Parceiros de Negócio', href: paths.dashboard.businessPartner.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.businessPartner.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Novo parceiro
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
                  loadingCounts ? (
                    <Skeleton 
                      variant="rounded" 
                      width={32} 
                      height={22} 
                      sx={{ borderRadius: 1.5 }} 
                    />
                  ) : (
                    <Label
                      variant={
                        ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                        'soft'
                      }
                      color={
                        (tab.value === 'DRAFT' && 'warning') ||
                        (tab.value === 'ACTIVE' && 'success') ||
                        (tab.value === 'INTEGRATED' && 'info') ||
                        'default'
                      }
                    >
                      {statusCounts[tab.value] || 0}
                    </Label>
                  )
                }
              />
            ))}
          </Tabs>

          <BusinessPartnerTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ tipos: TIPO_OPTIONS }}
          />

          {canReset && (
            <BusinessPartnerTableFiltersResult
              filters={filters}
              totalResults={totalItems}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

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
                <Tooltip title="Delete">
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
                  {loading && <BusinessPartnerTableSkeleton rows={table.rowsPerPage} />}

                  {!loading &&
                    tableData.map((row) => (
                      <BusinessPartnerTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                      />
                    ))}

                  {!loading && (
                    <TableEmptyRows
                      height={table.dense ? 56 : 56 + 20}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, totalItems)}
                    />
                  )}

                  {!loading && <TableNoData notFound={notFound} />}
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={totalItems}
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
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
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
            Delete
          </Button>
        }
      />
    </>
  );
}

