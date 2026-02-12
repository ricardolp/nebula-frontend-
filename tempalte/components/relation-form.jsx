import { useEffect } from 'react';
import { Grid, MenuItem } from '@mui/material';
import { RHFTextField, Field } from 'src/components/hook-form';
import { FormProvider, useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export function RelationForm({ data, onChange }) {
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
            name="cod_produtor"
            label="Código do Produtor *"
            placeholder="Ex: PROD001"
            helperText="Código do produtor"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Field.Select
            name="tp_relacao"
            label="Tipo de Relação *"
            helperText="Tipo de relação com o produtor"
          >
            <MenuItem value="PROPRIETARIO">Proprietário</MenuItem>
            <MenuItem value="ARRENDATARIO">Arrendatário</MenuItem>
            <MenuItem value="PARCEIRO">Parceiro</MenuItem>
            <MenuItem value="COMODATARIO">Comodatário</MenuItem>
          </Field.Select>
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="cod_propriedade"
            label="Código da Propriedade *"
            placeholder="Ex: PROP001"
            helperText="Código da propriedade"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Field.DatePicker
            name="valid_date_from"
            label="Data Início *"
            helperText="Data de início da relação"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Field.DatePicker
            name="valid_date_to"
            label="Data Fim"
            helperText="Data de fim da relação"
          />
        </Grid>
      </Grid>
    </FormProvider>
  );
}

