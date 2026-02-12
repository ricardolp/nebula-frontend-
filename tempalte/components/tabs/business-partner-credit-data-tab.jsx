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
import { Field } from 'src/components/hook-form';
import { CustomCombobox } from 'src/components/custom-combobox';

import { 
  classeRiscoOptions,
  grupoCreditoOptions,
  segmentoOptions 
} from '../../schemas/business-partner-schema';

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {Object} props.form - Form instance from react-hook-form
 * @param {boolean} props.disabled - Se true, desabilita todos os campos
 */
export function BusinessPartnerCreditDataTab({ form, disabled = false }) {
  const { control } = form;
  const [expandedCards, setExpandedCards] = useState(new Set());

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dadosCredito',
  });

  const handleAddCredit = () => {
    const newIndex = fields.length;
    append({
      partner: '',
      role: '',
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
      text: '',
    });
    // Auto-expandir o novo card
    setExpandedCards(prev => new Set([...prev, newIndex]));
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

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Configure os dados de crédito para este parceiro
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:add-circle-bold" />}
            onClick={handleAddCredit}
            disabled={disabled}
          >
            Adicionar Dados de Crédito
          </Button>
        </Box>

        {fields.length === 0 && (
          <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'background.neutral' }}>
            <Iconify icon="solar:shield-check-bold" width={48} sx={{ color: 'text.disabled', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Nenhum dado de crédito adicionado.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Clique no botão acima para adicionar novos dados de crédito.
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
                  Crédito #{index + 1}
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
                    {/* Seção: Identificação */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Identificação
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`dadosCredito.${index}.partner`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Parceiro"
                                placeholder="Código do parceiro"
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
                            name={`dadosCredito.${index}.role`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Função"
                                placeholder="Função do parceiro"
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

                    {/* Seção: Limites e Valores */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Limites e Valores
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`dadosCredito.${index}.creditLimit`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Limite de Crédito"
                                placeholder="Valor do limite"
                                type="number"
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
                            name={`dadosCredito.${index}.amount`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Valor"
                                placeholder="Valor adicional"
                                type="number"
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
                            name={`dadosCredito.${index}.currency`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Moeda"
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
                      </Grid>
                    </Box>

                    {/* Seção: Classificação */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Classificação
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`dadosCredito.${index}.riskClass`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <CustomCombobox
                                label="Classe de Risco"
                                disabled={disabled}
                                placeholder="Selecionar classe..."
                                options={classeRiscoOptions}
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
                            name={`dadosCredito.${index}.creditGroup`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <CustomCombobox
                                label="Grupo de Crédito"
                                disabled={disabled}
                                placeholder="Selecionar grupo..."
                                options={grupoCreditoOptions}
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
                            name={`dadosCredito.${index}.segment`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <CustomCombobox
                                label="Segmento"
                                disabled={disabled}
                                placeholder="Selecionar segmento..."
                                options={segmentoOptions}
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

                    {/* Seção: Regras e Validações */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Regras e Validações
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`dadosCredito.${index}.limitRule`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Regra de Limite"
                                placeholder="Regra de limite"
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
                            name={`dadosCredito.${index}.checkRule`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Regra de Verificação"
                                placeholder="Regra de verificação"
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
                            name={`dadosCredito.${index}.xblocked`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Bloqueado"
                                placeholder="Status de bloqueio"
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

                    {/* Seção: Informações */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Informações
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`dadosCredito.${index}.infocategory`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Categoria de Informação"
                                placeholder="Categoria"
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
                            name={`dadosCredito.${index}.infotype`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Tipo de Informação"
                                placeholder="Tipo de informação"
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
                            name={`dadosCredito.${index}.checkRelevant`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Verificação Relevante"
                                placeholder="Verificação relevante"
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

                    {/* Seção: Datas */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Datas
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Field.DatePicker
                            name={`dadosCredito.${index}.limitValidDate`}
                            label="Data de Validade do Limite"
                            disabled={disabled}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Field.DatePicker
                            name={`dadosCredito.${index}.dateFrom`}
                            label="Data Inicial"
                            disabled={disabled}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Field.DatePicker
                            name={`dadosCredito.${index}.dateTo`}
                            label="Data Final"
                            disabled={disabled}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <Field.DatePicker
                            name={`dadosCredito.${index}.dateFollowUp`}
                            label="Data de Acompanhamento"
                            disabled={disabled}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Seção: Observações */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Observações
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Controller
                            name={`dadosCredito.${index}.text`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Texto/Observações"
                                placeholder="Observações sobre o crédito"
                                fullWidth
                                multiline
                                rows={3}
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