import { useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

import { RHFTextField, RHFDatePicker, Field } from 'src/components/hook-form';

import { BUSINESS_PARTNER_FORM_OPTIONS } from '../business-partner-form-schema';

// ----------------------------------------------------------------------

/**
 * Aba de Informações Gerais
 * Campos obrigatórios e de identificação básica
 */
export function BusinessPartnerGeneralTab({ isView = false }) {
  const { watch } = useFormContext();
  const funcao = watch('funcao');

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Informações Gerais
      </Typography>

      <Stack spacing={3}>
        {/* Campos Obrigatórios */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main' }}>
            Campos Obrigatórios
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="cod_antigo"
                label="Código Antigo"
                placeholder="Ex: BP001"
                helperText="Código único do parceiro de negócio"
                required
                InputProps={{
                  readOnly: isView,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Field.Select
                name="tipo"
                label="Tipo"
                placeholder="Selecione o tipo"
                helperText="Tipo de parceiro de negócio"
                required
                disabled={isView}
              >
                {BUSINESS_PARTNER_FORM_OPTIONS.tipo.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>

            <Grid item xs={12} md={6}>
              <Field.Select
                name="funcao"
                label="Função"
                placeholder="Selecione a função"
                helperText="Função do parceiro de negócio"
                required
                disabled={isView}
              >
                <MenuItem value="FORNECEDOR">Fornecedor</MenuItem>
                <MenuItem value="CLIENTE">Cliente</MenuItem>
              </Field.Select>
            </Grid>

            {funcao === 'FORNECEDOR' && (
              <Grid item xs={12} md={6}>
                <Field.Select
                  name="empresa"
                  label="Empresa"
                  placeholder="Selecione a empresa"
                  helperText="Empresa associada ao fornecedor"
                  disabled={isView}
                >
                  <MenuItem value="">Selecione uma empresa</MenuItem>
                  <MenuItem value="1401">1401</MenuItem>
                  <MenuItem value="1402">1402</MenuItem>
                  <MenuItem value="1403">1403</MenuItem>
                </Field.Select>
              </Grid>
            )}
          </Grid>
        </Box>

        <Divider />

        {/* Campos de Identificação */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Identificação
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="nome_nome_fantasia"
                label="Nome / Nome Fantasia"
                placeholder="Ex: João Silva ou Empresa ABC"
                helperText="Nome para pessoa física ou nome fantasia para pessoa jurídica"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="sobrenome_razao_social"
                label="Sobrenome / Razão Social"
                placeholder="Ex: Silva ou ABC Comércio Ltda"
                helperText="Sobrenome para pessoa física ou razão social para pessoa jurídica"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="nome3"
                label="Nome 3"
                placeholder="Nome adicional"
                helperText="Nome adicional ou apelido"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="nome4"
                label="Nome 4"
                placeholder="Nome adicional"
                helperText="Nome adicional ou apelido"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="vocativo"
                label="Vocativo"
                placeholder="Ex: Sr., Sra., Dr., Dra."
                helperText="Tratamento formal"
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Campos de Classificação */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Classificação
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Select
                name="grupo_contas"
                label="Grupo de Contas"
                placeholder="Selecione o grupo"
                helperText="Grupo de contas contábeis"
              >
                <MenuItem value="">Selecione um grupo</MenuItem>
                <MenuItem value="SUPL">SUPL - Fornecedores</MenuItem>
                <MenuItem value="CUST">CUST - Clientes</MenuItem>
                <MenuItem value="CLIENTES">Clientes</MenuItem>
                <MenuItem value="FORNECEDORES">Fornecedores</MenuItem>
                <MenuItem value="FUNCIONARIOS">Funcionários</MenuItem>
                <MenuItem value="PARCEIROS">Parceiros</MenuItem>
              </Field.Select>
            </Grid>

            <Grid item xs={12} md={6}>
              <Field.Select
                name="agr_contas"
                label="Agrupamento de Contas"
                placeholder="Selecione o agrupamento"
                helperText="Agrupamento de contas contábeis"
              >
                <MenuItem value="">Selecione um agrupamento</MenuItem>
                <MenuItem value="Z001">Z001</MenuItem>
                <MenuItem value="Z002">Z002</MenuItem>
                <MenuItem value="Z003">Z003</MenuItem>
              </Field.Select>
            </Grid>

            <Grid item xs={12} md={6}>
              <Field.Select
                name="genero"
                label="Gênero"
                placeholder="Selecione o gênero"
                helperText="Gênero do parceiro de negócio"
                disabled={isView}
              >
                <MenuItem value="">Não informado</MenuItem>
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Feminino</MenuItem>
                <MenuItem value="OUTRO">Outro</MenuItem>
              </Field.Select>
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Campos de Busca */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Termos de Pesquisa
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="termo_pesquisa1"
                label="Termo de Pesquisa 1"
                placeholder="Termo para busca"
                helperText="Termo adicional para facilitar a busca"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="termo_pesquisa2"
                label="Termo de Pesquisa 2"
                placeholder="Termo para busca"
                helperText="Termo adicional para facilitar a busca"
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        {/* Datas */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Datas Importantes
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFDatePicker
                name="data_nascimento"
                label="Data de Nascimento"
                helperText="Data de nascimento (pessoa física)"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFDatePicker
                name="data_fundacao"
                label="Data de Fundação"
                helperText="Data de fundação (pessoa jurídica)"
              />
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
}
