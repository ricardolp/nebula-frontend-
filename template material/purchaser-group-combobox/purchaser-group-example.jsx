import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { PurchaserGroupCombobox, RHFPurchaserGroupCombobox } from './index';

/**
 * Exemplo de uso do PurchaserGroupCombobox
 * Este arquivo é apenas para demonstração e testes
 */
export function PurchaserGroupExample() {
  // Exemplo 1: Uso standalone (sem form)
  const [selectedGroup, setSelectedGroup] = useState('');

  // Exemplo 2: Uso com React Hook Form
  const methods = useForm({
    defaultValues: {
      purchaserGroup: 'G01',
    },
  });

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    alert(`Grupo selecionado: ${data.purchaserGroup}`);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Exemplos de Purchaser Group ComboBox
      </Typography>

      <Stack spacing={3}>
        {/* Exemplo 1: Standalone */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Exemplo 1: Uso Standalone (sem form)
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <PurchaserGroupCombobox
                value={selectedGroup}
                onChange={setSelectedGroup}
                label="Grupo de Compradores"
                placeholder="Buscar grupo..."
                helperText="Selecione um grupo de compradores"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.neutral',
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Valor Selecionado:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  {selectedGroup || '(nenhum)'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        <Divider />

        {/* Exemplo 2: Com React Hook Form */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Exemplo 2: Com React Hook Form
          </Typography>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <RHFPurchaserGroupCombobox
                      name="purchaserGroup"
                      label="Grupo de Compradores"
                      helperText="Campo integrado com React Hook Form"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'background.neutral',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        Valor no Form:
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {methods.watch('purchaserGroup') || '(nenhum)'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button type="submit" variant="contained">
                    Enviar Formulário
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => methods.reset()}
                  >
                    Resetar
                  </Button>
                </Box>
              </Stack>
            </form>
          </FormProvider>
        </Card>

        <Divider />

        {/* Exemplo 3: Estados diferentes */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Exemplo 3: Estados Diferentes
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <PurchaserGroupCombobox
                value=""
                onChange={() => {}}
                label="Normal"
                helperText="Campo normal"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <PurchaserGroupCombobox
                value="G01"
                onChange={() => {}}
                label="Com valor inicial"
                helperText="Grupo G01 pré-selecionado"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <PurchaserGroupCombobox
                value="G02"
                onChange={() => {}}
                label="Desabilitado"
                helperText="Campo desabilitado"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <PurchaserGroupCombobox
                value=""
                onChange={() => {}}
                label="Com erro"
                helperText="Este campo é obrigatório"
                error
              />
            </Grid>
          </Grid>
        </Card>

        {/* Info sobre os dados */}
        <Card sx={{ p: 3, bgcolor: 'info.lighter' }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'info.darker' }}>
            ℹ️ Informações
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Total de 31 grupos de compradores disponíveis
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Busca funciona por código ou nome
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Códigos: 001, 002, 003, 005, CMM, G01-G26
          </Typography>
          <Typography variant="body2">
            • Exemplos: &quot;G01&quot; (Compras Padaria), &quot;G08&quot; (Defensivos), &quot;CMM&quot; (Grãos)
          </Typography>
        </Card>
      </Stack>
    </Box>
  );
}

