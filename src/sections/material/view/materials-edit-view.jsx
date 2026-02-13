import { useState, useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import { useGetMaterial, updateMaterial } from 'src/actions/materials';

import { materialsSchema } from '../schema/materials-schema';
import {
  MaterialMainDataTab,
  MaterialBasicDataTab,
  MaterialPurchasingTab,
  MaterialMrpTab,
  MaterialWorkSchedulingTab,
  MaterialSalesDistributionTab,
  MaterialControllingTab,
  MaterialSdCenterTab,
  MaterialTextsTab,
} from '../tabs';

// Schema mais flexível para edição
const materialsEditSchema = materialsSchema.partial();

// ----------------------------------------------------------------------

const TABS = [
  { value: 'main-data', label: 'Dados Principais', icon: 'solar:document-text-bold' },
  { value: 'basic-data', label: 'Dados Básicos', icon: 'solar:file-text-bold' },
  { value: 'purchasing', label: 'Compras', icon: 'solar:box-bold' },
  { value: 'mrp', label: 'MRP', icon: 'solar:calendar-bold' },
  { value: 'work-scheduling', label: 'Esquematização', icon: 'solar:settings-bold' },
  { value: 'sales-distribution', label: 'Vendas e Distribuição', icon: 'solar:shop-bold' },
  { value: 'controlling', label: 'Controlling', icon: 'solar:calculator-bold' },
  { value: 'sd-center', label: 'Dados SD/Centro', icon: 'solar:home-bold' },
  { value: 'texts', label: 'Textos', icon: 'solar:text-bold' },
];

// ----------------------------------------------------------------------

export function MaterialsEditView({ id }) {
  const router = useRouter();
  const { selectedOrganizationId: organizationId } = useAuthContext();
  const [currentTab, setCurrentTab] = useState('main-data');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar dados do material
  const { material, materialLoading, materialError } = useGetMaterial(id);

  const methods = useForm({
    resolver: zodResolver(materialsEditSchema),
    defaultValues: material || {},
    mode: 'onChange',
    shouldFocusError: false,
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  // Debug: verificar se o material está sendo carregado
  useEffect(() => {
    if (material) {
      console.log('Material carregado:', material);
      console.log('Form values:', methods.getValues());
      console.log('Form errors:', methods.formState.errors);
    }
  }, [material, methods]);

  const { handleSubmit, reset } = methods;

  // Atualizar form quando material carregar
  useEffect(() => {
    if (material) {
      console.log('Material carregado do banco:', material);
      
      // Função helper para converter valores do banco em boolean
      const toBoolean = (value) => {
        if (value === null || value === undefined || value === '' || value === '0' || value === 0) {
          return false;
        }
        if (value === true || value === 'true' || value === '1' || value === 1) {
          return true;
        }
        return false;
      };
      
      // Converter campos booleanos que podem vir como string, null ou number do banco
      const normalizedMaterial = {
        ...material,
        // Converter campos booleanos principais
        batch_mgmt: toBoolean(material.batch_mgmt),
        auto_p_ord: toBoolean(material.auto_p_ord),
        backflush: toBoolean(material.backflush),
        jit_relvt: toBoolean(material.jit_relvt),
        bulk_mat: toBoolean(material.bulk_mat),
        ml_active: toBoolean(material.ml_active),
        in_house: toBoolean(material.in_house),
        no_costing: toBoolean(material.no_costing),
        ml_settle: toBoolean(material.ml_settle),
        qty_struct: toBoolean(material.qty_struct),
        orig_mat: toBoolean(material.orig_mat),
        physical_commodity: toBoolean(material.physical_commodity),
        
        // Converter sales_distributions (array) para salesDistribution (objeto) para o formulário
        // IMPORTANTE: Usar camelCase porque o schema espera camelCase
        salesDistribution: material.sales_distributions?.[0] ? {
          vkorg: material.sales_distributions[0].vkorg || '',
          vtweg: material.sales_distributions[0].vtweg || '',
          spart: material.sales_distributions[0].spart || '',
          dwerk: material.sales_distributions[0].dwerk || '',
          lgort: material.sales_distributions[0].lgort || '',
          prctr: material.sales_distributions[0].prctr || '',
          ktgrm: material.sales_distributions[0].ktgrm || '',
          salesUnit: material.sales_distributions[0].sales_unit || '',     // snake_case → camelCase
          minOrder: material.sales_distributions[0].min_order || '',       // snake_case → camelCase
          minDely: material.sales_distributions[0].min_dely || '',         // snake_case → camelCase
          delyUnit: material.sales_distributions[0].dely_unit || '',       // snake_case → camelCase
          taxType1: material.sales_distributions[0].tax_type_1 || '',      // snake_case → camelCase
          taxclass1: material.sales_distributions[0].taxclass_1 || '',
          matlStats: material.sales_distributions[0].matl_stats || '',     // snake_case → camelCase
          rebateGrp: material.sales_distributions[0].rebate_grp || '',     // snake_case → camelCase
          commGroup: material.sales_distributions[0].comm_group || '',     // snake_case → camelCase
          matPrGrp: material.sales_distributions[0].mat_pr_grp || '',      // snake_case → camelCase
          acctAssgt: material.sales_distributions[0].acct_assgt || '',     // snake_case → camelCase
          cashDisc: material.sales_distributions[0].cash_disc || '',       // snake_case → camelCase
          roundProf: material.sales_distributions[0].round_prof || '',     // snake_case → camelCase
        } : {},
        
        // Converter controllings (array) para controlling (objeto) para o formulário
        // IMPORTANTE: Usar camelCase porque o schema espera camelCase
        controlling: material.controllings?.[0] ? {
          bwkey: material.controllings[0].bwkey || '',
          bwtar: material.controllings[0].bwtar || '',
          matKlass: material.controllings[0].mat_klass || '',  // snake_case → camelCase
          valArea: material.controllings[0].val_area || '',    // snake_case → camelCase
          valClass: material.controllings[0].val_class || '',  // snake_case → camelCase
          priceCtrl: material.controllings[0].price_ctrl || '', // snake_case → camelCase
          stdPrice: material.controllings[0].std_price || '',   // snake_case → camelCase
          priceUnit: material.controllings[0].price_unit || '', // snake_case → camelCase
          movingPrice: material.controllings[0].moving_price || '', // snake_case → camelCase
          priceDate: material.controllings[0].price_date || '',   // snake_case → camelCase
          mlActive: toBoolean(material.controllings[0].ml_active),  // snake_case → camelCase
          mlSettle: toBoolean(material.controllings[0].ml_settle),  // snake_case → camelCase
          originMat: toBoolean(material.controllings[0].origin_mat), // snake_case → camelCase
          originGroup: material.controllings[0].origin_group || '',  // snake_case → camelCase
          overheadGrp: material.controllings[0].overhead_grp || '',  // snake_case → camelCase
          profitCtr2: material.controllings[0].profit_ctr2 || '',
          qtyStruct: toBoolean(material.controllings[0].qty_struct), // snake_case → camelCase
          inHouse: toBoolean(material.controllings[0].in_house),     // snake_case → camelCase
          matUsage: material.controllings[0].mat_usage || '',        // snake_case → camelCase
          plndprice1: material.controllings[0].plndprice1 || '',
          plndprdate1: material.controllings[0].plndprdate1 || '',
          plndprice2: material.controllings[0].plndprice2 || '',
          plndprdate2: material.controllings[0].plndprdate2 || '',
          plndprice3: material.controllings[0].plndprice3 || '',
          plndprdate3: material.controllings[0].plndprdate3 || '',
        } : {},
      };
      
      console.log('=== DADOS NORMALIZADOS PARA O FORMULÁRIO ===');
      console.log('salesDistribution:', normalizedMaterial.salesDistribution);
      console.log('controlling:', normalizedMaterial.controlling);
      
      reset(normalizedMaterial);
    }
  }, [material, reset]);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  // Função para verificar se uma aba tem erros
  const hasTabErrors = (tabValue) => {
    const { errors } = methods.formState;
    if (!errors || Object.keys(errors).length === 0) return false;
    
    switch (tabValue) {
      case 'main-data':
        // Tab 1: Dados Principais (snake_case)
        return ['material', 'matl_desc', 'matl_type', 'base_uom', 'division'].some(field => errors[field]);
      
      case 'basic-data':
        // Tab 2: Dados Básicos (snake_case)
        return ['material', 'codigo_sap', 'matl_desc', 'ind_sector', 'matl_type', 'old_mat_no', 'std_descr', 'basic_matl', 'pl_ref_mat', 'document', 'langu', 'matl_group', 'extmatlgrp', 'division', 'prod_hier', 'item_cat', 'mat_grp_sm', 'pur_status', 'batch_mgmt', 'ean_upc', 'physical_commodity', 'abc_id', 'base_uom', 'alt_unit', 'fator_alt_unit', 'fator_base_uom', 'gross_wt', 'net_weight', 'unit_of_wt', 'volume', 'volumeunit'].some(field => errors[field]);
      
      case 'purchasing':
        // Tab 3: Compras (snake_case)
        return ['plant', 'pur_group', 'pur_status_marc', 'po_unit', 'auto_p_ord', 'pur_valkey', 'po_text', 'stor_conds', 'minremlife', 'shelf_life', 'period_ind_expiration_date', 'sled_bbd'].some(field => errors[field]);
      
      case 'mrp':
        // Tab 4: Planejamento MRP (snake_case)
        return ['mrp_type', 'mrp_ctrler', 'mrp_group', 'reorder_pt', 'lotsizekey', 'minlotsize', 'maxlotsize', 'fixed_lot', 'round_val', 'serv_level', 'max_stock', 'safety_stk', 'min_safety_stk', 'covprofile', 'bwd_cons', 'consummode', 'fwd_cons', 'replentime', 'dep_req_id', 'plan_strgp'].some(field => errors[field]);
      
      case 'work-scheduling':
        // Tab 5: Esquematização (snake_case)
        return ['proc_type', 'spproctype', 'backflush', 'jit_relvt', 'bulk_mat', 'batchentry', 'inhseprodt', 'plnd_delry', 'gr_pr_time', 'ppc_pl_cal', 'sm_key', 'assy_scrap', 'comp_scrap', 'repmanprof', 'rep_manuf', 'production_scheduler', 'prodprof', 'under_tol', 'over_tol', 'no_costing', 'serno_prof', 'lot_size', 'specprocty', 'prt_usage', 'ctrl_key', 'db_text', 'stge_loc', 'ctrl_code', 'stge_bin', 'availcheck', 'trans_grp', 'loadinggrp', 'countryori', 'profit_ctr', 'sh_mat_typ', 'mat_cfop', 'sd_text', 'iss_st_loc', 'supply_area', 'sloc_exprc'].some(field => errors[field]);
      
      case 'sales-distribution':
        // Tab 6: Vendas/Distribuição
        if (errors.sales_distributions) {
          return true;
        }
        return false;
      
      case 'controlling':
        // Tab 7: Controlling/Custos
        if (errors.controllings) {
          return true;
        }
        return false;
      
      case 'sd-center':
        // Tab 8: Dados SD/Centro
        return false;
      
      case 'texts':
        // Tab 9: Textos
        return false;
      
      default:
        return false;
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);

      console.log('Material form data (antes do mapper):', data);
      
      // Converter dados do formulário usando o mapper
      // Isso garante que salesDistribution → sales_distributions e controlling → controllings
      const dataToSend = {
        ...data,
        // Converter salesDistribution (objeto singular) para sales_distributions (array)
        // IMPORTANTE: Converter camelCase de volta para snake_case para o backend
        sales_distributions: data.salesDistribution ? [{
          vkorg: data.salesDistribution.vkorg || null,
          vtweg: data.salesDistribution.vtweg || null,
          spart: data.salesDistribution.spart || null,
          dwerk: data.salesDistribution.dwerk || null,
          lgort: data.salesDistribution.lgort || null,
          prctr: data.salesDistribution.prctr || null,
          ktgrm: data.salesDistribution.ktgrm || null,
          sales_unit: data.salesDistribution.salesUnit || null,    // camelCase → snake_case
          min_order: data.salesDistribution.minOrder || null,      // camelCase → snake_case
          min_dely: data.salesDistribution.minDely || null,        // camelCase → snake_case
          dely_unit: data.salesDistribution.delyUnit || null,      // camelCase → snake_case
          tax_type_1: data.salesDistribution.taxType1 || null,     // camelCase → snake_case
          taxclass_1: data.salesDistribution.taxclass1 || null,
          matl_stats: data.salesDistribution.matlStats || null,    // camelCase → snake_case
          rebate_grp: data.salesDistribution.rebateGrp || null,    // camelCase → snake_case
          comm_group: data.salesDistribution.commGroup || null,    // camelCase → snake_case
          mat_pr_grp: data.salesDistribution.matPrGrp || null,     // camelCase → snake_case
          acct_assgt: data.salesDistribution.acctAssgt || null,    // camelCase → snake_case
          cash_disc: data.salesDistribution.cashDisc || null,      // camelCase → snake_case
          round_prof: data.salesDistribution.roundProf || null,    // camelCase → snake_case
        }] : data.sales_distributions || [],
        // Converter controlling (objeto singular) para controllings (array)
        // IMPORTANTE: Converter camelCase de volta para snake_case para o backend
        controllings: data.controlling ? [{
          bwkey: data.controlling.bwkey || null,
          bwtar: data.controlling.bwtar || null,
          mat_klass: data.controlling.matKlass || null,    // camelCase → snake_case
          val_area: data.controlling.valArea || null,      // camelCase → snake_case
          val_class: data.controlling.valClass || null,    // camelCase → snake_case
          price_ctrl: data.controlling.priceCtrl || null,  // camelCase → snake_case
          std_price: data.controlling.stdPrice || null,    // camelCase → snake_case
          price_unit: data.controlling.priceUnit || null,  // camelCase → snake_case
          moving_price: data.controlling.movingPrice || null, // camelCase → snake_case
          price_date: data.controlling.priceDate || null,     // camelCase → snake_case
          ml_active: data.controlling.mlActive || false,      // camelCase → snake_case
          ml_settle: data.controlling.mlSettle || false,      // camelCase → snake_case
          origin_mat: data.controlling.originMat || false,    // camelCase → snake_case
          origin_group: data.controlling.originGroup || null, // camelCase → snake_case
          overhead_grp: data.controlling.overheadGrp || null, // camelCase → snake_case
          profit_ctr2: data.controlling.profitCtr2 || null,
          qty_struct: data.controlling.qtyStruct || false,    // camelCase → snake_case
          in_house: data.controlling.inHouse || false,        // camelCase → snake_case
          mat_usage: data.controlling.matUsage || null,       // camelCase → snake_case
          plndprice1: data.controlling.plndprice1 || null,
          plndprdate1: data.controlling.plndprdate1 || null,
          plndprice2: data.controlling.plndprice2 || null,
          plndprdate2: data.controlling.plndprdate2 || null,
          plndprice3: data.controlling.plndprice3 || null,
          plndprdate3: data.controlling.plndprdate3 || null,
        }] : data.controllings || [],
      };
      
      // Remover os campos antigos
      delete dataToSend.salesDistribution;
      delete dataToSend.controlling;
      
      console.log('Material data to send (após converter):', dataToSend);
      console.log('Form validation:', methods.formState.isValid);
      console.log('Form errors:', methods.formState.errors);

      const result = await updateMaterial(organizationId, id, dataToSend);

      if (result.success) {
        toast.success('Material atualizado com sucesso!');
        router.push(paths.dashboard.materials.root);
      } else {
        toast.error(result.error || 'Erro ao atualizar material');
      }
    } catch (error) {
      console.error('Erro ao atualizar material:', error);
      toast.error('Erro ao atualizar material. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  });

  const renderTabContent = () => {
    switch (currentTab) {
      case 'main-data':
        return <MaterialMainDataTab isEdit />;
      case 'basic-data':
        return <MaterialBasicDataTab />;
      case 'purchasing':
        return <MaterialPurchasingTab />;
      case 'mrp':
        return <MaterialMrpTab />;
      case 'work-scheduling':
        return <MaterialWorkSchedulingTab />;
      case 'sales-distribution':
        return <MaterialSalesDistributionTab />;
      case 'controlling':
        return <MaterialControllingTab />;
      case 'sd-center':
        return <MaterialSdCenterTab />;
      case 'texts':
        return <MaterialTextsTab />;
      default:
        return null;
    }
  };

  if (materialLoading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Carregando dados do material...
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  if (materialError || !material) {
    return (
      <DashboardContent>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {materialError ? `Erro ao carregar material: ${materialError}` : 'Material não encontrado'}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => router.push(paths.dashboard.materials.root)}
            sx={{ mt: 2 }}
          >
            Voltar
          </Button>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Editar Material"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Materiais', href: paths.dashboard.materials.root },
          { name: material.material || 'Material' },
          { name: 'Editar' },
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

            <LoadingButton
              type="button"
              variant="contained"
              size="large"
              loading={isSubmitting}
              onClick={onSubmit}
              startIcon={<Iconify icon="mingcute:check-line" />}
            >
              Atualizar Material
            </LoadingButton>
          </Stack>
        </form>
      </FormProvider>
    </DashboardContent>
  );
}
