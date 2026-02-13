/**
 * Componente de teste para verificar a configuração da API
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Box,
  Divider
} from '@mui/material';

import { runAllTests, testApiConfiguration, testMaterialsApi, testAuthentication } from 'src/debug/api-test';

// ----------------------------------------------------------------------

export function ApiTestComponent() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleRunTests = async () => {
    setLoading(true);
    try {
      const testResults = await runAllTests();
      setResults(testResults);
    } catch (error) {
      console.error('Erro ao executar testes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConfiguration = async () => {
    setLoading(true);
    try {
      const result = await testApiConfiguration();
      setResults({ configuration: result });
    } catch (error) {
      console.error('Erro no teste de configuração:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestMaterials = async () => {
    setLoading(true);
    try {
      const result = await testMaterialsApi();
      setResults({ materials: result });
    } catch (error) {
      console.error('Erro no teste de materiais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestAuth = async () => {
    setLoading(true);
    try {
      const result = await testAuthentication();
      setResults({ authentication: result });
    } catch (error) {
      console.error('Erro no teste de autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 2 }}>
      <CardHeader 
        title="Teste de Configuração da API" 
        subheader="Verificar se a API está configurada corretamente"
      />
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Este componente testa se a configuração da API está funcionando corretamente.
            Verifique o console do navegador para logs detalhados.
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button 
              variant="contained" 
              onClick={handleRunTests}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              Executar Todos os Testes
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={handleTestConfiguration}
              disabled={loading}
            >
              Testar Configuração
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={handleTestMaterials}
              disabled={loading}
            >
              Testar Materiais
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={handleTestAuth}
              disabled={loading}
            >
              Testar Autenticação
            </Button>
          </Stack>

          {results && (
            <Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Resultados dos Testes
              </Typography>

              {results.configuration && (
                <Alert 
                  severity={results.configuration.success ? 'success' : 'error'}
                  sx={{ mb: 1 }}
                >
                  <Typography variant="subtitle2">
                    Configuração da API
                  </Typography>
                  <Typography variant="body2">
                    {results.configuration.success 
                      ? '✅ Configuração funcionando corretamente'
                      : `❌ Erro: ${results.configuration.error}`
                    }
                  </Typography>
                  {results.configuration.data && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Dados: {JSON.stringify(results.configuration.data, null, 2)}
                    </Typography>
                  )}
                </Alert>
              )}

              {results.materials && (
                <Alert 
                  severity={results.materials.success ? 'success' : 'error'}
                  sx={{ mb: 1 }}
                >
                  <Typography variant="subtitle2">
                    API de Materiais
                  </Typography>
                  <Typography variant="body2">
                    {results.materials.success 
                      ? `✅ API de materiais funcionando (${results.materials.data?.total || 0} materiais encontrados)`
                      : `❌ Erro: ${results.materials.error}`
                    }
                  </Typography>
                  {results.materials.data && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Total: {results.materials.data.total || 0} | 
                      Página: {results.materials.data.page || 1} | 
                      Materiais: {results.materials.data.materials?.length || 0}
                    </Typography>
                  )}
                </Alert>
              )}

              {results.authentication && (
                <Alert 
                  severity={results.authentication.success ? 'success' : 'error'}
                  sx={{ mb: 1 }}
                >
                  <Typography variant="subtitle2">
                    Autenticação
                  </Typography>
                  <Typography variant="body2">
                    {results.authentication.success 
                      ? '✅ Autenticação funcionando'
                      : `❌ Erro: ${results.authentication.error}`
                    }
                  </Typography>
                </Alert>
              )}
            </Box>
          )}

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Dica:</strong> Abra o console do navegador (F12) para ver logs detalhados dos testes.
            </Typography>
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  );
}

