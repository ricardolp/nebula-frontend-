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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close dialog callback
 * @param {Function} props.onConfirm - Confirm callback to fill form
 * @param {Object} props.data - CNPJ data from API
 */
export function BusinessPartnerCnpjDetailsDialog({ open, onClose, onConfirm, data }) {
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
    const status = situacao?.toLowerCase();
    if (status === 'ativa') return 'success';
    if (status === 'cancelada' || status === 'baixada') return 'error';
    if (status === 'suspensa') return 'warning';
    return 'default';
  };

  const getStatusIcon = (situacao) => {
    const status = situacao?.toLowerCase();
    if (status === 'ativa') return 'solar:check-circle-bold';
    if (status === 'cancelada' || status === 'baixada') return 'solar:close-circle-bold';
    if (status === 'suspensa') return 'solar:pause-circle-bold';
    return 'solar:question-circle-bold';
  };

  const formatCurrency = (value) => {
    if (!value) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatPhone = (phone) => {
    if (!phone.area || !phone.number) return '';
    return `(${phone.area}) ${phone.number}`;
  };

  if (!data) return null;

  const companyName = data.company?.name || 'Nome não informado';
  const { taxId = '' } = data;
  const status = data.status?.text || 'Status não informado';
  const { founded, alias } = data;
  const equity = data.company?.equity;
  const nature = data.company?.nature?.text;
  const size = data.company?.size?.text;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:buildings-2-bold" width={24} />
          Dados do CNPJ Encontrados
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
                  bgcolor: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <Iconify icon="solar:buildings-2-bold" width={32} />
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {companyName}
                </Typography>
                {alias && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    {alias}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                  CNPJ: {taxId}
                </Typography>
              </Box>

              <Stack spacing={1} alignItems="flex-end">
                <Chip
                  icon={<Iconify icon={getStatusIcon(status)} width={16} />}
                  label={status}
                  color={getStatusColor(status)}
                  variant="filled"
                  sx={{ fontWeight: 600 }}
                />
                {!data.head && (
                  <Chip
                    icon={<Iconify icon="solar:buildings-3-bold" width={16} />}
                    label="Filial"
                    color="info"
                    variant="outlined"
                    size="small"
                  />
                )}
              </Stack>
            </Stack>
          </Card>

          {/* Informações da empresa */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Iconify icon="solar:buildings-bold" width={20} />
              Informações da Empresa
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    RAZÃO SOCIAL
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {companyName}
                  </Typography>
                </Box>
              </Grid>
              
              {alias && (
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      NOME FANTASIA
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {alias}
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              <Grid item xs={12} sm={6} md={4}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    CNPJ
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                    {taxId}
                  </Typography>
                </Box>
              </Grid>
              
              {founded && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      DATA DE FUNDAÇÃO
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatDate(founded)}
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {equity && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      CAPITAL SOCIAL
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formatCurrency(equity)}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {nature && (
                <Grid item xs={12} sm={6} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      NATUREZA JURÍDICA
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {nature}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {size && (
                <Grid item xs={12} sm={6} md={6}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      PORTE
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {size}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Card>

          {/* Endereço */}
          {data.address && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:home-2-bold" width={20} />
                Endereço
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      LOGRADOURO
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {data.address.street}
                      {data.address.number && `, ${data.address.number}`}
                      {data.address.details && ` - ${data.address.details}`}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      BAIRRO
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {data.address.district || 'Não informado'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      CIDADE/UF
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {data.address.city} - {data.address.state}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      CEP
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                      {data.address.zip}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          )}

          {/* Contato */}
          {(data.phones?.length > 0 || data.emails?.length > 0) && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:phone-bold" width={20} />
                Contato
              </Typography>
              
              <Grid container spacing={2}>
                {data.phones?.length > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        TELEFONES
                      </Typography>
                      {data.phones.map((phone, index) => (
                        <Typography key={index} variant="body1" sx={{ fontWeight: 500 }}>
                          {formatPhone(phone)} ({phone.type === 'LANDLINE' ? 'Fixo' : 'Móvel'})
                        </Typography>
                      ))}
                    </Box>
                  </Grid>
                )}

                {data.emails?.length > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        EMAILS
                      </Typography>
                      {data.emails.map((email, index) => (
                        <Typography key={index} variant="body1" sx={{ fontWeight: 500 }}>
                          {email.address}
                        </Typography>
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Card>
          )}

          {/* Atividades */}
          {(data.mainActivity || data.sideActivities?.length > 0) && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:case-minimalistic-bold" width={20} />
                Atividades
              </Typography>
              
              <Grid container spacing={2}>
                {data.mainActivity && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        ATIVIDADE PRINCIPAL
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {data.mainActivity.text}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Código: {data.mainActivity.id}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {data.sideActivities?.length > 0 && (
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1, display: 'block' }}>
                        ATIVIDADES SECUNDÁRIAS
                      </Typography>
                      <List dense>
                        {data.sideActivities.map((activity, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemText
                              primary={activity.text}
                              secondary={`Código: ${activity.id}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Card>
          )}

          {/* Membros/Sócios */}
          {data.company?.members?.length > 0 && (
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon="solar:users-group-rounded-bold" width={20} />
                Membros e Sócios ({data.company.members.length})
              </Typography>
              
              <List dense>
                {data.company.members.map((member, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 2,
                      py: 1.5,
                      mb: 1,
                      bgcolor: 'background.neutral',
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {member.person.name}
                          </Typography>
                          <Chip
                            label={member.role.text}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Desde {formatDate(member.since)} • Idade: {member.person.age}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          )}
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
