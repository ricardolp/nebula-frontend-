import { Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { CustomCombobox } from 'src/components/custom-combobox';
import { Field } from 'src/components/hook-form';

import { 
  agrupamentoContasOptions, 
  funcaoOptions, 
  sexoOptions, 
  tipoOptions,
  vocativoOptions 
} from '../../schemas/business-partner-schema';

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {Object} props.form - Form instance from react-hook-form
 * @param {boolean} props.disabled - Se true, desabilita todos os campos
 */
export function BusinessPartnerGeneralTab({ form, disabled = false }) {
  const { control, watch, setValue } = form;
  
  // Watch dos campos para determinar o tipo de data
  const cpf = watch('identificacao.cpf');
  const cnpj = watch('identificacao.cnpj');
  
  // Determina se é pessoa física ou jurídica
  const isPessoaFisica = cpf && cpf.trim() !== '';
  const isPessoaJuridica = cnpj && cnpj.trim() !== '';
  
  const dataLabel = isPessoaJuridica ? 'Data de Fundação' : 'Data de Nascimento/Fundação';

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Primeira linha: tipo | funcao | agrupamento de contas */}
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
          }}
        >
          <Controller
            name="tipo"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <CustomCombobox
                label="Tipo"
                disabled={disabled}
                placeholder="Buscar tipo..."
                options={tipoOptions}
                value={field.value}
                onChange={field.onChange}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Field.Autocomplete
            name="funcao"
            label="Função"
            placeholder="Buscar função..."
            disabled={disabled}
            multiple
            disableCloseOnSelect
            options={funcaoOptions.map((option) => option.value)}
            getOptionLabel={(option) => {
              const found = funcaoOptions.find(opt => opt.value === option);
              return found ? found.label : option;
            }}
            renderOption={(props, option) => {
              const found = funcaoOptions.find(opt => opt.value === option);
              return (
                <li {...props} key={option}>
                  {found ? found.label : option}
                </li>
              );
            }}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => {
                const found = funcaoOptions.find(opt => opt.value === option);
                return (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={found ? found.label : option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                );
              })
            }
          />

          <Controller
            name="agrContas"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <CustomCombobox
                label="Agrupamento de Contas"
                disabled={disabled}
                placeholder="Selecionar agrupamento..."
                options={agrupamentoContasOptions}
                value={field.value}
                onChange={field.onChange}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Box>

        {/* Segunda linha: vocativo | nome ou nome fantasia | sobrenome ou razao social */}
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(3, 1fr)',
          }}
        >
          <Controller
            name="vocativo"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <CustomCombobox
                label="Vocativo"
                disabled={disabled}
                placeholder="Selecionar vocativo..."
                options={vocativoOptions}
                value={field.value}
                onChange={field.onChange}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name="nomeNomeFantasia"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Nome / Nome Fantasia"
                placeholder="Nome ou nome fantasia"
                fullWidth
                disabled={disabled}
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ shrink: true }}
                onBlur={(e) => {
                  field.onBlur();
                  // Copia o valor para termo de pesquisa 2
                  if (e.target.value && !disabled) {
                    setValue('termoPesquisa2', e.target.value);
                  }
                }}
              />
            )}
          />

          <Controller
            name="sobrenomeRazaoSocial"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Sobrenome / Razão Social"
                placeholder="Sobrenome ou razão social"
                fullWidth
                disabled={disabled}
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Box>

        {/* Terceira linha: nome3 | nome4 */}
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Controller
            name="nome3"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Nome 3"
                placeholder="Nome adicional"
                fullWidth
                disabled={disabled}
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="nome4"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Nome 4"
                placeholder="Nome adicional"
                fullWidth
                disabled={disabled}
                error={!!error}
                helperText={error?.message}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Box>

               {/* Quarta linha: data de nascimento/fundação | gênero */}
               <Box
                 rowGap={3}
                 columnGap={2}
                 display="grid"
                 gridTemplateColumns={{
                   xs: 'repeat(1, 1fr)',
                   sm: 'repeat(2, 1fr)',
                 }}
               >
                 <Field.DatePicker
                   name="dataNascimentoFundacao"
                   label={dataLabel}
                   disabled={disabled}
                 />

                 <Controller
                   name="sexo"
                   control={control}
                   render={({ field, fieldState: { error } }) => (
                     <CustomCombobox
                       label="Gênero"
                       placeholder="Selecionar gênero..."
                       disabled={disabled}
                       options={sexoOptions}
                       value={field.value}
                       onChange={field.onChange}
                       error={!!error}
                       helperText={error?.message}
                     />
                   )}
                 />
               </Box>

               {/* Quinta linha: termo de pesquisa 1 | termo de pesquisa 2 */}
               <Box
                 rowGap={3}
                 columnGap={2}
                 display="grid"
                 gridTemplateColumns={{
                   xs: 'repeat(1, 1fr)',
                   sm: 'repeat(2, 1fr)',
                 }}
               >
                 <Controller
                   name="termoPesquisa1"
                   control={control}
                   render={({ field, fieldState: { error } }) => (
                     <TextField
                       {...field}
                       label="Termo de Pesquisa 1"
                       placeholder="Termo para busca"
                       fullWidth
                       disabled={disabled}
                       error={!!error}
                       helperText={error?.message}
                       InputLabelProps={{ shrink: true }}
                     />
                   )}
                 />

                 <Controller
                   name="termoPesquisa2"
                   control={control}
                   render={({ field, fieldState: { error } }) => (
                     <TextField
                       {...field}
                       label="Termo de Pesquisa 2"
                       placeholder="Termo para busca"
                       fullWidth
                       disabled={disabled}
                       error={!!error}
                       helperText={error?.message}
                       InputLabelProps={{ shrink: true }}
                     />
                   )}
                 />
               </Box>
      </Stack>
    </Box>
  );
}
