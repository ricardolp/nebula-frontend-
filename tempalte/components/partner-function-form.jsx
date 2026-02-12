import { useEffect } from 'react';
import { Grid, MenuItem } from '@mui/material';
import { RHFTextField, Field } from 'src/components/hook-form';
import { FormProvider, useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export function PartnerFunctionForm({ data, onChange }) {
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
            name="partner"
            label="Partner *"
            placeholder="Ex: BP001"
            helperText="Código do parceiro"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Field.Select
            name="acao"
            label="Ação *"
            helperText="Ação a ser executada"
          >
            <MenuItem value="INSERT">INSERT - Inserir</MenuItem>
            <MenuItem value="UPDATE">UPDATE - Atualizar</MenuItem>
            <MenuItem value="DELETE">DELETE - Excluir</MenuItem>
          </Field.Select>
        </Grid>

        <Grid item xs={12} md={6}>
          <Field.Select
            name="funcao"
            label="Função *"
            helperText="Função do parceiro"
          >
            <MenuItem value="SP">SP - Sold-to Party</MenuItem>
            <MenuItem value="SH">SH - Ship-to Party</MenuItem>
            <MenuItem value="BP">BP - Bill-to Party</MenuItem>
            <MenuItem value="PY">PY - Payer</MenuItem>
          </Field.Select>
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="organ_vendas"
            label="Organização de Vendas"
            placeholder="Ex: 1000"
            helperText="Organização de vendas"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="canal_distr"
            label="Canal de Distribuição"
            placeholder="Ex: 10"
            helperText="Canal de distribuição"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="setor_ativ"
            label="Setor de Atividade"
            placeholder="Ex: 00"
            helperText="Setor de atividade"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="parceiro"
            label="Parceiro"
            placeholder="Ex: BP001"
            helperText="Código do parceiro relacionado"
          />
        </Grid>
      </Grid>
    </FormProvider>
  );
}

