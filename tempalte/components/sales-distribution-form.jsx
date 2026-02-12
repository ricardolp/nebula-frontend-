import { useEffect } from 'react';
import { Grid, MenuItem } from '@mui/material';
import { RHFTextField, Field } from 'src/components/hook-form';
import { FormProvider, useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export function SalesDistributionForm({ data, onChange }) {
  const methods = useForm({
    defaultValues: data,
  });

  const { watch } = methods;

  // Atualiza o parent component quando os valores mudam
  const formValues = watch();
  
  useEffect(() => {
    onChange(formValues);
  }, [formValues, onChange]);

  return (
    <FormProvider {...methods}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <RHFTextField
            name="org_vendas"
            label="Organização de Vendas *"
            placeholder="Ex: 1000"
            helperText="Organização de vendas"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="canal_distr"
            label="Canal de Distribuição *"
            placeholder="Ex: 10"
            helperText="Canal de distribuição"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="setor_ativ"
            label="Setor de Atividade *"
            placeholder="Ex: 00"
            helperText="Setor de atividade"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="regiao_vendas"
            label="Região de Vendas"
            placeholder="Ex: SP"
            helperText="Região de vendas"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="prioridade_remessa"
            label="Prioridade de Remessa"
            placeholder="Ex: 02"
            helperText="Prioridade de remessa"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="incoterms"
            label="Incoterms"
            placeholder="Ex: CIF"
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
            name="grp_class_cont_cli"
            label="Grupo de Classificação Contábil"
            placeholder="Ex: 01"
            helperText="Grupo de classificação contábil do cliente"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="class_fiscal"
            label="Classificação Fiscal"
            placeholder="Ex: 1"
            helperText="Classificação fiscal do cliente"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Field.Select
            name="moeda_cliente"
            label="Moeda"
            helperText="Moeda do cliente"
          >
            <MenuItem value="BRL">BRL - Real</MenuItem>
            <MenuItem value="USD">USD - Dólar</MenuItem>
            <MenuItem value="EUR">EUR - Euro</MenuItem>
          </Field.Select>
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="esquema_cliente"
            label="Esquema Cliente"
            placeholder="Ex: A"
            helperText="Esquema do cliente"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="grupo_preco"
            label="Grupo de Preço"
            placeholder="Ex: 01"
            helperText="Grupo de preço"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="lista_preco"
            label="Lista de Preço"
            placeholder="Ex: 01"
            helperText="Lista de preço"
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
            name="icms"
            label="ICMS"
            placeholder="Ex: X"
            helperText="Indicador de ICMS"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="ipi"
            label="IPI"
            placeholder="Ex: X"
            helperText="Indicador de IPI"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="subst_fiscal"
            label="Substituição Fiscal"
            placeholder="Ex: X"
            helperText="Indicador de substituição fiscal"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="cfop"
            label="CFOP"
            placeholder="Ex: 5102"
            helperText="Código Fiscal de Operações e Prestações"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="contrib_icms"
            label="Contribuinte ICMS"
            placeholder="Ex: 1"
            helperText="Tipo de contribuinte ICMS"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="tp_princ_set_ind"
            label="Tipo Principal Setor Industrial"
            placeholder="Ex: A"
            helperText="Tipo principal do setor industrial"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="agrupamento_ordens"
            label="Agrupamento de Ordens"
            placeholder="Ex: 01"
            helperText="Código de agrupamento de ordens"
          />
        </Grid>
      </Grid>
    </FormProvider>
  );
}

