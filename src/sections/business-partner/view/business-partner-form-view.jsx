import { useCallback, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';
import { useAuthContext } from 'src/auth/hooks';

import {
  getOrganizationForms,
  getOrganizationFormFields,
} from 'src/actions/forms';

import { getOrganizationBp, createOrganizationBp } from 'src/actions/bps';
import { mapBpApiToFormValues, getEmptyClienteVendasItem } from 'src/sections/business-partner/data/bp-api-to-form-values';
import { mapFormValuesToBpPayload } from 'src/sections/business-partner/data/form-values-to-bp-payload';

import { BUSINESS_PARTNER_FORM_ID } from 'src/sections/business-partner/data/business-partner-form-config';
import { PARTNER_FIELD_TEMPLATES } from 'src/sections/business-partner/data/partner-field-templates-for-builder';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DomainMatchcodeCombobox } from 'src/components/domain-matchcode-combobox';
import { PhoneInput } from 'src/components/phone-input';
import { toast } from 'src/components/snackbar';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import Alert from '@mui/material/Alert';

import { BUSINESS_PARTNER_TABS } from 'src/sections/business-partner/data/business-partner-tabs-config';
import { getVisibleTabs } from 'src/sections/business-partner/data/partner-function-tabs-config';
import { getFieldWidgetConfig, WIDGET_TYPES } from 'src/sections/business-partner/data/field-widget-config';

import { formatCep, formatCpf, formatCnpj } from 'src/lib/masks';
import { searchCep } from 'src/services/cep-api';
import { fetchCnpjaOffice } from 'src/services/cnpja-api';
import { validateBusinessPartnerForm } from 'src/sections/business-partner/data/business-partner-validation';

import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

dayjs.extend(relativeTime);

// ----------------------------------------------------------------------
// Formatação de moeda (capital social)
// ----------------------------------------------------------------------
function formatCurrency(value) {
  if (value == null || value === '') return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
}

// ----------------------------------------------------------------------
// Conteúdo do popup de resultado da consulta CNPJA (layout tipo perfil empresa)
// ----------------------------------------------------------------------
function CnpjaResultDialogContent({ data, onRemoverDados, onUsarNoCadastro, formatCnpjDisplay }) {
  const company = data.company || {};
  const address = data.address || {};
  const phones = data.phones || [];
  const mainActivity = data.mainActivity;
  const sideActivities = data.sideActivities || [];
  const members = company.members || [];
  const taxId = data.taxId || '';
  const taxIdShort = taxId.toString().slice(0, 8);
  const cnpjFormatted = formatCnpjDisplay(taxId.toString());
  const updatedAt = data.updated
    ? dayjs(data.updated).fromNow()
    : '';

  const phoneDisplay = phones.length > 0
    ? phones.map((p) => `(${p.area || ''}) ${(p.number || '').replace(/(\d{4,5})(\d{4})/, '$1-$2')}`).join(', ')
    : '—';

  return (
    <>
      <Box sx={{ px: 3, pt: 2.5, pb: 1.5, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ typography: 'body2', color: 'text.secondary' }}>
          <Typography variant="body2" color="text.primary" fontWeight={600}>Empresas</Typography>
          <Iconify icon="eva:chevron-right-fill" width={16} />
          <Typography variant="body2">{taxIdShort}</Typography>
          <Iconify icon="eva:chevron-right-fill" width={16} />
          <Typography variant="body2" fontWeight={500}>{cnpjFormatted}</Typography>
        </Stack>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={18} />}
          onClick={onRemoverDados}
        >
          Remover Dados
        </Button>
      </Box>

      <Scrollbar sx={{ maxHeight: 'calc(90vh - 180px)' }}>
        <Box sx={{ p: 3 }}>
          {/* Card: Dados principais da empresa */}
          <Card variant="outlined" sx={{ p: 2.5, mb: 2 }}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                <Typography variant="h6">{company.name || '—'}</Typography>
                <Stack direction="row" spacing={0.5}>
                  <IconButton size="small" onClick={() => navigator.clipboard?.writeText(company.name)}>
                    <Iconify icon="solar:copy-bold" width={18} />
                  </IconButton>
                </Stack>
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Iconify icon="solar:shield-check-bold" width={20} color="success.main" />
                  <Typography variant="body2">{data.status?.text || '—'}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Iconify icon="solar:calendar-bold" width={20} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {data.founded ? dayjs(data.founded).format('DD/MM/YYYY') : '—'} - Presente
                  </Typography>
                </Stack>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="solar:document-text-bold" width={20} sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2">{company.nature?.text || '—'}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="solar:wallet-money-bold" width={20} sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2">{formatCurrency(company.equity)}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="solar:phone-bold" width={20} sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2">{phoneDisplay}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={0.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:map-point-bold" width={20} sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">{address.district || '—'}</Typography>
                      <Typography variant="body2" color="text.secondary">{address.number ? `Nº ${address.number}` : 'S/N'}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 3 }}>
                      <Typography variant="body2">{address.street || '—'}</Typography>
                      {address.details && <Typography variant="body2" color="text.secondary">• {address.details}</Typography>}
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 3 }}>
                      <Typography variant="body2">{[address.city, address.state].filter(Boolean).join(' ')}</Typography>
                      {address.zip && <Typography variant="body2">{address.zip}</Typography>}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
              {updatedAt && (
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary', typography: 'caption' }}>
                  <Iconify icon="solar:check-circle-bold" width={16} />
                  <span>Atualizado {updatedAt} via Receita Federal</span>
                  <Iconify icon="eva:external-link-outline" width={14} />
                </Stack>
              )}
            </Stack>
          </Card>

          <Grid container spacing={2}>
            {/* Atividades Econômicas */}
            <Grid item xs={12} md={7}>
              <Card variant="outlined" sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Atividades Econômicas
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>CNAE</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Descrição</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mainActivity && (
                      <TableRow>
                        <TableCell>{mainActivity.id || '—'}</TableCell>
                        <TableCell>Principal</TableCell>
                        <TableCell>{mainActivity.text || '—'}</TableCell>
                      </TableRow>
                    )}
                    {sideActivities.map((act) => (
                      <TableRow key={act.id || act.text}>
                        <TableCell>{act.id || '—'}</TableCell>
                        <TableCell>Secundária</TableCell>
                        <TableCell>{act.text || '—'}</TableCell>
                      </TableRow>
                    ))}
                    {!mainActivity && sideActivities.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ color: 'text.secondary' }}>Nenhuma atividade informada</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {updatedAt && (
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1.5, color: 'text.secondary', typography: 'caption' }}>
                    <Iconify icon="solar:check-circle-bold" width={16} />
                    <span>Atualizado {updatedAt} via Receita Federal</span>
                  </Stack>
                )}
              </Card>
            </Grid>

            {/* Coluna direita: Porte / Regime e Sócios */}
            <Grid item xs={12} md={5}>
              <Stack spacing={2}>
                {(company.size?.text || company.size?.acronym) && (
                  <Card variant="outlined" sx={{ p: 2.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                      Porte / Regime
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:document-text-bold" width={20} sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">{company.size?.text || company.size?.acronym || '—'}</Typography>
                    </Stack>
                  </Card>
                )}
                <Card variant="outlined" sx={{ p: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                    Sócios e Administradores
                  </Typography>
                  <Stack spacing={1.5}>
                    {members.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">Nenhum sócio informado</Typography>
                    ) : (
                      members.map((m, idx) => (
                        <Box key={m.person?.id || idx} sx={{ py: 1, borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                          <Typography variant="body2" fontWeight={600}>{m.person?.name || '—'}</Typography>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                            <Iconify icon="solar:document-text-bold" width={16} sx={{ color: 'text.secondary' }} />
                            <Typography variant="caption">{m.role?.text || '—'}</Typography>
                            {m.since && <Typography variant="caption">desde {dayjs(m.since).format('DD/MM/YYYY')}</Typography>}
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.25 }}>
                            <Iconify icon="solar:user-bold" width={16} sx={{ color: 'text.secondary' }} />
                            <Typography variant="caption">{m.person?.taxId || '—'}</Typography>
                            {m.person?.age && <Typography variant="caption">• {m.person.age}</Typography>}
                          </Stack>
                        </Box>
                      ))
                    )}
                  </Stack>
                  {updatedAt && (
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1.5, color: 'text.secondary', typography: 'caption' }}>
                      <Iconify icon="solar:check-circle-bold" width={16} />
                      <span>Atualizado {updatedAt} via Receita Federal</span>
                    </Stack>
                  )}
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Scrollbar>

      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onRemoverDados} color="inherit">
          Remover Dados
        </Button>
        <Button variant="contained" onClick={onUsarNoCadastro} startIcon={<Iconify icon="solar:check-circle-bold" width={18} />}>
          Usar no cadastro
        </Button>
      </DialogActions>
    </>
  );
}

// ----------------------------------------------------------------------
// Labels para breadcrumb e exibição (tipo/função ocultos no formulário quando vêm do diálogo)
// ----------------------------------------------------------------------

const TIPO_LABELS = { PF: 'Pessoa Física', PJ: 'Pessoa Jurídica' };
const FUNCAO_LABELS = { C: 'Cliente', F: 'Fornecedor', A: 'Cliente e Fornecedor' };

// Vocativo: opções por tipo de parceiro (PF = pessoa física, PJ = pessoa jurídica)
// A opção vazia (value: '') tem label vazio para o campo aparecer em branco quando selecionada
const VOCATIVO_OPTIONS_PF = [
  { value: '', label: '' },
  { value: 'Sr.', label: 'Sr.' },
  { value: 'Sra.', label: 'Sra.' },
];
const VOCATIVO_OPTIONS_PJ = [
  { value: '', label: '' },
  { value: 'Empresa', label: 'Empresa' },
];

// Prioridade de remessa: 01 alta, 02 normal, 03 baixa
const PRIORIDADE_REMESSA_OPTIONS = [
  { value: '', label: '' },
  { value: '01', label: '01 - Alta' },
  { value: '02', label: '02 - Normal' },
  { value: '03', label: '03 - Baixa' },
];

// Grupo de classificação conta cliente: 01 receitas nacionais, 02 receitas internacionais, 03 rec. empr. afiliada
const GRP_CLASS_CONTA_CLIENTE_OPTIONS = [
  { value: '', label: '' },
  { value: '01', label: '01 - Receitas nacionais' },
  { value: '02', label: '02 - Receitas internacionais' },
  { value: '03', label: '03 - Rec. empr. afiliada' },
];

// Principais moedas (área de vendas)
const MOEDA_OPTIONS = [
  { value: '', label: '' },
  { value: 'BRL', label: 'BRL - Real brasileiro' },
  { value: 'USD', label: 'USD - Dólar americano' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - Libra esterlina' },
  { value: 'JPY', label: 'JPY - Iene japonês' },
  { value: 'CHF', label: 'CHF - Franco suíço' },
  { value: 'CAD', label: 'CAD - Dólar canadense' },
  { value: 'AUD', label: 'AUD - Dólar australiano' },
  { value: 'CNY', label: 'CNY - Yuan chinês' },
  { value: 'ARS', label: 'ARS - Peso argentino' },
  { value: 'CLP', label: 'CLP - Peso chileno' },
  { value: 'MXN', label: 'MXN - Peso mexicano' },
  { value: 'PYG', label: 'PYG - Guarani paraguaio' },
  { value: 'UYU', label: 'UYU - Peso uruguaio' },
];

// ----------------------------------------------------------------------

export function BusinessPartnerFormView({ partnerId, initialTipo = '', initialFuncao = '' }) {
  const navigate = useNavigate();
  const tabsState = useTabs('general');
  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  /** No "new": campos vêm do form builder (/dashboard/forms/:id/edit) */
  const [formBuilderFields, setFormBuilderFields] = useState([]);
  const [formBuilderLoading, setFormBuilderLoading] = useState(!partnerId);
  const [formBuilderError, setFormBuilderError] = useState(null);
  const [resolvedFormId, setResolvedFormId] = useState(null);

  /** Edição: carrega BP da API e controla modo somente leitura quando status === 'workflow' */
  const [bpLoading, setBpLoading] = useState(!!partnerId);
  const [bpError, setBpError] = useState(null);
  const [bpStatus, setBpStatus] = useState(null);

  /** Busca CEP (matchcode) */
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  /** Erros de validação ao salvar */
  const [validationErrors, setValidationErrors] = useState(null);

  /** Popup "Consultar dados" (CNPJ) – apenas para PJ */
  const [consultarDadosOpen, setConsultarDadosOpen] = useState(false);
  const [consultarDadosCnpj, setConsultarDadosCnpj] = useState('');
  const [cnpjaLoading, setCnpjaLoading] = useState(false);
  const [cnpjaError, setCnpjaError] = useState(null);
  const [cnpjaData, setCnpjaData] = useState(null);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);

  /** Modal Área de vendas (criar/editar) – usa selectedSalesAreaIndex como índice em edição */
  const [salesAreaModalOpen, setSalesAreaModalOpen] = useState(false);
  const [salesAreaModalCreateMode, setSalesAreaModalCreateMode] = useState(false);

  const [values, setValues] = useState(() => ({
    // 1. Dados Básicos (General) – initialTipo/initialFuncao vêm do diálogo "Novo parceiro"
    tipo: initialTipo || '',
    funcao: initialFuncao || '',
    agrContas: '',
    vocativo: initialTipo === 'PJ' ? 'Empresa' : '',
    nomeNomeFantasia: '',
    sobrenomeRazaoSocial: '',
    nome3: '',
    nome4: '',
    dataNascimentoFundacao: '',
    sexo: '',
    termoPesquisa1: '',
    termoPesquisa2: '',
    // Endereço
    cep: '',
    rua: '',
    numero: '',
    rua2: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pais: 'BR',
    // Comunicação
    telefone: '',
    telefone2: '',
    telefone3: '',
    celular: '',
    email: '',
    comunicacaoObservacoes: '',
    // Identificação
    cpf: '',
    cnpj: '',
    inscrEstatual: '',
    inscrMunicipal: '',
    tipoIdIdent: '',
    numeroId: '',
    // Setor Industrial
    chaveSetorInd: '',
    codSetorInd: '',
    setorIndPadrao: '',
    // Pagamentos
    codBanco: '',
    codAgencia: '',
    digAgencia: '',
    codConta: '',
    digConta: '',
    favorecido: '',
    cpfFavorecido: '',
    // Funções de Parceiro
    funcaoParceiro: '',
    autorizacao: '',
    validadeInicio: '',
    validadeFim: '',
    // Dados Adicionais
    referenciaExterna: '',
    codigoAntigo: '',
    observacoes: '',
    informacoesComplementares: '',
    // Compras (fornecedor – dados básicos)
    devolucao: false,
    revFatBasEm: false,
    revFatBasServ: false,
    relevanteLiquidacao: false,
    pedidoAutom: false,
    tipoNfe: '',
    tipoImposto: '',
    simplesNacional: '',
    grpEsqForn: '',
    cntrleConfir: '',
    regimePisCofins: '',
    optanteSimples: '',
    recebedorAlternativo: '',
    orgCompras: '',
    moedaPedido: '',
    condPgto: '',
    versIncoterms: '',
    incoterms: '',
    localInco1: '',
    compensacao: false,
    marcPrecoForn: '',
    centro: '',
    empresa: '',
    contaConciliacao: '',
    grpAdminTesouraria: '',
    minorit: '',
    formPgto: '',
    bancoEmpresaFornecedor: '',
    verificarFaturaDuplicada: '',
    procedimentoAdvertencia: '',
    responsavelAdvertencia: '',
    contribIcms: '',
    tpPrincSetInd: '',
    ctgIrf: '',
    codigoIrf: '',
    // Vendas (cliente)
    orgVendas: '',
    canalDistr: '',
    setorAtiv: '',
    regiaoVendas: '',
    prioridadeRemessa: '',
    grpClassContCli: '',
    classFiscal: '',
    moedaCliente: '',
    esquemaCliente: '',
    grupoPreco: '',
    listaPreco: '',
    icms: '',
    ipi: '',
    substFiscal: '',
    cfop: '',
    agrupamentoOrdens: false,
    vendasGrupoClientes: '',
    vendasEscritorioVendas: '',
    vendasEquipeVendas: '',
    vendasAtributo1: '',
    vendasAtributo2: '',
    vendasSociedadeParceiro: '',
    vendasCentroFornecedor: '',
    condicaoExpedicao: '',
    vendasRelevanteliquidacao: false,
    relevanteCrr: false,
    perfilClienteBayer: '',
    clienteVendasList: [],
    selectedSalesAreaIndex: null,
    chvOrdenacao: '',
    ajusValor: '',
    bancoEmpresaCliente: '',
    // Dados de Crédito (primeiro item do array)
    partner: '',
    creditRole: '',
    limitRule: '',
    riskClass: '',
    checkRule: '',
    creditGroup: '',
    segment: '',
    creditLimit: '',
    limitValidDate: '',
    followUpDt: '',
    xblocked: '',
    infocategory: '',
    infotype: '',
    checkRelevant: '',
    amount: '',
    currency: '',
    dateFrom: '',
    dateTo: '',
    dateFollowUp: '',
    creditText: '',
    // Credit Collection (primeiro item do array)
    collectionCodAntigo: '',
    collectionRole: '',
    perfil: '',
    collectionSegment: '',
    grupo: '',
    resp: '',
  }));

  /** Quando status === 'workflow', BP está em processo de criação via workflow – campos desativados */
  const isWorkflowStatus = bpStatus === 'workflow';

  const handleChange = useCallback((field, value) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'tipo') {
        if (value === 'PJ') next.vocativo = 'Empresa';
        else if (value === 'PF') next.vocativo = '';
      }
      // Termo pesquisa 1 = nome (razão social) em maiúsculas
      if (field === 'sobrenomeRazaoSocial') {
        next.termoPesquisa1 = (value || '').toUpperCase();
      }
      // Termo pesquisa 2 = CNPJ sem pontuação
      if (field === 'cnpj') {
        next.termoPesquisa2 = (value || '').replace(/\D/g, '');
      }
      return next;
    });
  }, []);

  /** Atualiza um campo da área de vendas selecionada (clienteVendasList[index]) */
  const handleSalesAreaChange = useCallback((index, field, value) => {
    setValues((prev) => {
      const list = Array.isArray(prev.clienteVendasList) ? [...prev.clienteVendasList] : [];
      if (index < 0 || index >= list.length) return prev;
      list[index] = { ...list[index], [field]: value };
      return { ...prev, clienteVendasList: list };
    });
  }, []);

  /** Abre modal para inserir nova área de vendas */
  const handleInserirArea = useCallback(() => {
    const empty = getEmptyClienteVendasItem();
    setValues((prev) => {
      const list = Array.isArray(prev.clienteVendasList) ? [...prev.clienteVendasList, empty] : [empty];
      return { ...prev, clienteVendasList: list, selectedSalesAreaIndex: list.length - 1 };
    });
    setSalesAreaModalCreateMode(true);
    setSalesAreaModalOpen(true);
  }, []);

  /** Abre modal para editar área de vendas no índice */
  const handleOpenEditSalesArea = useCallback((index) => {
    setValues((prev) => ({ ...prev, selectedSalesAreaIndex: index }));
    setSalesAreaModalCreateMode(false);
    setSalesAreaModalOpen(true);
  }, []);

  /** Fecha modal de área de vendas. Se cancel e era criação, remove o item adicionado */
  const handleCloseSalesAreaModal = useCallback((confirm) => {
    if (!confirm && salesAreaModalCreateMode) {
      setValues((prev) => {
        const list = Array.isArray(prev.clienteVendasList) ? [...prev.clienteVendasList] : [];
        if (list.length > 0) {
          const nextList = list.slice(0, -1);
          const nextIdx = nextList.length > 0 ? nextList.length - 1 : null;
          return { ...prev, clienteVendasList: nextList, selectedSalesAreaIndex: nextIdx };
        }
        return prev;
      });
    }
    setSalesAreaModalOpen(false);
    setSalesAreaModalCreateMode(false);
  }, [salesAreaModalCreateMode]);

  /** Seleciona qual área de vendas está sendo editada (sem abrir modal) */
  const handleSelectSalesAreaIndex = useCallback((index) => {
    setValues((prev) => ({ ...prev, selectedSalesAreaIndex: index }));
  }, []);

  const handleBack = useCallback(() => {
    navigate(paths.dashboard.businessPartners.root);
  }, [navigate]);

  const handleSearchCep = useCallback(async () => {
    if (isWorkflowStatus) return;
    const cep = values.cep;
    if (!cep || String(cep).replace(/\D/g, '').length !== 8) {
      toast.error('Digite um CEP válido (8 dígitos) para buscar');
      return;
    }
    try {
      setIsSearchingCep(true);
      const data = await searchCep(cep);
      setValues((prev) => ({
        ...prev,
        rua: data.logradouro || prev.rua,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        estado: data.uf || prev.estado,
        cep: formatCep(data.cep),
      }));
      toast.success('Endereço encontrado e preenchido automaticamente!');
    } catch (err) {
      toast.error(err?.message || 'Erro ao buscar CEP');
    } finally {
      setIsSearchingCep(false);
    }
  }, [values.cep, isWorkflowStatus]);

  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setValidationErrors(null);
    const { valid, errors } = validateBusinessPartnerForm(values);
    if (!valid) {
      setValidationErrors(errors);
      const message = Object.values(errors).join('. ');
      toast.error(message);
      return;
    }
    if (partnerId) {
      toast.info('Edição: use a API PUT /api/organizations/:organizationId/bps/:bpId quando implementada.');
      return;
    }
    if (!organizationId) {
      toast.error('Organização não selecionada.');
      return;
    }
    setSaving(true);
    try {
      const payload = mapFormValuesToBpPayload(values);
      const created = await createOrganizationBp(organizationId, payload);
      toast.success('Parceiro criado com sucesso.');
      const newId = created?.id ?? created?.bpId;
      if (newId) {
        navigate(paths.dashboard.businessPartners.edit(newId));
      } else {
        navigate(paths.dashboard.businessPartners.root);
      }
    } catch (err) {
      toast.error(err?.message ?? 'Erro ao salvar parceiro.');
    } finally {
      setSaving(false);
    }
  }, [values, partnerId, organizationId, navigate]);

  const handleOpenConsultarDados = useCallback(() => {
    setConsultarDadosCnpj(values.cnpj || '');
    setConsultarDadosOpen(true);
  }, [values.cnpj]);

  const handleCloseConsultarDados = useCallback(() => {
    setConsultarDadosOpen(false);
    setConsultarDadosCnpj('');
    setCnpjaError(null);
  }, []);

  const handleConsultarDadosConfirm = useCallback(async () => {
    const digits = (consultarDadosCnpj || '').replace(/\D/g, '');
    if (digits.length !== 14) {
      toast.error('Informe um CNPJ válido com 14 dígitos.');
      return;
    }
    setCnpjaError(null);
    setCnpjaLoading(true);
    try {
      const data = await fetchCnpjaOffice(consultarDadosCnpj);
      setCnpjaData(data);
      setConsultarDadosOpen(false);
      setConsultarDadosCnpj('');
      setResultDialogOpen(true);
      toast.success('Dados encontrados.');
    } catch (err) {
      setCnpjaError(err?.message || 'Erro ao consultar CNPJ');
      toast.error(err?.message || 'Erro ao consultar CNPJ');
    } finally {
      setCnpjaLoading(false);
    }
  }, [consultarDadosCnpj]);

  const handleCloseResultDialog = useCallback(() => {
    setResultDialogOpen(false);
    setCnpjaData(null);
    setCnpjaError(null);
  }, []);

  const handleUsarNoCadastro = useCallback(() => {
    if (!cnpjaData) return;
    const d = cnpjaData;
    const company = d.company || {};
    const address = d.address || {};
    const phones = d.phones || [];
    const emails = d.emails || [];
    const registrations = d.registrations || [];
    const toUpper = (v) => (typeof v === 'string' ? v.toUpperCase() : v);
    const companyName = (company.name || '').trim();
    const companyNameUpper = companyName.toUpperCase();
    const cnpjFormatted = formatCnpj(d.taxId || '');
    const cnpjDigits = (d.taxId || '').toString().replace(/\D/g, '');

    // Telefones: até 3 (E.164 para PhoneInput: +55 + DDD + número)
    const phoneToE164 = (p) => {
      if (!p || (!p.area && !p.number)) return null;
      const digits = `${p.area || ''}${p.number || ''}`.replace(/\D/g, '');
      return digits.length >= 10 ? `+55${digits}` : null;
    };
    const telefoneValue = phoneToE164(phones[0]) ?? '';
    const telefone2Value = phoneToE164(phones[1]) ?? '';
    const telefone3Value = phoneToE164(phones[2]) ?? '';

    // Email: preferir CORPORATE, senão o primeiro
    const emailValue =
      emails.find((e) => e.ownership === 'CORPORATE')?.address || emails[0]?.address || '';

    // Inscrição estadual: primeiro registro (IE)
    const firstRegistration = registrations[0];
    const inscrEstatualValue =
      firstRegistration && firstRegistration.number
        ? String(firstRegistration.number).trim()
        : '';

    setValues((prev) => ({
      ...prev,
      cnpj: cnpjFormatted,
      nomeNomeFantasia: toUpper(d.alias || prev.nomeNomeFantasia),
      sobrenomeRazaoSocial: toUpper(companyName || prev.sobrenomeRazaoSocial),
      dataNascimentoFundacao: d.founded ? dayjs(d.founded).format('YYYY-MM-DD') : prev.dataNascimentoFundacao,
      cep: address.zip ? formatCep(address.zip) : prev.cep,
      rua: toUpper(address.street || prev.rua),
      numero: address.number && String(address.number).trim() ? String(address.number).trim() : prev.numero || 'S/N',
      complemento: toUpper(address.details || prev.complemento),
      bairro: toUpper(address.district || prev.bairro),
      cidade: toUpper(address.city || prev.cidade),
      estado: toUpper(address.state || prev.estado),
      telefone: telefoneValue,
      telefone2: telefone2Value,
      telefone3: telefone3Value,
      email: emailValue || prev.email,
      inscrEstatual: inscrEstatualValue || prev.inscrEstatual,
      termoPesquisa1: companyNameUpper || prev.termoPesquisa1,
      termoPesquisa2: cnpjDigits,
    }));
    setResultDialogOpen(false);
    setCnpjaData(null);
    toast.success('Dados preenchidos no cadastro. Revise e salve.');
  }, [cnpjaData]);

  // Abas Compras e Vendas visíveis conforme função do parceiro (estilo SAP Fiori)
  // Em "new", inclui aba "Campos personalizados" quando há campos do form builder
  const visibleTabs = useMemo(() => {
    const base = getVisibleTabs(BUSINESS_PARTNER_TABS, values.funcao);
    if (!partnerId && formBuilderFields.length > 0) {
      return [
        ...base,
        { value: 'custom-fields', label: 'Campos personalizados', icon: 'solar:widget-bold' },
      ];
    }
    return base;
  }, [values.funcao, partnerId, formBuilderFields.length]);

  // Se a aba atual ficou invisível ao mudar a função, volta para a primeira visível
  useEffect(() => {
    const currentIsVisible = visibleTabs.some((t) => t.value === tabsState.value);
    if (!currentIsVisible && visibleTabs.length > 0) {
      tabsState.setValue(visibleTabs[0].value);
    }
  }, [values.funcao, visibleTabs, tabsState.value]);

  // No "new": carrega formulário de parceiro (mesmos campos que no form builder)
  useEffect(() => {
    if (partnerId || !organizationId) {
      setFormBuilderLoading(false);
      return;
    }
    let cancelled = false;
    setFormBuilderError(null);
    (async () => {
      try {
        const forms = await getOrganizationForms(organizationId);
        const formId =
          BUSINESS_PARTNER_FORM_ID ||
          (Array.isArray(forms) && forms.find((f) => f.entity === 'partner'))?.id ||
          null;
        if (cancelled || !formId) {
          setResolvedFormId(null);
          setFormBuilderFields([]);
          setFormBuilderLoading(false);
          return;
        }
        setResolvedFormId(formId);
        const fields = await getOrganizationFormFields(organizationId, formId);
        const sorted = (fields || [])
          .map((f) => ({ campo: f.campo, tabela: f.tabela, sequencia: f.sequencia ?? 0 }))
          .sort((a, b) => a.sequencia - b.sequencia);
        if (!cancelled) {
          setFormBuilderFields(sorted);
          setValues((prev) => ({
            ...prev,
            ...sorted.reduce(
              (acc, f) => ({ ...acc, [`${f.tabela}.${f.campo}`]: prev[`${f.tabela}.${f.campo}`] ?? '' }),
              {}
            ),
          }));
        }
      } catch (err) {
        if (!cancelled) {
          setFormBuilderError(err?.message ?? 'Erro ao carregar formulário');
          setFormBuilderFields([]);
        }
      } finally {
        if (!cancelled) setFormBuilderLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [partnerId, organizationId]);

  // Edição: carregar BP da API GET /api/organizations/:organizationId/bps/:bpId
  useEffect(() => {
    if (!partnerId || !organizationId) {
      setBpLoading(false);
      return;
    }
    let cancelled = false;
    setBpError(null);
    getOrganizationBp(organizationId, partnerId)
      .then((bp) => {
        if (cancelled) return;
        setValues((prev) => ({ ...prev, ...mapBpApiToFormValues(bp) }));
        setBpStatus(bp.status ?? null);
      })
      .catch((err) => {
        if (!cancelled) {
          setBpError(err?.message ?? 'Erro ao carregar parceiro');
          toast.error(err?.message ?? 'Erro ao carregar parceiro');
        }
      })
      .finally(() => {
        if (!cancelled) setBpLoading(false);
      });
    return () => { cancelled = true; };
  }, [partnerId, organizationId]);

  const v = (key) => values[key] ?? '';

  const getLabelForField = (campo, tabela) => {
    const template = (PARTNER_FIELD_TEMPLATES || []).find(
      (x) => x.campo === campo && x.tabela === tabela
    );
    return template?.label ?? campo;
  };
  const fieldStateKey = (field) => `${field.tabela}.${field.campo}`;

  const renderField = (campo, label, placeholder, opts = {}) => {
    const stateKey = opts.stateKey ?? campo;
    const { widget, options } = getFieldWidgetConfig(campo);
    const value = v(stateKey);
    const disabled = isWorkflowStatus || opts.disabled;

    if (widget === WIDGET_TYPES.CHECKBOX) {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(value)}
              onChange={(e) => handleChange(stateKey, e.target.checked)}
              disabled={disabled}
              {...opts}
            />
          }
          label={label}
        />
      );
    }
    if (widget === WIDGET_TYPES.SELECT) {
      return (
        <FormControl fullWidth size="small" disabled={disabled}>
          <InputLabel>{label}</InputLabel>
          <Select
            label={label}
            value={value}
            onChange={(e) => handleChange(stateKey, e.target.value)}
            disabled={disabled}
            {...opts}
          >
            <MenuItem value=""><em>Selecione</em></MenuItem>
            {(options ?? []).map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
    if (widget === WIDGET_TYPES.DATE) {
      return (
        <DatePicker
          label={label}
          value={value ? dayjs(value) : null}
          onChange={(date) => handleChange(stateKey, date ? dayjs(date).format('YYYY-MM-DD') : '')}
          slotProps={{ textField: { fullWidth: true, size: 'small', disabled } }}
          disabled={disabled}
        />
      );
    }
    if (widget === WIDGET_TYPES.MASK_PHONE) {
      return (
        <Box sx={{ minWidth: 0, width: '100%' }}>
          <PhoneInput
            label={label}
            fullWidth
            size="small"
            value={value}
            onChange={(val) => handleChange(stateKey, val ?? '')}
            placeholder={placeholder}
            disabled={disabled}
          />
        </Box>
      );
    }
    if (widget === WIDGET_TYPES.NUMBER) {
      return (
        <TextField fullWidth size="small" label={label} value={value} onChange={(e) => handleChange(stateKey, e.target.value)} type="number" InputLabelProps={{ shrink: true }} disabled={disabled} {...opts} />
      );
    }
    if (widget === WIDGET_TYPES.EMAIL) {
      return (
        <TextField fullWidth size="small" label={label} value={value} onChange={(e) => handleChange(stateKey, e.target.value)} type="email" placeholder={placeholder} InputLabelProps={{ shrink: true }} disabled={disabled} {...opts} />
      );
    }
    return (
      <TextField fullWidth size="small" label={label} value={value} onChange={(e) => handleChange(stateKey, e.target.value)} placeholder={placeholder} InputLabelProps={{ shrink: true }} disabled={disabled} {...opts} />
    );
  };

  const renderTabContent = () => {
    const current = tabsState.value;

    if (current === 'general') {
      return (
        <Stack spacing={4}>
          {/* Bloco: Identificação */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Identificação
            </Typography>
            <Grid container spacing={3}>
              {!hideTipoFuncaoInputs && (
                <>
                  <Grid item xs={12} sm={4}>
                    {renderField('tipo', 'Tipo', 'Buscar tipo...')}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    {renderField('funcao', 'Função', 'Buscar função...')}
                  </Grid>
                </>
              )}
              {/* Linha única: Agrupamento de Contas (matchcode/combobox com autocomplete - TB002) */}
              <Grid item xs={12}>
                <Box sx={{ width: '20%', minWidth: 160, marginLeft: 'auto' }}>
                  <DomainMatchcodeCombobox
                    tabela="TB002"
                    value={v('agrContas')}
                    onChange={(val) => handleChange('agrContas', val)}
                    organizationId={organizationId}
                    label="Agrupamento de Contas"
                    placeholder="Selecionar agrupamento..."
                    size="small"
                    fullWidth
                    disabled={isWorkflowStatus}
                  />
                </Box>
              </Grid>
              {/* Linha de baixo: Vocativo 2/10, Nome 4/10, Sobrenome 4/10 */}
              <Grid item xs={12}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 4fr 4fr', gap: 2, alignItems: 'start' }}>
                  <Box>
                    <FormControl fullWidth size="small" disabled={isWorkflowStatus}>
                      <InputLabel>Vocativo</InputLabel>
                      <Select
                        label="Vocativo"
                        value={v('vocativo')}
                        onChange={(e) => handleChange('vocativo', e.target.value)}
                        disabled={isWorkflowStatus}
                      >
                        {(values.tipo === 'PJ' ? VOCATIVO_OPTIONS_PJ : VOCATIVO_OPTIONS_PF).map((opt) => (
                          <MenuItem key={opt.value || 'blank'} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box>
                    <TextField fullWidth size="small" label="Nome / Nome Fantasia" value={v('nomeNomeFantasia')} onChange={(e) => handleChange('nomeNomeFantasia', e.target.value)} placeholder="Nome ou nome fantasia" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
                  </Box>
                  <Box>
                    <TextField fullWidth size="small" label="Sobrenome / Razão Social" value={v('sobrenomeRazaoSocial')} onChange={(e) => handleChange('sobrenomeRazaoSocial', e.target.value)} placeholder="Sobrenome ou razão social" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Nome 3" value={v('nome3')} onChange={(e) => handleChange('nome3', e.target.value)} placeholder="Nome adicional" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Nome 4" value={v('nome4')} onChange={(e) => handleChange('nome4', e.target.value)} placeholder="Nome adicional" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12}>
                <DatePicker label="Data de Nascimento/Fundação" value={v('dataNascimentoFundacao') ? dayjs(v('dataNascimentoFundacao')) : null} onChange={(date) => handleChange('dataNascimentoFundacao', date ? dayjs(date).format('YYYY-MM-DD') : '')} slotProps={{ textField: { fullWidth: true, size: 'small', disabled: isWorkflowStatus } }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Termo de Pesquisa 1" value={v('termoPesquisa1')} onChange={(e) => handleChange('termoPesquisa1', e.target.value)} placeholder="Termo para busca" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Termo de Pesquisa 2" value={v('termoPesquisa2')} onChange={(e) => handleChange('termoPesquisa2', e.target.value)} placeholder="Termo para busca" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
            </Grid>
          </Box>

          {/* Bloco: Endereço */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Endereço
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="CEP"
                  value={v('cep')}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                    handleChange('cep', digits.length < 8 ? digits : formatCep(digits));
                  }}
                  placeholder="00000-000"
                  inputProps={{ maxLength: 9 }}
                  InputLabelProps={{ shrink: true }}
                  disabled={isWorkflowStatus}
                  helperText="Digite o CEP e clique em Buscar para preencher o endereço"
                  InputProps={{
                    endAdornment: !isWorkflowStatus ? (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          onClick={handleSearchCep}
                          disabled={isSearchingCep}
                          startIcon={
                            isSearchingCep ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <Iconify icon="solar:magnifer-linear" width={18} />
                            )
                          }
                        >
                          {isSearchingCep ? 'Buscando...' : 'Buscar'}
                        </Button>
                      </InputAdornment>
                    ) : undefined,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField fullWidth size="small" label="Rua" value={v('rua')} onChange={(e) => handleChange('rua', e.target.value)} placeholder="Nome da rua" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={4}>
                {renderField('numero', 'Número', 'Número')}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Rua 2" value={v('rua2')} onChange={(e) => handleChange('rua2', e.target.value)} placeholder="Informações adicionais da rua" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Complemento" value={v('complemento')} onChange={(e) => handleChange('complemento', e.target.value)} placeholder="Complemento" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size="small" label="Bairro" value={v('bairro')} onChange={(e) => handleChange('bairro', e.target.value)} placeholder="Bairro" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Cidade" value={v('cidade')} onChange={(e) => handleChange('cidade', e.target.value)} placeholder="Cidade" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={4}>
                {renderField('estado', 'Estado', 'Buscar estado...')}
              </Grid>
              <Grid item xs={12} sm={4}>
                {renderField('pais', 'País', 'Buscar país...')}
              </Grid>
            </Grid>
          </Box>

          {/* Bloco: Comunicação */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Comunicação
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ minWidth: 0, width: '100%' }}>
                  <PhoneInput label="Telefone" fullWidth size="small" value={v('telefone')} onChange={(val) => handleChange('telefone', val ?? '')} placeholder="(00) 0000-0000" disabled={isWorkflowStatus} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ minWidth: 0, width: '100%' }}>
                  <PhoneInput label="Telefone 2" fullWidth size="small" value={v('telefone2')} onChange={(val) => handleChange('telefone2', val ?? '')} placeholder="(00) 0000-0000" disabled={isWorkflowStatus} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ minWidth: 0, width: '100%' }}>
                  <PhoneInput label="Telefone 3" fullWidth size="small" value={v('telefone3')} onChange={(val) => handleChange('telefone3', val ?? '')} placeholder="(00) 0000-0000" disabled={isWorkflowStatus} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ minWidth: 0, width: '100%' }}>
                  <PhoneInput label="Celular" fullWidth size="small" value={v('celular')} onChange={(val) => handleChange('celular', val ?? '')} placeholder="(00) 00000-0000" disabled={isWorkflowStatus} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Email" type="email" value={v('email')} onChange={(e) => handleChange('email', e.target.value)} placeholder="email@exemplo.com" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth size="small" label="Observações" value={v('comunicacaoObservacoes')} onChange={(e) => handleChange('comunicacaoObservacoes', e.target.value)} placeholder="Observações de contato" multiline rows={3} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
            </Grid>
          </Box>

          {/* Bloco: Documentos (CPF para PF, CNPJ para PJ, inscrições) */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Documentos
            </Typography>
            <Grid container spacing={3}>
              {values.tipo === 'PF' && (
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" label="CPF" value={v('cpf')} onChange={(e) => handleChange('cpf', formatCpf(e.target.value))} placeholder="000.000.000-00" inputProps={{ maxLength: 14 }} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
                </Grid>
              )}
              {values.tipo === 'PJ' && (
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" label="CNPJ" value={v('cnpj')} onChange={(e) => handleChange('cnpj', formatCnpj(e.target.value))} placeholder="00.000.000/0000-00" inputProps={{ maxLength: 18 }} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Inscrição Estadual" value={v('inscrEstatual')} onChange={(e) => handleChange('inscrEstatual', e.target.value)} placeholder="Inscrição estadual" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Inscrição Municipal" value={v('inscrMunicipal')} onChange={(e) => handleChange('inscrMunicipal', e.target.value)} placeholder="Inscrição municipal" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Tipo de Identificação" value={v('tipoIdIdent')} onChange={(e) => handleChange('tipoIdIdent', e.target.value)} placeholder="Tipo de identificação" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Número de Identificação" value={v('numeroId')} onChange={(e) => handleChange('numeroId', e.target.value)} placeholder="Número de identificação" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
            </Grid>
          </Box>

          {/* Bloco: Setor Industrial - oculto */}
        </Stack>
      );
    }

    if (current === 'additional-data') {
      return (
        <Stack spacing={4}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Dados Adicionais (Referência Externa, Código Antigo, Observações, Informações Complementares).
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Referência Externa" value={v('referenciaExterna')} onChange={(e) => handleChange('referenciaExterna', e.target.value)} placeholder="Referência externa" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Código Antigo" value={v('codigoAntigo')} onChange={(e) => handleChange('codigoAntigo', e.target.value)} placeholder="Código antigo" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Observações" value={v('observacoes')} onChange={(e) => handleChange('observacoes', e.target.value)} placeholder="Observações gerais" multiline rows={3} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Informações Complementares" value={v('informacoesComplementares')} onChange={(e) => handleChange('informacoesComplementares', e.target.value)} placeholder="Informações complementares" multiline rows={4} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
            </Grid>
          </Grid>
        </Stack>
      );
    }

    if (current === 'payments') {
      return (
        <Grid container spacing={3}>
          <Typography variant="h6" sx={{ width: '100%', mb: 0 }}>Pagamentos</Typography>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth size="small" label="Código do Banco" value={v('codBanco')} onChange={(e) => handleChange('codBanco', e.target.value)} type="number" placeholder="Código do banco" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth size="small" label="Código da Agência" value={v('codAgencia')} onChange={(e) => handleChange('codAgencia', e.target.value)} type="number" placeholder="Código da agência" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth size="small" label="Dígito da Agência" value={v('digAgencia')} onChange={(e) => handleChange('digAgencia', e.target.value)} placeholder="Dígito da agência" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth size="small" label="Código da Conta" value={v('codConta')} onChange={(e) => handleChange('codConta', e.target.value)} type="number" placeholder="Código da conta" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField fullWidth size="small" label="Dígito da Conta" value={v('digConta')} onChange={(e) => handleChange('digConta', e.target.value)} placeholder="Dígito da conta" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Favorecido" value={v('favorecido')} onChange={(e) => handleChange('favorecido', e.target.value)} placeholder="Nome do favorecido" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="CPF do Favorecido" value={v('cpfFavorecido')} onChange={(e) => handleChange('cpfFavorecido', formatCpf(e.target.value))} placeholder="000.000.000-00" inputProps={{ maxLength: 14 }} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
          </Grid>
        </Grid>
      );
    }

    if (current === 'partner-functions') {
      return (
        <Grid container spacing={3}>
          <Typography variant="h6" sx={{ width: '100%', mb: 0 }}>Funções de Parceiro</Typography>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Função do Parceiro" value={v('funcaoParceiro')} onChange={(e) => handleChange('funcaoParceiro', e.target.value)} placeholder="Selecionar função..." InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Autorização" value={v('autorizacao')} onChange={(e) => handleChange('autorizacao', e.target.value)} placeholder="Autorização" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker label="Validade Início" value={v('validadeInicio') ? dayjs(v('validadeInicio')) : null} onChange={(date) => handleChange('validadeInicio', date ? dayjs(date).format('YYYY-MM-DD') : '')} slotProps={{ textField: { fullWidth: true, size: 'small', disabled: isWorkflowStatus } }} disabled={isWorkflowStatus} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker label="Validade Fim" value={v('validadeFim') ? dayjs(v('validadeFim')) : null} onChange={(date) => handleChange('validadeFim', date ? dayjs(date).format('YYYY-MM-DD') : '')} slotProps={{ textField: { fullWidth: true, size: 'small', disabled: isWorkflowStatus } }} disabled={isWorkflowStatus} />
          </Grid>
        </Grid>
      );
    }

    if (current === 'purchases') {
      return (
        <Stack spacing={4}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Dados de fornecedor (Organização de Compras). Visível quando a função do parceiro é Fornecedor ou Cliente e Fornecedor.
          </Typography>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Dados básicos do fornecedor
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>{renderField('devolucao', 'Devolução')}</Grid>
              <Grid item xs={12} sm={6} md={4}>{renderField('revFatBasEm', 'Revisão Fatura Baseada em Entrada de Mercadoria')}</Grid>
              <Grid item xs={12} sm={6} md={4}>{renderField('revFatBasServ', 'Revisão Fatura Baseada em Serviço')}</Grid>
              <Grid item xs={12} sm={6} md={4}>{renderField('relevanteLiquidacao', 'Relevante para Liquidação')}</Grid>
              <Grid item xs={12} sm={6} md={4}>{renderField('pedidoAutom', 'Pedido Automático')}</Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderField('tipoNfe', 'Tipo NFe', 'Selecionar...')}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderField('tipoImposto', 'Tipo Imposto', 'Selecionar...')}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderField('simplesNacional', 'Simples Nacional', 'Selecionar...')}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Grupo Esquema Fornecedor" value={v('grpEsqForn')} onChange={(e) => handleChange('grpEsqForn', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Controle de Confirmação" value={v('cntrleConfir')} onChange={(e) => handleChange('cntrleConfir', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderField('regimePisCofins', 'Regime PIS/COFINS', 'Selecionar...')}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderField('optanteSimples', 'Optante Simples', 'Selecionar...')}
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                {renderField('recebedorAlternativo', 'Recebedor Alternativo', 'Selecionar...')}
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Fornecedor Compras (Organização de Compras)
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Organização de Compras" value={v('orgCompras')} onChange={(e) => handleChange('orgCompras', e.target.value)} placeholder="Ex.: 1000" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>{renderField('moedaPedido', 'Moeda do Pedido', 'BRL')}</Grid>
              <Grid item xs={12} sm={6} md={4}>{renderField('condPgto', 'Condição de Pagamento', 'Selecionar...')}</Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Versão Incoterms" value={v('versIncoterms')} onChange={(e) => handleChange('versIncoterms', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Incoterms" value={v('incoterms')} onChange={(e) => handleChange('incoterms', e.target.value)} placeholder="Ex.: CIF, FOB" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Local Incoterms" value={v('localInco1')} onChange={(e) => handleChange('localInco1', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>{renderField('compensacao', 'Compensação')}</Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField fullWidth size="small" label="Marcação de Preço Fornecedor" value={v('marcPrecoForn')} onChange={(e) => handleChange('marcPrecoForn', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Fornecedor Empresas
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Centro" value={v('centro')} onChange={(e) => handleChange('centro', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Empresa" value={v('empresa')} onChange={(e) => handleChange('empresa', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Conta de Conciliação" value={v('contaConciliacao')} onChange={(e) => handleChange('contaConciliacao', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Grupo Administração de Tesouraria" value={v('grpAdminTesouraria')} onChange={(e) => handleChange('grpAdminTesouraria', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Minoritário" value={v('minorit')} onChange={(e) => handleChange('minorit', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}>{renderField('condPgto', 'Condição de Pagamento')}</Grid>
              <Grid item xs={12} sm={6} md={3}>{renderField('formPgto', 'Forma de Pagamento')}</Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Banco Empresa Fornecedor" value={v('bancoEmpresaFornecedor')} onChange={(e) => handleChange('bancoEmpresaFornecedor', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}>{renderField('verificarFaturaDuplicada', 'Verificar Fatura Duplicada')}</Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Procedimento de Advertência" value={v('procedimentoAdvertencia')} onChange={(e) => handleChange('procedimentoAdvertencia', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Responsável por Advertência" value={v('responsavelAdvertencia')} onChange={(e) => handleChange('responsavelAdvertencia', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Contribuição ICMS" value={v('contribIcms')} onChange={(e) => handleChange('contribIcms', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              {/* Tipo Principal Setor Industrial - oculto */}
            </Grid>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Fornecedor IRF
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Categoria IRF" value={v('ctgIrf')} onChange={(e) => handleChange('ctgIrf', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Código IRF" value={v('codigoIrf')} onChange={(e) => handleChange('codigoIrf', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            </Grid>
          </Box>
        </Stack>
      );
    }

    if (current === 'sales') {
      const vendasList = Array.isArray(values.clienteVendasList) ? values.clienteVendasList : [];
      const selectedIdx = values.selectedSalesAreaIndex;
      const hasSelection = selectedIdx !== null && selectedIdx >= 0 && selectedIdx < vendasList.length;
      const currentArea = hasSelection ? vendasList[selectedIdx] : null;
      const sv = (key) => (currentArea && currentArea[key] !== undefined ? currentArea[key] : '');

      return (
        <Stack spacing={4}>
          {/* Header Área de vendas (estilo SAP) */}
          <Card variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Área de vendas
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<Iconify icon="solar:check-circle-bold" />}
                  disabled={isWorkflowStatus}
                >
                  Áreas de vendas
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Iconify icon="solar:folder-bold" />}
                  disabled={isWorkflowStatus}
                >
                  Mudar área
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Iconify icon="solar:add-circle-bold" />}
                  onClick={handleInserirArea}
                  disabled={isWorkflowStatus}
                >
                  Inserir
                </Button>
              </Stack>
            </Stack>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Org. vendas"
                  value={currentArea ? sv('orgVendas') : '—'}
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Canal distrib."
                  value={currentArea ? sv('canalDistr') : '—'}
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Setor atividade"
                  value={currentArea ? sv('setorAtiv') : '—'}
                  InputProps={{ readOnly: true }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Card>

          {/* Lista de áreas de vendas (seleção) */}
          {vendasList.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Áreas cadastradas ({vendasList.length})
              </Typography>
              <Table size="small" sx={{ '& .MuiTableCell-root': { py: 0.75 } }}>
                <TableHead>
                  <TableRow>
                    <TableCell width={48}>#</TableCell>
                    <TableCell>Org. vendas</TableCell>
                    <TableCell>Canal distrib.</TableCell>
                    <TableCell>Setor atividade</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vendasList.map((area, idx) => (
                    <TableRow
                      key={idx}
                      selected={selectedIdx === idx}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleOpenEditSalesArea(idx)}
                    >
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{area.orgVendas || '—'}</TableCell>
                      <TableCell>{area.canalDistr || '—'}</TableCell>
                      <TableCell>{area.setorAtiv || '—'}</TableCell>
                      <TableCell align="right" />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {vendasList.length === 0 && (
            <Alert severity="info">
              Nenhuma área de vendas. Clique em <strong>Inserir</strong> para adicionar a primeira área.
            </Alert>
          )}

          {/* Cliente Empresas (mantido como seção separada – primeiro item) */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Cliente Empresas
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Chave de Ordenação" value={v('chvOrdenacao')} onChange={(e) => handleChange('chvOrdenacao', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Ajuste de Valor" value={v('ajusValor')} onChange={(e) => handleChange('ajusValor', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Banco Empresa Cliente" value={v('bancoEmpresaCliente')} onChange={(e) => handleChange('bancoEmpresaCliente', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            </Grid>
          </Box>
        </Stack>
      );
    }

    if (current === 'credit-data') {
      return (
        <Stack spacing={4}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Dados de Crédito (array dadosCredito[]). Primeiro item abaixo; múltiplos itens podem ser implementados com useFieldArray.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Parceiro" value={v('partner')} onChange={(e) => handleChange('partner', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Função" value={v('creditRole')} onChange={(e) => handleChange('creditRole', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Regra de Limite" value={v('limitRule')} onChange={(e) => handleChange('limitRule', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Classe de Risco" value={v('riskClass')} onChange={(e) => handleChange('riskClass', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Regra de Verificação" value={v('checkRule')} onChange={(e) => handleChange('checkRule', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Grupo de Crédito" value={v('creditGroup')} onChange={(e) => handleChange('creditGroup', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Segmento" value={v('segment')} onChange={(e) => handleChange('segment', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}>{renderField('creditLimit', 'Limite de Crédito', '', { type: 'number' })}</Grid>
            <Grid item xs={12} sm={6} md={4}><DatePicker label="Data de Validade do Limite" value={v('limitValidDate') ? dayjs(v('limitValidDate')) : null} onChange={(date) => handleChange('limitValidDate', date ? dayjs(date).format('YYYY-MM-DD') : '')} slotProps={{ textField: { fullWidth: true, size: 'small', disabled: isWorkflowStatus } }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><DatePicker label="Data de Acompanhamento" value={v('followUpDt') ? dayjs(v('followUpDt')) : null} onChange={(date) => handleChange('followUpDt', date ? dayjs(date).format('YYYY-MM-DD') : '')} slotProps={{ textField: { fullWidth: true, size: 'small', disabled: isWorkflowStatus } }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}>{renderField('xblocked', 'Bloqueado')}</Grid>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Categoria de Informação" value={v('infocategory')} onChange={(e) => handleChange('infocategory', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Tipo de Informação" value={v('infotype')} onChange={(e) => handleChange('infotype', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}>{renderField('checkRelevant', 'Verificação Relevante')}</Grid>
            <Grid item xs={12} sm={6} md={4}>{renderField('amount', 'Valor', '', { type: 'number' })}</Grid>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Moeda" value={v('currency')} onChange={(e) => handleChange('currency', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><DatePicker label="Data Inicial" value={v('dateFrom') ? dayjs(v('dateFrom')) : null} onChange={(date) => handleChange('dateFrom', date ? dayjs(date).format('YYYY-MM-DD') : '')} slotProps={{ textField: { fullWidth: true, size: 'small', disabled: isWorkflowStatus } }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><DatePicker label="Data Final" value={v('dateTo') ? dayjs(v('dateTo')) : null} onChange={(date) => handleChange('dateTo', date ? dayjs(date).format('YYYY-MM-DD') : '')} slotProps={{ textField: { fullWidth: true, size: 'small', disabled: isWorkflowStatus } }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><DatePicker label="Data de Acompanhamento" value={v('dateFollowUp') ? dayjs(v('dateFollowUp')) : null} onChange={(date) => handleChange('dateFollowUp', date ? dayjs(date).format('YYYY-MM-DD') : '')} slotProps={{ textField: { fullWidth: true, size: 'small', disabled: isWorkflowStatus } }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12}><TextField fullWidth size="small" label="Texto/Observações" value={v('creditText')} onChange={(e) => handleChange('creditText', e.target.value)} multiline rows={3} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
          </Grid>
        </Stack>
      );
    }

    if (current === 'credit-collection') {
      return (
        <Stack spacing={4}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Credit Collection (array collection[]). Primeiro item abaixo.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Código Antigo" value={v('collectionCodAntigo')} onChange={(e) => handleChange('collectionCodAntigo', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Função" value={v('collectionRole')} onChange={(e) => handleChange('collectionRole', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Perfil" value={v('perfil')} onChange={(e) => handleChange('perfil', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Segmento" value={v('collectionSegment')} onChange={(e) => handleChange('collectionSegment', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Grupo" value={v('grupo')} onChange={(e) => handleChange('grupo', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Responsável" value={v('resp')} onChange={(e) => handleChange('resp', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
          </Grid>
        </Stack>
      );
    }

    if (current === 'custom-fields' && formBuilderFields.length > 0) {
      return (
        <Stack spacing={4}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Campos definidos no Formulário de Parceiro (em Formulários).
          </Typography>
          <Grid container spacing={3}>
            {formBuilderFields.map((field) => {
              const key = fieldStateKey(field);
              const label = getLabelForField(field.campo, field.tabela);
              const isCpf = field.campo === 'cpf' || field.campo === 'cpf_favorecido';
              const isCnpj = field.campo === 'cnpj';
              const isCep = field.campo === 'cep';
              if (isCpf) {
                if (field.campo === 'cpf' && values.tipo !== 'PF') return null;
                return (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField fullWidth size="small" label={label} value={v(key)} onChange={(e) => handleChange(key, formatCpf(e.target.value))} placeholder="000.000.000-00" inputProps={{ maxLength: 14 }} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
                  </Grid>
                );
              }
              if (isCnpj) {
                if (values.tipo !== 'PJ') return null;
                return (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField fullWidth size="small" label={label} value={v(key)} onChange={(e) => handleChange(key, formatCnpj(e.target.value))} placeholder="00.000.000/0000-00" inputProps={{ maxLength: 18 }} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
                  </Grid>
                );
              }
              if (isCep) {
                return (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField fullWidth size="small" label={label} value={v(key)} onChange={(e) => { handleChange(key, formatCep(e.target.value)); }} placeholder="00000-000" inputProps={{ maxLength: 9 }} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
                  </Grid>
                );
              }
              return (
                <Grid item xs={12} sm={6} key={key}>
                  {renderField(field.campo, label, '', { stateKey: key })}
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      );
    }

    return null;
  };

  const currentTabData = visibleTabs.find((t) => t.value === tabsState.value);

  // Ocultar inputs de tipo/função quando vieram do diálogo (continuam no payload)
  const hideTipoFuncaoInputs = !!(initialTipo || initialFuncao);
  const tipoLabel = values.tipo ? (TIPO_LABELS[values.tipo] ?? values.tipo) : '';
  const funcaoLabel = values.funcao ? (FUNCAO_LABELS[values.funcao] ?? values.funcao) : '';
  const breadcrumbLast =
    partnerId
      ? 'Editar'
      : tipoLabel && funcaoLabel
        ? `${tipoLabel} · ${funcaoLabel}`
        : 'Formulário completo';

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={partnerId ? 'Editar Business Partner' : 'Novo Business Partner'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Business Partner', href: paths.dashboard.businessPartners.root },
          { name: breadcrumbLast },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={handleBack}>Voltar</Button>
            {values.tipo === 'PJ' && (
              <Button
                variant="outlined"
                color="primary"
                onClick={handleOpenConsultarDados}
                disabled={isWorkflowStatus || bpLoading}
              >
                Consultar dados
              </Button>
            )}
            <Button variant="contained" onClick={handleSave} disabled={isWorkflowStatus || bpLoading || saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </Stack>
        }
        sx={{ mb: 3 }}
      />

      {/* Edição: carregando BP da API */}
      {partnerId && bpLoading && (
        <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Iconify icon="eva:loading-outline" width={20} sx={{ animation: 'spin 1s linear infinite' }} />
            <Typography variant="body2" color="text.secondary">Carregando dados do parceiro...</Typography>
          </Stack>
        </Card>
      )}

      {/* Edição: erro ao carregar BP */}
      {partnerId && !bpLoading && bpError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setBpError(null)}>
          {bpError}
        </Alert>
      )}

      {/* Erros de validação ao salvar */}
      {validationErrors && Object.keys(validationErrors).length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setValidationErrors(null)}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Corrija os campos antes de salvar:</Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {Object.entries(validationErrors).map(([field, msg]) => (
              <li key={field}><Typography variant="body2">{msg}</Typography></li>
            ))}
          </Box>
        </Alert>
      )}

      {/* Quando status === workflow: formulário somente leitura */}
      {partnerId && isWorkflowStatus && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Este parceiro está em processo de criação via workflow. Os campos permanecem desativados até a conclusão.
        </Alert>
      )}

      {/* Aviso de erro ao carregar form builder (não bloqueia o formulário completo) */}
      {!partnerId && !formBuilderLoading && formBuilderError && (
        <Card variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'error.lighter' }}>
          <Typography variant="body2" color="error">{formBuilderError}</Typography>
        </Card>
      )}

      {/* Formulário completo com abas: sempre exibido (novo e edição) */}
      <Card variant="outlined" sx={{ overflow: 'hidden', maxWidth: '100%' }}>
          <Tabs
            value={visibleTabs.some((t) => t.value === tabsState.value) ? tabsState.value : visibleTabs[0]?.value ?? 'general'}
            onChange={tabsState.onChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              px: 2.5,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            {visibleTabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                icon={<Iconify icon={tab.icon} width={22} />}
                iconPosition="start"
                label={tab.label}
                sx={{ minHeight: 64 }}
              />
            ))}
          </Tabs>

          <Box sx={{ p: 3, overflow: 'hidden' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {currentTabData?.label}
            </Typography>
            <Scrollbar
              sx={{
                maxHeight: 560,
                overflowX: 'hidden',
                '& .simplebar-content-wrapper': { overflowX: 'hidden !important' },
                '& .simplebar-content': {
                  overflowX: 'hidden !important',
                  minWidth: 0,
                  pr: 1.5, /* espaço para a barra de rolagem não sobrepor os inputs */
                },
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ width: '100%', minWidth: 0, overflowX: 'hidden' }}>
                  {renderTabContent()}
                </Box>
              </LocalizationProvider>
            </Scrollbar>
          </Box>
        </Card>

      {/* Popup Consultar dados (CNPJ) – apenas para Pessoa Jurídica */}
      <Dialog open={consultarDadosOpen} onClose={handleCloseConsultarDados} maxWidth="sm" fullWidth>
        <DialogTitle>Consultar dados</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Busque os dados do CNPJ na Receita Federal preenchendo o campo abaixo. As informações retornadas poderão ser utilizadas para preencher o cadastro do parceiro.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="CNPJ"
            value={consultarDadosCnpj}
            onChange={(e) => setConsultarDadosCnpj(formatCnpj(e.target.value))}
            placeholder="00.000.000/0000-00"
            inputProps={{ maxLength: 18 }}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 1 }}
            error={!!cnpjaError}
            helperText={cnpjaError}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseConsultarDados} color="inherit" disabled={cnpjaLoading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConsultarDadosConfirm}
            disabled={cnpjaLoading || (consultarDadosCnpj || '').replace(/\D/g, '').length !== 14}
            startIcon={cnpjaLoading ? <CircularProgress size={18} color="inherit" /> : <Iconify icon="solar:magnifer-linear" width={18} />}
          >
            {cnpjaLoading ? 'Consultando...' : 'Consultar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Área de vendas – criar/editar (form completo em popup) */}
      <Dialog
        open={salesAreaModalOpen}
        onClose={() => handleCloseSalesAreaModal(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{ sx: { maxHeight: '90vh', borderRadius: 2 } }}
      >
        <DialogTitle>
          {salesAreaModalCreateMode ? 'Nova área de vendas' : 'Editar área de vendas'}
        </DialogTitle>
        <DialogContent dividers>
          {(() => {
            const vendasList = Array.isArray(values.clienteVendasList) ? values.clienteVendasList : [];
            const selectedIdx = values.selectedSalesAreaIndex;
            const hasValid = selectedIdx !== null && selectedIdx >= 0 && selectedIdx < vendasList.length;
            const currentArea = hasValid ? vendasList[selectedIdx] : null;
            const sv = (key) => (currentArea && currentArea[key] !== undefined ? currentArea[key] : '');
            if (!hasValid || !currentArea) return null;
            return (
              <Scrollbar sx={{ maxHeight: 'calc(90vh - 180px)' }}>
                <Box sx={{ py: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    Ordem – preencha os campos da área de vendas
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <DomainMatchcodeCombobox
                        tabela="TVKOT"
                        value={sv('orgVendas')}
                        onChange={(val) => handleSalesAreaChange(selectedIdx, 'orgVendas', val)}
                        organizationId={organizationId}
                        label="Org. vendas"
                        placeholder="Selecionar organização de vendas..."
                        size="small"
                        fullWidth
                        disabled={isWorkflowStatus}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <DomainMatchcodeCombobox
                        tabela="TVTWT"
                        value={sv('canalDistr')}
                        onChange={(val) => handleSalesAreaChange(selectedIdx, 'canalDistr', val)}
                        organizationId={organizationId}
                        label="Canal distrib."
                        placeholder="Selecionar canal de distribuição..."
                        size="small"
                        fullWidth
                        disabled={isWorkflowStatus}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <DomainMatchcodeCombobox
                        tabela="T016T"
                        value={sv('setorAtiv')}
                        onChange={(val) => handleSalesAreaChange(selectedIdx, 'setorAtiv', val)}
                        organizationId={organizationId}
                        label="Setor atividade"
                        placeholder="Selecionar setor de atividade..."
                        size="small"
                        fullWidth
                        disabled={isWorkflowStatus}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Região de vendas" value={sv('regiaoVendas')} onChange={(e) => handleSalesAreaChange(selectedIdx, 'regiaoVendas', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
                    <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Grupo de clientes" value={sv('vendasGrupoClientes')} onChange={(e) => handleSalesAreaChange(selectedIdx, 'vendasGrupoClientes', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <DomainMatchcodeCombobox
                        tabela="TVKBT"
                        value={sv('vendasEscritorioVendas')}
                        onChange={(val) => handleSalesAreaChange(selectedIdx, 'vendasEscritorioVendas', val)}
                        organizationId={organizationId}
                        label="Escritório de vendas"
                        placeholder="Selecionar escritório de vendas..."
                        size="small"
                        fullWidth
                        disabled={isWorkflowStatus}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <DomainMatchcodeCombobox
                        tabela="TVGRT"
                        value={sv('vendasEquipeVendas')}
                        onChange={(val) => handleSalesAreaChange(selectedIdx, 'vendasEquipeVendas', val)}
                        organizationId={organizationId}
                        label="Equipe vendas"
                        placeholder="Selecionar equipe de vendas..."
                        size="small"
                        fullWidth
                        disabled={isWorkflowStatus}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small" disabled={isWorkflowStatus}>
                        <InputLabel>Prioridade remessa</InputLabel>
                        <Select
                          label="Prioridade remessa"
                          value={sv('prioridadeRemessa') ?? ''}
                          onChange={(e) => handleSalesAreaChange(selectedIdx, 'prioridadeRemessa', e.target.value)}
                          disabled={isWorkflowStatus}
                        >
                          {PRIORIDADE_REMESSA_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value || 'blank'} value={opt.value}>
                              {opt.label || '—'}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small" disabled={isWorkflowStatus}>
                        <InputLabel>Grupo class. conta cliente</InputLabel>
                        <Select
                          label="Grupo class. conta cliente"
                          value={sv('grpClassContCli') ?? ''}
                          onChange={(e) => handleSalesAreaChange(selectedIdx, 'grpClassContCli', e.target.value)}
                          disabled={isWorkflowStatus}
                        >
                          {GRP_CLASS_CONTA_CLIENTE_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value || 'blank'} value={opt.value}>
                              {opt.label || '—'}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Classificação fiscal" value={sv('classFiscal')} onChange={(e) => handleSalesAreaChange(selectedIdx, 'classFiscal', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth size="small" disabled={isWorkflowStatus}>
                        <InputLabel>Moeda</InputLabel>
                        <Select
                          label="Moeda"
                          value={sv('moedaCliente') ?? ''}
                          onChange={(e) => handleSalesAreaChange(selectedIdx, 'moedaCliente', e.target.value)}
                          disabled={isWorkflowStatus}
                        >
                          {MOEDA_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value || 'blank'} value={opt.value}>
                              {opt.label || '—'}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Esquema cliente" value={sv('esquemaCliente')} onChange={(e) => handleSalesAreaChange(selectedIdx, 'esquemaCliente', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel control={<Checkbox checked={Boolean(sv('agrupamentoOrdens'))} onChange={(e) => handleSalesAreaChange(selectedIdx, 'agrupamentoOrdens', e.target.checked)} disabled={isWorkflowStatus} />} label="Agrupamento ordens" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <DomainMatchcodeCombobox
                        tabela="T001W"
                        value={sv('vendasCentroFornecedor')}
                        onChange={(val) => handleSalesAreaChange(selectedIdx, 'vendasCentroFornecedor', val)}
                        organizationId={organizationId}
                        label="Centro fornecedor"
                        placeholder="Selecionar centro fornecedor..."
                        size="small"
                        fullWidth
                        disabled={isWorkflowStatus}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel control={<Checkbox checked={Boolean(sv('vendasRelevanteliquidacao'))} onChange={(e) => handleSalesAreaChange(selectedIdx, 'vendasRelevanteliquidacao', e.target.checked)} disabled={isWorkflowStatus} />} label="Relevante liquidação" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel control={<Checkbox checked={Boolean(sv('relevanteCrr'))} onChange={(e) => handleSalesAreaChange(selectedIdx, 'relevanteCrr', e.target.checked)} disabled={isWorkflowStatus} />} label="Relevante CRR" />
                    </Grid>
                  </Grid>
                </Box>
              </Scrollbar>
            );
          })()}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => handleCloseSalesAreaModal(false)} color="inherit">
            Cancelar
          </Button>
          <Button variant="contained" onClick={() => handleCloseSalesAreaModal(true)}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup resultado da consulta CNPJA – layout similar à tela de perfil da empresa */}
      <Dialog
        open={resultDialogOpen && !!cnpjaData}
        onClose={handleCloseResultDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[24],
          },
        }}
      >
        {cnpjaData && (
          <CnpjaResultDialogContent
            data={cnpjaData}
            onRemoverDados={handleCloseResultDialog}
            onUsarNoCadastro={handleUsarNoCadastro}
            formatCnpjDisplay={formatCnpj}
          />
        )}
      </Dialog>
    </DashboardContent>
  );
}
