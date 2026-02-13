import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';
import { RHFSapMaterialTypeCombobox } from 'src/components/sap-material-type-combobox';

// ----------------------------------------------------------------------

// TAB 1: DADOS BÁSICOS
// Informações essenciais e identificação do material

const IND_SECTOR_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '1', label: '1 - Comércio' },
  { value: 'A', label: 'A - Constr.instal.industriais' },
  { value: 'C', label: 'C - Química' },
  { value: 'I', label: 'I - Indústria mineira' },
  { value: 'M', label: 'M - Engenharia mecânica' },
  { value: 'O', label: 'O - Indústria petrolífera' },
  { value: 'P', label: 'P - Indústria farmacêutica' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '01', label: '01 - Ativo' },
  { value: '02', label: '02 - Bloqueado' },
  { value: '03', label: '03 - Inativo' },
];

const LANGUAGE_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: 'PT', label: 'PT - Português' },
  { value: 'EN', label: 'EN - Inglês' },
  { value: 'ES', label: 'ES - Espanhol' },
];

// ----------------------------------------------------------------------

export function MaterialBasicDataTab({ isEdit = false }) {
  return (
    <Stack spacing={3}>
      {/* Identificação */}
      <Card>
        <CardHeader 
          title="Identificação" 
          subheader="Informações básicas de identificação do material"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Field.Text
                name="material"
                label="Código do Material *"
                disabled={isEdit}
                placeholder="Ex: MAT001"
                helperText={isEdit ? 'Código não pode ser alterado' : 'Código único do material'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field.Text
                name="codigoSap"
                label="Código SAP"
                disabled
                helperText="Preenchido automaticamente após integração com SAP"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field.Select name="status" label="Status">
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Descrição */}
      <Card>
        <CardHeader 
          title="Descrição" 
          subheader="Informações descritivas do material"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Field.Text
                name="matlDesc"
                label="Descrição do Material"
                placeholder="Descrição completa e detalhada do material"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Field.Text
                name="stdDescr"
                label="Descrição Padrão"
                placeholder="Descrição padrão do material"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="langu" label="Idioma">
                {LANGUAGE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Tipo e Setor */}
      <Card>
        <CardHeader 
          title="Tipo e Setor" 
          subheader="Classificação por tipo e setor industrial"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFSapMaterialTypeCombobox
                name="matlType"
                label="Tipo de Material *"
                placeholder="Selecione o tipo de material..."
                helperText="Tipo de material SAP (obrigatório)"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="indSector" label="Setor Industrial *" required>
                {IND_SECTOR_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Referências */}
      <Card>
        <CardHeader 
          title="Referências e Relacionamentos" 
          subheader="Materiais de referência e relacionados"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="oldMatNo"
                label="Material Antigo"
                placeholder="Código do material antigo"
                helperText="Número do material usado anteriormente"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="basicMatl"
                label="Material Básico"
                placeholder="Material básico de referência"
                helperText="Material básico ou mestre"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="plRefMat"
                label="Material de Referência"
                placeholder="Material de referência para planejamento"
                helperText="Material usado como referência no planejamento"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="document"
                label="Documento"
                placeholder="Documento relacionado"
                helperText="Documento técnico ou especificação"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}
