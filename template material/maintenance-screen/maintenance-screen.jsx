import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { Iconify } from 'src/components/iconify';

import { SimpleLayout } from 'src/layouts/simple';
import { MaintenanceIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export function MaintenanceScreen() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <SimpleLayout content={{ compact: true }}>
      <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
        <m.div variants={varBounce().in}>
          <Chip 
            label="🔧 Manutenção Programada" 
            color="warning" 
            sx={{ mb: 3, fontSize: '0.875rem', fontWeight: 600 }}
          />
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
            Sistema em Manutenção
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1, maxWidth: 480, mx: 'auto' }}>
            Estamos realizando melhorias no sistema para oferecer uma experiência ainda melhor.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 480, mx: 'auto' }}>
            Voltaremos em breve!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <MaintenanceIllustration sx={{ my: { xs: 5, sm: 8 }, height: { xs: 200, sm: 280 } }} />
        </m.div>

        <m.div variants={varBounce().in}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ mb: 4 }}>
            <CircularProgress size={20} thickness={4} />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Aguarde um momento...
            </Typography>
          </Stack>
        </m.div>

        <m.div variants={varBounce().in}>
          <Button 
            onClick={handleReload}
            size="large" 
            variant="contained"
            startIcon={<Iconify icon="solar:restart-bold" />}
            sx={{ 
              minWidth: 180,
              boxShadow: (theme) => theme.customShadows.z8,
            }}
          >
            Tentar novamente
          </Button>
        </m.div>

        <m.div variants={varBounce().in}>
          <Box sx={{ mt: 5, pt: 3, borderTop: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 1 }}>
              Precisa de ajuda? Entre em contato com o suporte
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                📧 suporte@novaconsulting.com.br
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                📱 (11) 3000-0000
              </Typography>
            </Stack>
          </Box>
        </m.div>
      </Container>
    </SimpleLayout>
  );
}
