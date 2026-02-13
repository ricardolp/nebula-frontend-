import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';

import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export function MaterialTextsTab() {
  return (
    <Stack spacing={3}>
      {/* Textos Longos */}
      <Card>
        <CardHeader 
          title="Textos Longos" 
          subheader="Textos descritivos e instruções adicionais para o material"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field.Text
                name="po_text"
                label="Texto de Pedido"
                multiline
                rows={6}
                placeholder="Texto que aparecerá nos pedidos de compra (máximo 500 caracteres)"
                inputProps={{ maxLength: 500 }}
                helperText="Este texto será exibido nos documentos de pedido de compra"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Field.Text
                name="db_text"
                label="Texto de Dados Básicos"
                multiline
                rows={6}
                placeholder="Texto descritivo geral do material (máximo 500 caracteres)"
                inputProps={{ maxLength: 500 }}
                helperText="Descrição detalhada e informações gerais sobre o material"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Field.Text
                name="sd_text"
                label="Texto de Vendas"
                multiline
                rows={6}
                placeholder="Texto que aparecerá nos documentos de vendas (máximo 500 caracteres)"
                inputProps={{ maxLength: 500 }}
                helperText="Este texto será exibido nos documentos de venda e remessa"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

