# Purchaser Group ComboBox

ComboBox para seleção de Grupo de Compradores com busca e filtro.

## 📦 Componentes

- `PurchaserGroupCombobox` - Componente standalone
- `RHFPurchaserGroupCombobox` - Integrado com React Hook Form
- `PURCHASER_GROUP_OPTIONS` - Array com todas as opções
- `findPurchaserGroupByCode()` - Busca por código
- `searchPurchaserGroupOptions()` - Busca/filtro por termo

## 🎯 Uso Básico

### Com React Hook Form

```jsx
import { RHFPurchaserGroupCombobox } from 'src/components/purchaser-group-combobox';

function MyForm() {
  return (
    <RHFPurchaserGroupCombobox 
      name="purchaserGroup"
      label="Grupo de Compradores"
      helperText="Selecione o grupo"
    />
  );
}
```

### Standalone (sem form)

```jsx
import { PurchaserGroupCombobox } from 'src/components/purchaser-group-combobox';

function MyComponent() {
  const [group, setGroup] = useState('');

  return (
    <PurchaserGroupCombobox 
      value={group}
      onChange={setGroup}
      label="Grupo de Compradores"
      placeholder="Buscar grupo..."
    />
  );
}
```

## 🔧 Props

### RHFPurchaserGroupCombobox

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | **Obrigatório**. Nome do campo no form |
| `label` | `string` | `'Grupo de Compradores'` | Label do campo |
| `placeholder` | `string` | `'Buscar grupo...'` | Placeholder |
| `helperText` | `string` | - | Texto de ajuda |
| `disabled` | `boolean` | `false` | Desabilita o campo |

### PurchaserGroupCombobox

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | **Obrigatório**. Código do grupo selecionado |
| `onChange` | `function` | - | **Obrigatório**. Callback com o código |
| `label` | `string` | `'Grupo de Compradores'` | Label do campo |
| `placeholder` | `string` | `'Buscar grupo...'` | Placeholder |
| `error` | `boolean` | `false` | Marca campo com erro |
| `helperText` | `string` | - | Texto de ajuda |
| `disabled` | `boolean` | `false` | Desabilita o campo |

## 📊 Dados Disponíveis

Total: **31 grupos de compradores**

### Códigos numéricos:
- `001` - Group 001
- `002` - Group 002
- `003` - Group 003
- `005` - Transportation Srv

### Códigos alfanuméricos:
- `CMM` - Grãos
- `G01` a `G26` - Diversos grupos especializados

## 🔍 Funcionalidades

### Busca Inteligente
O componente permite busca por:
- Código (ex: "G01", "CMM")
- Nome/Label (ex: "Padaria", "Grãos")

### Visual
- Chip colorido mostrando o código
- Nome completo do grupo
- Filtro em tempo real

## 💡 Exemplos de Uso

### Em um formulário de Parceiro de Negócio

```jsx
import { RHFPurchaserGroupCombobox } from 'src/components/purchaser-group-combobox';

<Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    <RHFPurchaserGroupCombobox 
      name="purchaserGroup"
      label="Grupo de Compradores"
      helperText="Selecione o grupo responsável pelas compras"
    />
  </Grid>
</Grid>
```

### Com validação

```javascript
import { z as zod } from 'zod';
import { PURCHASER_GROUP_OPTIONS } from 'src/components/purchaser-group-combobox';

const schema = zod.object({
  purchaserGroup: zod
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || PURCHASER_GROUP_OPTIONS.some((opt) => opt.code === val),
      { message: 'Grupo de compradores inválido' }
    ),
});
```

### Buscar informações de um grupo

```javascript
import { findPurchaserGroupByCode } from 'src/components/purchaser-group-combobox';

const group = findPurchaserGroupByCode('G01');
console.log(group); // { code: 'G01', label: 'Compras Padaria' }
```

### Filtrar grupos

```javascript
import { searchPurchaserGroupOptions } from 'src/components/purchaser-group-combobox';

const results = searchPurchaserGroupOptions('Compras');
// Retorna todos os grupos que contém "Compras" no nome
```

## 🎨 Personalização

```jsx
<RHFPurchaserGroupCombobox 
  name="purchaserGroup"
  label="Grupo"
  placeholder="Digite para buscar..."
  helperText="Grupo responsável"
  disabled={isView}
  sx={{ 
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'background.paper'
    }
  }}
/>
```

## 📝 Notas

- O valor salvo no formulário é sempre o **código** (string)
- A busca é **case-insensitive**
- Opções ordenadas conforme listagem original
- Componente otimizado com `useMemo` para performance

