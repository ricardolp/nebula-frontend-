import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close dialog callback
 * @param {Function} props.onConfirm - Confirm callback to fill form
 * @param {Object} props.data - CPF data from API
 */
export function BusinessPartnerCpfDetailsDialog({ open, onClose, onConfirm, data }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(data);
      onClose();
    } catch (error) {
      console.error('Erro ao confirmar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (situacao) => {
    switch (situacao?.toLowerCase()) {
      case 'ativa':
        return 'success';
      case 'cancelada':
        return 'error';
      case 'suspensa':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (situacao) => {
    switch (situacao?.toLowerCase()) {
      case 'ativa':
        return 'solar:check-circle-bold';
      case 'cancelada':
        return 'solar:close-circle-bold';
      case 'suspensa':
        return 'solar:pause-circle-bold';
      default:
        return 'solar:question-circle-bold';
    }
  };

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:id-card-bold" width={24} />
          Dados do CPF Encontrados
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ py: 2 }}>
          {/* Header com informações principais */}
          <Card sx={{ p: 3, bgcolor: 'background.neutral' }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <Iconify icon="solar:user-bold" width={32} />
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {data.nome || 'Nome não informado'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  CPF: {data.cpf}
                </Typography>
              </Box>

              <Chip
                icon={<Iconify icon={getStatusIcon(data.situacao)} width={16} />}
                label={data.situacao || 'Status não informado'}
                color={getStatusColor(data.situacao)}
                variant="filled"
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </Card>

          {/* Informações pessoais */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="solar:user-id-bold" width={20} />
              Informações Pessoais
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    NOME COMPLETO
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {data.nome || 'Não informado'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    DATA DE NASCIMENTO
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {data.nascimento || 'Não informado'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    CPF
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                    {data.cpf || 'Não informado'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    SITUAÇÃO DA INSCRIÇÃO
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {data.situacaoInscricao || 'Não informado'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>

          {/* Situação detalhada */}
          {data.situacao && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:shield-check-bold" width={20} />
                Situação Detalhada
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      STATUS
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        icon={<Iconify icon={getStatusIcon(data.situacao)} width={16} />}
                        label={data.situacao}
                        color={getStatusColor(data.situacao)}
                        variant="soft"
                      />
                    </Box>
                  </Box>
                </Grid>
                
                {data.situacaoDigito && (
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        CÓDIGO DA SITUAÇÃO
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                        {data.situacaoDigito}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                {data.situacaoMotivo && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        MOTIVO
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {data.situacaoMotivo}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                
                {data.situacaoAnoObito && (
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        ANO DO ÓBITO
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {data.situacaoAnoObito}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Card>
          )}

          {/* Informações da consulta */}
          <Card sx={{ p: 3, bgcolor: 'background.neutral' }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="solar:info-circle-bold" width={20} />
              Informações da Consulta
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    ID DA CONSULTA
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {data.consultaID || 'Não informado'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    TEMPO DE RESPOSTA
                  </Typography>
                  <Typography variant="body2">
                    {data.delay ? `${data.delay}s` : 'Não informado'}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    STATUS
                  </Typography>
                  <Chip
                    label={data.status === 1 ? 'Sucesso' : 'Erro'}
                    color={data.status === 1 ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={loading}
          startIcon={<Iconify icon="solar:check-circle-bold" />}
        >
          {loading ? 'Preenchendo...' : 'Usar Estes Dados'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
