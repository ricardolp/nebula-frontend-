import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

// TAB 5: PLANEJAMENTO (MRP)
// Material Requirements Planning - Planejamento de necessidades

const MRP_TYPE_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: 'PD', label: 'PD - MRP' },
  { value: 'VB', label: 'VB - Baseado em consumo' },
  { value: 'VV', label: 'VV - Previsão com reabastec.automát.' },
  { value: 'VM', label: 'VM - Manual reord.point planning' },
  { value: 'ND', label: 'ND - Sem planejamento' },
];

const MRP_GROUP_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '0001', label: '0001 - Grupo MRP 01' },
  { value: '0002', label: '0002 - Grupo MRP 02' },
  { value: '0003', label: '0003 - Grupo MRP 03' },
];

const LOT_SIZE_KEY_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: 'EX', label: 'EX - Lote a lote' },
  { value: 'FX', label: 'FX - Lote fixo' },
  { value: 'HB', label: 'HB - Reabastecimento' },
  { value: 'WB', label: 'WB - Semanal' },
  { value: 'MB', label: 'MB - Mensal' },
];

const CONSUM_MODE_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '1', label: '1 - Baseado em consumo' },
  { value: '2', label: '2 - Baseado em previsão' },
  { value: '3', label: '3 - Consumo e previsão' },
];

// ----------------------------------------------------------------------

export function MaterialMrpTab() {
  return (
    <Stack spacing={3}>
      {/* Configuração MRP */}
      <Card>
        <CardHeader 
          title="Configuração MRP" 
          subheader="Tipo e controlador de planejamento"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="mrpType" label="Tipo de MRP">
                {MRP_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="mrpCtrler"
                label="Controlador MRP"
                placeholder="Ex: 001"
                helperText="Responsável pelo planejamento de necessidades"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="mrpGroup" label="Grupo MRP">
                {MRP_GROUP_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="reorderPt"
                label="Ponto de Reabastecimento"
                type="number"
                placeholder="0"
                helperText="Ponto de reordem"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Tamanho de Lote */}
      <Card>
        <CardHeader 
          title="Tamanho de Lote" 
          subheader="Configuração de lotes de produção/compra"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="lotsizekey" label="Chave de Tamanho de Lote">
                {LOT_SIZE_KEY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="fixedLot"
                label="Lote Fixo"
                type="number"
                placeholder="0"
                helperText="Tamanho de lote fixo"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="minlotsize"
                label="Lote Mínimo"
                type="number"
                placeholder="0"
                helperText="Tamanho mínimo do lote"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="maxlotsize"
                label="Lote Máximo"
                type="number"
                placeholder="0"
                helperText="Tamanho máximo do lote"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="roundVal"
                label="Valor de Arredondamento"
                type="number"
                placeholder="0"
                helperText="Valor para arredondamento de lote"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Estoques */}
      <Card>
        <CardHeader 
          title="Estoques" 
          subheader="Níveis de estoque e segurança"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="safetyStk"
                label="Estoque de Segurança"
                type="number"
                placeholder="0"
                helperText="Estoque de segurança"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="minSafetyStk"
                label="Estoque de Segurança Mínimo"
                type="number"
                placeholder="0"
                helperText="Estoque de segurança mínimo"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="maxStock"
                label="Estoque Máximo"
                type="number"
                placeholder="0"
                helperText="Nível máximo de estoque"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="servLevel"
                label="Nível de Serviço"
                type="number"
                placeholder="0"
                helperText="Nível de serviço (%)"
                InputProps={{
                  inputProps: { min: 0, max: 100 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="covprofile"
                label="Perfil de Cobertura"
                placeholder="Perfil de cobertura"
                helperText="Perfil de cobertura de estoque"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Consumo e Reabastecimento */}
      <Card>
        <CardHeader 
          title="Consumo e Reabastecimento" 
          subheader="Configurações de consumo e tempo de reposição"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="consummode" label="Modo de Consumo">
                {CONSUM_MODE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="replentime"
                label="Tempo de Reabastecimento"
                type="number"
                placeholder="0"
                helperText="Tempo de reabastecimento (dias)"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="bwdCons"
                label="Consumo Retroativo"
                type="number"
                placeholder="0"
                helperText="Períodos de consumo retroativo"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="fwdCons"
                label="Consumo Futuro"
                type="number"
                placeholder="0"
                helperText="Períodos de consumo futuro"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Planejamento Avançado */}
      <Card>
        <CardHeader 
          title="Planejamento Avançado" 
          subheader="Configurações adicionais de planejamento"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="depReqId"
                label="ID Requisição Dependente"
                placeholder="ID requisição"
                helperText="ID para requisição dependente"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="planStrgp"
                label="Grupo de Estratégia"
                placeholder="Grupo de estratégia"
                helperText="Grupo de estratégia de planejamento"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}
