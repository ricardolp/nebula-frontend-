import { useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { CustomCombobox } from 'src/components/custom-combobox';
import { Field } from 'src/components/hook-form';

import { 
  canalDistribuicaoOptions,
  condicaoPagamentoOptions,
  empresaOptions,
  equipeVendasOptions,
  incotermsOptions,
  organizacaoVendasOptions,
  setorAtividadeOptions 
} from '../../schemas/business-partner-schema';

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {Object} props.form - Form instance from react-hook-form
 * @param {boolean} props.disabled - Se true, desabilita todos os campos
 */
export function BusinessPartnerSalesTab({ form, disabled = false }) {
  const { control } = form;
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [expandedCardsEmpresas, setExpandedCardsEmpresas] = useState(new Set());

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'clienteVendas',
  });

  const { fields: fieldsEmpresas, append: appendEmpresa, remove: removeEmpresa } = useFieldArray({
    control,
    name: 'clienteEmpresas',
  });

  const handleAddCliente = () => {
    const newIndex = fields.length;
    append({
      orgVendas: '',
      canalDistr: '',
      setorAtiv: '',
      regiaoVendas: '',
      prioridadeRemessa: '',
      incoterms: '',
      localInco1: '',
      grpClassContCli: '',
      classFiscal: '',
      moedaCliente: '',
      esquemaCliente: '',
      grupoPreco: '',
      listaPreco: '',
      compensacao: false,
      icms: '',
      ipi: '',
      substFiscal: '',
      cfop: '',
      contribIcms: '',
      tpPrincSetInd: '',
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
    });
    // Auto-expandir o novo card
    setExpandedCards(prev => new Set([...prev, newIndex]));
  };

  const handleAddEmpresa = () => {
    const newIndex = fieldsEmpresas.length;
    appendEmpresa({
      centro: '',
      empresa: '',
      contaConciliacao: '',
      condPgto: '',
      chvOrdenacao: '',
      grpAdminTesouraria: '',
      ajusValor: '',
      formPgto: '',
      bancoEmpresaCliente: '',
      verificarFaturaDuplicada: '',
      procedimentoAdvertencia: '',
      responsavelAdvertencia: '',
    });
    // Auto-expandir o novo card
    setExpandedCardsEmpresas(prev => new Set([...prev, newIndex]));
  };

  const toggleCard = (index) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleCardEmpresa = (index) => {
    setExpandedCardsEmpresas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Configure as informações de vendas para este parceiro
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:add-circle-bold" />}
            onClick={handleAddCliente}
            disabled={disabled}
          >
            Adicionar Configuração de Vendas
          </Button>
        </Box>

        {fields.length === 0 && (
          <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'background.neutral' }}>
            <Iconify icon="solar:shop-bold" width={48} sx={{ color: 'text.disabled', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Nenhuma configuração de vendas adicionada.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Clique no botão acima para adicionar uma nova configuração.
            </Typography>
          </Card>
        )}

        {fields.map((item, index) => {
          const isExpanded = expandedCards.has(index);
          
          return (
            <Card key={item.id} sx={{ p: 3, position: 'relative' }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  borderRadius: 1,
                  p: 1,
                  m: -1
                }}
                onClick={() => toggleCard(index)}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Vendas #{index + 1}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(index);
                    }}
                    size="small"
                    disabled={disabled}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCard(index);
                    }}
                  >
                    <Iconify 
                      icon={isExpanded ? "solar:alt-arrow-down-bold" : "solar:alt-arrow-right-bold"} 
                      width={20}
                    />
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={isExpanded}>
                <Box sx={{ pt: 2 }}>
                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={3}>
                    {/* Seção: Organização e Estrutura */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Organização e Estrutura
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.orgVendas`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <CustomCombobox
                                label="Organização de Vendas"
                                disabled={disabled}
                                placeholder="Selecionar organização..."
                                options={organizacaoVendasOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={!!error}
                                helperText={error?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.canalDistr`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <CustomCombobox
                                label="Canal de Distribuição"
                                disabled={disabled}
                                placeholder="Selecionar canal..."
                                options={canalDistribuicaoOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={!!error}
                                helperText={error?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.setorAtiv`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <CustomCombobox
                                label="Setor de Atividade"
                                disabled={disabled}
                                placeholder="Selecionar setor..."
                                options={setorAtividadeOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={!!error}
                                helperText={error?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.regiaoVendas`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Região de Vendas"
                                placeholder="Região de vendas"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.vendasEscritorioVendas`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Escritório de Vendas"
                                placeholder="Escritório de vendas"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.vendasEquipeVendas`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <CustomCombobox
                                label="Equipe de Vendas"
                                disabled={disabled}
                                placeholder="Selecionar equipe..."
                                options={equipeVendasOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={!!error}
                                helperText={error?.message}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Seção: Logística e Expedição */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Logística e Expedição
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.prioridadeRemessa`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Prioridade de Remessa"
                                placeholder="Prioridade"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.incoterms`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <CustomCombobox
                                label="Incoterms"
                                disabled={disabled}
                                placeholder="Selecionar incoterms..."
                                options={incotermsOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={!!error}
                                helperText={error?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.localInco1`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Local Incoterms"
                                placeholder="Local do incoterms"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.condicaoExpedicao`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Condição de Expedição"
                                placeholder="Condição de expedição"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.vendasCentroFornecedor`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Centro Fornecedor"
                                placeholder="Centro fornecedor"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Seção: Preços e Financeiro */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Preços e Financeiro
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.moedaCliente`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Moeda do Cliente"
                                placeholder="Ex: BRL, USD"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.grupoPreco`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Grupo de Preço"
                                placeholder="Grupo de preço"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.listaPreco`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Lista de Preços"
                                placeholder="Lista de preços"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.esquemaCliente`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Esquema do Cliente"
                                placeholder="Esquema do cliente"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Field.Checkbox
                            name={`clienteVendas.${index}.compensacao`}
                            label="Compensação"
                            disabled={disabled}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Seção: Fiscal e Tributário */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Fiscal e Tributário
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.classFiscal`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Classificação Fiscal"
                                placeholder="Classificação fiscal"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.icms`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="ICMS"
                                placeholder="Classificação ICMS"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.ipi`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="IPI"
                                placeholder="Classificação IPI"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.substFiscal`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Substituição Fiscal"
                                placeholder="Substituição fiscal"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.cfop`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="CFOP"
                                placeholder="Código CFOP"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.contribIcms`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Contribuição ICMS"
                                placeholder="Contribuição ICMS"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Seção: Classificação e Agrupamento */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Classificação e Agrupamento
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.tpPrincSetInd`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Tipo Principal do Setor Industrial"
                                placeholder="Tipo principal"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Field.Checkbox
                            name={`clienteVendas.${index}.agrupamentoOrdens`}
                            label="Agrupamento de Ordens"
                            disabled={disabled}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.vendasGrupoClientes`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Grupo de Clientes de Vendas"
                                placeholder="Grupo de clientes"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.vendasAtributo1`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Atributo de Vendas 1"
                                placeholder="Atributo de vendas 1"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.vendasAtributo2`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Atributo de Vendas 2"
                                placeholder="Atributo de vendas 2"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Seção: Outros Dados */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Outros Dados
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.vendasSociedadeParceiro`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Sociedade Parceiro"
                                placeholder="Sociedade parceiro"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Field.Checkbox
                            name={`clienteVendas.${index}.vendasRelevanteliquidacao`}
                            label="Liquidação Relevante"
                            disabled={disabled}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Field.Checkbox
                            name={`clienteVendas.${index}.relevanteCrr`}
                            label="CRR Relevante"
                            disabled={disabled}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteVendas.${index}.perfilClienteBayer`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Perfil do Cliente Bayer"
                                placeholder="Perfil do cliente"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                </Box>
              </Collapse>
            </Card>
          );
        })}

        <Divider sx={{ mt: 4 }} />

        {/* Seção: Cliente Empresas */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Configure as empresas/centros associados ao cliente
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:add-circle-bold" />}
            onClick={handleAddEmpresa}
            disabled={disabled}
          >
            Adicionar Empresa
          </Button>
        </Box>

        {fieldsEmpresas.length === 0 && (
          <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'background.neutral' }}>
            <Iconify icon="solar:buildings-2-bold" width={48} sx={{ color: 'text.disabled', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Nenhuma empresa associada adicionada.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Clique no botão acima para adicionar uma nova empresa.
            </Typography>
          </Card>
        )}

        {fieldsEmpresas.map((item, index) => {
          const isExpanded = expandedCardsEmpresas.has(index);
          
          return (
            <Card key={item.id} sx={{ p: 3, position: 'relative' }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  borderRadius: 1,
                  p: 1,
                  m: -1
                }}
                onClick={() => toggleCardEmpresa(index)}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Empresa #{index + 1}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeEmpresa(index);
                    }}
                    size="small"
                    disabled={disabled}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCardEmpresa(index);
                    }}
                  >
                    <Iconify 
                      icon={isExpanded ? "solar:alt-arrow-down-bold" : "solar:alt-arrow-right-bold"} 
                      width={20}
                    />
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={isExpanded}>
                <Box sx={{ pt: 2 }}>
                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={3}>
                    {/* Seção: Identificação */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Identificação
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteEmpresas.${index}.centro`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Centro"
                                placeholder="Centro"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteEmpresas.${index}.empresa`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <CustomCombobox
                                label="Empresa"
                                disabled={disabled}
                                placeholder="Selecionar empresa..."
                                options={empresaOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={!!error}
                                helperText={error?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteEmpresas.${index}.contaConciliacao`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Conta de Conciliação"
                                placeholder="Conta de conciliação"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Seção: Pagamento e Tesouraria */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Pagamento e Tesouraria
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteEmpresas.${index}.condPgto`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <CustomCombobox
                                label="Condição de Pagamento"
                                disabled={disabled}
                                placeholder="Selecionar condição..."
                                options={condicaoPagamentoOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={!!error}
                                helperText={error?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteEmpresas.${index}.chvOrdenacao`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Chave de Ordenação"
                                placeholder="Chave de ordenação"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteEmpresas.${index}.grpAdminTesouraria`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Grupo Administração de Tesouraria"
                                placeholder="Grupo admin tesouraria"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteEmpresas.${index}.ajusValor`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Ajuste de Valor"
                                placeholder="Ajuste de valor"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteEmpresas.${index}.formPgto`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Forma de Pagamento"
                                placeholder="Forma de pagamento"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteEmpresas.${index}.bancoEmpresaCliente`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Banco Empresa Cliente"
                                placeholder="Banco"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Seção: Controle */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Controle e Advertência
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteEmpresas.${index}.verificarFaturaDuplicada`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Verificar Fatura Duplicada"
                                placeholder="S/N"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteEmpresas.${index}.procedimentoAdvertencia`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Procedimento de Advertência"
                                placeholder="Procedimento"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`clienteEmpresas.${index}.responsavelAdvertencia`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Responsável por Advertência"
                                placeholder="Responsável"
                                fullWidth
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                </Box>
              </Collapse>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}