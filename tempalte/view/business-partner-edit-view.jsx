import { useCallback, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import axios, { endpoints } from 'src/utils/axios';
import { convertObjectToSnakeCase } from 'src/utils/change-case';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';

import { BusinessPartnerDocumentSearchDialog } from '../components/business-partner-document-search-dialog';
import { BusinessPartnerTabs } from '../components/business-partner-tabs';
import { businessPartnerSchema, convertCheckboxFromBackend, convertCheckboxToBackend, convertFuncaoFromBackend, convertFuncaoToBackend, convertTipoFromBackend, convertTipoToBackend, defaultValues } from '../schemas/business-partner-schema';

// ----------------------------------------------------------------------

/**
 * Business Partner Edit View
 * Formulário de edição de parceiros de negócio com abas
 */
export function BusinessPartnerEditView() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [businessPartnerData, setBusinessPartnerData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);
  const [isIntegrating, setIsIntegrating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const form = useForm({
    resolver: zodResolver(businessPartnerSchema),
    defaultValues,
  });

  const { handleSubmit, setValue, reset, setError } = form;

  /**
   * Carrega os dados do parceiro de negócio
   */
  const loadBusinessPartner = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Carregando parceiro de negócio:', id);

      const response = await axios.get(endpoints.businessPartners.details(id));

      console.log('📊 Resposta do backend:', response.data);

      if (response.data) {
        const apiData = response.data;
        setBusinessPartnerData(apiData);
        
        console.log('📊 Dados do parceiro:', apiData);
        
        // Transforma os dados da API (snake_case) para o formato do formulário (camelCase)
        const formData = {
          // Dados principais
          codAntigo: apiData.cod_antigo || '',
          tipo: convertTipoFromBackend(apiData.tipo || ''),
          funcao: convertFuncaoFromBackend(apiData.funcao),
          grupoContas: apiData.grupo_contas || '',
          agrContas: apiData.agr_contas || '',
          sexo: apiData.sexo || '',
          nomeNomeFantasia: apiData.nome_nome_fantasia || '',
          sobrenomeRazaoSocial: apiData.sobrenome_razao_social || '',
          nome3: apiData.nome3 || '',
          nome4: apiData.nome4 || '',
          termoPesquisa1: apiData.termo_pesquisa1 || '',
          termoPesquisa2: apiData.termo_pesquisa2 || '',
          vocativo: apiData.vocativo || '',
          status: apiData.status || 'DRAFT',
          
          // Endereço
          endereco: {
            rua: apiData.endereco?.rua || '',
            rua2: apiData.endereco?.rua2 || '',
            numero: apiData.endereco?.numero || '',
            complemento: apiData.endereco?.complemento || '',
            bairro: apiData.endereco?.bairro || '',
            cep: apiData.endereco?.cep || '',
            cidade: apiData.endereco?.cidade || '',
            estado: apiData.endereco?.estado || '',
            pais: apiData.endereco?.pais || 'BR',
          },
          
          // Comunicação
          comunicacao: {
            telefone: apiData.comunicacao?.telefone || '',
            telefone2: apiData.comunicacao?.telefone2 || '',
            telefone3: apiData.comunicacao?.telefone3 || '',
            celular: apiData.comunicacao?.celular || '',
            email: apiData.comunicacao?.email || [],
            observacoes: apiData.comunicacao?.observacoes || '',
          },
          
          // Data de nascimento/fundação
          dataNascimentoFundacao: apiData.data_nascimento || apiData.data_fundacao || null,
          
          // Identificação
          identificacao: {
            cpf: apiData.identificacao?.cpf || '',
            cnpj: apiData.identificacao?.cnpj || '',
            inscrEstatual: apiData.identificacao?.inscr_estadual || '',
            inscrMunicipal: apiData.identificacao?.inscr_municipal || '',
            tipoIdIdent: apiData.identificacao?.tipo_id_ident || '',
            numeroId: apiData.identificacao?.numero_id || '',
          },
          
          // Setor Industrial
          setorIndustrial: {
            chaveSetorInd: apiData.setor_industrial?.chave_setor_ind || '',
            codSetorInd: apiData.setor_industrial?.cod_setor_ind || '',
            setorIndPadrao: apiData.setor_industrial?.setor_ind_padrao || '',
          },
          
          // Pagamentos
          pagamentos: {
            codBanco: apiData.pagamentos?.cod_banco || '',
            codAgencia: apiData.pagamentos?.cod_agencia || '',
            digAgencia: apiData.pagamentos?.dig_agencia || '',
            codConta: apiData.pagamentos?.cod_conta || '',
            digConta: apiData.pagamentos?.dig_conta || '',
            favorecido: apiData.pagamentos?.favorecido || '',
            cpfFavorecido: apiData.pagamentos?.cpf_favorecido || '',
          },
          
          // Fornecedor IRF (é objeto único, não array)
          fornecedor: apiData.fornecedor_irf ? {
            devolucao: convertCheckboxFromBackend(apiData.fornecedor_irf.devolucao),
            revFatBasEm: apiData.fornecedor_irf.rev_fat_bas_em || '',
            grpEsqForn: apiData.fornecedor_irf.grp_esq_forn || '',
            relevanteLiquidacao: apiData.fornecedor_irf.relevante_liquidacao || '',
            regimePisCofins: apiData.fornecedor_irf.regime_pis_cofins || '',
            tipoImposto: apiData.fornecedor_irf.tipo_imposto || '',
            optanteSimples: apiData.fornecedor_irf.optante_simples || '',
            simplesNacional: apiData.fornecedor_irf.simples_nacional || '',
            recebedorAlternativo: apiData.fornecedor_irf.recebedor_alternativo || '',
          } : {},
          
          // Arrays relacionados - API retorna em snake_case
          fornecedorEmpresas: (apiData.fornecedor_empresas || []).map(item => ({
            ...Object.keys(item || {}).reduce((acc, key) => {
              acc[key] = item[key] ?? '';
              return acc;
            }, {}),
            minorit: convertCheckboxFromBackend(item?.minorit),
            verificarFaturaDuplicada: convertCheckboxFromBackend(item?.verificar_fatura_duplicada),
          })),
          fornecedorCompras: (apiData.fornecedor_compras || []).map(item => ({
            ...Object.keys(item || {}).reduce((acc, key) => {
              acc[key] = item[key] ?? '';
              return acc;
            }, {}),
            compensacao: convertCheckboxFromBackend(item?.compensacao),
          })),
          fornecedorIrf: apiData.fornecedor_irf ? {
            ...Object.keys(apiData.fornecedor_irf || {}).reduce((acc, key) => {
              acc[key] = apiData.fornecedor_irf[key] ?? '';
              return acc;
            }, {}),
          } : {},
          clienteEmpresas: (apiData.cliente_empresas || []).map(item => ({
            ...Object.keys(item || {}).reduce((acc, key) => {
              acc[key] = item[key] ?? '';
              return acc;
            }, {}),
            verificarFaturaDuplicada: convertCheckboxFromBackend(item?.verificar_fatura_duplicada),
          })),
          vendasDistribuicoes: (apiData.vendas_distribuicoes || []).map(item => ({
            ...Object.keys(item || {}).reduce((acc, key) => {
              acc[key] = item[key] ?? '';
              return acc;
            }, {}),
            compensacao: convertCheckboxFromBackend(item?.compensacao),
            agrupamentoOrdens: convertCheckboxFromBackend(item?.agrupamento_ordens),
            vendasRelevanteliquidacao: convertCheckboxFromBackend(item?.vendas_relevante_liquidacao),
            relevanteCrr: convertCheckboxFromBackend(item?.relevante_crr),
          })),
          relacoes: (apiData.relacoes || []).map(item => ({
            ...Object.keys(item || {}).reduce((acc, key) => {
              acc[key] = item[key] ?? '';
              return acc;
            }, {}),
          })),
          partnerFunctions: (apiData.partner_functions || []).map(item => ({
            ...Object.keys(item || {}).reduce((acc, key) => {
              acc[key] = item[key] ?? '';
              return acc;
            }, {}),
          })),
          
          // Campos personalizados Z
          camposZ: apiData.business_partner_z || {},
        };
        
        console.log('✅ Dados transformados para o formulário:', formData);
        
        // Popula o formulário com os dados transformados
        reset(formData);
        
        console.log('✅ Formulário resetado com os dados do parceiro');
      }
    } catch (error) {
      console.error('Erro ao carregar parceiro de negócio:', error);
      toast.error(
        error?.response?.data?.message || 'Erro ao carregar dados do parceiro de negócio'
      );
      
      // Redireciona para lista se não conseguir carregar
      router.push(paths.dashboard.businessPartner.list);
    } finally {
      setIsLoading(false);
    }
  }, [id, reset, router]);

  /**
   * Carrega os dados quando o componente é montado
   */
  useEffect(() => {
    if (id) {
      loadBusinessPartner();
    }
  }, [id, loadBusinessPartner]);

  /**
   * Ativa o business partner (muda status de DRAFT para ACTIVE)
   */
  const handleActivate = useCallback(async () => {
    try {
      setIsActivating(true);

      const response = await axios.post(
        endpoints.businessPartners.changeStatus(id),
        { status: 'ACTIVE' }
      );

      if (response.data?.success) {
        toast.success('Business partner ativado com sucesso!');
        
        // Atualiza o status local
        setBusinessPartnerData(prev => ({
          ...prev,
          status: 'ACTIVE'
        }));
        
        // Atualiza o valor no formulário
        setValue('status', 'ACTIVE');
        
        // Recarrega os dados para garantir sincronização
        await loadBusinessPartner();
      } else {
        throw new Error(response.data?.message || 'Erro ao ativar business partner');
      }
    } catch (error) {
      console.error('Erro ao ativar business partner:', error);
      toast.error(
        error?.response?.data?.message || 'Erro ao ativar business partner'
      );
    } finally {
      setIsActivating(false);
    }
  }, [id, setValue, loadBusinessPartner]);

  /**
   * Submete o formulário para atualização do parceiro de negócio
   */
  const onSubmit = useCallback(
    async (data) => {
      try {
        setIsSubmitting(true);

        console.log('Atualizando parceiro de negócio:', data);

        // Prepara os dados para envio
        const preparedData = { ...data };
        
        // Converte tipo para o formato do backend (SOCI -> S, TERC -> T)
        preparedData.tipo = convertTipoToBackend(preparedData.tipo);
        
        // Converte funcao de array para string concatenada (backend espera string)
        // ['CLI', 'FORN'] -> 'CLIE/FORN'
        preparedData.funcao = convertFuncaoToBackend(preparedData.funcao);
        
        // Converte checkboxes para o formato do backend ('' ou 'X')
        if (preparedData.fornecedor) {
          preparedData.fornecedor.devolucao = convertCheckboxToBackend(preparedData.fornecedor.devolucao);
          preparedData.fornecedor.revFatBasEm = convertCheckboxToBackend(preparedData.fornecedor.revFatBasEm);
          preparedData.fornecedor.revFatBasServ = convertCheckboxToBackend(preparedData.fornecedor.revFatBasServ);
          preparedData.fornecedor.relevanteLiquidacao = convertCheckboxToBackend(preparedData.fornecedor.relevanteLiquidacao);
          preparedData.fornecedor.pedidoAutom = convertCheckboxToBackend(preparedData.fornecedor.pedidoAutom);
          preparedData.fornecedor.tipoNfe = convertCheckboxToBackend(preparedData.fornecedor.tipoNfe);
          preparedData.fornecedor.tipoImposto = convertCheckboxToBackend(preparedData.fornecedor.tipoImposto);
          preparedData.fornecedor.simplesNacional = convertCheckboxToBackend(preparedData.fornecedor.simplesNacional);
        }
        
        // Converte checkboxes dos arrays
        if (preparedData.fornecedorEmpresas) {
          preparedData.fornecedorEmpresas = preparedData.fornecedorEmpresas.map(item => ({
            ...item,
            minorit: convertCheckboxToBackend(item.minorit),
            verificarFaturaDuplicada: convertCheckboxToBackend(item.verificarFaturaDuplicada),
          }));
        }
        
        if (preparedData.fornecedorCompras) {
          preparedData.fornecedorCompras = preparedData.fornecedorCompras.map(item => ({
            ...item,
            compensacao: convertCheckboxToBackend(item.compensacao),
          }));
        }
        
        if (preparedData.clienteEmpresas) {
          preparedData.clienteEmpresas = preparedData.clienteEmpresas.map(item => ({
            ...item,
            verificarFaturaDuplicada: convertCheckboxToBackend(item.verificarFaturaDuplicada),
          }));
        }
        
        if (preparedData.clienteVendas) {
          preparedData.clienteVendas = preparedData.clienteVendas.map(item => ({
            ...item,
            compensacao: convertCheckboxToBackend(item.compensacao),
            agrupamentoOrdens: convertCheckboxToBackend(item.agrupamentoOrdens),
            vendasRelevanteliquidacao: convertCheckboxToBackend(item.vendasRelevanteliquidacao),
            relevanteCrr: convertCheckboxToBackend(item.relevanteCrr),
          }));
        }
        
        // Se houver CNPJ, copia dataNascimentoFundacao para data_fundacao (nível raiz)
        if (preparedData.identificacao?.cnpj?.trim()) {
          preparedData.data_fundacao = preparedData.dataNascimentoFundacao || null;
          preparedData.data_nascimento = null;
        }
        // Se houver CPF, copia dataNascimentoFundacao para data_nascimento (nível raiz)
        else if (preparedData.identificacao?.cpf?.trim()) {
          preparedData.data_nascimento = preparedData.dataNascimentoFundacao || null;
          preparedData.data_fundacao = null;
        }
        
        // Remove formatação de CPF e CNPJ (backend espera apenas números)
        if (preparedData.identificacao?.cpf) {
          preparedData.identificacao.cpf = preparedData.identificacao.cpf.replace(/\D/g, '');
        }
        if (preparedData.identificacao?.cnpj) {
          preparedData.identificacao.cnpj = preparedData.identificacao.cnpj.replace(/\D/g, '');
        }
        
        // Limpa email vazio para evitar erro de validação
        if (preparedData.comunicacao?.email === '') {
          delete preparedData.comunicacao.email;
        }

        console.log('Dados preparados para envio:', preparedData);

        // Converte todo o objeto para snake_case antes de enviar para a API
        const snakeCaseData = convertObjectToSnakeCase(preparedData);
        
        console.log('Dados convertidos para snake_case:', snakeCaseData);

        // Envia dados para a API
        const response = await axios.put(endpoints.businessPartners.update(id), snakeCaseData);

        console.log('Resposta da API:', response.data);

        // Verifica se o parceiro foi atualizado com sucesso (se retornou um ID)
        if (response.data?.id) {
          toast.success('Parceiro de negócio atualizado com sucesso!');
          router.push(paths.dashboard.businessPartner.root);
        } else {
          throw new Error('Erro ao atualizar parceiro de negócio');
        }
      } catch (error) {
        console.error('Erro ao atualizar parceiro de negócio:', error);
        
        // Verifica se há erros de validação do backend
        const validationErrors = error?.response?.data?.error?.details;
        
        if (validationErrors && Array.isArray(validationErrors)) {
          // Mapeia os erros para os campos do formulário
          validationErrors.forEach(({ path: fieldPath, message }) => {
            // Define o erro no campo específico
            setError(fieldPath, {
              type: 'server',
              message,
            });
          });
          
          toast.error('Verifique os campos destacados e corrija os erros');
        } else {
          toast.error(
            error?.response?.data?.error?.message || 
            error?.response?.data?.message || 
            'Erro ao atualizar parceiro de negócio'
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [id, router, setError]
  );

  /**
   * Handler para busca de dados por documento
   */
  const handleDocumentSearch = useCallback(
    async (documentType, documentValue, searchData) => {
      try {
        console.log('handleDocumentSearch called with:', { documentType, documentValue, searchData });
        
        if (documentType === 'cpf' && searchData) {
          // Limpa CNPJ se existir
          setValue('identificacao.cnpj', '');
          
          // Preenche dados do CPF
          setValue('identificacao.cpf', searchData.cpf || '');
          setValue('nomeNomeFantasia', searchData.nome || '');
          
          // Preenche termo de pesquisa 1 com CPF sem formatação
          const cpfSemFormatacao = (searchData.cpf || '').replace(/\D/g, '');
          setValue('termoPesquisa1', cpfSemFormatacao);
          
          // Formata data de nascimento se existir
          if (searchData.nascimento) {
            // A API retorna no formato DD/MM/AAAA, que já é compatível com o campo
            setValue('dataNascimentoFundacao', searchData.nascimento);
          }
          
          // Define função como cliente se não estiver definida
          const currentFuncao = form.getValues('funcao');
          if (!currentFuncao || currentFuncao.length === 0) {
            setValue('funcao', ['CLI']);
          }
          
          console.log('CPF data filled:', {
            cpf: searchData.cpf,
            nome: searchData.nome,
            nascimento: searchData.nascimento
          });
          
          toast.success('Dados do CPF preenchidos automaticamente!');
        } else if (documentType === 'cnpj' && searchData) {
          // Limpa CPF se existir
          setValue('identificacao.cpf', '');
          
          // Formata CNPJ
          const formatCnpj = (cnpj) => {
            const numbers = cnpj.replace(/\D/g, '');
            return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
          };
          
          // Formata telefone
          const formatPhone = (phone) => {
            if (!phone.area || !phone.number) return '';
            const numbers = phone.number.replace(/\D/g, '');
            if (numbers.length === 8) {
              return `(${phone.area}) ${numbers.slice(0, 4)}-${numbers.slice(4)}`;
            }
            return `(${phone.area}) ${numbers.slice(0, 5)}-${numbers.slice(5)}`;
          };
          
          // Preenche dados básicos do CNPJ
          setValue('identificacao.cnpj', formatCnpj(searchData.taxId || ''));
          setValue('nomeNomeFantasia', searchData.alias || searchData.company?.name || '');
          setValue('sobrenomeRazaoSocial', searchData.company?.name || '');
          
          // Preenche gênero e vocativo para empresa
          setValue('sexo', 'O'); // O = Organização (Pessoa Jurídica)
          setValue('vocativo', '0003'); // 0003 = Empresa
          
          // Preenche termo de pesquisa 1 com CNPJ sem formatação
          const cnpjSemFormatacao = (searchData.taxId || '').replace(/\D/g, '');
          setValue('termoPesquisa1', cnpjSemFormatacao);
          
          // Preenche data de fundação se existir (DatePicker espera formato ISO YYYY-MM-DD)
          if (searchData.founded) {
            setValue('dataNascimentoFundacao', searchData.founded);
          }
          
          // Preenche endereço se disponível
          if (searchData.address) {
            const { address } = searchData;
            
            if (address.street) {
              setValue('endereco.rua', address.street);
            }
            if (address.number) {
              setValue('endereco.numero', address.number);
            }
            if (address.details) {
              setValue('endereco.complemento', address.details);
            }
            if (address.district) {
              setValue('endereco.bairro', address.district);
            }
            if (address.city) {
              setValue('endereco.cidade', address.city);
            }
            if (address.state) {
              setValue('endereco.estado', address.state);
            }
            if (address.zip) {
              // Remove formatação do CEP se houver e reformata
              const cep = address.zip.replace(/\D/g, '');
              setValue('endereco.cep', cep.replace(/(\d{5})(\d{3})/, '$1-$2'));
            }
            if (address.country?.name) {
              // Mapeia país para código se necessário
              setValue('endereco.pais', address.country.name === 'Brasil' ? 'BR' : '');
            }
          }
          
          // Preenche contatos se disponíveis
          if (searchData.phones && searchData.phones.length > 0) {
            const phone1 = searchData.phones[0];
            setValue('comunicacao.telefone', formatPhone(phone1));
            
            if (searchData.phones.length > 1) {
              const phone2 = searchData.phones[1];
              setValue('comunicacao.telefone2', formatPhone(phone2));
            }
            
            if (searchData.phones.length > 2) {
              const phone3 = searchData.phones[2];
              setValue('comunicacao.telefone3', formatPhone(phone3));
            }
          }
          
          // Preenche email se disponível
          if (searchData.emails && searchData.emails.length > 0) {
            setValue('comunicacao.email', searchData.emails[0].address || '');
          }
          
          // Define função como fornecedor se não estiver definida
          const currentFuncao = form.getValues('funcao');
          if (!currentFuncao || currentFuncao.length === 0) {
            setValue('funcao', ['FORN']);
          }
          
          console.log('CNPJ data filled:', {
            cnpj: searchData.taxId,
            razaoSocial: searchData.company?.name,
            alias: searchData.alias,
            founded: searchData.founded
          });
          
          toast.success('Dados do CNPJ preenchidos automaticamente!');
        }
      } catch (error) {
        console.error('Erro ao preencher dados:', error);
        toast.error('Erro ao preencher dados do documento');
      }
    },
    [setValue, form]
  );

  /**
   * Envia o parceiro de negócio para integração com SAP
   */
  const handleSapIntegration = useCallback(async () => {
    try {
      setIsIntegrating(true);
      
      const response = await axios.post(endpoints.businessPartners.sendToSap(id), {
        forceSync: false,
      });

      if (response.data?.success) {
        toast.success(
          response.data.message || 'Parceiro de negócio enfileirado para integração com SAP!'
        );
        
        // Atualiza os logs após um pequeno delay para garantir que o backend processou
        setTimeout(() => {
          if (logsDialogOpen) {
            setLogsDialogOpen(false);
            setTimeout(() => setLogsDialogOpen(true), 100);
          }
        }, 1000);
      } else if (response.data?.success === false) {
        // Trata erro quando a API retorna success: false
        const errorMessage = response.data?.error?.message || 
                            'Erro ao enviar parceiro para integração com SAP';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Erro ao integrar com SAP:', error);
      
      // Trata diferentes formatos de erro
      // O interceptor do axios já transforma error.response.data em error
      let errorMessage = 'Erro ao enviar parceiro para integração com SAP';
      
      // Caso 1: Error já é o objeto data com success: false e error.message
      if (error?.success === false && error?.error?.message) {
        errorMessage = error.error.message;
      }
      // Caso 2: Error tem message direto
      else if (error?.message) {
        errorMessage = error.message;
      }
      // Caso 3: Error tem error.message
      else if (error?.error?.message) {
        errorMessage = error.error.message;
      }
      // Caso 4: Fallback para error.response.data (caso o interceptor não tenha processado)
      else if (error?.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsIntegrating(false);
    }
  }, [id, logsDialogOpen]);

  // Exibe loading enquanto carrega os dados
  if (isLoading) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Editar Parceiro de Negócio"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Parceiros de Negócio', href: paths.dashboard.businessPartner.list },
            { name: 'Editar' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: 400 }}
        >
          <CircularProgress size={60} />
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            Carregando dados do parceiro...
          </Typography>
        </Stack>
      </DashboardContent>
    );
  }

  /**
   * Retorna a cor do badge de status
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INTEGRATED':
        return 'info';
      case 'PENDING':
        return 'warning';
      case 'ERROR':
        return 'error';
      case 'INACTIVE':
        return 'default';
      default:
        return 'default';
    }
  };

  /**
   * Retorna o label do status
   */
  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativo';
      case 'INTEGRATED':
        return 'Integrado';
      case 'PENDING':
        return 'Pendente';
      case 'ERROR':
        return 'Erro';
      case 'INACTIVE':
        return 'Inativo';
      default:
        return status;
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={
          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
            <span>{isEditMode ? 'Editar Parceiro de Negócio' : 'Detalhes do Parceiro de Negócio'}</span>
            {businessPartnerData?.status && (
              <Label
                variant="soft"
                color={getStatusColor(businessPartnerData.status)}
              >
                {getStatusLabel(businessPartnerData.status)}
              </Label>
            )}
            {businessPartnerData?.codAntigo && (
              <Tooltip title="Código Antigo do Parceiro">
                <Label variant="outlined" color="default">
                  Cód: {businessPartnerData.codAntigo}
                </Label>
              </Tooltip>
            )}
            {businessPartnerData?.sapBpNum && (
              <Tooltip title={`Integrado no SAP em ${new Date(businessPartnerData.sapIntegratedAt).toLocaleString('pt-BR')}`}>
                <Label
                  variant="outlined"
                  color="info"
                  startIcon={<Iconify icon="simple-icons:sap" width={14} />}
                >
                  SAP: {businessPartnerData.sapBpNum}
                </Label>
              </Tooltip>
            )}
          </Stack>
        }
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Parceiros de Negócio', href: paths.dashboard.businessPartner.list },
          { name: businessPartnerData?.nomeNomeFantasia || 'Detalhes' },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            {/* Botão de Logs - discreto */}
            <Button
              variant="text"
              color="inherit"
              size="small"
              startIcon={<Iconify icon="solar:clipboard-list-bold-duotone" />}
              onClick={() => setLogsDialogOpen(true)}
              sx={{ 
                minWidth: 'auto',
                px: 1.5,
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
            >
              Logs
            </Button>

            {/* Botão de Integração SAP - discreto */}
            <Tooltip title="Enviar para integração com SAP">
              <Button
                variant="text"
                color="inherit"
                size="small"
                disabled={isIntegrating}
                startIcon={
                  isIntegrating ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Iconify icon="simple-icons:sap" />
                  )
                }
                onClick={handleSapIntegration}
                sx={{ 
                  minWidth: 'auto',
                  px: 1.5,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'info.main',
                    bgcolor: 'action.hover',
                  },
                  '&:disabled': {
                    color: 'text.disabled',
                  },
                }}
              >
                Integrar
              </Button>
            </Tooltip>

            {/* Botão de Ativar - só aparece quando status = DRAFT */}
            {businessPartnerData?.status === 'DRAFT' && !isEditMode && (
              <Button
                variant="contained"
                color="success"
                disabled={isActivating}
                startIcon={
                  isActivating ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Iconify icon="solar:check-circle-bold" />
                  )
                }
                onClick={handleActivate}
                sx={{ 
                  minWidth: 'auto',
                  px: 2,
                }}
              >
                {isActivating ? 'Ativando...' : 'Ativar'}
              </Button>
            )}
            
            {isEditMode ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="solar:magnifer-bold" />}
                  onClick={() => setSearchDialogOpen(true)}
                >
                  Buscar dados
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    setIsEditMode(false);
                    loadBusinessPartner(); // Recarrega os dados originais
                  }}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<Iconify icon="solar:pen-bold" />}
                onClick={() => setIsEditMode(true)}
              >
                Editar
              </Button>
            )}
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={form} onSubmit={handleSubmit(onSubmit)}>
        <BusinessPartnerTabs 
          form={form} 
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          isViewMode={!isEditMode}
        />
      </Form>

      {/* Dialog de busca de dados */}
      <BusinessPartnerDocumentSearchDialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        onSearch={handleDocumentSearch}
      />

      {/* Dialog de Logs */}
      <BusinessPartnerLogsDialog
        open={logsDialogOpen}
        onClose={() => setLogsDialogOpen(false)}
        businessPartnerId={id}
        businessPartnerName={businessPartnerData?.nomeNomeFantasia}
      />
    </DashboardContent>
  );
}

/**
 * Business Partner Logs Dialog
 * Dialog profissional para exibir histórico de alterações
 */
function BusinessPartnerLogsDialog({ open, onClose, businessPartnerId, businessPartnerName }) {
  const [currentTab, setCurrentTab] = useState('modificacao');
  const [logs, setLogs] = useState([]);
  const [integrationLogs, setIntegrationLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingIntegration, setIsLoadingIntegration] = useState(false);

  useEffect(() => {
    if (open && businessPartnerId) {
      if (currentTab === 'modificacao') {
        loadLogs();
      } else if (currentTab === 'integracao') {
        loadIntegrationLogs();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, businessPartnerId, currentTab]);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      // Endpoint de histórico indisponível no momento; retorna lista vazia
      const response = { data: { items: [], total: 0 } };
      setLogs(response.data?.data || []);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      toast.error('Erro ao carregar histórico de alterações');
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadIntegrationLogs = async () => {
    try {
      setIsLoadingIntegration(true);
      // Endpoint de logs de integração indisponível; retorna lista vazia
      const response = { data: { items: [], total: 0 } };
      setIntegrationLogs(response.data?.data || []);
    } catch (error) {
      console.error('Erro ao carregar logs de integração:', error);
      toast.error('Erro ao carregar logs de integração');
      setIntegrationLogs([]);
    } finally {
      setIsLoadingIntegration(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getOperationIcon = (operation) => {
    switch (operation) {
      case 'CREATE':
        return 'solar:add-circle-bold';
      case 'UPDATE':
        return 'solar:pen-bold';
      case 'DELETE':
        return 'solar:trash-bin-minimalistic-bold';
      default:
        return 'solar:document-bold';
    }
  };

  const getOperationColor = (operation) => {
    switch (operation) {
      case 'CREATE':
        return 'success.main';
      case 'UPDATE':
        return 'warning.main';
      case 'DELETE':
        return 'error.main';
      default:
        return 'text.secondary';
    }
  };

  const getOperationLabel = (operation) => {
    switch (operation) {
      case 'CREATE':
        return 'Criação';
      case 'UPDATE':
        return 'Atualização';
      case 'DELETE':
        return 'Exclusão';
      default:
        return operation;
    }
  };

  const getSectionLabel = (fieldName) => {
    const sections = {
      tipo: 'Informações Gerais',
      funcao: 'Informações Gerais',
      nomeNomeFantasia: 'Informações Gerais',
      sobrenomeRazaoSocial: 'Informações Gerais',
      endereco: 'Endereço',
      comunicacao: 'Comunicação',
      identificacao: 'Identificação',
      fornecedor: 'Dados do Fornecedor',
      fornecedorCompras: 'Compras',
      fornecedorEmpresas: 'Empresas',
      clienteEmpresas: 'Empresas',
      clienteVendas: 'Vendas',
      pagamentos: 'Pagamentos',
      setorIndustrial: 'Setor Industrial',
      camposZ: 'Campos Customizados',
    };
    return sections[fieldName] || 'Outros';
  };

  const getIntegrationStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'solar:check-circle-bold';
      case 'ERROR':
        return 'solar:close-circle-bold';
      case 'PENDING':
        return 'solar:clock-circle-bold';
      case 'RETRY':
        return 'solar:refresh-bold';
      default:
        return 'solar:question-circle-bold';
    }
  };

  const getIntegrationStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'success.main';
      case 'ERROR':
        return 'error.main';
      case 'PENDING':
        return 'warning.main';
      case 'RETRY':
        return 'info.main';
      default:
        return 'text.secondary';
    }
  };

  const getIntegrationStatusLabel = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'Sucesso';
      case 'ERROR':
        return 'Erro';
      case 'PENDING':
        return 'Pendente';
      case 'RETRY':
        return 'Tentativa';
      default:
        return status;
    }
  };

  const getIntegrationTypeIcon = (type) => {
    switch (type) {
      case 'CREATE':
        return 'solar:add-circle-bold';
      case 'UPDATE':
        return 'solar:pen-bold';
      case 'DELETE':
        return 'solar:trash-bin-minimalistic-bold';
      default:
        return 'solar:document-bold';
    }
  };

  const getIntegrationTypeColor = (type) => {
    switch (type) {
      case 'CREATE':
        return 'success.main';
      case 'UPDATE':
        return 'warning.main';
      case 'DELETE':
        return 'error.main';
      default:
        return 'text.secondary';
    }
  };

  const getIntegrationTypeLabel = (type) => {
    switch (type) {
      case 'CREATE':
        return 'Criação';
      case 'UPDATE':
        return 'Atualização';
      case 'DELETE':
        return 'Exclusão';
      default:
        return type;
    }
  };

  const formatJsonForDisplay = (jsonData) => {
    if (!jsonData) return 'Nenhum dado';
    return JSON.stringify(jsonData, null, 2);
  };

  const getErrorMessage = (log) => {
    if (log.errorMessage) {
      return log.errorMessage;
    }
    if (log.responsePayload?.errors && Array.isArray(log.responsePayload.errors)) {
      return log.responsePayload.errors.map(error => error.message).join('; ');
    }
    if (log.responsePayload?.message) {
      return log.responsePayload.message;
    }
    return null;
  };

  // Agrupa logs por timestamp e conta modificações
  const groupedLogs = logs.reduce((acc, log) => {
    const key = log.changedAt;
    if (!acc[key]) {
      acc[key] = {
        timestamp: key,
        operation: log.operation,
        changedByName: log.changedByName,
        changes: [],
        sections: new Set(),
      };
    }
    acc[key].changes.push(log);
    acc[key].sections.add(getSectionLabel(log.fieldName));
    return acc;
  }, {});

  const sortedGroups = Object.values(groupedLogs).sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 2 }}>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  bgcolor: 'primary.lighter',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify 
                  icon="solar:history-bold-duotone" 
                  width={24} 
                  sx={{ color: 'primary.main' }}
                />
              </Box>
              <div>
                <Typography variant="h6">Histórico de Alterações</Typography>
                {businessPartnerName && (
                  <Typography variant="body2" color="text.secondary">
                    {businessPartnerName}
                  </Typography>
                )}
              </div>
            </Stack>
          </Stack>
        </Stack>
      </DialogTitle>

      <Divider />

      <Tabs
        value={currentTab}
        onChange={(e, newValue) => setCurrentTab(newValue)}
        sx={{ 
          px: 3, 
          pt: 1.5,
          minHeight: 48,
          '& .MuiTab-root': {
            minHeight: 48,
          },
        }}
      >
        <Tab 
          label="Modificações" 
          value="modificacao"
          icon={<Iconify icon="solar:pen-bold-duotone" width={20} />}
          iconPosition="start"
        />
        <Tab 
          label="Integrações" 
          value="integracao"
          icon={<Iconify icon="solar:cloud-bold-duotone" width={20} />}
          iconPosition="start"
        />
      </Tabs>

      <Divider />

      <DialogContent sx={{ minHeight: 400, maxHeight: 600, pt: 3 }}>
        {currentTab === 'modificacao' && (
          <>
            {isLoading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Carregando histórico...
                </Typography>
              </Stack>
            ) : logs.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    bgcolor: 'background.neutral',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Iconify
                    icon="solar:document-text-bold-duotone"
                    width={40}
                    sx={{ color: 'text.disabled' }}
                  />
                </Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Nenhuma modificação encontrada
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
                  Este parceiro ainda não possui histórico de alterações
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={0} sx={{ position: 'relative' }}>
                {/* Timeline vertical */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: 19,
                    top: 40,
                    bottom: 20,
                    width: 2,
                    bgcolor: 'divider',
                  }}
                />

                {sortedGroups.map((group, index) => (
                  <Stack 
                    key={group.timestamp}
                    direction="row" 
                    spacing={2}
                    sx={{ 
                      position: 'relative',
                      pt: index === 0 ? 2 : 0,
                      pb: index === sortedGroups.length - 1 ? 2 : 3,
                    }}
                  >
                    {/* Ícone da operação */}
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'background.paper',
                        border: 2,
                        borderColor: getOperationColor(group.operation),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <Iconify
                        icon={getOperationIcon(group.operation)}
                        width={20}
                        sx={{ color: getOperationColor(group.operation) }}
                      />
                    </Box>

                    {/* Card de informações */}
                    <Box
                      sx={{
                        flex: 1,
                        p: 2.5,
                        borderRadius: 2,
                        bgcolor: 'background.neutral',
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: (theme) => theme.customShadows.z8,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Stack spacing={1.5}>
                        {/* Header */}
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Stack spacing={0.5}>
                            <Typography variant="subtitle2">
                              {getOperationLabel(group.operation)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(group.timestamp)}
                              {group.changedByName && ` • ${group.changedByName}`}
                            </Typography>
                          </Stack>
                          <Chip
                            label={`${group.changes.length} ${group.changes.length === 1 ? 'alteração' : 'alterações'}`}
                            size="small"
                            sx={{ 
                              height: 24,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          />
                        </Stack>

                        {/* Seções modificadas */}
                        <Stack direction="row" flexWrap="wrap" gap={0.75}>
                          {Array.from(group.sections).map((section) => (
                            <Chip
                              key={section}
                              label={section}
                              size="small"
                              variant="outlined"
                              sx={{
                                height: 22,
                                fontSize: '0.70rem',
                                borderRadius: 0.75,
                              }}
                            />
                          ))}
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            )}
          </>
        )}

        {currentTab === 'integracao' && (
          <>
            {isLoadingIntegration ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Carregando logs de integração...
                </Typography>
              </Stack>
            ) : integrationLogs.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    bgcolor: 'background.neutral',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Iconify
                    icon="solar:cloud-download-bold-duotone"
                    width={40}
                    sx={{ color: 'text.disabled' }}
                  />
                </Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Nenhum log de integração encontrado
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
                  Este parceiro ainda não possui logs de integração
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={2}>
                {integrationLogs.map((log) => (
                  <Card key={log.id} sx={{ overflow: 'visible' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        {/* Header do Log */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                bgcolor: 'background.paper',
                                border: 2,
                                borderColor: getIntegrationStatusColor(log.status),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Iconify
                                icon={getIntegrationStatusIcon(log.status)}
                                width={24}
                                sx={{ color: getIntegrationStatusColor(log.status) }}
                              />
                            </Box>
                            <Stack>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Chip
                                  label={getIntegrationTypeLabel(log.type)}
                                  size="small"
                                  sx={{
                                    bgcolor: getIntegrationTypeColor(log.type),
                                    color: 'white',
                                    fontWeight: 600,
                                  }}
                                />
                                <Chip
                                  label={getIntegrationStatusLabel(log.status)}
                                  size="small"
                                  variant="outlined"
                                  color={log.status === 'SUCCESS' ? 'success' : log.status === 'ERROR' ? 'error' : 'warning'}
                                />
                              </Stack>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(log.sentAt)} • {log.requestMethod} • {log.sentByName}
                              </Typography>
                            </Stack>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {log.retryCount > 0 && (
                              <Chip
                                label={`${log.retryCount} tentativa${log.retryCount > 1 ? 's' : ''}`}
                                size="small"
                                variant="outlined"
                                color="warning"
                              />
                            )}
                            <Chip
                              label={`${log.responseStatus || 'N/A'}`}
                              size="small"
                              variant="outlined"
                              color={log.responseStatus >= 200 && log.responseStatus < 300 ? 'success' : 'error'}
                            />
                          </Stack>
                        </Stack>

                        {/* Mensagem de Erro (se houver) */}
                        {getErrorMessage(log) && (
                          <Alert 
                            severity={log.status === 'SUCCESS' ? 'success' : 'error'}
                            sx={{ borderRadius: 1 }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {getErrorMessage(log)}
                            </Typography>
                          </Alert>
                        )}

                        {/* Accordions para Detalhes */}
                        <Stack spacing={1}>
                          {/* Request Payload */}
                          <Accordion>
                            <AccordionSummary expandIcon={<Iconify icon="solar:alt-arrow-down-bold" width={20} />}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Iconify icon="solar:upload-bold" width={18} />
                                <Typography variant="subtitle2">Payload de Envio</Typography>
                                <Chip
                                  label={log.requestMethod || 'N/A'}
                                  size="small"
                                  variant="outlined"
                                  sx={{ ml: 1 }}
                                />
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Box
                                component="pre"
                                sx={{
                                  p: 2,
                                  borderRadius: 1,
                                  bgcolor: 'background.neutral',
                                  fontSize: '0.75rem',
                                  fontFamily: 'monospace',
                                  overflow: 'auto',
                                  maxHeight: 300,
                                  border: (theme) => `1px solid ${theme.palette.divider}`,
                                }}
                              >
                                {formatJsonForDisplay(log.requestPayload)}
                              </Box>
                            </AccordionDetails>
                          </Accordion>

                          {/* Response Payload */}
                          <Accordion>
                            <AccordionSummary expandIcon={<Iconify icon="solar:alt-arrow-down-bold" width={20} />}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Iconify icon="solar:download-bold" width={18} />
                                <Typography variant="subtitle2">Resposta</Typography>
                                <Chip
                                  label={log.responseStatus || 'N/A'}
                                  size="small"
                                  variant="outlined"
                                  color={log.responseStatus >= 200 && log.responseStatus < 300 ? 'success' : 'error'}
                                  sx={{ ml: 1 }}
                                />
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Box
                                component="pre"
                                sx={{
                                  p: 2,
                                  borderRadius: 1,
                                  bgcolor: 'background.neutral',
                                  fontSize: '0.75rem',
                                  fontFamily: 'monospace',
                                  overflow: 'auto',
                                  maxHeight: 300,
                                  border: (theme) => `1px solid ${theme.palette.divider}`,
                                }}
                              >
                                {formatJsonForDisplay(log.responsePayload)}
                              </Box>
                            </AccordionDetails>
                          </Accordion>

                          {/* Request Headers */}
                          <Accordion>
                            <AccordionSummary expandIcon={<Iconify icon="solar:alt-arrow-down-bold" width={20} />}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Iconify icon="solar:settings-bold" width={18} />
                                <Typography variant="subtitle2">Headers da Requisição</Typography>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Box
                                component="pre"
                                sx={{
                                  p: 2,
                                  borderRadius: 1,
                                  bgcolor: 'background.neutral',
                                  fontSize: '0.75rem',
                                  fontFamily: 'monospace',
                                  overflow: 'auto',
                                  maxHeight: 200,
                                  border: (theme) => `1px solid ${theme.palette.divider}`,
                                }}
                              >
                                {formatJsonForDisplay(log.requestHeaders)}
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" size="large">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

