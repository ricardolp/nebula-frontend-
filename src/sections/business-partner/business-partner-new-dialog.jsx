import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CardActionArea from '@mui/material/CardActionArea';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import { alpha } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

// ----------------------------------------------------------------------
// Tipo: PF = Pessoa Física, PJ = Pessoa Jurídica (escolha única – step 1)
// Função: C = Cliente, F = Fornecedor, A = Cliente e Fornecedor (step 2, uma ou ambas)
// ----------------------------------------------------------------------

const TIPO_OPTIONS = [
  {
    value: 'PF',
    label: 'Pessoa Física',
    description: 'Cadastro de pessoa física',
    icon: 'solar:user-id-bold-duotone',
    color: 'primary',
  },
  {
    value: 'PJ',
    label: 'Pessoa Jurídica',
    description: 'Cadastro de pessoa jurídica (empresa)',
    icon: 'solar:buildings-2-bold-duotone',
    color: 'secondary',
  },
];

const FUNCAO_OPTIONS = [
  {
    value: 'C',
    label: 'Cliente',
    description: 'Parceiro como cliente',
    icon: 'solar:cart-large-2-bold-duotone',
    color: 'info',
  },
  {
    value: 'F',
    label: 'Fornecedor',
    description: 'Parceiro como fornecedor',
    icon: 'solar:box-bold-duotone',
    color: 'warning',
  },
];

// ----------------------------------------------------------------------

function OptionCard({ value, selected, label, description, icon, color, onClick, multiSelect }) {
  const handleClick = () => {
    if (multiSelect) {
      onClick(value, !selected);
    } else {
      onClick(value);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        borderWidth: 2,
        borderColor: selected ? `${color}.main` : 'divider',
        bgcolor: selected ? (theme) => alpha(theme.palette[color].main, 0.08) : 'background.paper',
        transition: (theme) =>
          theme.transitions.create(['border-color', 'background-color', 'box-shadow'], {
            duration: theme.transitions.duration.short,
          }),
        '&:hover': {
          borderColor: `${color}.main`,
          bgcolor: (theme) => alpha(theme.palette[color].main, 0.04),
          boxShadow: (theme) => `0 0 0 1px ${theme.palette[color].main}`,
        },
      }}
    >
      <CardActionArea
        onClick={handleClick}
        sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Stack
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ textAlign: 'center', minHeight: 100, flex: 1 }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (theme) =>
                alpha(theme.palette[color].main, selected ? 0.24 : 0.12),
              color: `${color}.main`,
            }}
          >
            <Iconify icon={icon} width={28} />
          </Box>
          <Typography variant="subtitle2">{label}</Typography>
          {description && (
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
              {description}
            </Typography>
          )}
        </Stack>
      </CardActionArea>
    </Card>
  );
}

// ----------------------------------------------------------------------

const STEPS = ['Tipo', 'Função'];

export function BusinessPartnerNewDialog({ open, onClose, onConfirm }) {
  const [activeStep, setActiveStep] = useState(0);
  const [tipo, setTipo] = useState('');
  const [funcoesSelected, setFuncoesSelected] = useState([]); // ['C'] | ['F'] | ['C','F']

  const resetForm = useCallback(() => {
    setActiveStep(0);
    setTipo('');
    setFuncoesSelected([]);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleTipoSelect = useCallback((value) => {
    setTipo(value);
  }, []);

  const handleFuncaoToggle = useCallback((value, selected) => {
    setFuncoesSelected((prev) => {
      if (selected) return prev.includes(value) ? prev : [...prev, value];
      return prev.filter((v) => v !== value);
    });
  }, []);

  const handleContinuarStep1 = useCallback(() => {
    if (!tipo) {
      toast.error('Selecione o tipo: Pessoa Física ou Pessoa Jurídica.');
      return;
    }
    setActiveStep(1);
  }, [tipo]);

  const handleContinuarStep2 = useCallback(() => {
    if (funcoesSelected.length === 0) {
      toast.error('Selecione pelo menos uma função: Cliente e/ou Fornecedor.');
      return;
    }
    const funcao = funcoesSelected.length === 2 ? 'A' : funcoesSelected[0];
    onConfirm?.({ tipo, funcao });
    handleClose();
  }, [tipo, funcoesSelected, onConfirm, handleClose]);

  const handleVoltar = useCallback(() => {
    setActiveStep(0);
  }, []);

  const canContinuarStep1 = !!tipo;
  const canContinuarStep2 = funcoesSelected.length > 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          maxHeight: '90vh',
        },
      }}
    >
      <Box
        sx={{
          py: 2,
          px: 3,
          background: (t) =>
            `linear-gradient(180deg, ${alpha(t.palette.primary.main, 0.08)} 0%, transparent 100%)`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
              color: 'primary.main',
            }}
          >
            <Iconify icon="solar:user-plus-bold-duotone" width={28} />
          </Box>
          <Box>
            <DialogTitle sx={{ p: 0, typography: 'h6' }}>Novo parceiro</DialogTitle>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {activeStep === 0 ? 'Escolha o tipo do parceiro' : 'Escolha a função do parceiro'}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Stepper activeStep={activeStep} sx={{ px: 3, pt: 2 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <DialogContent sx={{ pt: 2, pb: 1 }}>
        {activeStep === 0 && (
          <Stack spacing={2} sx={{ py: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
              Tipo
            </Typography>
            <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
              {TIPO_OPTIONS.map((opt) => (
                <Grid item xs={12} sm={6} key={opt.value} sx={{ display: 'flex' }}>
                  <OptionCard
                    value={opt.value}
                    selected={tipo === opt.value}
                    onClick={handleTipoSelect}
                    {...opt}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={2} sx={{ py: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
              Função (pode escolher uma ou as duas)
            </Typography>
            <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
              {FUNCAO_OPTIONS.map((opt) => (
                <Grid item xs={12} sm={6} key={opt.value} sx={{ display: 'flex' }}>
                  <OptionCard
                    value={opt.value}
                    selected={funcoesSelected.includes(opt.value)}
                    onClick={handleFuncaoToggle}
                    multiSelect
                    {...opt}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Box sx={{ flex: 1 }} />
        {activeStep === 0 ? (
          <Button variant="contained" onClick={handleContinuarStep1} disabled={!canContinuarStep1}>
            Continuar
          </Button>
        ) : (
          <>
            <Button onClick={handleVoltar} color="inherit">
              Voltar
            </Button>
            <Button
              variant="contained"
              onClick={handleContinuarStep2}
              disabled={!canContinuarStep2}
            >
              Continuar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
