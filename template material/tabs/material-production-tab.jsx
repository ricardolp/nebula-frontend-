import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

// TAB 6: PRODUÇÃO
// Dados relacionados à produção e manufatura

const PROC_TYPE_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: 'E', label: 'E - Produção própria' },
  { value: 'F', label: 'F - Aquisição externa' },
  { value: 'X', label: 'X - Ambos' },
];

const BATCH_ENTRY_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '0', label: '0 - Manual' },
  { value: '1', label: '1 - Automático' },
];

const SPECIAL_PROC_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '10', label: '10 - Fantasma' },
  { value: '20', label: '20 - Subcontratação' },
  { value: '30', label: '30 - Produção por terceiros' },
  { value: '50', label: '50 - Produção alternativa' },
];

// ----------------------------------------------------------------------

export function MaterialProductionTab() {
  return (
    <Stack spacing={3}>
      {/* Tipo de Procurement */}
      <Card>
        <CardHeader 
          title="Tipo de Procurement" 
          subheader="Define se o material é produzido ou comprado"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="procType" label="Tipo de Procurement">
                {PROC_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="spproctype" label="Tipo Procurement Especial">
                {SPECIAL_PROC_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Configurações de Produção */}
      <Card>
        <CardHeader 
          title="Configurações de Produção" 
          subheader="Parâmetros de processo produtivo"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Checkbox 
                name="backflush" 
                label="Backflushing"
                helperText="Baixa automática de componentes na produção"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Checkbox 
                name="jitRelvt" 
                label="JIT Relevante"
                helperText="Material relevante para Just-In-Time"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Checkbox 
                name="bulkMat" 
                label="Material a Granel"
                helperText="Indica se é um material a granel"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="batchentry" label="Entrada de Lote">
                {BATCH_ENTRY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="inhseprodt"
                label="Produção Interna"
                placeholder="Tempo de produção interna"
                helperText="Tempo de produção interna (dias)"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Prazos e Tempos */}
      <Card>
        <CardHeader 
          title="Prazos e Tempos" 
          subheader="Tempos de processamento e entrega"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="plndDelry"
                label="Prazo de Entrega"
                type="number"
                placeholder="0"
                helperText="Prazo de entrega planejado (dias)"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="grPrTime"
                label="Tempo Processamento GR"
                type="number"
                placeholder="0"
                helperText="Tempo de processamento de recebimento (dias)"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="ppcPlCal"
                label="Calendário PPC"
                placeholder="Calendário"
                helperText="Calendário de planejamento de produção"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Sucata e Perdas */}
      <Card>
        <CardHeader 
          title="Sucata e Perdas" 
          subheader="Percentuais de sucata na produção"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="assyScrap"
                label="Sucata de Montagem (%)"
                type="number"
                placeholder="0"
                helperText="Percentual de sucata na montagem"
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="compScrap"
                label="Sucata de Componente (%)"
                type="number"
                placeholder="0"
                helperText="Percentual de sucata de componentes"
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 0.01 }
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Manufatura Repetitiva */}
      <Card>
        <CardHeader 
          title="Manufatura Repetitiva" 
          subheader="Configurações para produção repetitiva"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="repmanprof"
                label="Perfil Manufatura Repetitiva"
                placeholder="Perfil"
                helperText="Perfil de manufatura repetitiva"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="repManuf"
                label="Fabricante Repetitivo"
                placeholder="Fabricante"
                helperText="Identificação do fabricante repetitivo"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="productionScheduler"
                label="Programador de Produção"
                placeholder="Programador"
                helperText="Responsável pela programação de produção"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="prodprof"
                label="Perfil de Produção"
                placeholder="Perfil"
                helperText="Perfil de produção do material"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Tolerâncias */}
      <Card>
        <CardHeader 
          title="Tolerâncias" 
          subheader="Tolerâncias de entrega"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="underTol"
                label="Tolerância Inferior (%)"
                type="number"
                placeholder="0"
                helperText="Tolerância inferior de entrega"
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 0.1 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="overTol"
                label="Tolerância Superior (%)"
                type="number"
                placeholder="0"
                helperText="Tolerância superior de entrega"
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 0.1 }
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Configurações Adicionais */}
      <Card>
        <CardHeader 
          title="Configurações Adicionais" 
          subheader="Outras configurações de produção"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Checkbox 
                name="noCosting" 
                label="Sem Custeio"
                helperText="Material sem custeio"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="sernoProf"
                label="Perfil Nº Série"
                placeholder="Perfil"
                helperText="Perfil de número de série"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="lotSize"
                label="Tamanho de Lote"
                type="number"
                placeholder="0"
                helperText="Tamanho do lote de produção"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="specprocty"
                label="Tipo Processo Especial"
                placeholder="Tipo"
                helperText="Tipo de processo especial"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="prtUsage"
                label="Uso de Impressão"
                placeholder="Uso"
                helperText="Uso de impressão"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="ctrlKey"
                label="Chave de Controle"
                placeholder="Chave"
                helperText="Chave de controle de produção"
              />
            </Grid>
            <Grid item xs={12}>
              <Field.Text
                name="dbText"
                label="Texto BD"
                placeholder="Texto para base de dados"
                multiline
                rows={2}
                helperText="Texto para base de dados"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

