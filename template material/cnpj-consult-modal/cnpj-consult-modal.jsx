import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { Iconify } from 'src/components/iconify';
import { consultCnpj, mapApiDataToForm } from 'src/services/cnpj-api';

// ----------------------------------------------------------------------

/**
 * Modal para consulta de dados por CNPJ
 * Permite buscar informações de empresa através do CNPJ
 */
export function CnpjConsultModal({ open, onClose, onCnpjFound }) {
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Aplica máscara de CNPJ no formato XX.XXX.XXX/XXXX-XX
   */
  const formatCnpj = (value) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara
    return numbers
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18); // Limita a 18 caracteres (com máscara)
  };

  /**
   * Valida se o CNPJ está no formato correto
   */
  const isValidCnpj = (cnpjValue) => {
    const numbers = cnpjValue.replace(/\D/g, '');
    return numbers.length === 14;
  };

  /**
   * Consulta dados de CNPJ usando a API real
   */
  const handleConsultCnpj = async (cnpjValue) => {
    setLoading(true);
    setError('');

    try {
      // Consulta a API real
      const apiData = await consultCnpj(cnpjValue);
      
      // Mapeia os dados da API para o formato do formulário
      const mappedData = mapApiDataToForm(apiData);

      // Chama callback com os dados encontrados
      onCnpjFound(mappedData);
      onClose();
    } catch (err) {
      console.error('Erro na consulta de CNPJ:', err);
      setError(err.message || 'Erro ao consultar CNPJ. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manipula o envio do formulário
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!isValidCnpj(cnpj)) {
      setError('CNPJ inválido. Digite um CNPJ válido.');
      return;
    }

    handleConsultCnpj(cnpj);
  };

  /**
   * Manipula mudança no campo CNPJ
   */
  const handleCnpjChange = (event) => {
    const formatted = formatCnpj(event.target.value);
    setCnpj(formatted);
    setError('');
  };

  /**
   * Limpa o formulário ao fechar
   */
  const handleClose = () => {
    setCnpj('');
    setError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon="solar:search-bold" />
          <Typography variant="h6">Consultar Dados (CNPJ)</Typography>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <Typography variant="body2" color="text.secondary">
              Digite o CNPJ da empresa para consultar os dados automaticamente.
            </Typography>

            <TextField
              fullWidth
              label="CNPJ"
              value={cnpj}
              onChange={handleCnpjChange}
              placeholder="00.000.000/0000-00"
              error={!!error}
              helperText={error || 'Digite o CNPJ da empresa'}
              disabled={loading}
              inputProps={{
                maxLength: 18,
              }}
            />

            {loading && (
              <Box display="flex" justifyContent="center" py={2}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Consultando dados...
                </Typography>
              </Box>
            )}

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button 
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          
          <Button 
            type="submit"
            variant="contained"
            disabled={loading || !cnpj}
            startIcon={<Iconify icon="solar:search-bold" />}
          >
            Consultar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
