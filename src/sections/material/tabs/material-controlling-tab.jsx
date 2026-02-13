import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';
import { RHFPlantCombobox } from 'src/components/plant-combobox';

// ----------------------------------------------------------------------

// TAB 9: CONTROLLING/CUSTOS
// Campos relacionados a controlling e custos

const PRICE_CONTROL_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: 'S', label: 'S - Preço Standard' },
  { value: 'V', label: 'V - Preço Médio Móvel' },
];

const MATERIAL_ORIGEM_OPTIONS = [
  { value: '0', label: 'Nacional - exceto indicado para códigos 3, 4, 5 ou 8' },
  { value: '1', label: 'Estrangeiro - import.direta' },
  { value: '2', label: 'Estrang.- aquis.merc.interno' },
  { value: '3', label: 'Nacional - com quota de importação entre 40 e 70%, inclusive' },
  { value: '4', label: 'Nacional - produção com incentivo de imposto' },
  { value: '5', label: 'Nacional - c/conteúdo de importação inferior ou igual a 40%' },
  { value: '6', label: 'Estrng.- imp.dir., nen.prod.nac.semlh., res.CAMEX e gás nat.' },
  { value: '7', label: 'Estrng.- aquis.int., nenh.prd.nac.sem., res.CAMEX e gás nat.' },
  { value: '8', label: 'Nacional - com quota de importação acima de 70%' },
];

const MATERIAL_USE_OPTIONS = [
  { value: '0', label: 'Revenda' },
  { value: '1', label: 'Industrialização' },
  { value: '2', label: 'Consumo' },
  { value: '3', label: 'Imobilizado' },
  { value: '4', label: 'Consumo para atividade principal' },
];


// ----------------------------------------------------------------------

export function MaterialControllingTab() {
  return (
    <Stack spacing={3}>
      {/* Área de Avaliação */}
      <Card>
        <CardHeader 
          title="Área de Avaliação" 
          subheader="Configurações de área e tipo de avaliação"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFPlantCombobox
                name="controlling.bwkey"
                label="Área de Avaliação (BWKEY)"
                placeholder="Buscar centro..."
                helperText="Chave da área de avaliação (mesma do centro)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.bwtar"
                label="Tipo de Avaliação"
                placeholder="Tipo"
                helperText="Tipo de avaliação do material"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.valArea"
                label="Área de Valorização"
                placeholder="Área"
                helperText="Área de valorização"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.valClass"
                label="Classe de Valorização"
                placeholder="Classe"
                helperText="Classe de valorização"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Classe de Material */}
      <Card>
        <CardHeader 
          title="Classe de Material" 
          subheader="Classificação do material para controlling"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.matKlass"
                label="Classe de Material"
                placeholder="Classe"
                helperText="Classe do material para avaliação"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Controle de Preço */}
      <Card>
        <CardHeader 
          title="Controle de Preço" 
          subheader="Tipo de controle de preço e valores"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="controlling.priceCtrl" label="Controle de Preço">
                {PRICE_CONTROL_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.priceUnit"
                label="Unidade de Preço"
                type="number"
                placeholder="1"
                helperText="Unidade base do preço"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.stdPrice"
                label="Preço Standard"
                type="number"
                placeholder="0.00"
                helperText="Preço padrão do material"
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.movingPrice"
                label="Preço Médio Móvel"
                type="number"
                placeholder="0.00"
                helperText="Preço médio móvel"
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.priceDate"
                label="Data do Preço"
                type="date"
                helperText="Data de vigência do preço"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Material Ledger */}
      <Card>
        <CardHeader 
          title="Material Ledger" 
          subheader="Configurações do Material Ledger"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Checkbox 
                name="controlling.mlActive" 
                label="ML Ativo"
                helperText="Material Ledger ativo"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Checkbox 
                name="controlling.mlSettle" 
                label="ML Liquidação"
                helperText="Liquidação no Material Ledger"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Origem */}
      <Card>
        <CardHeader 
          title="Origem" 
          subheader="Material e grupo de origem"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="controlling.originMat" label="Material Origem">
                {MATERIAL_ORIGEM_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.originGroup"
                label="Grupo de Origem"
                placeholder="Grupo"
                helperText="Grupo de origem do material"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Overhead e Centro de Lucro */}
      <Card>
        <CardHeader 
          title="Overhead e Centro de Lucro" 
          subheader="Configurações de custos indiretos"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.overheadGrp"
                label="Grupo Overhead"
                placeholder="Grupo"
                helperText="Grupo de custos indiretos"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.profitCtr2"
                label="Centro de Lucro 2"
                placeholder="Centro"
                helperText="Centro de lucro secundário"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Estrutura e Uso */}
      <Card>
        <CardHeader 
          title="Estrutura e Uso" 
          subheader="Configurações de estrutura e utilização"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Checkbox 
                name="controlling.qtyStruct" 
                label="Estrutura de Quantidade"
                helperText="Estrutura de quantidade"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Checkbox 
                name="controlling.inHouse" 
                label="Produção Interna"
                helperText="Produção interna para custos"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="controlling.matUsage" label="Uso do Material">
                {MATERIAL_USE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Preços Planejados */}
      <Card>
        <CardHeader 
          title="Preços Planejados" 
          subheader="Preços planejados para períodos futuros"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {/* Preço Planejado 1 */}
            <Grid item xs={12}>
              <CardHeader 
                title="Preço Planejado 1" 
                sx={{ px: 0 }}
                titleTypographyProps={{ variant: 'subtitle2' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.plndprice1"
                label="Preço Planejado 1"
                type="number"
                placeholder="0.00"
                helperText="Primeiro preço planejado"
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.plndprdate1"
                label="Data Preço Planejado 1"
                type="date"
                helperText="Data do primeiro preço planejado"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Preço Planejado 2 */}
            <Grid item xs={12}>
              <CardHeader 
                title="Preço Planejado 2" 
                sx={{ px: 0, pt: 2 }}
                titleTypographyProps={{ variant: 'subtitle2' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.plndprice2"
                label="Preço Planejado 2"
                type="number"
                placeholder="0.00"
                helperText="Segundo preço planejado"
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.plndprdate2"
                label="Data Preço Planejado 2"
                type="date"
                helperText="Data do segundo preço planejado"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Preço Planejado 3 */}
            <Grid item xs={12}>
              <CardHeader 
                title="Preço Planejado 3" 
                sx={{ px: 0, pt: 2 }}
                titleTypographyProps={{ variant: 'subtitle2' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.plndprice3"
                label="Preço Planejado 3"
                type="number"
                placeholder="0.00"
                helperText="Terceiro preço planejado"
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="controlling.plndprdate3"
                label="Data Preço Planejado 3"
                type="date"
                helperText="Data do terceiro preço planejado"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}
