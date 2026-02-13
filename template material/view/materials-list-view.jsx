import { useState, useEffect, useCallback, useMemo } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// Actions para buscar dados reais da API
import { 
  useGetMaterials, 
  deleteMaterial, 
  toggleMaterialStatus 
} from 'src/actions/materials';

import { MaterialsTableToolbar } from '../table/materials-table-toolbar';
import { MaterialsTableFiltersResult } from '../table/materials-table-filters-result';
import { MaterialsDataGridSkeleton } from '../table/materials-table-skeleton';
import {
  RenderCellMaterial,
  RenderCellStatus,
  RenderCellType,
  RenderCellCreatedAt,
} from '../table/materials-table-row';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
];

const TIPO_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'FERT', label: 'Produto Acabado' },
  { value: 'HALB', label: 'Semiacabado' },
  { value: 'ROH', label: 'Matéria-prima' },
  { value: 'HIBE', label: 'Material de embalagem' },
  { value: 'VERP', label: 'Material de embalagem' },
];

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function MaterialsListView() {
  const confirmRows = useBoolean();

  const router = useRouter();

  const filters = useSetState({ status: [], matl_type: [] });

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [filterButtonEl, setFilterButtonEl] = useState(null);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  // Estados para paginação
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Parâmetros para a API baseados nos filtros
  const apiParams = useMemo(() => ({
    page: paginationModel.page + 1, // API usa página baseada em 1
    limit: paginationModel.pageSize,
    matl_type: filters.state.matl_type.length > 0 ? filters.state.matl_type[0] : undefined,
    status: filters.state.status.length > 0 ? (filters.state.status[0] === 'active' ? '1' : '0') : undefined,
  }), [paginationModel.page, paginationModel.pageSize, filters.state.matl_type, filters.state.status]);

  // Buscar dados reais da API
  const {
    materials,
    materialsLoading,
    materialsError,
    pagination
  } = useGetMaterials(apiParams);

  const canReset = filters.state.status.length > 0 || filters.state.matl_type.length > 0;

  // Aplicar filtros locais (busca rápida) - apenas para busca de texto
  const dataFiltered = applyFilter({ inputData: materials || [], filters: filters.state });

  // Recarregar dados quando os filtros mudarem
  useEffect(() => {
    // Os dados serão recarregados automaticamente pelo hook useGetMaterials
    // quando apiParams mudar
  }, [apiParams.page, apiParams.limit, apiParams.matl_type, apiParams.status]);

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const result = await deleteMaterial(id);
        
        if (result.success) {
          toast.success('Material excluído com sucesso!');
          // Os dados serão recarregados automaticamente pelo hook
        } else {
          toast.error(result.error || 'Erro ao excluir material');
        }
      } catch (error) {
        toast.error('Erro ao excluir material');
        console.error('Erro ao excluir material:', error);
      }
    },
    []
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      // Deletar múltiplos materiais
      const deletePromises = selectedRowIds.map(id => deleteMaterial(id));
      const results = await Promise.all(deletePromises);
      
      const successCount = results.filter(result => result.success).length;
      const errorCount = results.length - successCount;
      
      if (successCount > 0) {
        toast.success(`${successCount} material(is) excluído(s) com sucesso!`);
      }
      
      if (errorCount > 0) {
        toast.error(`${errorCount} material(is) não puderam ser excluídos`);
      }
      
      // Limpar seleção
      setSelectedRowIds([]);
    } catch (error) {
      toast.error('Erro ao excluir materiais');
      console.error('Erro ao excluir materiais:', error);
    }
  }, [selectedRowIds]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.materials.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.materials.view(id));
    },
    [router]
  );

  const handleToggleStatus = useCallback(
    async (id) => {
      try {
        // Encontrar o material atual para obter o status
        const currentMaterial = materials?.find(material => material.id === id);
        if (!currentMaterial) {
          toast.error('Material não encontrado');
          return;
        }

        const newStatus = currentMaterial.isActive !== '1';
        const result = await toggleMaterialStatus(id, newStatus);
        
        if (result.success) {
          toast.success('Status atualizado com sucesso!');
          // Os dados serão recarregados automaticamente pelo hook
        } else {
          toast.error(result.error || 'Erro ao atualizar status');
        }
      } catch (error) {
        toast.error('Erro ao atualizar status');
        console.error('Erro ao atualizar status:', error);
      }
    },
    [materials]
  );

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.state, selectedRowIds]
  );

  const columns = [
    {
      field: 'material',
      headerName: 'Código',
      flex: 1,
      minWidth: 120,
      hideable: false,
      renderCell: (params) => (
        <RenderCellMaterial params={params} onViewRow={() => handleViewRow(params.row.id)} />
      ),
    },
    {
      field: 'codigo_sap',
      headerName: 'Código SAP',
      width: 120,
    },
    {
      field: 'matl_type',
      headerName: 'Tipo',
      width: 120,
      type: 'singleSelect',
      valueOptions: TIPO_OPTIONS,
      renderCell: (params) => <RenderCellType params={params} />,
    },
    {
      field: 'matl_desc',
      headerName: 'Descrição',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'division',
      headerName: 'Divisão',
      width: 100,
    },
    {
      field: 'plant',
      headerName: 'Planta',
      width: 100,
    },
    {
      field: 'sales_org',
      headerName: 'Org. Vendas',
      width: 120,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      type: 'singleSelect',
      valueOptions: STATUS_OPTIONS,
      renderCell: (params) => <RenderCellStatus params={params} />,
    },
    {
      field: 'createdAt',
      headerName: 'Criado em',
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Visualizar"
          onClick={() => handleViewRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Editar"
          onClick={() => handleEditRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Excluir"
          onClick={() => {
            handleDeleteRow(params.row.id);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  // Mostrar erro se houver problema na API
  useEffect(() => {
    if (materialsError) {
      toast.error(`Erro ao carregar materiais: ${materialsError}`);
    }
  }, [materialsError]);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Materiais"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Materiais', href: paths.dashboard.materials.root },
            { name: 'Lista' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.materials.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Novo Material
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: 2 },
            flexDirection: { md: 'column' },
          }}
        >
          {materialsLoading ? (
            <MaterialsDataGridSkeleton amount={paginationModel.pageSize} />
          ) : (
            <DataGrid
              checkboxSelection
              disableRowSelectionOnClick
              rows={dataFiltered}
              columns={columns}
              loading={false}
              getRowHeight={() => 'auto'}
              pageSizeOptions={[5, 10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              rowCount={pagination?.total || 0}
              paginationMode="server"
              onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
              columnVisibilityModel={columnVisibilityModel}
              onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
              slots={{
                toolbar: CustomToolbarCallback,
                noRowsOverlay: () => <EmptyContent title="Nenhum material encontrado" />,
                noResultsOverlay: () => <EmptyContent title="Nenhum resultado encontrado" />,
              }}
              slotProps={{
                panel: { anchorEl: filterButtonEl },
                toolbar: { setFilterButtonEl },
                columnsManagement: { getTogglableColumns },
              }}
              sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
            />
          )}
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Excluir"
        content={
          <>
            Tem certeza que deseja excluir <strong> {selectedRowIds.length} </strong> materiais?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Excluir
          </Button>
        }
      />
    </>
  );
}

function CustomToolbar({
  filters,
  canReset,
  selectedRowIds,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
}) {
  return (
    <>
      <GridToolbarContainer>
        <MaterialsTableToolbar
          filters={filters}
          options={{ status: STATUS_OPTIONS, matl_type: TIPO_OPTIONS }}
        />

        <GridToolbarQuickFilter />

        <Stack
          spacing={1}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={onOpenConfirmDeleteRows}
            >
              Excluir ({selectedRowIds.length})
            </Button>
          )}

          <GridToolbarColumnsButton />
          <GridToolbarFilterButton ref={setFilterButtonEl} />
          <GridToolbarExport />
        </Stack>
      </GridToolbarContainer>

      {canReset && (
        <MaterialsTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
    </>
  );
}

function applyFilter({ inputData, filters }) {
  const { status, matl_type, search } = filters;

  let filtered = inputData;

  // Filtro por status (aplicado localmente apenas para busca rápida)
  if (status.length) {
    filtered = filtered.filter((material) => 
      status.includes(material.isActive === '1' ? 'active' : 'inactive')
    );
  }

  // Filtro por tipo (aplicado localmente apenas para busca rápida)
  if (matl_type.length) {
    filtered = filtered.filter((material) => matl_type.includes(material.matl_type));
  }

  // Filtro por busca de texto
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter((material) => 
      material.material?.toLowerCase().includes(searchLower) ||
      material.codigo_sap?.toLowerCase().includes(searchLower) ||
      material.matl_desc?.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}
