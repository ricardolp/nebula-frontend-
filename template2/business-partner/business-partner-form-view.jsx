import { useState, useCallback, useEffect } from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { createBusinessPartner, updateBusinessPartner, sendBusinessPartnerToSap } from 'src/actions/business-partners';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CnpjConsultModal } from 'src/components/cnpj-consult-modal';

import {
  businessPartnerFormSchema,
  businessPartnerFormDefaultValues,
} from './business-partner-form-schema';
import { BusinessPartnerAddressTab } from './tabs/business-partner-address-tab';
import { BusinessPartnerCommunicationTab } from './tabs/business-partner-communication-tab';
import { BusinessPartnerGeneralTab } from './tabs/business-partner-general-tab';
import { BusinessPartnerIdentificationTab } from './tabs/business-partner-identification-tab';
import { BusinessPartnerIndustrialTab } from './tabs/business-partner-industrial-tab';
import { BusinessPartnerPaymentTab } from './tabs/business-partner-payment-tab';
import { BusinessPartnerRelationsTab } from './tabs/business-partner-relations-tab';
import { BusinessPartnerSalesTab } from './tabs/business-partner-sales-tab';
import { BusinessPartnerSupplierTab } from './tabs/business-partner-supplier-tab';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'general', label: 'Informações Gerais', icon: 'solar:user-bold' },
  { value: 'address', label: 'Endereço', icon: 'solar:home-bold' },
  { value: 'communication', label: 'Comunicação', icon: 'solar:phone-bold' },
  { value: 'identification', label: 'Identificação', icon: 'solar:id-card-bold' },
  { value: 'industrial', label: 'Setor Industrial', icon: 'solar:buildings-bold' },
  { value: 'payment', label: 'Pagamentos', icon: 'solar:card-bold' },
  { value: 'sales', label: 'Vendas', icon: 'solar:shop-bold' },
  { value: 'supplier', label: 'Fornecedor IRF', icon: 'solar:box-bold' },
  { value: 'relations', label: 'Distribuições e Relações', icon: 'solar:users-group-rounded-bold' },
];

// ----------------------------------------------------------------------

/**
 * Componente do formulário de parceiros de negócio
 * Formulário complexo com abas organizadas por contexto
 */
export function BusinessPartnerFormView({ businessPartner, isEdit = false, isView = false }) {
  const router = useRouter();
  const isSubmitting = useBoolean();
  const [currentTab, setCurrentTab] = useState('general');
  const [cnpjModalOpen, setCnpjModalOpen] = useState(false);
  const [isSendingToSap, setIsSendingToSap] = useState(false);

  // Função para validar e formatar datas
  const validateDate = useCallback((dateValue) => {
    // Se não tem valor ou é string vazia, retorna null para o backend
    if (!dateValue || dateValue === '' || dateValue === null || dateValue === undefined) {
      return null;
    }
    
    try {
      const date = new Date(dateValue);
      
      // Verifica se a data é válida
      if (Number.isNaN(date.getTime())) {
        console.warn('Data inválida encontrada:', dateValue);
        return null;
      }
      
      // Verifica se a data não é muito antiga ou futura (validação adicional)
      const year = date.getFullYear();
      if (year < 1900 || year > 2100) {
        console.warn('Data fora do range válido:', dateValue);
        return null;
      }
      
      // Retorna a data no formato ISO string
      return date.toISOString();
    } catch (error) {
      console.warn('Erro ao processar data:', dateValue, error);
      return null;
    }
  }, []);

  // Mapear dados da API para o formato do formulário
  const mapApiDataToForm = useCallback((apiData) => {
    if (!apiData) return businessPartnerFormDefaultValues;

    return {
      // Dados básicos
      cod_antigo: apiData.cod_antigo || '',
      tipo: apiData.tipo === 'PESSOA_JURIDICA' ? 'SOCI' : apiData.tipo || '',
      funcao: apiData.funcao || 'FORNECEDOR', // Valor padrão obrigatório
      empresa: apiData.empresa || '',
      nome_nome_fantasia: apiData.nome_nome_fantasia || '',
      sobrenome_razao_social: apiData.sobrenome_razao_social || '',
      nome3: apiData.nome3 || '',
      nome4: apiData.nome4 || '',
      vocativo: apiData.vocativo || '',
      grupo_contas: apiData.grupo_contas || '',
      agr_contas: apiData.agr_contas || '',
      genero: apiData.genero || apiData.sexo || '', // Backend pode usar 'sexo' ou 'genero'
      termo_pesquisa1: apiData.termo_pesquisa1 || '',
      termo_pesquisa2: apiData.termo_pesquisa2 ? apiData.termo_pesquisa2.replace(/\D/g, '') : '',
      data_nascimento: validateDate(apiData.data_nascimento),
      data_fundacao: validateDate(apiData.data_fundacao),

      // Endereço
      rua: apiData.endereco?.rua || '',
      rua2: apiData.endereco?.rua2 || '',
      numero: apiData.endereco?.numero || '',
      complemento: apiData.endereco?.complemento || '',
      bairro: apiData.endereco?.bairro || '',
      cep: apiData.endereco?.cep || '',
      cidade: apiData.endereco?.cidade || '',
      estado: apiData.endereco?.estado || '',
      pais: apiData.endereco?.pais || 'Brasil',

      // Comunicação
      telefone: apiData.comunicacao?.telefone || '',
      telefone2: apiData.comunicacao?.telefone2 || '',
      telefone3: apiData.comunicacao?.telefone3 || '',
      celular: apiData.comunicacao?.celular || '',
      email: apiData.comunicacao?.email || '',
      observacoes: apiData.comunicacao?.observacoes || '',

      // Identificação
      cpf: apiData.identificacao?.cpf || '',
      cnpj: apiData.identificacao?.cnpj || '',
      inscr_estadual: apiData.identificacao?.inscr_estadual || '',
      inscr_municipal: apiData.identificacao?.inscr_municipal || '',
      tipo_id_ident: apiData.identificacao?.tipo_id_ident || '',
      numero_id: apiData.identificacao?.numero_id || '',

      // Setor Industrial
      chave_setor_ind: apiData.setor_industrial?.chave_setor_ind || '',
      cod_setor_ind: apiData.setor_industrial?.cod_setor_ind || '',
      setor_ind_padrao: apiData.setor_industrial?.setor_ind_padrao || '',
      category: apiData.category || '',

      // Pagamentos
      cod_banco: apiData.pagamentos?.cod_banco || '',
      cod_agencia: apiData.pagamentos?.cod_agencia || '',
      cod_conta: apiData.pagamentos?.cod_conta || '',
      dig_conta: apiData.pagamentos?.dig_conta || '',
      favorecido: apiData.pagamentos?.favorecido || '',
      cpf_favorecido: apiData.pagamentos?.cpf_favorecido || '',

      // Vendas
      vendas_grupo_clientes: apiData.vendas?.vendas_grupo_clientes || '',
      vendas_escritorio_vendas: apiData.vendas?.vendas_escritorio_vendas || '',
      vendas_equipe_vendas: apiData.vendas?.vendas_equipe_vendas || '',
      vendas_atributo_1: apiData.vendas?.vendas_atributo_1 || '',
      vendas_atributo_2: apiData.vendas?.vendas_atributo_2 || '',
      vendas_sociedade_parceiro: apiData.vendas?.vendas_sociedade_parceiro || '',
      vendas_centro_fornecedor: apiData.vendas?.vendas_centro_fornecedor || '',
      condicao_expedicao: apiData.vendas?.condicao_expedicao || '',
      vendas_relevante_liquidacao: apiData.vendas?.vendas_relevante_liquidacao || false,
      relevante_crr: apiData.vendas?.relevante_crr || false,
      perfil_cliente_bayer: apiData.vendas?.perfil_cliente_bayer || '',

      // Fornecedor IRF
      devolucao: apiData.fornecedor_irf?.devolucao === 'X' || apiData.fornecedor_irf?.devolucao === true || false,
      rev_fat_bas_em: apiData.fornecedor_irf?.rev_fat_bas_em || '',
      grp_esq_forn: apiData.fornecedor_irf?.grp_esq_forn || '',
      relevante_liquidacao: apiData.fornecedor_irf?.relevante_liquidacao === 'X' || apiData.fornecedor_irf?.relevante_liquidacao === true || false,
      regime_pis_cofins: apiData.fornecedor_irf?.regime_pis_cofins || '',
      tipo_imposto: apiData.fornecedor_irf?.tipo_imposto || '',
      optante_simples: apiData.fornecedor_irf?.optante_simples === 'S' || apiData.fornecedor_irf?.optante_simples === true || false,
      simples_nacional: apiData.fornecedor_irf?.simples_nacional === 'S' || apiData.fornecedor_irf?.simples_nacional === true || false,
      recebedor_alternativo: apiData.fornecedor_irf?.recebedor_alternativo === 'S' || apiData.fornecedor_irf?.recebedor_alternativo === true || false,

      // Business Partner Z (Campos Customizados)
      zz1_localidade_bus: apiData.business_partner_z?.zz1_localidade_bus || '',
      zz1_latitude_bus: apiData.business_partner_z?.zz1_latitude_bus || '',
      zz1_longitude_bus: apiData.business_partner_z?.zz1_longitude_bus || '',
      zz1_atividade_bus: apiData.business_partner_z?.zz1_atividade_bus || '',
      zz1_situacao_bus: apiData.business_partner_z?.zz1_situacao_bus || '',

      // Arrays
      cliente_empresas: apiData.cliente_empresas || [],
      vendas_distribuicoes: apiData.vendas_distribuicoes || [],
      fornecedor_empresas: apiData.fornecedor_empresas || [],
      fornecedor_compras: apiData.fornecedor_compras || [],
      relacoes: apiData.relacoes || [],
      partner_functions: apiData.partner_functions || [],
    };
  }, [validateDate]);

  const methods = useForm({
    resolver: zodResolver(businessPartnerFormSchema),
    defaultValues: mapApiDataToForm(businessPartner),
    mode: 'onChange', // Validação em tempo real
  });

  const {
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isDirty, isValid },
  } = methods;

  // Log de erros para debug
  console.log('Erros do formulário:', errors);
  console.log('Formulário válido:', isValid);

  // Monitora mudanças na função para preencher grupo de contas e categoria
  const funcao = watch('funcao');

  // Preenche grupo de contas e categoria baseado na função
  useEffect(() => {
    if (funcao === 'FORNECEDOR') {
      setValue('grupo_contas', 'SUPL');
      setValue('category', '2'); // Pessoa Jurídica para fornecedores
      trigger('grupo_contas');
      trigger('category');
    } else if (funcao === 'CLIENTE') {
      setValue('grupo_contas', 'CUST');
      setValue('category', '2'); // Pessoa Jurídica para clientes
      trigger('grupo_contas');
      trigger('category');
    }
  }, [funcao, setValue, trigger]);

  // ----------------------------------------------------------------------

  /**
   * Manipula os dados encontrados pela consulta de CNPJ
   */
  const handleCnpjFound = useCallback((data) => {
    // Preenche os campos básicos do formulário
    setValue('nome_nome_fantasia', data.nomeFantasia || '');
    setValue('sobrenome_razao_social', data.razaoSocial || '');
    setValue('cnpj', data.cnpj || '');
    
    // Força a atualização do campo CNPJ
    trigger('cnpj');
    
    // Se tem CNPJ, define como sócio e gênero como outro
    if (data.cnpj) {
      setValue('tipo', 'SOCI');
      setValue('genero', 'OUTRO');
      trigger('tipo');
      trigger('genero');
    }
    
    // Preenche dados de endereço se disponíveis
    if (data.endereco) {
      setValue('rua', data.endereco.logradouro || '');
      setValue('bairro', data.endereco.bairro || '');
      setValue('cidade', data.endereco.municipio || '');
      setValue('estado', data.endereco.uf || '');
      setValue('cep', data.endereco.cep || '');
      setValue('numero', data.endereco.numero || '');
      setValue('complemento', data.endereco.complemento || '');
      setValue('pais', data.endereco.pais || '');
    }
    
    // Preenche dados de contato se disponíveis
    if (data.contato) {
      setValue('telefone', data.contato.telefone || '');
      setValue('email', data.contato.email || '');
    }
    
    // Preenche dados adicionais
    setValue('inscr_estadual', data.inscricaoEstadual || '');
    setValue('inscr_municipal', data.inscricaoMunicipal || '');
    setValue('regime_tributario', data.regimeTributario || '');
    setValue('atividade_principal', data.atividadePrincipal || '');
    
    // Preenche data de abertura se disponível
    if (data.dataAbertura) {
      const validDate = validateDate(data.dataAbertura);
      setValue('data_fundacao', validDate);
    }
    
    // Preenche dados dos sócios (salva como observações por enquanto)
    if (data.socios && data.socios.length > 0) {
      const sociosText = data.socios.map(socio => 
        `${socio.nome} - ${socio.qualificacao} (desde ${socio.dataEntrada})`
      ).join('; ');
      setValue('observacoes', `Sócios: ${sociosText}`);
    }
    
    // Preenche termos de pesquisa
    setValue('termo_pesquisa1', data.razaoSocial || ''); // Razão social
    setValue('termo_pesquisa2', data.cnpj ? data.cnpj.replace(/\D/g, '') : ''); // CNPJ sem caracteres especiais
    
    toast.success(`Dados preenchidos automaticamente! ${data.socios?.length || 0} sócio(s) encontrado(s).`);
  }, [setValue, trigger, validateDate]);

  /**
   * Envia o parceiro de negócio para o SAP diretamente
   */
  const handleSendToSap = useCallback(async () => {
    if (!businessPartner?.id) {
      toast.error('ID do parceiro de negócio não encontrado');
      return;
    }

    try {
      setIsSendingToSap(true);
      
      const result = await sendBusinessPartnerToSap(businessPartner.id);
      
      if (result.success) {
        // Exibe sucesso com a mensagem da resposta
        toast.success(result.message || 'Parceiro de negócio enviado para o SAP com sucesso!');
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
        
        // Exibe toast com erro do SAP
        toast.error(`Erro do SAP: ${errorMessage}`, {
          duration: 8000, // Toast mais longo para ler a mensagem
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
  }, [businessPartner?.id]);

  /**
   * Submete o formulário e salva o parceiro de negócio
   */
  const onSubmit = useCallback(async (formData) => {
    console.log('Formulário submetido!', formData);
    
    try {
      isSubmitting.onTrue();
      console.log('Iniciando envio...');

      // Transforma os dados do formulário para o formato da API
      const apiPayload = {
        // Dados básicos
        cod_antigo: formData.cod_antigo || '',
        tipo: formData.tipo || '',
        funcao: formData.funcao || '',
        empresa: formData.empresa || '',
        nome_nome_fantasia: formData.nome_nome_fantasia || '',
        sobrenome_razao_social: formData.sobrenome_razao_social || '',
        nome3: formData.nome3 || '',
        nome4: formData.nome4 || '',
        vocativo: formData.vocativo || '',
        grupo_contas: formData.grupo_contas || '',
        agr_contas: formData.agr_contas || '',
        sexo: formData.genero || '', // Backend espera 'sexo' ao invés de 'genero'
        data_nascimento: validateDate(formData.data_nascimento),
        data_fundacao: validateDate(formData.data_fundacao),
        termo_pesquisa1: formData.termo_pesquisa1 || '',
        termo_pesquisa2: formData.termo_pesquisa2 || '',
        
        // Endereço
        endereco: {
          rua: formData.rua || '',
          rua2: formData.rua2 || '',
          numero: formData.numero || '',
          bairro: formData.bairro || '',
          cep: formData.cep || '',
          cidade: formData.cidade || '',
          estado: formData.estado || '',
          complemento: formData.complemento || '',
          pais: formData.pais || 'Brasil'
        },
        
        // Comunicação
        comunicacao: {
          telefone: formData.telefone || '',
          telefone2: formData.telefone2 || '',
          telefone3: formData.telefone3 || '',
          celular: formData.celular || '',
          email: formData.email || '',
          observacoes: formData.observacoes || ''
        },
        
        // Identificação
        identificacao: {
          cpf: formData.cpf || '',
          cnpj: formData.cnpj || '',
          inscr_estadual: formData.inscr_estadual || '',
          inscr_municipal: formData.inscr_municipal || '',
          tipo_id_ident: formData.tipo_id_ident || '',
          numero_id: formData.numero_id || ''
        },
        
        // Setor Industrial
        setor_industrial: {
          chave_setor_ind: formData.chave_setor_ind || '',
          cod_setor_ind: formData.cod_setor_ind || '',
          setor_ind_padrao: formData.setor_ind_padrao || ''
        },
        category: formData.category || '',
        
        // Pagamentos
        pagamentos: {
          cod_banco: formData.cod_banco || '',
          cod_agencia: formData.cod_agencia || '',
          cod_conta: formData.cod_conta || '',
          dig_conta: formData.dig_conta || '',
          favorecido: formData.favorecido || '',
          cpf_favorecido: formData.cpf_favorecido || ''
        },
        
        // Vendas
        vendas: {
          vendas_grupo_clientes: formData.vendas_grupo_clientes || '',
          vendas_escritorio_vendas: formData.vendas_escritorio_vendas || '',
          vendas_equipe_vendas: formData.vendas_equipe_vendas || '',
          vendas_atributo_1: formData.vendas_atributo_1 || '',
          vendas_atributo_2: formData.vendas_atributo_2 || '',
          vendas_sociedade_parceiro: formData.vendas_sociedade_parceiro || '',
          vendas_centro_fornecedor: formData.vendas_centro_fornecedor || '',
          condicao_expedicao: formData.condicao_expedicao || '',
          vendas_relevante_liquidacao: formData.vendas_relevante_liquidacao ? 'X' : '',
          relevante_crr: formData.relevante_crr ? 'X' : '',
          perfil_cliente_bayer: formData.perfil_cliente_bayer || ''
        },
        
        // Fornecedor IRF
        fornecedor_irf: {
          devolucao: formData.devolucao ? 'X' : '',
          rev_fat_bas_em: formData.rev_fat_bas_em || '',
          grp_esq_forn: formData.grp_esq_forn || '',
          relevante_liquidacao: formData.relevante_liquidacao ? 'X' : '',
          regime_pis_cofins: formData.regime_pis_cofins || '',
          tipo_imposto: formData.tipo_imposto || '',
          optante_simples: formData.optante_simples ? 'S' : 'N',
          simples_nacional: formData.simples_nacional ? 'S' : 'N',
          recebedor_alternativo: formData.recebedor_alternativo ? 'S' : 'N'
        },
        
        // Business Partner Z (Campos Customizados)
        business_partner_z: {
          zz1_localidade_bus: formData.zz1_localidade_bus || '',
          zz1_latitude_bus: formData.zz1_latitude_bus || '',
          zz1_longitude_bus: formData.zz1_longitude_bus || '',
          zz1_atividade_bus: formData.zz1_atividade_bus || '',
          zz1_situacao_bus: formData.zz1_situacao_bus || ''
        },
        
        // Arrays
        cliente_empresas: formData.cliente_empresas || [],
        vendas_distribuicoes: formData.vendas_distribuicoes || [],
        fornecedor_empresas: formData.fornecedor_empresas || [],
        fornecedor_compras: formData.fornecedor_compras || [],
        relacoes: formData.relacoes || [],
        partner_functions: formData.partner_functions || []
      };

      console.log('Payload sendo enviado:', apiPayload);

      // Chama a função apropriada dependendo se é edição ou criação
      const result = isEdit 
        ? await updateBusinessPartner(businessPartner.id, apiPayload)
        : await createBusinessPartner(apiPayload);

      if (result.success) {
        toast.success(isEdit ? 'Parceiro de negócio atualizado com sucesso!' : 'Parceiro de negócio criado com sucesso!');
        router.push(paths.dashboard.businessPartner.root);
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao salvar parceiro de negócio:', error);
      toast.error(`Erro ao salvar parceiro de negócio: ${error.message}`);
    } finally {
      isSubmitting.onFalse();
    }
  }, [router, isSubmitting, validateDate, isEdit, businessPartner]);

  /**
   * Cancela a edição e volta para a lista
   */
  const handleCancel = useCallback(() => {
    if (isDirty) {
      if (window.confirm('Tem certeza que deseja cancelar? As alterações serão perdidas.')) {
        router.push(paths.dashboard.businessPartner.root);
      }
    } else {
      router.push(paths.dashboard.businessPartner.root);
    }
  }, [isDirty, router]);

  /**
   * Renderiza o conteúdo da aba atual
   */
  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'general':
        return <BusinessPartnerGeneralTab isView={isView} />;
      case 'address':
        return <BusinessPartnerAddressTab isView={isView} />;
      case 'communication':
        return <BusinessPartnerCommunicationTab isView={isView} />;
      case 'identification':
        return <BusinessPartnerIdentificationTab isView={isView} />;
      case 'industrial':
        return <BusinessPartnerIndustrialTab isView={isView} />;
      case 'payment':
        return <BusinessPartnerPaymentTab isView={isView} />;
      case 'sales':
        return <BusinessPartnerSalesTab isView={isView} />;
      case 'supplier':
        return <BusinessPartnerSupplierTab isView={isView} />;
      case 'relations':
        return <BusinessPartnerRelationsTab isView={isView} businessPartner={businessPartner} />;
      default:
        return <BusinessPartnerGeneralTab isView={isView} />;
    }
  };

  // ----------------------------------------------------------------------

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={
          isView 
            ? 'Visualizar Parceiro de Negócio' 
            : isEdit 
              ? 'Editar Parceiro de Negócio' 
              : 'Novo Parceiro de Negócio'
        }
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Parceiros de Negócio', href: paths.dashboard.businessPartner.root },
          { name: isView ? 'Visualizar' : isEdit ? 'Editar' : 'Novo' },
        ]}
        action={
          !isView ? (
            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:search-bold" />}
              onClick={() => setCnpjModalOpen(true)}
            >
              Consultar Dados (CNPJ)
            </Button>
          ) : (
            <Stack direction="row" spacing={2}>
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
              <Button
                variant="outlined"
                startIcon={<Iconify icon="solar:pen-bold" />}
                onClick={() => router.push(paths.dashboard.businessPartner.edit(businessPartner?.id))}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="solar:arrow-left-bold" />}
                onClick={() => router.push(paths.dashboard.businessPartner.root)}
              >
                Voltar
              </Button>
            </Stack>
          )
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/* Abas de Navegação */}
            <Card>
              <Tabs
                value={currentTab}
                onChange={(event, newValue) => setCurrentTab(newValue)}
                sx={{
                  px: 3,
                  boxShadow: (theme) => `inset 0 -2px 0 0 ${theme.palette.divider}`,
                }}
              >
                {TABS.map((tab) => (
                  <Tab
                    key={tab.value}
                    value={tab.value}
                    label={tab.label}
                    icon={<Iconify icon={tab.icon} />}
                    iconPosition="start"
                    disabled={tab.disabled}
                  />
                ))}
              </Tabs>
            </Card>

            {/* Conteúdo da Aba Atual */}
            <Card sx={{ p: 3 }}>
              {renderCurrentTab()}
            </Card>

            {/* Ações do Formulário */}
            {!isView && (
              <Card sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={isSubmitting.value}
                  >
                    Cancelar
                  </Button>

                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting.value}
                    startIcon={<Iconify icon="solar:check-circle-bold" />}
                  >
                    {isEdit ? 'Atualizar' : 'Criar'} Parceiro
                  </LoadingButton>
                </Stack>
              </Card>
            )}
          </Stack>
        </form>
      </FormProvider>

      {/* Modal de Consulta de CNPJ */}
      <CnpjConsultModal
        open={cnpjModalOpen}
        onClose={() => setCnpjModalOpen(false)}
        onCnpjFound={handleCnpjFound}
      />
    </DashboardContent>
  );
}
