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

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {Object} props.form - Form instance from react-hook-form
 * @param {boolean} props.disabled - Se true, desabilita todos os campos
 */
export function BusinessPartnerCreditCollectionTab({ form, disabled = false }) {
  const { control } = form;
  const [expandedCards, setExpandedCards] = useState(new Set());

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'collection',
  });

  const handleAddCollection = () => {
    const newIndex = fields.length;
    append({
      codAntigo: '',
      role: '',
      perfil: '',
      segment: '',
      grupo: '',
      resp: '',
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
            Configure as informações de cobrança para este parceiro
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:add-circle-bold" />}
            onClick={handleAddCollection}
            disabled={disabled}
          >
            Adicionar Dados de Cobrança
          </Button>
        </Box>

        {fields.length === 0 && (
          <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'background.neutral' }}>
            <Iconify icon="solar:credit-card-bold" width={48} sx={{ color: 'text.disabled', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Nenhum dado de cobrança adicionado.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Clique no botão acima para adicionar novos dados de cobrança.
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
                  Cobrança #{index + 1}
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
                            name={`collection.${index}.codAntigo`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Código Antigo"
                                placeholder="Código antigo"
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
                            name={`collection.${index}.role`}
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

                    {/* Seção: Classificação */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                        Classificação
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Controller
                            name={`collection.${index}.perfil`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Perfil"
                                placeholder="Perfil do parceiro"
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
                            name={`collection.${index}.segment`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Segmento"
                                placeholder="Segmento"
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
                            name={`collection.${index}.grupo`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Grupo"
                                placeholder="Grupo"
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
                            name={`collection.${index}.resp`}
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <TextField
                                {...field}
                                label="Responsável"
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