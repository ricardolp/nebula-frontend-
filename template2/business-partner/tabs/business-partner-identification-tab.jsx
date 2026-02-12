import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RHFTextField, Field } from 'src/components/hook-form';
import { MenuItem } from '@mui/material';


// ----------------------------------------------------------------------

/**
 * Aba de Identificação
 * Campos de CPF, CNPJ e documentos de identificação
 */
export function BusinessPartnerIdentificationTab({ isView = false }) {

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Identificação
      </Typography>

      <Stack spacing={3}>
        {/* Documentos Principais */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main' }}>
            Documentos Principais
          </Typography>
          
          <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="cpf"
                    label="CPF"
                    placeholder="000.000.000-00"
                    helperText="CPF para pessoa física"
                    InputProps={{
                      readOnly: isView,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <RHFTextField
                    name="cnpj"
                    label="CNPJ"
                    placeholder="00.000.000/0000-00"
                    helperText="CNPJ para pessoa jurídica"
                    InputProps={{
                      readOnly: isView,
                    }}
                  />
                </Grid>
          </Grid>
        </Box>

        {/* Inscrições */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Inscrições
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="inscr_estadual"
                label="Inscrição Estadual"
                placeholder="Ex: 123.456.789.012"
                helperText="Inscrição estadual (IE)"
                InputProps={{
                  readOnly: isView,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="inscr_municipal"
                label="Inscrição Municipal"
                placeholder="Ex: 123456"
                helperText="Inscrição municipal (IM)"
                InputProps={{
                  readOnly: isView,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Documento de Identificação */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Documento de Identificação
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Field.Select
                name="tipo_id_ident"
                label="Tipo de Documento"
                placeholder="Selecione o tipo"
                helperText="Tipo do documento de identificação"
                disabled={isView}
              >
                <MenuItem value="RG">RG - Registro Geral</MenuItem>
                <MenuItem value="RNE">RNE - Registro Nacional de Estrangeiro</MenuItem>
                <MenuItem value="PASSAPORTE">Passaporte</MenuItem>
                <MenuItem value="CNH">CNH - Carteira Nacional de Habilitação</MenuItem>
                <MenuItem value="CTPS">CTPS - Carteira de Trabalho</MenuItem>
                <MenuItem value="TITULO_ELEITOR">Título de Eleitor</MenuItem>
                <MenuItem value="CERTIDAO_NASCIMENTO">Certidão de Nascimento</MenuItem>
                <MenuItem value="CERTIDAO_CASAMENTO">Certidão de Casamento</MenuItem>
                <MenuItem value="OUTRO">Outro</MenuItem>
              </Field.Select>
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="numero_id"
                label="Número do Documento"
                placeholder="Ex: 12.345.678-9"
                helperText="Número do documento de identificação"
                InputProps={{
                  readOnly: isView,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Informações Adicionais */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Importante:</strong> Preencha pelo menos um documento de identificação (CPF ou CNPJ) 
            conforme o tipo de parceiro de negócio selecionado.
          </Typography>
        </Alert>
      </Stack>
    </Box>
  );
}
