import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import axios, { endpoints } from 'src/utils/axios';

import { BusinessPartnerCnpjDetailsDialog } from './business-partner-cnpj-details-dialog';
import { BusinessPartnerCpfDetailsDialog } from './business-partner-cpf-details-dialog';

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close dialog callback
 * @param {Function} props.onSearch - Search callback with document type and value
 */
export function BusinessPartnerDocumentSearchDialog({ open, onClose, onSearch }) {
  const [step, setStep] = useState('select'); // 'select' or 'input'
  const [documentType, setDocumentType] = useState('');
  const [documentValue, setDocumentValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleTypeSelect = (type) => {
    setDocumentType(type);
    setStep('input');
    setDocumentValue('');
  };

  const handleBack = () => {
    setStep('select');
    setDocumentType('');
    setDocumentValue('');
  };

  const handleSearch = async () => {
    if (!documentValue) return;

    setLoading(true);
    try {
      const cleanValue = documentValue.replace(/\D/g, '');
      
      let response;
      if (documentType === 'cpf') {
        response = await axios.get(endpoints.utils.cpf(cleanValue));
      } else if (documentType === 'cnpj') {
        response = await axios.get(endpoints.utils.cnpj(cleanValue));
      }
      
      // A resposta vem diretamente com os dados, não em response.data.data
      if (response.data) {
        setSearchData(response.data);
        setDetailsDialogOpen(true);
      } else {
        throw new Error('Erro ao buscar dados');
      }
    } catch (error) {
      console.error('Erro ao buscar documento:', error);
      // Aqui você pode adicionar um toast de erro
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('select');
    setDocumentType('');
    setDocumentValue('');
    setLoading(false);
    setSearchData(null);
    setDetailsDialogOpen(false);
    onClose();
  };

  const handleDetailsClose = () => {
    setDetailsDialogOpen(false);
    setSearchData(null);
  };

  const handleDetailsConfirm = async (data) => {
    await onSearch(documentType, documentValue, data);
    setDetailsDialogOpen(false);
    setSearchData(null);
    // Fecha também o dialog principal
    handleClose();
  };

  const formatCpf = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCnpj = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const validateCpf = (cpfValue) => {
    const cleanCpf = cpfValue.replace(/\D/g, '');
    return cleanCpf.length === 11;
  };

  const validateCnpj = (cnpjValue) => {
    const cleanCnpj = cnpjValue.replace(/\D/g, '');
    return cleanCnpj.length === 14;
  };

  const isValid = documentType === 'cpf' ? validateCpf(documentValue) : validateCnpj(documentValue);

  const documentTypeOptions = [
    {
      type: 'cpf',
      title: 'CPF',
      description: 'Buscar dados por CPF de pessoa física',
      icon: <Iconify icon="solar:user-bold" width={32} />,
      color: '#1976d2',
    },
    {
      type: 'cnpj',
      title: 'CNPJ',
      description: 'Buscar dados por CNPJ de pessoa jurídica',
      icon: <Iconify icon="solar:buildings-2-bold" width={32} />,
      color: '#388e3c',
    },
  ];

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth={false}
      PaperProps={{
        sx: {
          maxWidth: 480,
          width: '90vw',
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:magnifer-bold" width={24} />
          {step === 'select' ? 'Buscar Dados' : `Buscar por ${documentType.toUpperCase()}`}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {step === 'select' ? (
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Escolha o tipo de documento para buscar os dados
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {documentTypeOptions.map((option) => (
                <Card
                  key={option.type}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    '&:hover': {
                      borderColor: option.color,
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => handleTypeSelect(option.type)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 1.5,
                        backgroundColor: `${option.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: option.color,
                      }}
                    >
                      {option.icon}
                    </Box>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {option.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {option.description}
                      </Typography>
                    </Box>
                    
                    <Iconify icon="eva:arrow-right-fill" width={20} sx={{ color: 'text.secondary' }} />
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ py: 2 }}>
            <TextField
              fullWidth
              label={documentType.toUpperCase()}
              placeholder={
                documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'
              }
              value={documentValue}
              onChange={(e) => {
                const formatted = documentType === 'cpf' 
                  ? formatCpf(e.target.value)
                  : formatCnpj(e.target.value);
                setDocumentValue(formatted);
              }}
              inputProps={{
                maxLength: documentType === 'cpf' ? 14 : 18,
              }}
              helperText={
                documentValue && !isValid
                  ? `${documentType.toUpperCase()} deve ter ${
                      documentType === 'cpf' ? '11' : '14'
                    } dígitos`
                  : ''
              }
              error={!!documentValue && !isValid}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {step === 'select' ? (
          <Button onClick={handleClose}>
            Cancelar
          </Button>
        ) : (
          <>
            <Button onClick={handleBack} disabled={loading}>
              Voltar
            </Button>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={!isValid || loading}
              startIcon={loading ? <CircularProgress size={16} /> : <Iconify icon="solar:magnifer-bold" />}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </Button>
          </>
        )}
      </DialogActions>

      {/* Dialogs de detalhes */}
      {documentType === 'cpf' && (
        <BusinessPartnerCpfDetailsDialog
          open={detailsDialogOpen}
          onClose={handleDetailsClose}
          onConfirm={handleDetailsConfirm}
          data={searchData}
        />
      )}

      {documentType === 'cnpj' && (
        <BusinessPartnerCnpjDetailsDialog
          open={detailsDialogOpen}
          onClose={handleDetailsClose}
          onConfirm={handleDetailsConfirm}
          data={searchData}
        />
      )}
    </Dialog>
  );
}
