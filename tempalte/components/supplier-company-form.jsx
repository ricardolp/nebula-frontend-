import { useEffect } from 'react';
import { Grid } from '@mui/material';
import { RHFTextField } from 'src/components/hook-form';
import { FormProvider, useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export function SupplierCompanyForm({ data, onChange }) {
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
            name="centro"
            label="Centro *"
            placeholder="Ex: 1000"
            helperText="Centro"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="empresa"
            label="Empresa *"
            placeholder="Ex: 1000"
            helperText="Código da empresa"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="conta_conciliacao"
            label="Conta de Conciliação"
            placeholder="Ex: 210000"
            helperText="Conta de conciliação contábil"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="grp_admin_tesouraria"
            label="Grupo de Administração de Tesouraria"
            placeholder="Ex: 001"
            helperText="Grupo de administração de tesouraria"
          />
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
            name="form_pgto"
            label="Forma de Pagamento"
            placeholder="Ex: T"
            helperText="Forma de pagamento"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="banco_empresa_fornecedor"
            label="Banco da Empresa (Fornecedor)"
            placeholder="Ex: 001"
            helperText="Código do banco da empresa"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="verificar_fatura_duplicada"
            label="Verificar Fatura Duplicada"
            placeholder="Ex: X"
            helperText="Indicador de verificação de fatura duplicada"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="procedimento_advertencia"
            label="Procedimento de Advertência"
            placeholder="Ex: 01"
            helperText="Código do procedimento de advertência"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            name="responsavel_advertencia"
            label="Responsável pela Advertência"
            placeholder="Ex: 001"
            helperText="Código do responsável pela advertência"
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
      </Grid>
    </FormProvider>
  );
}

