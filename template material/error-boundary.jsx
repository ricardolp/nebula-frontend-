import { Component } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children } = this.props;
    
    if (hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            p: 3,
            textAlign: 'center'
          }}
        >
          <Iconify icon="solar:danger-triangle-bold" sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          
          <Typography variant="h5" gutterBottom>
            Oops! Algo deu errado
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 600 }}>
            Ocorreu um erro inesperado. Por favor, recarregue a página ou tente novamente.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              startIcon={<Iconify icon="solar:refresh-bold" />}
            >
              Recarregar Página
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              startIcon={<Iconify icon="solar:arrow-left-bold" />}
            >
              Tentar Novamente
            </Button>
          </Stack>

          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1, maxWidth: '100%', overflow: 'auto' }}>
              <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
                {error && error.toString()}
                {errorInfo && errorInfo.componentStack}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
