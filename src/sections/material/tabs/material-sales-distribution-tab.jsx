import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';

import { Field } from 'src/components/hook-form';
import { RHFSalesOrgCombobox } from 'src/components/sales-org-combobox';
import { RHFDistChannelCombobox } from 'src/components/dist-channel-combobox';
import { RHFSectorCombobox } from 'src/components/sector-combobox';
import { RHFDepotCombobox } from 'src/components/depot-combobox';
import { RHFPlantCombobox } from 'src/components/plant-combobox';

// ----------------------------------------------------------------------

// TAB 8: VENDAS/DISTRIBUIÇÃO
// Campos relacionados à área de vendas e distribuição

const TAX_TYPE_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '0', label: '0 - Isento' },
  { value: '1', label: '1 - Tributado' },
  { value: '2', label: '2 - Substituição Tributária' },
];

const TAX_CLASS_OPTIONS = [
  { value: '', label: 'Nenhuma' },
  { value: '0', label: '0 - Tributação normal' },
  { value: '1', label: '1 - Tributação especial' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Nenhum' },
  { value: '01', label: '01 - Ativo' },
  { value: '02', label: '02 - Bloqueado' },
  { value: '03', label: '03 - Inativo' },
];

const ACCOUNT_ASSIGNMENT_OPTIONS = [
  { value: '', label: 'Nenhuma' },
  { value: 'K', label: 'K - Custo' },
  { value: 'P', label: 'P - Projeto' },
  { value: 'Q', label: 'Q - Ordem' },
];

const UNIT_OPTIONS = [
  { value: '', label: 'Nenhuma' },
  { value: 'D', label: 'D - Dias' },
  { value: 'W', label: 'W - Semanas' },
  { value: 'M', label: 'M - Meses' },
];

// ----------------------------------------------------------------------

export function MaterialSalesDistributionTab() {
  return (
    <Stack spacing={3}>
      {/* Organização de Vendas */}
      <Card>
        <CardHeader 
          title="Organização de Vendas" 
          subheader="Estrutura organizacional de vendas"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <RHFSalesOrgCombobox
                name="salesDistribution.vkorg"
                label="Organização Vendas"
                placeholder="Buscar organização..."
                helperText="Código da organização de vendas"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RHFDistChannelCombobox
                name="salesDistribution.vtweg"
                label="Canal de Distribuição"
                placeholder="Buscar canal..."
                helperText="Canal de distribuição"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RHFSectorCombobox
                name="salesDistribution.spart"
                label="Setor de Atividade"
                placeholder="Buscar setor..."
                helperText="Setor de atividade/divisão"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Centro e Depósito */}
      <Card>
        <CardHeader 
          title="Centro e Depósito" 
          subheader="Centro fornecedor e depósito"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFPlantCombobox
                name="salesDistribution.dwerk"
                label="Centro Fornecedor"
                placeholder="Buscar centro..."
                helperText="Centro que fornece o material"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFDepotCombobox
                name="salesDistribution.lgort"
                label="Depósito"
                placeholder="Buscar depósito..."
                helperText="Local de armazenamento"
                plantFieldName="salesDistribution.dwerk"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="salesDistribution.prctr"
                label="Centro de Lucro"
                placeholder="Ex: 1000"
                helperText="Centro de lucro para vendas"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="salesDistribution.ktgrm"
                label="Grupo Conta Cliente"
                placeholder="Grupo"
                helperText="Grupo de conta do cliente"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Unidades e Quantidades */}
      <Card>
        <CardHeader 
          title="Unidades e Quantidades" 
          subheader="Unidades de venda e quantidades mínimas"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="salesDistribution.salesUnit"
                label="Unidade de Vendas"
                placeholder="Ex: UN, CX, PC"
                helperText="Unidade de medida para vendas"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="salesDistribution.minOrder"
                label="Quantidade Mínima Pedido"
                type="number"
                placeholder="0"
                helperText="Quantidade mínima de pedido"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Prazos de Entrega */}
      <Card>
        <CardHeader 
          title="Prazos de Entrega" 
          subheader="Configurações de prazo de entrega"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="salesDistribution.minDely"
                label="Prazo Entrega Mínimo"
                type="number"
                placeholder="0"
                helperText="Prazo mínimo de entrega"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="salesDistribution.delyUnit" label="Unidade do Prazo">
                {UNIT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Impostos */}
      <Card>
        <CardHeader 
          title="Impostos" 
          subheader="Configurações fiscais e tributárias"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="salesDistribution.taxType1" label="Tipo Imposto 1">
                {TAX_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Select name="salesDistribution.taxclass1" label="Classificação Fiscal 1">
                {TAX_CLASS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Status e Grupos */}
      <Card>
        <CardHeader 
          title="Status e Grupos" 
          subheader="Status do material e grupos de vendas"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="salesDistribution.matlStats" label="Status Material">
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="salesDistribution.rebateGrp"
                label="Grupo Rebate"
                placeholder="Grupo"
                helperText="Grupo de rebate"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="salesDistribution.commGroup"
                label="Grupo Comissão"
                placeholder="Grupo"
                helperText="Grupo de comissão"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="salesDistribution.matPrGrp"
                label="Grupo Preço Material"
                placeholder="Grupo"
                helperText="Grupo de preço do material"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>

      {/* Contabilização e Descontos */}
      <Card>
        <CardHeader 
          title="Contabilização e Descontos" 
          subheader="Atribuição de conta e descontos"
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Field.Select name="salesDistribution.acctAssgt" label="Atribuição Conta">
                {ACCOUNT_ASSIGNMENT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="salesDistribution.cashDisc"
                label="Desconto à Vista (%)"
                type="number"
                placeholder="0"
                helperText="Percentual de desconto à vista"
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 0.01 }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field.Text
                name="salesDistribution.roundProf"
                label="Perfil Arredondamento"
                placeholder="Perfil"
                helperText="Perfil de arredondamento de preço"
              />
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}
