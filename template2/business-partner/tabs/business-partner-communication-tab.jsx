import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RHFTextField } from 'src/components/hook-form';


// ----------------------------------------------------------------------

/**
 * Aba de Comunicação
 * Campos de telefone, email e observações
 */
export function BusinessPartnerCommunicationTab({ isView = false }) {

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Comunicação
      </Typography>

      <Stack spacing={3}>
        {/* Telefones */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main' }}>
            Telefones
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="telefone"
                label="Telefone Principal"
                placeholder="(11) 3333-3333"
                helperText="Telefone principal de contato"
                InputProps={{
                  readOnly: isView,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="telefone2"
                label="Telefone Secundário"
                placeholder="(11) 3333-4444"
                helperText="Telefone secundário de contato"
                InputProps={{
                  readOnly: isView,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="telefone3"
                label="Telefone Terciário"
                placeholder="(11) 3333-5555"
                helperText="Telefone adicional de contato"
                InputProps={{
                  readOnly: isView,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="celular"
                label="Celular"
                placeholder="(11) 99999-9999"
                helperText="Número de celular"
                InputProps={{
                  readOnly: isView,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Email e Observações */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Email e Observações
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="email"
                label="Email"
                placeholder="exemplo@email.com"
                type="email"
                helperText="Endereço de email principal"
              />
            </Grid>

            <Grid item xs={12}>
              <RHFTextField
                name="observacoes"
                label="Observações"
                placeholder="Observações adicionais sobre o parceiro de negócio..."
                multiline
                rows={4}
                helperText="Observações gerais sobre comunicação e contato (máximo 1000 caracteres)"
              />
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
}
