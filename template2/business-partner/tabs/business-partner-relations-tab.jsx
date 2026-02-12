import { useState } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import {
  DynamicArrayManager,
  SalesDistributionForm,
  ClientCompanyForm,
  SupplierCompanyForm,
  SupplierPurchaseForm,
  RelationForm,
  PartnerFunctionForm,
} from '../components';

// ----------------------------------------------------------------------

/**
 * Aba de Relações e Funções
 * Arrays dinâmicos para diferentes tipos de relações
 */
export function BusinessPartnerRelationsTab({ isView = false, businessPartner = null }) {
  const [expanded, setExpanded] = useState('vendas-distribuicoes');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Valores padrão para cada tipo de array
  const defaultValues = {
    clienteEmpresa: {
      centro: '',
      empresa: '',
      conta_conciliacao: '',
      cond_pgto: '',
      grp_admin_tesouraria: '',
      form_pgto: '',
      banco_empresa_cliente: '',
      verificar_fatura_duplicada: '',
      procedimento_advertencia: '',
      responsavel_advertencia: '',
    },
    vendasDistribuicao: {
      org_vendas: '',
      canal_distr: '',
      setor_ativ: '',
      regiao_vendas: '',
      prioridade_remessa: '',
      incoterms: '',
      local_inco1: '',
      grp_class_cont_cli: '',
      class_fiscal: '',
      moeda_cliente: 'BRL',
      esquema_cliente: '',
      grupo_preco: '',
      lista_preco: '',
      compensacao: '',
      icms: '',
      ipi: '',
      subst_fiscal: '',
      cfop: '',
      contrib_icms: '',
      tp_princ_set_ind: '',
      agrupamento_ordens: '',
    },
    fornecedorEmpresa: {
      centro: '',
      empresa: '',
      conta_conciliacao: '',
      grp_admin_tesouraria: '',
      cond_pgto: '',
      form_pgto: '',
      banco_empresa_fornecedor: '',
      verificar_fatura_duplicada: '',
      procedimento_advertencia: '',
      responsavel_advertencia: '',
      contrib_icms: '',
      tp_princ_set_ind: '',
    },
    fornecedorCompra: {
      org_compras: '',
      moeda_pedido: 'BRL',
      cond_pgto: '',
      incoterms: '',
      local_inco1: '',
      compensacao: '',
      marc_preco_forn: '',
    },
    relacao: {
      cod_produtor: '',
      tp_relacao: '',
      cod_propriedade: '',
      valid_date_from: '',
      valid_date_to: '',
    },
    partnerFunction: {
      partner: '',
      acao: 'INSERT',
      funcao: '',
      organ_vendas: '',
      canal_distr: '',
      setor_ativ: '',
      parceiro: '',
    },
  };

  // Configuração de colunas para cada array
  const columns = {
    clienteEmpresas: [
      { field: 'empresa', header: 'Empresa', width: 100 },
      { field: 'centro', header: 'Centro', width: 100 },
      { field: 'conta_conciliacao', header: 'Conta Conciliação', width: 150 },
      { field: 'cond_pgto', header: 'Cond. Pgto', width: 100 },
      { field: 'form_pgto', header: 'Forma Pgto', width: 100 },
    ],
    vendasDistribuicoes: [
      { field: 'org_vendas', header: 'Org. Vendas', width: 100 },
      { field: 'canal_distr', header: 'Canal Distr.', width: 100 },
      { field: 'setor_ativ', header: 'Setor Ativ.', width: 100 },
      { field: 'moeda_cliente', header: 'Moeda', width: 80 },
      { field: 'grupo_preco', header: 'Grupo Preço', width: 100 },
    ],
    fornecedorEmpresas: [
      { field: 'empresa', header: 'Empresa', width: 100 },
      { field: 'centro', header: 'Centro', width: 100 },
      { field: 'conta_conciliacao', header: 'Conta Conciliação', width: 150 },
      { field: 'cond_pgto', header: 'Cond. Pgto', width: 100 },
    ],
    fornecedorCompras: [
      { field: 'org_compras', header: 'Org. Compras', width: 120 },
      { field: 'moeda_pedido', header: 'Moeda', width: 80 },
      { field: 'cond_pgto', header: 'Cond. Pgto', width: 100 },
      { field: 'incoterms', header: 'Incoterms', width: 100 },
    ],
    relacoes: [
      { field: 'cod_produtor', header: 'Cód. Produtor', width: 120 },
      { field: 'tp_relacao', header: 'Tipo Relação', width: 120 },
      { field: 'cod_propriedade', header: 'Cód. Propriedade', width: 120 },
      { field: 'valid_date_from', header: 'Data Início', width: 120 },
      { field: 'valid_date_to', header: 'Data Fim', width: 120 },
    ],
    partnerFunctions: [
      { field: 'partner', header: 'Partner', width: 100 },
      { field: 'acao', header: 'Ação', width: 100 },
      { field: 'funcao', header: 'Função', width: 80 },
      { field: 'organ_vendas', header: 'Org. Vendas', width: 100 },
      { field: 'parceiro', header: 'Parceiro', width: 100 },
    ],
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Distribuições e Relações
      </Typography>

      <Stack spacing={2}>
        {/* Vendas Distribuições (Sales Organizations) */}
        <Accordion 
          expanded={expanded === 'vendas-distribuicoes'} 
          onChange={handleChange('vendas-distribuicoes')}
        >
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography variant="subtitle1">
              <Iconify icon="solar:shop-bold" sx={{ mr: 1 }} />
              Vendas - Organizações de Vendas
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DynamicArrayManager
              name="vendas_distribuicoes"
              title="Distribuição de Vendas"
              columns={columns.vendasDistribuicoes}
              FormComponent={SalesDistributionForm}
              defaultValues={defaultValues.vendasDistribuicao}
              isView={isView}
            />
          </AccordionDetails>
        </Accordion>

        {/* Cliente Empresas */}
        <Accordion 
          expanded={expanded === 'cliente-empresas'} 
          onChange={handleChange('cliente-empresas')}
        >
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography variant="subtitle1">
              <Iconify icon="solar:buildings-bold" sx={{ mr: 1 }} />
              Cliente - Dados por Empresa
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DynamicArrayManager
              name="cliente_empresas"
              title="Empresa Cliente"
              columns={columns.clienteEmpresas}
              FormComponent={ClientCompanyForm}
              defaultValues={defaultValues.clienteEmpresa}
              isView={isView}
            />
          </AccordionDetails>
        </Accordion>

        {/* Fornecedor Empresas */}
        <Accordion 
          expanded={expanded === 'fornecedor-empresas'} 
          onChange={handleChange('fornecedor-empresas')}
        >
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography variant="subtitle1">
              <Iconify icon="solar:box-bold" sx={{ mr: 1 }} />
              Fornecedor - Dados por Empresa
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DynamicArrayManager
              name="fornecedor_empresas"
              title="Empresa Fornecedor"
              columns={columns.fornecedorEmpresas}
              FormComponent={SupplierCompanyForm}
              defaultValues={defaultValues.fornecedorEmpresa}
              isView={isView}
            />
          </AccordionDetails>
        </Accordion>

        {/* Fornecedor Compras */}
        <Accordion 
          expanded={expanded === 'fornecedor-compras'} 
          onChange={handleChange('fornecedor-compras')}
        >
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography variant="subtitle1">
              <Iconify icon="solar:cart-large-bold" sx={{ mr: 1 }} />
              Fornecedor - Dados de Compras
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DynamicArrayManager
              name="fornecedor_compras"
              title="Compra Fornecedor"
              columns={columns.fornecedorCompras}
              FormComponent={SupplierPurchaseForm}
              defaultValues={defaultValues.fornecedorCompra}
              isView={isView}
            />
          </AccordionDetails>
        </Accordion>

        {/* Relações */}
        <Accordion 
          expanded={expanded === 'relacoes'} 
          onChange={handleChange('relacoes')}
        >
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography variant="subtitle1">
              <Iconify icon="solar:users-group-rounded-bold" sx={{ mr: 1 }} />
              Relações (Produtor/Propriedade)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DynamicArrayManager
              name="relacoes"
              title="Relação"
              columns={columns.relacoes}
              FormComponent={RelationForm}
              defaultValues={defaultValues.relacao}
              isView={isView}
            />
          </AccordionDetails>
        </Accordion>

        {/* Funções de Parceiro */}
        <Accordion 
          expanded={expanded === 'funcoes-parceiro'} 
          onChange={handleChange('funcoes-parceiro')}
        >
          <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
            <Typography variant="subtitle1">
              <Iconify icon="solar:user-id-bold" sx={{ mr: 1 }} />
              Funções de Parceiro
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DynamicArrayManager
              name="partner_functions"
              title="Função de Parceiro"
              columns={columns.partnerFunctions}
              FormComponent={PartnerFunctionForm}
              defaultValues={defaultValues.partnerFunction}
              isView={isView}
            />
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Box>
  );
}
