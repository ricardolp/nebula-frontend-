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
  condicaoPagamentoOptions,
  incotermsOptions,
  organizacaoComprasOptions 
} from '../../schemas/business-partner-schema';

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {Object} props.form - Form instance from react-hook-form
 * @param {boolean} props.disabled - Se true, desabilita todos os campos
 */
export function BusinessPartnerPurchasesTab({ form, disabled = false }) {
  const { control } = form;
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [expandedCardsEmpresas, setExpandedCardsEmpresas] = useState(new Set());
  const [expandedCardsIrf, setExpandedCardsIrf] = useState(new Set());

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fornecedorCompras',
  });

  const { fields: fieldsEmpresas, append: appendEmpresa, remove: removeEmpresa } = useFieldArray({
    control,
    name: 'fornecedorEmpresas',
  });

  const { fields: fieldsIrf, append: appendIrf, remove: removeIrf } = useFieldArray({
    control,
    name: 'fornecedorIrf',
  });

  const handleAddFornecedor = () => {
    const newIndex = fields.length;
    append({
      orgCompras: '',
      moedaPedido: '',
      condPgto: '',
      versIncoterms: '',
      incoterms: '',
      localInco1: '',
      compensacao: false,
      marcPrecoForn: '',
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
      grpAdminTesouraria: '',
      minorit: '',
      condPgto: '',
      formPgto: '',
      bancoEmpresaFornecedor: '',
      verificarFaturaDuplicada: '',
      procedimentoAdvertencia: '',
      responsavelAdvertencia: '',
      contribIcms: '',
      tpPrincSetInd: '',
    });
    // Auto-expandir o novo card
    setExpandedCardsEmpresas(prev => new Set([...prev, newIndex]));
  };

  const handleAddIrf = () => {
    const newIndex = fieldsIrf.length;
    appendIrf({
      ctgIrf: '',
      codigoIrf: '',
    });
    // Auto-expandir o novo card
    setExpandedCardsIrf(prev => new Set([...prev, newIndex]));
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

  const toggleCardIrf = (index) => {
    setExpandedCardsIrf(prev => {
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
        {/* Seção: Dados Básicos do Fornecedor */}
        <Card sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h6">Dados Básicos do Fornecedor</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Field.Checkbox
                  name="fornecedor.devolucao"
                  label="Devolução"
                  disabled={disabled}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Field.Checkbox
                  name="fornecedor.revFatBasEm"
                  label="Revisão Fatura Baseada em Entrada de Mercadoria"
                  disabled={disabled}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Field.Checkbox
                  name="fornecedor.revFatBasServ"
                  label="Revisão Fatura Baseada em Serviço"
                  disabled={disabled}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Field.Checkbox
                  name="fornecedor.relevanteLiquidacao"
                  label="Relevante para Liquidação"
                  disabled={disabled}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Field.Checkbox
                  name="fornecedor.pedidoAutom"
                  label="Pedido Automático"
                  disabled={disabled}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Field.Checkbox
                  name="fornecedor.tipoNfe"
                  label="Tipo NFe"
                  disabled={disabled}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Field.Checkbox
                  name="fornecedor.tipoImposto"
                  label="Tipo Imposto"
                  disabled={disabled}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Field.Checkbox
                  name="fornecedor.simplesNacional"
                  label="Simples Nacional"
                  disabled={disabled}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="fornecedor.grpEsqForn"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Grupo Esquema Fornecedor"
                      placeholder="Grupo esquema fornecedor"
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
                  name="fornecedor.cntrleConfir"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Controle de Confirmação"
                      placeholder="Controle de confirmação"
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
                  name="fornecedor.regimePisCofins"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Regime PIS/COFINS"
                      placeholder="Regime PIS/COFINS"
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
                  name="fornecedor.optanteSimples"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Optante Simples"
                      placeholder="Optante simples"
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
                  name="fornecedor.recebedorAlternativo"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label="Recebedor Alternativo"
                      placeholder="Recebedor alternativo"
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
          </Stack>
        </Card>

        <Divider />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Configure as informações de compras para este fornecedor
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:add-circle-bold" />}
            onClick={handleAddFornecedor}
            disabled={disabled}
          >
            Adicionar Configuração de Compras
          </Button>
        </Box>

        {fields.length === 0 && (
          <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'background.neutral' }}>
            <Iconify icon="solar:cart-bold" width={48} sx={{ color: 'text.disabled', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Nenhuma configuração de compras adicionada.
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
                  Compras #{index + 1}
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
                    {/* Seção: Organização */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Organização de Compras
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`fornecedorCompras.${index}.orgCompras`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <CustomCombobox
                                label="Organização de Compras"
                                disabled={disabled}
                                placeholder="Selecionar organização..."
                                options={organizacaoComprasOptions}
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

                    {/* Seção: Financeiro */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Financeiro
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`fornecedorCompras.${index}.moedaPedido`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Moeda do Pedido"
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
                            name={`fornecedorCompras.${index}.condPgto`}
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
                      </Grid>
                    </Box>

                    {/* Seção: Logística */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Logística
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`fornecedorCompras.${index}.versIncoterms`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Versão Incoterms"
                                placeholder="Versão dos incoterms"
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
                            name={`fornecedorCompras.${index}.incoterms`}
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
                            name={`fornecedorCompras.${index}.localInco1`}
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
                      </Grid>
                    </Box>

                    {/* Seção: Outros */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Outros
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Field.Checkbox
                            name={`fornecedorCompras.${index}.compensacao`}
                            label="Compensação"
                            disabled={disabled}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`fornecedorCompras.${index}.marcPrecoForn`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Marcação de Preço Fornecedor"
                                placeholder="Marcação de preço"
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

        {/* Seção: Fornecedor Empresas */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Configure as empresas/centros associados ao fornecedor
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
                            name={`fornecedorEmpresas.${index}.centro`}
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
                            name={`fornecedorEmpresas.${index}.empresa`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Empresa"
                                placeholder="Empresa"
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
                            name={`fornecedorEmpresas.${index}.contaConciliacao`}
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

                    {/* Seção: Administração e Tesouraria */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Administração e Tesouraria
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`fornecedorEmpresas.${index}.grpAdminTesouraria`}
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
                            name={`fornecedorEmpresas.${index}.minorit`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Minoritário"
                                placeholder="Minoritário"
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
                            name={`fornecedorEmpresas.${index}.bancoEmpresaFornecedor`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Banco Empresa Fornecedor"
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

                    {/* Seção: Pagamento */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Pagamento
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`fornecedorEmpresas.${index}.condPgto`}
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
                            name={`fornecedorEmpresas.${index}.formPgto`}
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
                            name={`fornecedorEmpresas.${index}.verificarFaturaDuplicada`}
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
                            name={`fornecedorEmpresas.${index}.procedimentoAdvertencia`}
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
                            name={`fornecedorEmpresas.${index}.responsavelAdvertencia`}
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

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`fornecedorEmpresas.${index}.contribIcms`}
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

                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`fornecedorEmpresas.${index}.tpPrincSetInd`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Tipo Principal Setor Industrial"
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
                      </Grid>
                    </Box>
                  </Stack>
                </Box>
              </Collapse>
            </Card>
          );
        })}

        <Divider sx={{ mt: 4 }} />

        {/* Seção: Fornecedor IRF */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Configure as categorias de IRF para o fornecedor
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:add-circle-bold" />}
            onClick={handleAddIrf}
            disabled={disabled}
          >
            Adicionar IRF
          </Button>
        </Box>

        {fieldsIrf.length === 0 && (
          <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'background.neutral' }}>
            <Iconify icon="solar:document-bold" width={48} sx={{ color: 'text.disabled', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Nenhuma categoria de IRF adicionada.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Clique no botão acima para adicionar uma nova categoria.
            </Typography>
          </Card>
        )}

        {fieldsIrf.map((item, index) => {
          const isExpanded = expandedCardsIrf.has(index);
          
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
                onClick={() => toggleCardIrf(index)}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  IRF #{index + 1}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeIrf(index);
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
                      toggleCardIrf(index);
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

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Controller
                        name={`fornecedorIrf.${index}.ctgIrf`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Categoria IRF"
                            placeholder="Categoria IRF"
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
                        name={`fornecedorIrf.${index}.codigoIrf`}
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <TextField
                            {...field}
                            label="Código IRF"
                            placeholder="Código IRF"
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
              </Collapse>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}