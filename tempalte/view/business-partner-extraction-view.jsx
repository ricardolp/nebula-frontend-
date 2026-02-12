import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
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

import { MigrationTableRow } from '../migration-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', width: 80 },
  { id: 'origem', label: 'Origem', width: 180 },
  { id: 'codigo_do_parceiro', label: 'Código', width: 120 },
  { id: 'razao_social_nome', label: 'Nome/Razão Social', width: 250 },
  { id: 'cnpj_cpf', label: 'CPF/CNPJ', width: 150 },
  { id: 'tipo_juridico', label: 'Tipo', width: 100 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'empresa', label: 'Empresa', width: 100 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

/**
 * Business Partner Extraction View
 * Tela de extração/visualização de dados do sistema legado antes da migração
 */
export function BusinessPartnerExtractionView() {
  const table = useTable();

  const confirmSelected = useBoolean();
  const confirmAll = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [executing, setExecuting] = useState(false);

  /**
   * Busca dados de preview da migração
   */
  const fetchMigrationData = useCallback(async () => {
    try {
      setLoading(true);

      const payload = {
        entityType: 'BUSINESS_PARTNERS',
        sourceTable: 'tb_parceiros_unificados',
        page: table.page + 1, // API usa page baseada em 1
        pageSize: table.rowsPerPage,
      };

      const response = await axios.post(endpoints.migration.preview, payload);

      if (response.data.success) {
        setTableData(response.data.data.data || []);
        setTotalItems(response.data.data.pagination?.total || 0);
        if (!hasSearched) {
          toast.success(`${response.data.data.pagination?.total || 0} registros encontrados`);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados de migração:', error);
      toast.error('Erro ao buscar dados de migração');
      setTableData([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [table.page, table.rowsPerPage, hasSearched]);

  /**
   * Handler para o botão buscar inicial
   */
  const handleSearch = useCallback(() => {
    setHasSearched(true);
  }, []);

  /**
   * Busca dados quando a página muda
   */
  useEffect(() => {
    if (hasSearched) {
      fetchMigrationData();
    }
  }, [fetchMigrationData, hasSearched]);

  /**
   * Executa a migração dos registros selecionados
   */
  const handleExecuteSelected = useCallback(async () => {
    try {
      setExecuting(true);

      const payload = {
        entityType: 'BUSINESS_PARTNERS',
        sourceTable: 'tb_parceiros_unificados',
        selectedIds: table.selected,
        skipExisting: true,
      };

      const response = await axios.post(endpoints.migration.extractSelected, payload);

      if (response.data.success) {
        toast.success(`${table.selected.length} registro(s) migrado(s) com sucesso!`);
        table.onSelectAllRows(false, []);
        fetchMigrationData(); // Recarrega os dados
      }
    } catch (error) {
      console.error('Erro ao executar migração:', error);
      toast.error(error.message || 'Erro ao executar migração');
    } finally {
      setExecuting(false);
      confirmSelected.onFalse();
    }
  }, [table, fetchMigrationData, confirmSelected]);

  /**
   * Executa a migração de TODOS os registros
   */
  const handleExecuteAll = useCallback(async () => {
    try {
      setExecuting(true);

      const payload = {
        entityType: 'BUSINESS_PARTNERS',
        sourceTable: 'tb_parceiros_unificados',
        batchSize: 50,
        skipExisting: true,
      };

      const response = await axios.post(endpoints.migration.extractAll, payload);

      if (response.data.success) {
        toast.success(`Todos os registros foram migrados com sucesso!`);
        table.onSelectAllRows(false, []);
        fetchMigrationData(); // Recarrega os dados
      }
    } catch (error) {
      console.error('Erro ao executar migração:', error);
      toast.error(error.message || 'Erro ao executar migração');
    } finally {
      setExecuting(false);
      confirmAll.onFalse();
    }
  }, [table, fetchMigrationData, confirmAll]);

  const notFound = !tableData.length && hasSearched;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Extração - Sistema Legado"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Parceiros de Negócio', href: paths.dashboard.businessPartner.root },
          { name: 'Extração' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {!hasSearched && (
        <Card sx={{ p: 5, textAlign: 'center' }}>
          <Stack spacing={3} alignItems="center">
            <Iconify icon="solar:database-bold-duotone" width={80} sx={{ color: 'primary.main' }} />
            
            <Typography variant="h5">
              Visualizar Dados do Sistema Legado
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600 }}>
              Clique no botão abaixo para buscar e visualizar os dados do sistema legado que serão
              migrados para o novo sistema.
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<Iconify icon="solar:magnifer-bold" />}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Buscando...' : 'Buscar Dados'}
            </Button>
          </Stack>
        </Card>
      )}

      {hasSearched && (
        <Card>
          <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6">
              Dados Extraídos ({totalItems} registros)
            </Typography>
            
            <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:refresh-bold" />}
                onClick={fetchMigrationData}
                disabled={loading || executing}
            >
              Atualizar
            </Button>
              
              <Button
                variant="contained"
                color="success"
                startIcon={<Iconify icon="solar:database-bold" />}
                onClick={confirmAll.onTrue}
                disabled={loading || executing || totalItems === 0}
              >
                Migrar Todos ({totalItems})
              </Button>
            </Stack>
          </Box>

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
                <Tooltip title="Migrar Selecionados">
                  <IconButton color="primary" onClick={confirmSelected.onTrue} disabled={executing}>
                    <Iconify icon="solar:import-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1200 }}>
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
                    <TableRow>
                      <TableCell colSpan={TABLE_HEAD.length + 1} align="center" sx={{ py: 10 }}>
                        <Stack alignItems="center" spacing={2}>
                          <Iconify 
                            icon="svg-spinners:blocks-shuffle-3" 
                            width={64} 
                            sx={{ color: 'primary.main' }} 
                          />
                          <Typography variant="body2" color="text.secondary">
                            Carregando dados...
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ) : (
                     <>
                       {tableData.map((row) => (
                         <MigrationTableRow
                           key={row.id}
                           row={row}
                           selected={table.selected.includes(row.id)}
                           onSelectRow={() => table.onSelectRow(row.id)}
                         />
                       ))}

                      <TableEmptyRows
                        height={table.dense ? 56 : 56 + 20}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, totalItems)}
                      />

                      <TableNoData notFound={notFound} />
                    </>
                  )}
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
       )}

       {/* Diálogo de confirmação - Migrar Selecionados */}
       <ConfirmDialog
         open={confirmSelected.value}
         onClose={confirmSelected.onFalse}
         title="Migrar Registros Selecionados"
         content={
           <>
             Deseja migrar <strong>{table.selected.length}</strong> registro(s) selecionado(s)?
             <br />
             <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
               Esta ação irá criar/atualizar os parceiros de negócio selecionados no sistema.
             </Typography>
           </>
         }
         action={
           <Button
             variant="contained"
             color="primary"
             onClick={handleExecuteSelected}
             disabled={executing}
             startIcon={executing ? <Iconify icon="svg-spinners:blocks-shuffle-3" /> : <Iconify icon="solar:import-bold" />}
           >
             {executing ? 'Migrando...' : 'Migrar'}
           </Button>
         }
       />

       {/* Diálogo de confirmação - Migrar Todos */}
       <ConfirmDialog
         open={confirmAll.value}
         onClose={confirmAll.onFalse}
         title="Migrar Todos os Registros"
         content={
           <>
             Deseja migrar <strong>TODOS os {totalItems}</strong> registros?
             <br />
             <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block', fontWeight: 600 }}>
               ⚠️ Atenção: Esta ação irá processar todos os registros da tabela em lotes de 50.
             </Typography>
             <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
               Esta operação pode levar alguns minutos dependendo da quantidade de registros.
             </Typography>
           </>
         }
         action={
           <Button
             variant="contained"
             color="success"
             onClick={handleExecuteAll}
             disabled={executing}
             startIcon={executing ? <Iconify icon="svg-spinners:blocks-shuffle-3" /> : <Iconify icon="solar:database-bold" />}
           >
             {executing ? 'Migrando...' : 'Migrar Todos'}
           </Button>
         }
       />
    </DashboardContent>
  );
}
