import { useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import { createMaterial } from 'src/actions/materials';

import { materialsSchema, materialsDefaultValues } from '../schema/materials-schema';
import { mapMaterialToDB } from '../utils/material-mapper';
import {
  MaterialBasicDataTab,
  MaterialClassificationTab,
  MaterialUnitsMeasuresTab,
  MaterialPurchasingTab,
  MaterialMrpTab,
  MaterialProductionTab,
  MaterialStorageTab,
  MaterialSalesDistributionTab,
  MaterialControllingTab,
} from '../tabs';

// ----------------------------------------------------------------------

// 9 TABS conforme especificação
const TABS = [
  { value: 'basic-data', label: 'Dados Básicos', icon: 'solar:document-text-bold' },
  { value: 'classification', label: 'Classificação', icon: 'solar:slider-minimalistic-bold' },
  { value: 'units-measures', label: 'Unidades e Medidas', icon: 'solar:ruler-bold' },
  { value: 'purchasing', label: 'Compras', icon: 'solar:cart-large-2-bold' },
  { value: 'mrp', label: 'Planejamento (MRP)', icon: 'solar:widget-5-bold' },
  { value: 'production', label: 'Produção', icon: 'solar:tuning-3-bold' },
  { value: 'storage', label: 'Armazenagem', icon: 'solar:box-minimalistic-bold' },
  { value: 'sales-distribution', label: 'Vendas/Distribuição', icon: 'solar:bag-4-bold' },
  { value: 'controlling', label: 'Controlling/Custos', icon: 'solar:calculator-minimalistic-bold' },
];

// ----------------------------------------------------------------------

export function MaterialsFormView() {
  const router = useRouter();
  const { selectedOrganizationId: organizationId } = useAuthContext();
  const [currentTab, setCurrentTab] = useState('basic-data');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    resolver: zodResolver(materialsSchema),
    defaultValues: materialsDefaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, reset, formState } = methods;

  // Handler para erros de validação
  const onError = (errors) => {
    console.error('❌ Erros de validação do formulário:', errors);
    
    // Contar erros por aba
    const errorsByTab = {};
    Object.keys(errors).forEach(field => {
      // Mapear campos para abas
      if (['material', 'matl_desc', 'matl_type', 'base_uom', 'division'].includes(field)) {
        errorsByTab['main-data'] = (errorsByTab['main-data'] || 0) + 1;
      } else if (['codigo_sap', 'matl_group', 'ind_sector'].includes(field)) {
        errorsByTab['basic-data'] = (errorsByTab['basic-data'] || 0) + 1;
      } else if (field.startsWith('pur_') || field.startsWith('stge_') || field.startsWith('plant')) {
        errorsByTab.purchasing = (errorsByTab.purchasing || 0) + 1;
      } else if (field.startsWith('mrp_') || field.startsWith('lotsize') || field.startsWith('proc_')) {
        errorsByTab.mrp = (errorsByTab.mrp || 0) + 1;
      } else if (field.startsWith('work_') || field.startsWith('prod_') || field.startsWith('under_') || field.startsWith('over_')) {
        errorsByTab['work-scheduling'] = (errorsByTab['work-scheduling'] || 0) + 1;
      } else if (field.startsWith('sales_') || field.startsWith('distr_') || field.startsWith('tax_')) {
        errorsByTab['sales-distribution'] = (errorsByTab['sales-distribution'] || 0) + 1;
      } else if (field.startsWith('bwkey') || field.startsWith('val_') || field.startsWith('price_') || field.startsWith('ml_')) {
        errorsByTab.controlling = (errorsByTab.controlling || 0) + 1;
      }
    });
    
    console.log('Erros por aba:', errorsByTab);
    
    // Mostrar mensagem com detalhes
    const totalErrors = Object.keys(errors).length;
    const errorMessage = `Formulário com ${totalErrors} erro(s). Verifique as abas: ${Object.keys(errorsByTab).join(', ')}`;
    
    toast.error(errorMessage, { duration: 8000 });
  };

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  // Função para verificar se uma aba tem erros
  const hasTabErrors = (tabValue) => {
    const { errors } = formState;
    if (!errors) return false;
    
    switch (tabValue) {
      case 'basic-data':
        // Tab 1: Dados Básicos - campos obrigatórios: material, indSector, matlType
        return ['material', 'codigoSap', 'matlDesc', 'indSector', 'matlType', 'oldMatNo', 'stdDescr', 'basicMatl', 'plRefMat', 'document', 'langu'].some(field => errors[field]);
      
      case 'classification':
        // Tab 2: Classificação - campo obrigatório: matlGroup
        return ['matlGroup', 'extmatlgrp', 'division', 'prodHier', 'itemCat', 'matGrpSm', 'purStatus', 'batchMgmt', 'eanUpc', 'physicalCommodity', 'abcId'].some(field => errors[field]);
      
      case 'units-measures':
        // Tab 3: Unidades e Medidas - campo obrigatório: baseUom
        return ['baseUom', 'altUnit', 'fatorAltUnit', 'fatorBaseUom', 'grossWt', 'netWeight', 'unitOfWt', 'volume', 'volumeunit'].some(field => errors[field]);
      
      case 'purchasing':
        // Tab 4: Compras - campo obrigatório: plant
        return ['plant', 'purGroup', 'purStatusMarc', 'poUnit', 'autoPOrd', 'purValkey', 'poText', 'storConds', 'minremlife', 'shelfLife', 'periodIndExpirationDate', 'sledBbd'].some(field => errors[field]);
      
      case 'mrp':
        // Tab 5: Planejamento (MRP)
        return ['mrpType', 'mrpCtrler', 'mrpGroup', 'reorderPt', 'lotsizekey', 'minlotsize', 'maxlotsize', 'fixedLot', 'roundVal', 'servLevel', 'maxStock', 'safetyStk', 'minSafetyStk', 'covprofile', 'bwdCons', 'consummode', 'fwdCons', 'replentime', 'depReqId', 'planStrgp'].some(field => errors[field]);
      
      case 'production':
        // Tab 6: Produção
        return ['procType', 'spproctype', 'backflush', 'jitRelvt', 'bulkMat', 'batchentry', 'inhseprodt', 'plndDelry', 'grPrTime', 'ppcPlCal', 'smKey', 'assyScrap', 'compScrap', 'repmanprof', 'repManuf', 'productionScheduler', 'prodprof', 'underTol', 'overTol', 'noCosting', 'sernoProf', 'lotSize', 'specprocty', 'prtUsage', 'ctrlKey', 'dbText'].some(field => errors[field]);
      
      case 'storage':
        // Tab 7: Armazenagem
        return ['stgeLoc', 'ctrlCode', 'stgeBin', 'availcheck', 'transGrp', 'loadinggrp', 'countryori', 'profitCtr', 'shMatTyp', 'matCfop', 'sdText', 'issStLoc', 'supplyArea', 'slocExprc'].some(field => errors[field]);
      
      case 'sales-distribution':
        // Tab 8: Vendas/Distribuição - campos obrigatórios: dwerk, lgort (dentro de salesDistribution)
        if (errors.salesDistribution) {
          return true;
        }
        return ['salesOrg', 'distrChan'].some(field => errors[field]);
      
      case 'controlling':
        // Tab 9: Controlling/Custos
        if (errors.controlling) {
          return true;
        }
        return ['valArea', 'valClass'].some(field => errors[field]);
      
      default:
        return false;
    }
  };

  // Função que recebe os dados validados do formulário
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      console.log('=== INICIANDO CADASTRO DE MATERIAL ===');
      console.log('Dados do formulário (camelCase):', data);
      
      // Converter dados do formulário para formato do banco
      const dbData = mapMaterialToDB(data);
      console.log('Dados convertidos para o banco (snake_case):', dbData);
      console.log('Validação do formulário:', methods.formState.isValid);
      console.log('Erros de validação:', methods.formState.errors);

      const result = await createMaterial(organizationId, dbData);
      
      console.log('Resultado da API:', result);

      if (result.success) {
        console.log('✅ Material criado com sucesso!');
        toast.success('Material criado com sucesso!');
        reset();
        router.push(paths.dashboard.materials.root);
      } else {
        console.error('❌ Erro ao criar material:', result.error);
        toast.error(result.error || 'Erro ao criar material');
      }
    } catch (error) {
      console.error('❌ Erro ao criar material:', error);
      toast.error('Erro ao criar material. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função que recebe os dados validados do formulário
  const onSaveAsDraft = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Converter dados do formulário para formato do banco
      const dbData = mapMaterialToDB(data);
      
      const draftData = {
        ...dbData,
        status_integracao: 'rascunho',
      };

      console.log('Material draft data (snake_case):', draftData);

      const result = await createMaterial(organizationId, draftData);

      if (result.success) {
        toast.success('Rascunho salvo com sucesso!');
        reset();
        router.push(paths.dashboard.materials.root);
      } else {
        toast.error(result.error || 'Erro ao salvar rascunho');
      }
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      toast.error('Erro ao salvar rascunho. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'basic-data':
        return <MaterialBasicDataTab />;
      case 'classification':
        return <MaterialClassificationTab />;
      case 'units-measures':
        return <MaterialUnitsMeasuresTab />;
      case 'purchasing':
        return <MaterialPurchasingTab />;
      case 'mrp':
        return <MaterialMrpTab />;
      case 'production':
        return <MaterialProductionTab />;
      case 'storage':
        return <MaterialStorageTab />;
      case 'sales-distribution':
        return <MaterialSalesDistributionTab />;
      case 'controlling':
        return <MaterialControllingTab />;
      default:
        return null;
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Novo Material"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Materiais', href: paths.dashboard.materials.root },
          { name: 'Novo Material' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FormProvider {...methods}>
        <form>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={currentTab}
                onChange={handleChangeTab}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ px: 3 }}
              >
                {TABS.map((tab) => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    label={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <span>{tab.label}</span>
                        {hasTabErrors(tab.value) && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'error.main',
                            }}
                          />
                        )}
                      </Stack>
                    }
                    icon={<Iconify icon={tab.icon} />}
                    iconPosition="start"
                    sx={{
                      color: hasTabErrors(tab.value) ? 'error.main' : 'inherit',
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              {renderTabContent()}
            </Box>
          </Card>

          {/* Botões de Ação */}
          <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
            <Button
              variant="outlined"
              size="large"
              disabled={isSubmitting}
              onClick={() => router.push(paths.dashboard.materials.root)}
            >
              Cancelar
            </Button>

            <Button
              variant="outlined"
              size="large"
              disabled={isSubmitting}
              onClick={handleSubmit(onSaveAsDraft, onError)}
              startIcon={<Iconify icon="solar:diskette-bold" />}
            >
              Salvar Rascunho
            </Button>

            <LoadingButton
              type="button"
              variant="contained"
              size="large"
              loading={isSubmitting}
              onClick={handleSubmit(onSubmit, onError)}
              startIcon={<Iconify icon="mingcute:check-line" />}
            >
              Criar Material
            </LoadingButton>
          </Stack>
        </form>
      </FormProvider>
    </DashboardContent>
  );
}
