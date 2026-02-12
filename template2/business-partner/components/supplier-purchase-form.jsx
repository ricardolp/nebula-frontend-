import { useEffect } from 'react';
import { Grid, MenuItem } from '@mui/material';
import { RHFTextField, Field } from 'src/components/hook-form';
import { FormProvider, useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export function SupplierPurchaseForm({ data, onChange }) {
  const methods = useForm({
    defaultValues: data,
  });

  const { watch } = methods;
  const formValues = watch();
  
  useEffect(() => {
    onChange(formValues);
  }, [formValues, onChange]);

  return (
    <FormProvider {...methods}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <RHFTextField
            name="org_compras"
            label="Organização de Compras *"
            placeholder="Ex: 1000"
            helperText="Organização de compras"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Field.Select
            name="moeda_pedido"
            label="Moeda do Pedido"
            helperText="Moeda utilizada no pedido"
          >
            <MenuItem value="BRL">BRL - Real</MenuItem>
            <MenuItem value="USD">USD - Dólar</MenuItem>
            <MenuItem value="EUR">EUR - Euro</MenuItem>
          </Field.Select>
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="cond_pgto"
            label="Condição de Pagamento"
            placeholder="Ex: Z002"
            helperText="Condição de pagamento"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="incoterms"
            label="Incoterms"
            placeholder="Ex: FOB"
            helperText="Termos de comércio internacional"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="local_inco1"
            label="Local Incoterms"
            placeholder="Ex: São Paulo"
            helperText="Local dos incoterms"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="compensacao"
            label="Compensação"
            placeholder="Ex: 01"
            helperText="Código de compensação"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="marc_preco_forn"
            label="Marcação de Preço Fornecedor"
            placeholder="Ex: S"
            helperText="Indicador de marcação de preço"
          />
        </Grid>
      </Grid>
    </FormProvider>
  );
}

