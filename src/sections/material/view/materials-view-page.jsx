import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import axios, { endpoints } from 'src/utils/axios';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Scrollbar } from 'src/components/scrollbar';
import { toast } from 'src/components/snackbar';
import { useAuthContext } from 'src/auth/hooks';
import { useGetMaterial, sendMaterialToSap } from 'src/actions/materials';

import { MaterialsViewSkeleton } from './materials-view-skeleton';


// ----------------------------------------------------------------------

const TABS = [
  { value: 'dados-basicos', label: 'Dados Básicos', icon: <Iconify icon="solar:document-text-bold" /> },
  { value: 'compras-armazenagem', label: 'Compras & Armazenagem', icon: <Iconify icon="solar:box-bold" /> },
  { value: 'vendas', label: 'Vendas (SD)', icon: <Iconify icon="solar:shop-bold" /> },
  { value: 'planejamento', label: 'Planejamento (MRP)', icon: <Iconify icon="solar:calendar-bold" /> },
  { value: 'producao', label: 'Produção', icon: <Iconify icon="solar:factory-bold" /> },
  { value: 'contabilidade', label: 'Contabilidade', icon: <Iconify icon="solar:calculator-bold" /> },
  { value: 'dados-adicionais', label: 'Dados Adicionais', icon: <Iconify icon="solar:settings-bold" /> },
];

// ----------------------------------------------------------------------

export function MaterialsViewPageComponent({ id }) {
  const router = useRouter();
  const { selectedOrganizationId: organizationId } = useAuthContext();

  const [currentTab, setCurrentTab] = useState('dados-basicos');
  const [isSendingToSap, setIsSendingToSap] = useState(false);
  const [logsPopupOpen, setLogsPopupOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsLoading, setLogsLoading] = useState(false);

  const { material: materialData, materialLoading: isLoading, materialError } = useGetMaterial(id);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleOpenLogsPopup = useCallback(() => {
    setLogsPopupOpen(true);
  }, []);

  const handleCloseLogsPopup = useCallback(() => {
    setLogsPopupOpen(false);
  }, []);

  // Buscar logs quando o popup abrir
  useEffect(() => {
    const fetchLogs = async () => {
      if (!logsPopupOpen || !id || !organizationId) return;

      try {
        setLogsLoading(true);
        const response = await axios.get(endpoints.organization.materialLogs(organizationId, id));
        
        if (response.data.success) {
          // Filtrar apenas logs com status ERROR
          const errorLogs = response.data.data.filter(log => log.status === 'ERROR');
          setLogs(errorLogs);
          setLogsTotal(response.data.total || errorLogs.length);
        }
      } catch (error) {
        console.error('Erro ao buscar logs:', error);
        toast.error('Erro ao carregar logs de integração');
      } finally {
        setLogsLoading(false);
      }
    };

    fetchLogs();
  }, [logsPopupOpen, id, organizationId]);

  /**
   * Envia o material para o SAP diretamente
   */
  const handleSendToSap = useCallback(async () => {
    if (!organizationId) {
      toast.error('Organização não selecionada');
      return;
    }
    if (!id) {
      toast.error('ID do material não encontrado');
      return;
    }

    try {
      setIsSendingToSap(true);
      
      console.log('=== INICIANDO ENVIO PARA SAP ===');
      console.log('Material ID:', id);
      console.log('Material Data:', materialData);
      
      // Debug específico para Sales Distribution
      if (materialData?.sales_distributions) {
        console.log('=== SALES DISTRIBUTIONS NO MATERIAL ===');
        console.log('Quantidade:', materialData.sales_distributions.length);
        console.log('Dados:', materialData.sales_distributions);
        
        materialData.sales_distributions.forEach((sd, index) => {
          console.log(`--- Sales Distribution #${index + 1} ---`);
          console.log('vkorg (Org Vendas):', sd.vkorg);
          console.log('vtweg (Canal Distrib):', sd.vtweg);
          console.log('spart (Setor):', sd.spart);
          console.log('dwerk (Centro):', sd.dwerk);
          console.log('lgort (Depósito):', sd.lgort);
          console.log('Objeto completo:', sd);
        });
      } else {
        console.warn('⚠️ MATERIAL SEM SALES DISTRIBUTIONS!');
      }
      
      // Debug específico para Controllings
      if (materialData?.controllings) {
        console.log('=== CONTROLLINGS NO MATERIAL ===');
        console.log('Quantidade:', materialData.controllings.length);
        console.log('Dados:', materialData.controllings);
      } else {
        console.warn('⚠️ MATERIAL SEM CONTROLLINGS!');
      }
      
      console.log('Iniciando envio para SAP...', { materialId: id });
      const result = await sendMaterialToSap(organizationId, id);
      
      console.log('=== RESULTADO DO ENVIO PARA SAP ===');
      console.log('Success:', result.success);
      console.log('Message:', result.message);
      console.log('Resultado completo:', result);
      
      if (result.success) {
        // Exibe sucesso com a mensagem da resposta
        toast.success(result.message || 'Material enviado para o SAP com sucesso!');
      } else {
        // Exibe erro com a mensagem da resposta
        const errorMessage = result.message || result.sapError || result.error || 'Erro desconhecido ao enviar para SAP';
        
        // Log completo do erro para debug
        console.error('Erro detalhado do SAP:', {
          success: result.success,
          message: result.message,
          sapError: result.sapError,
          error: result.error,
          fullError: result.fullError,
          status: result.status
        });
        
        // Exibe toast com erro do SAP de forma mais clara
        console.log('Exibindo toast de erro:', errorMessage);
        toast.error(`Erro do SAP: ${errorMessage}`, {
          duration: 10000, // Toast mais longo para ler a mensagem
          action: result.fullError ? (
            <Button 
              size="small" 
              onClick={() => {
                console.log('Detalhes completos do erro:', result.fullError);
                alert(`Detalhes completos do erro:\n\n${JSON.stringify(result.fullError, null, 2)}`);
              }}
            >
              Ver Detalhes
            </Button>
          ) : undefined
        });
      }
      
    } catch (error) {
      console.error('Erro ao enviar para SAP:', error);
      toast.error(`Erro ao enviar para SAP: ${error.message}`);
    } finally {
      setIsSendingToSap(false);
    }
  }, [id, materialData, organizationId]);


  // Tratar erro de carregamento
  if (materialError) {
    console.error('Erro ao carregar material:', materialError);
    toast.error('Erro ao carregar dados do material');
    router.push(paths.dashboard.materials.root);
  }

  const renderField = (label, value, type = 'text') => {
    if (type === 'status') {
      return (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {label}
          </Typography>
          <Chip
            label={value ? 'Ativo' : 'Inativo'}
            size="small"
            color={value ? 'success' : 'error'}
          />
        </Box>
      );
    }

    if (type === 'boolean') {
      return (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {label}
          </Typography>
          <Chip
            label={value ? 'Sim' : 'Não'}
            size="small"
            color={value ? 'success' : 'default'}
          />
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body1">
          {value || '-'}
        </Typography>
      </Box>
    );
  };

  const renderDadosBasicos = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Informações Principais
          </Typography>
          <Stack spacing={2}>
            {renderField('Código do Material', materialData?.material)}
            {renderField('Código SAP', materialData?.codigo_sap)}
            {renderField('Tipo de Material', materialData?.matl_type)}
            {renderField('Descrição', materialData?.matl_desc)}
            {/* Setor Industrial - oculto */}
            {renderField('Status', materialData?.status)}
            {renderField('Divisão', materialData?.division)}
            {renderField('Grupo de Material', materialData?.matl_group)}
          </Stack>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Unidades e Medidas
          </Typography>
          <Stack spacing={2}>
            {renderField('Unidade Base', materialData?.base_uom)}
            {renderField('Unidade Alternativa', materialData?.alt_unit)}
            {renderField('Fator Unidade Alt.', materialData?.fator_alt_unit)}
            {renderField('Fator Unidade Base', materialData?.fator_base_uom)}
            {renderField('Unidade de Peso', materialData?.unit_of_wt)}
            {renderField('Unidade de Volume', materialData?.volumeunit)}
            {renderField('Peso Bruto', materialData?.gross_wt)}
            {renderField('Peso Líquido', materialData?.net_weight)}
            {renderField('Volume', materialData?.volume)}
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Informações de Auditoria
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                {renderField('Status', materialData?.isActive === true || materialData?.isActive === '1', 'status')}
                {renderField('Criado em', materialData?.createdAt ? new Date(materialData.createdAt).toLocaleDateString('pt-BR') : '-')}
                {renderField('Atualizado em', materialData?.updatedAt ? new Date(materialData.updatedAt).toLocaleDateString('pt-BR') : '-')}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                {renderField('Criado por', materialData?.creator?.name)}
                {renderField('Email', materialData?.creator?.email)}
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );

  const renderComprasArmazenagem = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Informações de Compras
          </Typography>
          <Stack spacing={2}>
            {renderField('Status de Compra', materialData?.pur_status)}
            {renderField('Status MARC', materialData?.pur_status_marc)}
            {renderField('Grupo de Compras', materialData?.pur_group)}
            {renderField('Unidade PO', materialData?.po_unit)}
            {renderField('Ordem Automática', materialData?.auto_p_ord)}
            {renderField('Código de Controle', materialData?.ctrl_code)}
            {renderField('Chave de Valor', materialData?.pur_valkey)}
            {renderField('Código de CFOP', materialData?.mat_cfop)}
          </Stack>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Informações de Armazenagem
          </Typography>
          <Stack spacing={2}>
            {renderField('Condições de Armazenamento', materialData?.stor_conds)}
            {renderField('Local de Armazenagem', materialData?.stge_loc)}
            {renderField('Posição de Armazenagem', materialData?.stge_bin)}
            {renderField('Verificação de Disponibilidade', materialData?.availcheck)}
            {renderField('Grupo de Carregamento', materialData?.loadinggrp)}
            {renderField('Grupo de Transporte', materialData?.trans_grp)}
            {renderField('País de Origem', materialData?.countryori)}
            {renderField('Centro de Lucro', materialData?.profit_ctr)}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );

  const renderVendas = () => {
    // Debug para verificar se sales_distributions existe
    console.log('=== RENDERIZANDO ABA VENDAS ===');
    console.log('Material Data:', materialData);
    console.log('Sales Distributions:', materialData?.sales_distributions);
    console.log('Tem sales_distributions?', !!materialData?.sales_distributions);
    console.log('Quantidade:', materialData?.sales_distributions?.length || 0);
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Sales & Distribution - Informações Gerais
            </Typography>
            <Stack spacing={2}>
              {renderField('Tipo de Material SD', materialData?.sh_mat_typ)}
              {renderField('Texto SD', materialData?.sd_text)}
              {renderField('ID ABC', materialData?.abc_id)}
              {renderField('EAN/UPC', materialData?.ean_upc)}
              {renderField('Material de Referência PL', materialData?.pl_ref_mat)}
              {renderField('Idioma', materialData?.langu)}
              {renderField('Documento', materialData?.document)}
            </Stack>
          </Card>
        </Grid>
        
        {/* Sempre exibir a primeira sales distribution se existir */}
        {materialData?.sales_distributions && materialData.sales_distributions.length > 0 ? (
          materialData.sales_distributions.slice(0, 1).map((sd, index) => {
            console.log('✅ RENDERIZANDO SALES DISTRIBUTION:', sd);
            return (
              <Grid item xs={12} key={sd.id || index}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Distribuição de Vendas #{index + 1}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                          Organização
                        </Typography>
                        {renderField('Organização de Vendas', sd.vkorg)}
                        {renderField('Canal de Distribuição', sd.vtweg)}
                        {renderField('Setor de Atividade', sd.spart)}
                        {renderField('Centro Fornecedor', sd.dwerk)}
                        {renderField('Depósito', sd.lgort)}
                        {renderField('Centro de Lucro', sd.prctr)}
                        {renderField('Grupo Conta Cliente', sd.ktgrm)}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                          Vendas & Impostos
                        </Typography>
                        {renderField('Unidade de Vendas', sd.sales_unit)}
                        {renderField('Quantidade Mínima de Pedido', sd.min_order)}
                        {renderField('Prazo Entrega Mínimo', sd.min_dely)}
                        {renderField('Unidade de Prazo', sd.dely_unit)}
                        {renderField('Tipo de Imposto 1', sd.tax_type_1)}
                        {renderField('Classificação Fiscal 1', sd.taxclass_1)}
                        {renderField('Status do Material', sd.matl_stats)}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                          Grupos & Preços
                        </Typography>
                        {renderField('Grupo Rebate', sd.rebate_grp)}
                        {renderField('Grupo Comissão', sd.comm_group)}
                        {renderField('Grupo Preço Material', sd.mat_pr_grp)}
                        {renderField('Atribuição de Conta', sd.acct_assgt)}
                        {renderField('Desconto à Vista (%)', sd.cash_disc)}
                        {renderField('Perfil Arredondamento', sd.round_prof)}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={2}>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                          Informações do Sistema
                        </Typography>
                        {renderField('Status', sd.isActive, 'status')}
                        {renderField('Criado em', sd.createdAt ? new Date(sd.createdAt).toLocaleDateString('pt-BR') : '-')}
                        {renderField('Atualizado em', sd.updatedAt ? new Date(sd.updatedAt).toLocaleDateString('pt-BR') : '-')}
                      </Stack>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            );
          })
        ) : (
          console.log('❌ NÃO EXIBINDO SALES DISTRIBUTION - Array vazio ou inexistente'),
          null
        )}
    </Grid>
    );
  };

  const renderPlanejamento = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Parâmetros MRP
          </Typography>
          <Stack spacing={2}>
            {renderField('Tipo MRP', materialData?.mrp_type)}
            {renderField('Ponto de Reordenação', materialData?.reorder_pt)}
            {renderField('Controlador MRP', materialData?.mrp_ctrler)}
            {renderField('Chave de Lote', materialData?.lotsizekey)}
            {renderField('Lote Mínimo', materialData?.minlotsize)}
            {renderField('Lote Máximo', materialData?.maxlotsize)}
            {renderField('Lote Fixo', materialData?.fixed_lot)}
            {renderField('Sucata de Montagem', materialData?.assy_scrap)}
            {renderField('Valor de Arredondamento', materialData?.round_val)}
            {renderField('Nível de Serviço', materialData?.serv_level)}
          </Stack>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Controle de Estoque
          </Typography>
          <Stack spacing={2}>
            {renderField('Estoque Máximo', materialData?.max_stock)}
            {renderField('Estoque de Segurança Mínimo', materialData?.min_safety_stk)}
            {renderField('Perfil de Cobertura', materialData?.covprofile)}
            {renderField('Grupo MRP', materialData?.mrp_group)}
            {renderField('Tipo de Processo', materialData?.proc_type)}
            {renderField('Tipo de Processo SP', materialData?.spproctype)}
            {renderField('Backflush', materialData?.backflush)}
            {renderField('Liberação JIT', materialData?.jit_relvt)}
            {renderField('Material a Granel', materialData?.bulk_mat)}
            {renderField('Entrada de Lote', materialData?.batchentry)}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );

  const renderProducao = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Parâmetros de Produção
          </Typography>
          <Stack spacing={2}>
            {renderField('Local de Emissão', materialData?.iss_st_loc)}
            {renderField('Área de Suprimento', materialData?.supply_area)}
            {renderField('Local de Expedição', materialData?.sloc_exprc)}
            {renderField('Produto Interno', materialData?.inhseprodt)}
            {renderField('Entrega Planejada', materialData?.plnd_delry)}
            {renderField('Tempo de Processamento', materialData?.gr_pr_time)}
            {renderField('Calendário PPC', materialData?.ppc_pl_cal)}
            {renderField('Chave SM', materialData?.sm_key)}
            {renderField('Estoque de Segurança', materialData?.safety_stk)}
            {renderField('Plano de Armazenagem', materialData?.plan_strgp)}
          </Stack>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Consumo e Tempos
          </Typography>
          <Stack spacing={2}>
            {renderField('Consumo Backward', materialData?.bwd_cons)}
            {renderField('Modo de Consumo', materialData?.consummode)}
            {renderField('Consumo Forward', materialData?.fwd_cons)}
            {renderField('Tempo de Reposição', materialData?.replentime)}
            {renderField('ID de Requisito Dependente', materialData?.dep_req_id)}
            {renderField('Sucata de Componente', materialData?.comp_scrap)}
            {renderField('Perfil de Reparo', materialData?.repmanprof)}
            {renderField('Reparo de Manufatura', materialData?.rep_manuf)}
            {renderField('Agendador de Produção', materialData?.production_scheduler)}
            {renderField('Perfil de Produção', materialData?.prodprof)}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );

  const renderContabilidade = () => {
    // Debug para verificar se controllings existe
    console.log('=== RENDERIZANDO ABA CONTABILIDADE ===');
    console.log('Material Data:', materialData);
    console.log('Controllings:', materialData?.controllings);
    console.log('Tem controllings?', !!materialData?.controllings);
    console.log('Quantidade:', materialData?.controllings?.length || 0);
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Parâmetros de Controle
            </Typography>
            <Stack spacing={2}>
              {renderField('Tolerância Inferior', materialData?.under_tol)}
              {renderField('Tolerância Superior', materialData?.over_tol)}
              {renderField('Sem Custeio', materialData?.no_costing, 'boolean')}
              {renderField('Perfil de Série', materialData?.serno_prof)}
              {renderField('Tamanho do Lote', materialData?.lot_size)}
              {renderField('Tipo de Processo Especial', materialData?.specprocty)}
              {renderField('Uso de Partes', materialData?.prt_usage)}
              {renderField('Chave de Controle', materialData?.ctrl_key)}
            </Stack>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Textos e Documentação
            </Typography>
            <Stack spacing={2}>
              {renderField('Texto PO', materialData?.po_text)}
              {renderField('Texto DB', materialData?.db_text)}
            </Stack>
          </Card>
        </Grid>
        
        {/* Sempre exibir o primeiro controlling se existir */}
        {materialData?.controllings && materialData.controllings.length > 0 ? (
          materialData.controllings.slice(0, 1).map((ctrl, index) => {
            console.log('✅ RENDERIZANDO CONTROLLING:', ctrl);
            return (
              <Grid item xs={12} key={ctrl.id || index}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Controlling & Custos #{index + 1}
                  </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                      Avaliação
                    </Typography>
                    {renderField('Código de Avaliação', ctrl.bwkey)}
                    {renderField('Tipo de Avaliação', ctrl.bwtar)}
                    {renderField('Classe de Material', ctrl.mat_klass)}
                    {renderField('Área de Avaliação', ctrl.val_area)}
                    {renderField('Classe de Avaliação', ctrl.val_class)}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                      Controle de Preços
                    </Typography>
                    {renderField('Controle de Preço', ctrl.price_ctrl)}
                    {renderField('Preço Padrão', ctrl.std_price)}
                    {renderField('Unidade de Preço', ctrl.price_unit)}
                    {renderField('Preço Médio Móvel', ctrl.moving_price)}
                    {renderField('Data do Preço', ctrl.price_date ? new Date(ctrl.price_date).toLocaleDateString('pt-BR') : '-')}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                      Material Ledger & Estrutura
                    </Typography>
                    {renderField('ML Ativo', ctrl.ml_active, 'boolean')}
                    {renderField('Liquidação ML', ctrl.ml_settle, 'boolean')}
                    {renderField('Material Origem', ctrl.origin_mat, 'boolean')}
                    {renderField('Estrutura de Quantidade', ctrl.qty_struct, 'boolean')}
                    {renderField('Produção Interna', ctrl.in_house, 'boolean')}
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                      Grupos & Centros
                    </Typography>
                    {renderField('Grupo de Origem', ctrl.origin_group)}
                    {renderField('Grupo Overhead', ctrl.overhead_grp)}
                    {renderField('Centro de Lucro 2', ctrl.profit_ctr2)}
                    {renderField('Uso do Material', ctrl.mat_usage)}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                      Preços Planejados
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        {renderField('Preço Planejado 1', ctrl.plndprice1)}
                        {renderField('Data Planejada 1', ctrl.plndprdate1 ? new Date(ctrl.plndprdate1).toLocaleDateString('pt-BR') : '-')}
                      </Grid>
                      <Grid item xs={12} md={4}>
                        {renderField('Preço Planejado 2', ctrl.plndprice2)}
                        {renderField('Data Planejada 2', ctrl.plndprdate2 ? new Date(ctrl.plndprdate2).toLocaleDateString('pt-BR') : '-')}
                      </Grid>
                      <Grid item xs={12} md={4}>
                        {renderField('Preço Planejado 3', ctrl.plndprice3)}
                        {renderField('Data Planejada 3', ctrl.plndprdate3 ? new Date(ctrl.plndprdate3).toLocaleDateString('pt-BR') : '-')}
                      </Grid>
                    </Grid>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                      Informações do Sistema
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        {renderField('Status', ctrl.isActive, 'status')}
                      </Grid>
                      <Grid item xs={12} md={4}>
                        {renderField('Criado em', ctrl.createdAt ? new Date(ctrl.createdAt).toLocaleDateString('pt-BR') : '-')}
                      </Grid>
                      <Grid item xs={12} md={4}>
                        {renderField('Atualizado em', ctrl.updatedAt ? new Date(ctrl.updatedAt).toLocaleDateString('pt-BR') : '-')}
                      </Grid>
                    </Grid>
                  </Stack>
                </Grid>
              </Grid>
            </Card>
          </Grid>
            )
          })
        ) : (
          console.log('❌ NÃO EXIBINDO CONTROLLING - Array vazio ou inexistente'),
          null
        )}
    </Grid>
    );
  };

  const renderDadosAdicionais = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Informações Adicionais
          </Typography>
          <Stack spacing={2}>
            {renderField('Material Antigo', materialData?.old_mat_no)}
            {renderField('Grupo de Material Externo', materialData?.extmatlgrp)}
            {renderField('Hierarquia de Produto', materialData?.prod_hier)}
            {renderField('Categoria de Item', materialData?.item_cat)}
            {renderField('Gestão de Lote', materialData?.batch_mgmt)}
            {renderField('Commodity Física', materialData?.physical_commodity)}
            {renderField('Material Básico', materialData?.basic_matl)}
            {renderField('Descrição Padrão', materialData?.std_descr)}
            {renderField('Grupo de Material SM', materialData?.mat_grp_sm)}
          </Stack>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Validade e Vida Útil
          </Typography>
          <Stack spacing={2}>
            {renderField('Vida Útil Mínima', materialData?.minremlife)}
            {renderField('Vida Útil', materialData?.shelf_life)}
            {renderField('Indicador de Período de Expiração', materialData?.period_ind_expiration_date)}
            {renderField('SLED BBD', materialData?.sled_bbd)}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dados-basicos':
        return renderDadosBasicos();
      case 'compras-armazenagem':
        return renderComprasArmazenagem();
      case 'vendas':
        return renderVendas();
      case 'planejamento':
        return renderPlanejamento();
      case 'producao':
        return renderProducao();
      case 'contabilidade':
        return renderContabilidade();
      case 'dados-adicionais':
        return renderDadosAdicionais();
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <DashboardContent>
        <MaterialsViewSkeleton />
      </DashboardContent>
    );
  }

  if (!materialData) {
    return (
      <DashboardContent>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Material não encontrado
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`Material ${materialData.material}`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Materials', href: paths.dashboard.materials.root },
          { name: materialData.material },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Button
                variant="outlined"
                color="success"
                startIcon={
                  isSendingToSap ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Iconify icon="solar:upload-bold" />
                  )
                }
                onClick={handleSendToSap}
                disabled={isSendingToSap}
              >
                {isSendingToSap ? 'Enviando...' : 'Enviar para o SAP'}
              </Button>
              <Tooltip title="Ver Logs" arrow>
                <IconButton
                  size="small"
                  onClick={handleOpenLogsPopup}
                  sx={{
                    width: 18,
                    height: 18,
                    bgcolor: 'grey.400',
                    color: 'white',
                    opacity: 0.7,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'grey.600',
                      opacity: 1,
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Iconify icon="solar:document-text-bold" width={10} />
                </IconButton>
              </Tooltip>
            </Stack>
            <Button
              component={RouterLink}
              href={paths.dashboard.materials.edit(id)}
              variant="outlined"
              startIcon={<Iconify icon="solar:pen-bold" />}
            >
              Editar
            </Button>
            <Button
              component={RouterLink}
              href={paths.dashboard.materials.root}
              variant="outlined"
            >
              Voltar
            </Button>
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

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
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>
        {renderTabContent()}
      </Card>

      {/* Popup de Logs de Integração */}
      <Dialog
        open={logsPopupOpen}
        onClose={handleCloseLogsPopup}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:history-bold" width={24} />
              <Typography variant="h6">Logs de Integração SAP</Typography>
              {logsTotal > 0 && (
                <Chip 
                  label={`${logsTotal} erros`} 
                  size="small" 
                  color="error" 
                  variant="soft"
                />
              )}
            </Stack>
          </Stack>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {logsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : logs.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Iconify icon="solar:check-circle-bold" width={64} sx={{ color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Nenhum erro encontrado
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Este material não possui erros de integração recentes.
              </Typography>
            </Box>
          ) : (
            <Scrollbar sx={{ maxHeight: 600 }}>
              <Stack divider={<Divider />}>
                {logs.map((log, index) => (
                  <Box key={log.id} sx={{ p: 2, '&:hover': { bgcolor: 'action.hover' } }}>
                    <Stack spacing={1.5}>
                      {/* Cabeçalho do Log */}
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Chip 
                            label={log.status} 
                            size="small" 
                            color="error" 
                            variant="soft"
                          />
                          <Chip 
                            label={`HTTP ${log.httpStatus}`}
                            size="small" 
                            color={log.httpStatus >= 500 ? 'error' : 'warning'}
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.disabled">
                            {new Date(log.createdAt).toLocaleString('pt-BR')}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
                          #{log.id.slice(-8)}
                        </Typography>
                      </Stack>

                      {/* Mensagem de Erro */}
                      <Alert severity="error" sx={{ py: 0.5 }}>
                        <Typography variant="body2">
                          {log.responsePayload?.message 
                            ? (typeof log.responsePayload.message === 'string' 
                                ? log.responsePayload.message.replace(/^{|}$/g, '').replace(/\\/g, '')
                                : JSON.stringify(log.responsePayload.message))
                            : log.errorMessage || 'Erro desconhecido'}
                        </Typography>
                      </Alert>

                      {/* Detalhes Adicionais */}
                      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                        <Box>
                          <Typography variant="caption" color="text.disabled">
                            Método:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {log.requestMethod || 'N/A'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.disabled">
                            Tempo de Resposta:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {log.responseTime ? `${(log.responseTime / 1000).toFixed(2)}s` : 'N/A'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.disabled">
                            Tentativas:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {log.retryCount}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Scrollbar>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseLogsPopup}>Fechar</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setLogsPopupOpen(false);
              setTimeout(() => setLogsPopupOpen(true), 100);
            }}
            disabled={logsLoading}
            startIcon={<Iconify icon="solar:refresh-bold" />}
          >
            Recarregar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}