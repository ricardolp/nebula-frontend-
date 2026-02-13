import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const TIPO_OPTIONS = [
  { 
    value: 'PF', 
    label: 'Pessoa Física',
    icon: 'solar:user-bold',
    description: 'Pessoa física com CPF',
    color: 'primary'
  },
  { 
    value: 'PJ', 
    label: 'Pessoa Jurídica',
    icon: 'solar:buildings-bold',
    description: 'Empresa com CNPJ',
    color: 'secondary'
  },
];

const FUNCAO_OPTIONS = [
  { 
    value: 'CLIENTE', 
    label: 'Cliente',
    icon: 'solar:cart-bold',
    description: 'Compra produtos/serviços',
    color: 'info'
  },
  { 
    value: 'FORNECEDOR', 
    label: 'Fornecedor',
    icon: 'solar:box-bold',
    description: 'Fornece produtos/serviços',
    color: 'warning'
  },
  { 
    value: 'AMBOS', 
    label: 'Cliente e Fornecedor',
    icon: 'solar:arrows-left-right-bold',
    description: 'Tanto compra quanto fornece',
    color: 'success'
  },
];

const SOCI_TERC_OPTIONS = [
  { 
    value: 'SOCI', 
    label: 'Sócio',
    icon: 'solar:users-group-rounded-bold',
    description: 'Sócio da empresa',
    color: 'primary'
  },
  { 
    value: 'TERC', 
    label: 'Terceiro',
    icon: 'solar:user-plus-bold',
    description: 'Terceiro externo',
    color: 'secondary'
  },
];

const STEPS = [
  {
    label: 'Tipo do Parceiro',
    description: 'Selecione se é Pessoa Física ou Jurídica',
    options: TIPO_OPTIONS,
    field: 'tipo'
  },
  {
    label: 'Função do Parceiro',
    description: 'Defina a função na relação comercial',
    options: FUNCAO_OPTIONS,
    field: 'funcao'
  },
  {
    label: 'Classificação',
    description: 'Identifique se é Sócio ou Terceiro',
    options: SOCI_TERC_OPTIONS,
    field: 'sociTerc'
  },
];

// ----------------------------------------------------------------------

export function BusinessPartnerOptionsModal({ open, onClose, onConfirm }) {
  const [activeStep, setActiveStep] = useState(0);
  const [selections, setSelections] = useState({
    tipo: '',
    funcao: '',
    sociTerc: '',
  });

  const handleOptionSelect = (field, value) => {
    setSelections(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleConfirm = () => {
    if (selections.tipo && selections.funcao && selections.sociTerc) {
      onConfirm(selections);
      handleClose();
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setSelections({
      tipo: '',
      funcao: '',
      sociTerc: '',
    });
    onClose();
  };

  const isCurrentStepValid = () => {
    const currentStep = STEPS[activeStep];
    return selections[currentStep.field] !== '';
  };

  const isFormValid = selections.tipo && selections.funcao && selections.sociTerc;

  const renderOptionButton = (option, field) => {
    const isSelected = selections[field] === option.value;
    
    return (
      <Button
        key={option.value}
        variant={isSelected ? 'contained' : 'outlined'}
        color={isSelected ? option.color : 'inherit'}
        onClick={() => handleOptionSelect(field, option.value)}
        sx={{
          p: 3,
          height: 'auto',
          flexDirection: 'column',
          gap: 1,
          minHeight: 120,
          border: isSelected ? 2 : 1,
          borderColor: isSelected ? `${option.color}.main` : 'divider',
          '&:hover': {
            borderColor: `${option.color}.main`,
            bgcolor: `${option.color}.lighter`,
          },
        }}
      >
        <Iconify 
          icon={option.icon} 
          width={32} 
          sx={{ 
            color: isSelected ? `${option.color}.contrastText` : `${option.color}.main`,
            mb: 1 
          }} 
        />
        <Typography variant="subtitle1" fontWeight={600}>
          {option.label}
        </Typography>
        <Typography variant="caption" color="text.secondary" textAlign="center">
          {option.description}
        </Typography>
      </Button>
    );
  };

  const renderStepContent = (stepIndex) => {
    const step = STEPS[stepIndex];
    
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {step.description}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          {step.options.map((option) => 
            renderOptionButton(option, step.field)
          )}
        </Stack>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 600,
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Iconify icon="solar:user-plus-bold" width={32} color="primary.main" />
          <Box>
            <Typography variant="h6" component="div">
              Novo Parceiro de Negócio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure as opções básicas do parceiro
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        {/* Stepper Horizontal */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEPS.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={
                  <Iconify 
                    icon={
                      index === 0 ? 'solar:user-bold' :
                      index === 1 ? 'solar:cart-bold' :
                      'solar:users-group-rounded-bold'
                    }
                    width={20}
                  />
                }
                sx={{
                  '& .MuiStepLabel-label': {
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  },
                  '& .MuiStepLabel-labelContainer': {
                    '& .MuiStepLabel-iconContainer': {
                      '& .MuiStepLabel-icon': {
                        fontSize: '1.25rem',
                      },
                    },
                  },
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Conteúdo do Step Atual */}
        <Box sx={{ minHeight: 300 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            {STEPS[activeStep].label}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            {STEPS[activeStep].description}
          </Typography>
          
          {renderStepContent(activeStep)}
          
          {/* Mostrar seleção atual se houver */}
          {selections[STEPS[activeStep].field] && (
            <Paper 
              sx={{ 
                p: 2, 
                mt: 3, 
                bgcolor: 'primary.lighter',
                border: '1px solid',
                borderColor: 'primary.main',
                textAlign: 'center'
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                <Iconify 
                  icon="solar:check-circle-bold" 
                  width={20} 
                  color="success.main" 
                />
                <Typography variant="body2" color="primary.main" fontWeight={500}>
                  Selecionado: {STEPS[activeStep].options.find(opt => opt.value === selections[STEPS[activeStep].field])?.label}
                </Typography>
              </Stack>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            Voltar
          </Button>
        )}
        
        {activeStep < STEPS.length - 1 ? (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={!isCurrentStepValid()}
            endIcon={<Iconify icon="solar:arrow-right-bold" />}
          >
            Próximo
          </Button>
        ) : (
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={!isFormValid}
            startIcon={<Iconify icon="solar:check-circle-bold" />}
          >
            Criar Parceiro
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
