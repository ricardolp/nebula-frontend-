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

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';
import { useAuthContext } from 'src/auth/hooks';

import {
  getOrganizationForms,
  getOrganizationFormFields,
} from 'src/actions/forms';

import { getOrganizationBp } from 'src/actions/bps';
import { mapBpApiToFormValues } from 'src/sections/business-partner/data/bp-api-to-form-values';

import { BUSINESS_PARTNER_FORM_ID } from 'src/sections/business-partner/data/business-partner-form-config';
import { PARTNER_FIELD_TEMPLATES } from 'src/sections/business-partner/data/partner-field-templates-for-builder';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
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
import { validateBusinessPartnerForm } from 'src/sections/business-partner/data/business-partner-validation';

import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

// ----------------------------------------------------------------------

export function BusinessPartnerFormView({ partnerId }) {
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

  const [values, setValues] = useState(() => ({
    // 1. Dados Básicos (General)
    tipo: '',
    funcao: '',
    agrContas: '',
    vocativo: '',
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
    pais: '',
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
    setValues((prev) => ({ ...prev, [field]: value }));
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

  const handleSave = useCallback(() => {
    setValidationErrors(null);
    const { valid, errors } = validateBusinessPartnerForm(values);
    if (!valid) {
      setValidationErrors(errors);
      const message = Object.values(errors).join('. ');
      toast.error(message);
      return;
    }
    console.log('Salvar (layout)', values);
  }, [values]);

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
              <Grid item xs={12} sm={4}>
                {renderField('tipo', 'Tipo', 'Buscar tipo...')}
              </Grid>
              <Grid item xs={12} sm={4}>
                {renderField('funcao', 'Função', 'Buscar função...')}
              </Grid>
              <Grid item xs={12} sm={4}>
                {renderField('agrContas', 'Agrupamento de Contas', 'Selecionar agrupamento...')}
              </Grid>
              <Grid item xs={12} sm={4}>
                {renderField('vocativo', 'Vocativo', 'Selecionar vocativo...')}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Nome / Nome Fantasia" value={v('nomeNomeFantasia')} onChange={(e) => handleChange('nomeNomeFantasia', e.target.value)} placeholder="Nome ou nome fantasia" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Sobrenome / Razão Social" value={v('sobrenomeRazaoSocial')} onChange={(e) => handleChange('sobrenomeRazaoSocial', e.target.value)} placeholder="Sobrenome ou razão social" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Nome 3" value={v('nome3')} onChange={(e) => handleChange('nome3', e.target.value)} placeholder="Nome adicional" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="Nome 4" value={v('nome4')} onChange={(e) => handleChange('nome4', e.target.value)} placeholder="Nome adicional" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker label="Data de Nascimento/Fundação" value={v('dataNascimentoFundacao') ? dayjs(v('dataNascimentoFundacao')) : null} onChange={(date) => handleChange('dataNascimentoFundacao', date ? dayjs(date).format('YYYY-MM-DD') : '')} slotProps={{ textField: { fullWidth: true, size: 'small', disabled: isWorkflowStatus } }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderField('sexo', 'Gênero', 'Selecionar gênero...')}
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

          {/* Bloco: Documentos (CPF, CNPJ, inscrições) */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Documentos
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="CPF" value={v('cpf')} onChange={(e) => handleChange('cpf', formatCpf(e.target.value))} placeholder="000.000.000-00" inputProps={{ maxLength: 14 }} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth size="small" label="CNPJ" value={v('cnpj')} onChange={(e) => handleChange('cnpj', formatCnpj(e.target.value))} placeholder="00.000.000/0000-00" inputProps={{ maxLength: 18 }} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
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

          {/* Bloco: Setor Industrial */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Setor Industrial
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Chave Setor Industrial" value={v('chaveSetorInd')} onChange={(e) => handleChange('chaveSetorInd', e.target.value)} placeholder="Chave" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Código Setor Industrial" value={v('codSetorInd')} onChange={(e) => handleChange('codSetorInd', e.target.value)} placeholder="Código" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Setor Industrial Padrão" value={v('setorIndPadrao')} onChange={(e) => handleChange('setorIndPadrao', e.target.value)} placeholder="Padrão" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
              </Grid>
            </Grid>
          </Box>
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
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Tipo Principal Setor Industrial" value={v('tpPrincSetInd')} onChange={(e) => handleChange('tpPrincSetInd', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
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
      return (
        <Stack spacing={4}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Dados de cliente (Área de Vendas). Visível quando a função do parceiro é Cliente ou Cliente e Fornecedor.
          </Typography>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Cliente Vendas
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Organização de Vendas" value={v('orgVendas')} onChange={(e) => handleChange('orgVendas', e.target.value)} placeholder="Ex.: 1000" InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Canal de Distribuição" value={v('canalDistr')} onChange={(e) => handleChange('canalDistr', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Setor de Atividade" value={v('setorAtiv')} onChange={(e) => handleChange('setorAtiv', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Região de Vendas" value={v('regiaoVendas')} onChange={(e) => handleChange('regiaoVendas', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Prioridade de Remessa" value={v('prioridadeRemessa')} onChange={(e) => handleChange('prioridadeRemessa', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Incoterms" value={v('incoterms')} onChange={(e) => handleChange('incoterms', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Local Incoterms" value={v('localInco1')} onChange={(e) => handleChange('localInco1', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Grupo Classificação Conta Cliente" value={v('grpClassContCli')} onChange={(e) => handleChange('grpClassContCli', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Classificação Fiscal" value={v('classFiscal')} onChange={(e) => handleChange('classFiscal', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}>{renderField('moedaCliente', 'Moeda do Cliente', 'BRL')}</Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Esquema do Cliente" value={v('esquemaCliente')} onChange={(e) => handleChange('esquemaCliente', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Grupo de Preço" value={v('grupoPreco')} onChange={(e) => handleChange('grupoPreco', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Lista de Preços" value={v('listaPreco')} onChange={(e) => handleChange('listaPreco', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}>{renderField('compensacao', 'Compensação')}</Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="ICMS" value={v('icms')} onChange={(e) => handleChange('icms', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="IPI" value={v('ipi')} onChange={(e) => handleChange('ipi', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Substituição Fiscal" value={v('substFiscal')} onChange={(e) => handleChange('substFiscal', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="CFOP" value={v('cfop')} onChange={(e) => handleChange('cfop', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Contribuição ICMS" value={v('contribIcms')} onChange={(e) => handleChange('contribIcms', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Tipo Principal Setor Industrial" value={v('tpPrincSetInd')} onChange={(e) => handleChange('tpPrincSetInd', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}>{renderField('agrupamentoOrdens', 'Agrupamento de Ordens')}</Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Grupo de Clientes de Vendas" value={v('vendasGrupoClientes')} onChange={(e) => handleChange('vendasGrupoClientes', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Escritório de Vendas" value={v('vendasEscritorioVendas')} onChange={(e) => handleChange('vendasEscritorioVendas', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Equipe de Vendas" value={v('vendasEquipeVendas')} onChange={(e) => handleChange('vendasEquipeVendas', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Atributo de Vendas 1" value={v('vendasAtributo1')} onChange={(e) => handleChange('vendasAtributo1', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Atributo de Vendas 2" value={v('vendasAtributo2')} onChange={(e) => handleChange('vendasAtributo2', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Sociedade Parceiro" value={v('vendasSociedadeParceiro')} onChange={(e) => handleChange('vendasSociedadeParceiro', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Centro Fornecedor" value={v('vendasCentroFornecedor')} onChange={(e) => handleChange('vendasCentroFornecedor', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Condição de Expedição" value={v('condicaoExpedicao')} onChange={(e) => handleChange('condicaoExpedicao', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={4}>{renderField('vendasRelevanteliquidacao', 'Liquidação Relevante')}</Grid>
              <Grid item xs={12} sm={6} md={4}>{renderField('relevanteCrr', 'CRR Relevante')}</Grid>
              <Grid item xs={12} sm={6} md={4}><TextField fullWidth size="small" label="Perfil do Cliente Bayer" value={v('perfilClienteBayer')} onChange={(e) => handleChange('perfilClienteBayer', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
            </Grid>
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Cliente Empresas
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Centro" value={v('centro')} onChange={(e) => handleChange('centro', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Empresa" value={v('empresa')} onChange={(e) => handleChange('empresa', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Conta de Conciliação" value={v('contaConciliacao')} onChange={(e) => handleChange('contaConciliacao', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}>{renderField('condPgto', 'Condição de Pagamento')}</Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Chave de Ordenação" value={v('chvOrdenacao')} onChange={(e) => handleChange('chvOrdenacao', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Grupo Administração de Tesouraria" value={v('grpAdminTesouraria')} onChange={(e) => handleChange('grpAdminTesouraria', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Ajuste de Valor" value={v('ajusValor')} onChange={(e) => handleChange('ajusValor', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}>{renderField('formPgto', 'Forma de Pagamento')}</Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Banco Empresa Cliente" value={v('bancoEmpresaCliente')} onChange={(e) => handleChange('bancoEmpresaCliente', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}>{renderField('verificarFaturaDuplicada', 'Verificar Fatura Duplicada')}</Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Procedimento de Advertência" value={v('procedimentoAdvertencia')} onChange={(e) => handleChange('procedimentoAdvertencia', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
              <Grid item xs={12} sm={6} md={3}><TextField fullWidth size="small" label="Responsável por Advertência" value={v('responsavelAdvertencia')} onChange={(e) => handleChange('responsavelAdvertencia', e.target.value)} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} /></Grid>
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
                return (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField fullWidth size="small" label={label} value={v(key)} onChange={(e) => handleChange(key, formatCpf(e.target.value))} placeholder="000.000.000-00" inputProps={{ maxLength: 14 }} InputLabelProps={{ shrink: true }} disabled={isWorkflowStatus} />
                  </Grid>
                );
              }
              if (isCnpj) {
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

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={partnerId ? 'Editar Business Partner' : 'Novo Business Partner'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Business Partner', href: paths.dashboard.businessPartners.root },
          { name: partnerId ? 'Editar' : 'Formulário completo' },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={handleBack}>Voltar</Button>
            <Button variant="contained" onClick={handleSave} disabled={isWorkflowStatus || bpLoading}>
              Salvar
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

      {/* Aviso de carregamento do form builder (opcional); formulário completo é exibido abaixo */}
      {!partnerId && formBuilderLoading && (
        <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Iconify icon="eva:loading-outline" width={20} sx={{ animation: 'spin 1s linear infinite' }} />
            <Typography variant="body2" color="text.secondary">Carregando campos personalizados...</Typography>
          </Stack>
        </Card>
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
                '& .simplebar-content': { overflowX: 'hidden !important', minWidth: 0 },
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
    </DashboardContent>
  );
}
