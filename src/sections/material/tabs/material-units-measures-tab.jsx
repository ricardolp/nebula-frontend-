import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';

import { Field } from 'src/components/hook-form';
import { RHFMaterialUnitCombobox } from 'src/components/material-unit-combobox';

// ----------------------------------------------------------------------

// TAB 3: UNIDADES E MEDIDAS
// Unidades de medida, pesos e volumes

// As opções de unidades agora vêm do combobox com 450+ opções

// ----------------------------------------------------------------------

export function MaterialUnitsMeasuresTab() {
  return (
    <Stack spacing={3}>
      {/* Unidades de Medida */}
      <Card>
        <CardHeader 
          title="Unidades de Medida" 
          subheader="Unidade base e alternativa"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFMaterialUnitCombobox
                name="baseUom"
                label="Unidade de Medida Base *"
                placeholder="Buscar unidade..."
                helperText="Unidade de medida base do material (obrigatório)"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFMaterialUnitCombobox
                name="altUnit"
                label="Unidade Alternativa"
                placeholder="Buscar unidade..."
                helperText="Unidade de medida alternativa"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Fatores de Conversão */}
      <Card>
        <CardHeader 
          title="Fatores de Conversão" 
          subheader="Fatores para conversão entre unidades"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="fatorAltUnit"
                label="Fator Unidade Alternativa"
                type="number"
                placeholder="1"
                helperText="Fator de conversão da unidade alternativa"
                InputProps={{
                  inputProps: { min: 0, step: 0.0001 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="fatorBaseUom"
                label="Fator Unidade Base"
                type="number"
                placeholder="1"
                helperText="Fator de conversão da unidade base"
                InputProps={{
                  inputProps: { min: 0, step: 0.0001 }
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Peso */}
      <Card>
        <CardHeader 
          title="Peso" 
          subheader="Informações de peso do material"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Field.Text
                name="grossWt"
                label="Peso Bruto"
                type="number"
                placeholder="0.00"
                helperText="Peso bruto do material"
                InputProps={{
                  inputProps: { min: 0, step: 0.001 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Field.Text
                name="netWeight"
                label="Peso Líquido"
                type="number"
                placeholder="0.00"
                helperText="Peso líquido do material"
                InputProps={{
                  inputProps: { min: 0, step: 0.001 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RHFMaterialUnitCombobox
                name="unitOfWt"
                label="Unidade de Peso"
                placeholder="Buscar unidade..."
                helperText="Unidade de medida de peso"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Volume */}
      <Card>
        <CardHeader 
          title="Volume" 
          subheader="Informações de volume do material"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="volume"
                label="Volume"
                type="number"
                placeholder="0.00"
                helperText="Volume do material"
                InputProps={{
                  inputProps: { min: 0, step: 0.001 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFMaterialUnitCombobox
                name="volumeunit"
                label="Unidade de Volume"
                placeholder="Buscar unidade..."
                helperText="Unidade de medida de volume"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

