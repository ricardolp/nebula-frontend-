import { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { BusinessPartnerGeneralTab } from './tabs/business-partner-general-tab';
import { BusinessPartnerAddressTab } from './tabs/business-partner-address-tab';
import { BusinessPartnerCommunicationTab } from './tabs/business-partner-communication-tab';
import { BusinessPartnerIdentificationTab } from './tabs/business-partner-identification-tab';
import { BusinessPartnerIndustrialSectorTab } from './tabs/business-partner-industrial-sector-tab';
import { BusinessPartnerPaymentsTab } from './tabs/business-partner-payments-tab';
import { BusinessPartnerPurchasesTab } from './tabs/business-partner-purchases-tab';
import { BusinessPartnerSalesTab } from './tabs/business-partner-sales-tab';
import { BusinessPartnerPartnerFunctionsTab } from './tabs/business-partner-partner-functions-tab';
import { BusinessPartnerCreditCollectionTab } from './tabs/business-partner-credit-collection-tab';
import { BusinessPartnerCreditDataTab } from './tabs/business-partner-credit-data-tab';
import { BusinessPartnerCustomFieldsTab } from './tabs/business-partner-custom-fields-tab';
import { BusinessPartnerAdditionalDataTab } from './tabs/business-partner-additional-data-tab';

// ----------------------------------------------------------------------

/**
 * Mapeamento de campos para suas respectivas abas
 * Usado para identificar qual aba contém um campo com erro
 */
const FIELD_TO_TAB_MAP = {
  // General tab
  codAntigo: 'general',
  tipo: 'general',
  funcao: 'general',
  grupoContas: 'general',
  agrContas: 'general',
  sexo: 'general',
  nomeNomeFantasia: 'general',
  sobrenomeRazaoSocial: 'general',
  nome3: 'general',
  nome4: 'general',
  termoPesquisa1: 'general',
  termoPesquisa2: 'general',
  vocativo: 'general',
  dataNascimentoFundacao: 'general',
  status: 'general',
  
  // Address tab
  'endereco.rua': 'address',
  'endereco.rua2': 'address',
  'endereco.numero': 'address',
  'endereco.complemento': 'address',
  'endereco.bairro': 'address',
  'endereco.cep': 'address',
  'endereco.cidade': 'address',
  'endereco.estado': 'address',
  'endereco.pais': 'address',
  
  // Communication tab
  'comunicacao.telefone': 'communication',
  'comunicacao.telefone2': 'communication',
  'comunicacao.telefone3': 'communication',
  'comunicacao.celular': 'communication',
  'comunicacao.email': 'communication',
  'comunicacao.observacoes': 'communication',
  'comunicacao.dataNascimento': 'communication',
  'comunicacao.dataFundacao': 'communication',
  
  // Identification tab
  'identificacao.cpf': 'identification',
  'identificacao.cnpj': 'identification',
  'identificacao.inscrEstatual': 'identification',
  'identificacao.inscrMunicipal': 'identification',
  'identificacao.tipoIdIdent': 'identification',
  'identificacao.numeroId': 'identification',
  
  // Industrial Sector tab
  'setorIndustrial.chaveSetorInd': 'industrial-sector',
  'setorIndustrial.codSetorInd': 'industrial-sector',
  'setorIndustrial.setorIndPadrao': 'industrial-sector',
  
  // Payments tab
  'pagamentos.codBanco': 'payments',
  'pagamentos.codAgencia': 'payments',
  'pagamentos.digAgencia': 'payments',
  'pagamentos.codConta': 'payments',
  'pagamentos.digConta': 'payments',
  'pagamentos.favorecido': 'payments',
  'pagamentos.cpfFavorecido': 'payments',
  
  // Partner Functions tab
  'funcoesParceiro.funcaoParceiro': 'partner-functions',
  'funcoesParceiro.autorizacao': 'partner-functions',
  'funcoesParceiro.validadeInicio': 'partner-functions',
  'funcoesParceiro.validadeFim': 'partner-functions',
  
  // Additional Data tab
  'dadosAdicionais.observacoes': 'additional-data',
  'dadosAdicionais.informacoesComplementares': 'additional-data',
  'dadosAdicionais.referenciaExterna': 'additional-data',
  'dadosAdicionais.codigoAntigo': 'additional-data',
};

/**
 * Identifica qual aba contém determinado campo
 */
function getTabForField(fieldPath) {
  // Verifica se o campo está no mapa
  if (FIELD_TO_TAB_MAP[fieldPath]) {
    return FIELD_TO_TAB_MAP[fieldPath];
  }
  
  // Se não encontrou, tenta verificar se é um campo de array (ex: fornecedorEmpresas[0].campo)
  if (fieldPath.includes('[')) {
    const baseField = fieldPath.split('[')[0];
    if (baseField.includes('fornecedor') || baseField.includes('Fornecedor')) {
      return 'purchases';
    }
    if (baseField.includes('cliente') || baseField.includes('Cliente')) {
      return 'sales';
    }
    if (baseField.includes('dadosCredito') || baseField === 'dadosCredito') {
      return 'credit-data';
    }
    if (baseField === 'collection') {
      return 'credit-collection';
    }
  }
  
  // Verifica campos de arrays
  if (fieldPath.startsWith('fornecedor')) return 'purchases';
  if (fieldPath.startsWith('cliente')) return 'sales';
  if (fieldPath.startsWith('dadosCredito')) return 'credit-data';
  if (fieldPath.startsWith('collection')) return 'credit-collection';
  if (fieldPath.startsWith('camposZ')) return 'custom-fields';
  
  return null;
}

const ALL_TABS = [
  {
    value: 'general',
    label: 'Dados Básicos',
    icon: <Iconify icon="solar:user-bold" />,
    component: BusinessPartnerGeneralTab,
    alwaysVisible: true,
  },
  {
    value: 'custom-fields',
    label: 'Informações Gerais',
    icon: <Iconify icon="solar:settings-2-bold" />,
    component: BusinessPartnerCustomFieldsTab,
    alwaysVisible: true,
  },
  {
    value: 'address',
    label: 'Endereço',
    icon: <Iconify icon="solar:home-2-bold" />,
    component: BusinessPartnerAddressTab,
    alwaysVisible: true,
  },
  {
    value: 'communication',
    label: 'Comunicação',
    icon: <Iconify icon="solar:phone-bold" />,
    component: BusinessPartnerCommunicationTab,
    alwaysVisible: true,
  },
  {
    value: 'identification',
    label: 'Identificação',
    icon: <Iconify icon="solar:id-card-bold" />,
    component: BusinessPartnerIdentificationTab,
    alwaysVisible: true,
  },
  {
    value: 'industrial-sector',
    label: 'Setor Industrial',
    icon: <Iconify icon="solar:buildings-2-bold" />,
    component: BusinessPartnerIndustrialSectorTab,
    alwaysVisible: true,
  },
  {
    value: 'payments',
    label: 'Pagamentos',
    icon: <Iconify icon="solar:credit-card-bold" />,
    component: BusinessPartnerPaymentsTab,
    alwaysVisible: true,
  },
  {
    value: 'purchases',
    label: 'Compras',
    icon: <Iconify icon="solar:cart-bold" />,
    component: BusinessPartnerPurchasesTab,
    alwaysVisible: false,
    condition: (funcao) => funcao?.includes('FORN'),
  },
  {
    value: 'sales',
    label: 'Vendas',
    icon: <Iconify icon="solar:shop-bold" />,
    component: BusinessPartnerSalesTab,
    alwaysVisible: false,
    condition: (funcao) => funcao?.includes('CLI'),
  },
  {
    value: 'partner-functions',
    label: 'Funções de Parceiro',
    icon: <Iconify icon="solar:settings-bold" />,
    component: BusinessPartnerPartnerFunctionsTab,
    alwaysVisible: true,
  },
  {
    value: 'credit-data',
    label: 'Dados de Crédito',
    icon: <Iconify icon="solar:shield-check-bold" />,
    component: BusinessPartnerCreditDataTab,
    alwaysVisible: true,
  },
  {
    value: 'credit-collection',
    label: 'Credit Collection',
    icon: <Iconify icon="solar:bill-list-bold" />,
    component: BusinessPartnerCreditCollectionTab,
    alwaysVisible: true,
  },
  {
    value: 'additional-data',
    label: 'Dados Adicionais',
    icon: <Iconify icon="solar:document-text-bold" />,
    component: BusinessPartnerAdditionalDataTab,
    alwaysVisible: false,
  },
];

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {Object} props.form - Form instance from react-hook-form
 * @param {Function} props.onSubmit - Submit callback
 * @param {boolean} props.isSubmitting - Loading state
 * @param {boolean} props.isViewMode - Se true, desabilita todos os campos (modo visualização)
 */
export function BusinessPartnerTabs({ form, onSubmit, isSubmitting, isViewMode = false }) {
  const [currentTab, setCurrentTab] = useState('general');
  const { watch, formState } = form;
  
  // Watch the funcao field to determine which tabs should be visible
  const funcao = watch('funcao');
  
  // Identifica quais abas têm erros
  const tabsWithErrors = useMemo(() => {
    const errors = formState.errors || {};
    const tabsSet = new Set();
    
    // Função recursiva para coletar todos os caminhos de erro
    const collectErrorPaths = (obj, prefix = '') => {
      Object.keys(obj).forEach((key) => {
        const fullPath = prefix ? `${prefix}.${key}` : key;
        
        if (obj[key]?.message) {
          // É um erro direto
          const tab = getTabForField(fullPath);
          if (tab) tabsSet.add(tab);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          // É um objeto aninhado, continua a busca
          collectErrorPaths(obj[key], fullPath);
        }
      });
    };
    
    collectErrorPaths(errors);
    return Array.from(tabsSet);
  }, [formState.errors]);

  // Filter tabs based on conditions
  const visibleTabs = useMemo(() => ALL_TABS.filter((tab) => {
    if (tab.alwaysVisible) return true;
    if (tab.condition && typeof tab.condition === 'function') {
      return tab.condition(funcao);
    }
    return false;
  }), [funcao]);

  // Redirect to first visible tab if current tab is not visible
  useEffect(() => {
    const isCurrentTabVisible = visibleTabs.some((tab) => tab.value === currentTab);
    if (!isCurrentTabVisible && visibleTabs.length > 0) {
      setCurrentTab(visibleTabs[0].value);
    }
  }, [visibleTabs, currentTab]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const currentTabData = visibleTabs.find((tab) => tab.value === currentTab);
  const CurrentTabComponent = currentTabData?.component;

  return (
    <Card sx={{ overflow: 'visible' }}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        sx={{
          px: 2.5,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {visibleTabs.map((tab) => {
          const hasError = tabsWithErrors.includes(tab.value);
          
          return (
            <Tab
              key={tab.value}
              value={tab.value}
              icon={
                hasError ? (
                  <Badge
                    variant="dot"
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        right: -3,
                        top: 3,
                      },
                    }}
                  >
                    {tab.icon}
                  </Badge>
                ) : (
                  tab.icon
                )
              }
              label={tab.label}
              iconPosition="start"
              sx={{ 
                minHeight: 64,
                ...(hasError && {
                  borderBottom: 3,
                  borderColor: 'error.main',
                }),
              }}
            />
          );
        })}
      </Tabs>

      <Box sx={{ p: 3, overflow: 'visible' }}>
        {currentTabData && (
          <Stack spacing={3} sx={{ overflow: 'visible' }}>
            <Typography variant="h6">{currentTabData.label}</Typography>
            
            {CurrentTabComponent && (
              <CurrentTabComponent form={form} disabled={isViewMode} />
            )}
          </Stack>
        )}

        {!isViewMode && (
          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 4 }}>
            <Button variant="outlined" size="large">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              onClick={onSubmit}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Parceiro'}
            </Button>
          </Stack>
        )}
      </Box>
    </Card>
  );
}
