import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { SapDepotCombobox, RHFSapDepotCombobox } from './index';

// ----------------------------------------------------------------------

/**
 * Exemplo de uso do SapDepotCombobox
 */
export function SapDepotComboboxExample() {
  const [selectedDepot, setSelectedDepot] = useState('');

  const methods = useForm({
    defaultValues: {
      depot: '',
      requiredDepot: '',
    },
  });

  const { handleSubmit, watch, reset } = methods;

  const watchedValues = watch();

  const onSubmit = (data) => {
    console.log('Form data:', data);
    alert(`Depósito selecionado: ${data.depot}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Exemplos de Uso - SapDepotCombobox
      </Typography>

      <Stack spacing={4}>
        {/* Exemplo básico */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              1. Uso Básico (Sem React Hook Form)
            </Typography>
            
            <SapDepotCombobox
              value={selectedDepot}
              onChange={setSelectedDepot}
              label="Armazenagem"
              placeholder="Digite para buscar..."
              helperText="Campo opcional"
            />
            
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Valor selecionado: {selectedDepot || 'Nenhum'}
            </Typography>
          </CardContent>
        </Card>

        {/* Exemplo com React Hook Form */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              2. Com React Hook Form
            </Typography>
            
            <FormProvider {...methods}>
              <Stack spacing={3}>
                <RHFSapDepotCombobox
                  name="depot"
                  label="Armazenagem"
                  placeholder="Selecione um depósito..."
                  helperText="Campo opcional"
                />
                
                <RHFSapDepotCombobox
                  name="requiredDepot"
                  label="Armazenagem Obrigatória"
                  placeholder="Este campo é obrigatório..."
                  required
                  helperText="Este campo é obrigatório"
                />
                
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained" 
                    onClick={handleSubmit(onSubmit)}
                  >
                    Enviar
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    onClick={() => reset()}
                  >
                    Limpar
                  </Button>
                </Stack>
                
                <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Valores do formulário:</strong>
                  </Typography>
                  <pre style={{ margin: 0, fontSize: '0.875rem' }}>
                    {JSON.stringify(watchedValues, null, 2)}
                  </pre>
                </Box>
              </Stack>
            </FormProvider>
          </CardContent>
        </Card>

        {/* Exemplo com opções filtradas */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              3. Com Filtro Customizado (apenas lojas)
            </Typography>
            
            <SapDepotCombobox
              value={selectedDepot}
              onChange={setSelectedDepot}
              label="Armazenagem - Apenas Lojas"
              placeholder="Selecione uma loja..."
              filteredOptions={[
                { value: 'L049', label: 'L049 - NAO-ME-TOQUE - LOJA' },
                { value: 'L050', label: 'L050 - SALDANHA MARINHO - LOJA' },
                { value: 'L078', label: 'L078 - TAPEJARA - LOJA' },
                { value: 'L079', label: 'L079 - COXILHA - LOJA' },
                { value: 'L080', label: 'L080 - PASSO FUNDO - LOJA' },
              ]}
              helperText="Apenas opções de lojas são exibidas"
            />
          </CardContent>
        </Card>

        {/* Exemplo desabilitado */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              4. Campo Desabilitado
            </Typography>
            
            <SapDepotCombobox
              value="A001"
              onChange={() => {}}
              label="Armazenagem Desabilitada"
              disabled
              helperText="Este campo está desabilitado"
            />
          </CardContent>
        </Card>

        {/* Exemplo com erro */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              5. Campo com Erro
            </Typography>
            
            <SapDepotCombobox
              value=""
              onChange={() => {}}
              label="Armazenagem com Erro"
              error
              helperText="Este campo possui um erro"
            />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
