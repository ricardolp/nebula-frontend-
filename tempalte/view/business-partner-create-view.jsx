import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';
import { DashboardContent } from 'src/layouts/dashboard';
import { convertObjectToSnakeCase } from 'src/utils/change-case';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import { businessPartnerSchema, defaultValues, convertTipoToBackend, convertFuncaoToBackend, convertCheckboxToBackend } from '../schemas/business-partner-schema';
import { BusinessPartnerDocumentSearchDialog } from '../components/business-partner-document-search-dialog';
import { BusinessPartnerTabs } from '../components/business-partner-tabs';

// ----------------------------------------------------------------------

/**
 * Business Partner Create View
 * Formulário de criação de parceiros de negócio com abas
 */
export function BusinessPartnerCreateView() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(businessPartnerSchema),
    defaultValues,
  });

  const { handleSubmit, setValue, setError } = form;

  /**
   * Submete o formulário para criação do parceiro de negócio
   */
  const onSubmit = useCallback(
    async (data) => {
      try {
        setIsSubmitting(true);

        console.log('Dados do formulário:', data);

        // Prepara os dados para envio
        const preparedData = { ...data };
        
        // Converte tipo para o formato do backend (SOCI -> S, TERC -> T)
        preparedData.tipo = convertTipoToBackend(preparedData.tipo);
        
        // Converte funcao de array para string concatenada (backend espera string)
        // ['CLI', 'FORN'] -> 'CLIE/FORN'
        preparedData.funcao = convertFuncaoToBackend(preparedData.funcao);
        
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

        console.log('Dados preparados para envio:', preparedData);

        // Converte todo o objeto para snake_case antes de enviar para a API
        const snakeCaseData = convertObjectToSnakeCase(preparedData);
        
        console.log('Dados convertidos para snake_case:', snakeCaseData);

        // Envia dados para a API
        const response = await axios.post(endpoints.businessPartners.create, snakeCaseData);

        console.log('Resposta da API:', response.data);

        // Verifica se o parceiro foi criado com sucesso (se retornou um ID)
        if (response.data?.id) {
          toast.success('Parceiro de negócio criado com sucesso!');
          router.push(paths.dashboard.businessPartner.root);
        } else {
          throw new Error('Erro ao criar parceiro de negócio');
        }
      } catch (error) {
        console.error('Erro ao criar parceiro de negócio:', error);
        
        // Verifica se há erros de validação do backend
        const validationErrors = error?.response?.data?.error?.details;
        
        if (validationErrors && Array.isArray(validationErrors)) {
          // Mapeia os erros para os campos do formulário
          validationErrors.forEach((validationError) => {
            const { path: fieldPath, message } = validationError;
            
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
            'Erro ao criar parceiro de negócio'
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, setError]
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

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Novo Parceiro de Negócio"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Parceiros de Negócio', href: paths.dashboard.businessPartner.root },
          { name: 'Novo' },
        ]}
        action={
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:magnifer-bold" />}
            onClick={() => setSearchDialogOpen(true)}
          >
            Buscar dados
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Form methods={form} onSubmit={handleSubmit(onSubmit)}>
        <BusinessPartnerTabs 
          form={form} 
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
        />
      </Form>

      {/* Dialog de busca de dados */}
      <BusinessPartnerDocumentSearchDialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        onSearch={handleDocumentSearch}
      />
    </DashboardContent>
  );
}
