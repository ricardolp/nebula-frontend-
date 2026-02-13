import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';
import { RHFSapDepotCombobox } from 'src/components/sap-depot-combobox';

// ----------------------------------------------------------------------

// TAB 7: ARMAZENAGEM
// Informações de depósito e armazenagem

const AVAILABILITY_CHECK_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '01', label: '01 - Verificação diária' },
  { value: '02', label: '02 - Verificação semanal' },
  { value: 'KP', label: 'KP - Verificação individual/coletiva' },
];

const TRANSPORT_GROUP_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '0001', label: '0001 - Transporte Rodoviário' },
  { value: '0002', label: '0002 - Transporte Ferroviário' },
  { value: '0003', label: '0003 - Transporte Aéreo' },
  { value: '0004', label: '0004 - Transporte Marítimo' },
];

const LOADING_GROUP_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '0001', label: '0001 - Carregamento Manual' },
  { value: '0002', label: '0002 - Carregamento Mecanizado' },
  { value: '0003', label: '0003 - Carregamento Automatizado' },
];

const COUNTRY_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: 'BR', label: 'BR - Brasil' },
  { value: 'AR', label: 'AR - Argentina' },
  { value: 'PY', label: 'PY - Paraguai' },
  { value: 'UY', label: 'UY - Uruguai' },
  { value: 'US', label: 'US - Estados Unidos' },
  { value: 'CN', label: 'CN - China' },
];

// ----------------------------------------------------------------------

export function MaterialStorageTab() {
  return (
    <Stack spacing={3}>
      {/* Depósito */}
      <Card>
        <CardHeader 
          title="Depósito" 
          subheader="Local de armazenamento"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFSapDepotCombobox
                name="stgeLoc"
                label="Depósito"
                placeholder="Selecione um depósito..."
                helperText="Local de armazenamento SAP"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="stgeBin"
                label="Área de Armazenagem"
                placeholder="Ex: A-01-01"
                helperText="Posição/bin específico no depósito"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="ctrlCode"
                label="Código de Controle"
                placeholder="Código de controle"
                helperText="Código de controle de armazenagem"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Verificação e Disponibilidade */}
      <Card>
        <CardHeader 
          title="Verificação e Disponibilidade" 
          subheader="Controle de disponibilidade de estoque"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="availcheck" label="Verificação Disponibilidade">
                {AVAILABILITY_CHECK_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Transporte e Carregamento */}
      <Card>
        <CardHeader 
          title="Transporte e Carregamento" 
          subheader="Grupos de transporte e carregamento"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="transGrp" label="Grupo de Transporte">
                {TRANSPORT_GROUP_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="loadinggrp" label="Grupo de Carregamento">
                {LOADING_GROUP_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Origem e Centro de Lucro */}
      <Card>
        <CardHeader 
          title="Origem e Centro de Lucro" 
          subheader="Informações de origem e centro de lucro"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="countryori" label="País de Origem">
                {COUNTRY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="profitCtr"
                label="Centro de Lucro"
                placeholder="Ex: 1000"
                helperText="Centro de lucro associado"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Envio e Distribuição */}
      <Card>
        <CardHeader 
          title="Envio e Distribuição" 
          subheader="Configurações para envio e distribuição"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="shMatTyp"
                label="Tipo Material Envio"
                placeholder="Tipo"
                helperText="Tipo de material para envio"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="matCfop"
                label="CFOP do Material"
                placeholder="Ex: 5101"
                helperText="Código Fiscal de Operações e Prestações"
              />
            </Grid>
            <Grid item xs={12}>
              <Field.Text
                name="sdText"
                label="Texto SD"
                placeholder="Texto para Sales & Distribution"
                multiline
                rows={2}
                helperText="Texto adicional para vendas e distribuição"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Locais de Emissão e Suprimento */}
      <Card>
        <CardHeader 
          title="Locais de Emissão e Suprimento" 
          subheader="Configurações de locais específicos"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Field.Text
                name="issStLoc"
                label="Local de Emissão"
                placeholder="Local"
                helperText="Local de emissão do material"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field.Text
                name="supplyArea"
                label="Área de Suprimento"
                placeholder="Área"
                helperText="Área de suprimento"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field.Text
                name="slocExprc"
                label="Local Exprc"
                placeholder="Local"
                helperText="Local para external procurement"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

