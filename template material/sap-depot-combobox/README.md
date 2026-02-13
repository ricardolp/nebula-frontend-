# SapDepotCombobox

Componente de combobox para seleção de armazenagem/depósitos SAP, com suporte a busca e integração com React Hook Form.

## Características

- ✅ Busca inteligente por código ou nome do depósito
- ✅ Integração com React Hook Form
- ✅ Renderização customizada das opções
- ✅ Suporte a filtros customizados
- ✅ Acessibilidade completa
- ✅ TypeScript support (através de JSDoc)
- ✅ 150+ depósitos pré-configurados

## Instalação

```bash
# O componente já está incluído no projeto
# Apenas importe onde necessário
```

## Uso Básico

```jsx
import { SapDepotCombobox } from 'src/components/sap-depot-combobox';

function MyComponent() {
  const [selectedDepot, setSelectedDepot] = useState('');

  return (
    <SapDepotCombobox
      value={selectedDepot}
      onChange={setSelectedDepot}
      label="Armazenagem"
      placeholder="Digite para buscar..."
    />
  );
}
```

## Com React Hook Form

```jsx
import { RHFSapDepotCombobox } from 'src/components/sap-depot-combobox';

function MyForm() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <RHFSapDepotCombobox
        name="depot"
        label="Armazenagem"
        required
        helperText="Selecione o depósito desejado"
      />
    </FormProvider>
  );
}
```

## Props

### SapDepotCombobox

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `value` | `string` | - | Valor selecionado (código do depósito) |
| `onChange` | `(value: string) => void` | - | Callback quando o valor muda |
| `label` | `string` | `'Armazenagem'` | Label do campo |
| `placeholder` | `string` | `'Selecione um depósito...'` | Placeholder do campo |
| `disabled` | `boolean` | `false` | Se o campo está desabilitado |
| `required` | `boolean` | `false` | Se o campo é obrigatório |
| `helperText` | `string` | - | Texto de ajuda |
| `error` | `boolean` | `false` | Se há erro no campo |
| `size` | `'small' \| 'medium'` | `'medium'` | Tamanho do campo |
| `fullWidth` | `boolean` | `true` | Se ocupa toda a largura disponível |
| `searchable` | `boolean` | `true` | Se permite busca |
| `filteredOptions` | `Array<{value: string, label: string}>` | - | Opções filtradas customizadas |
| `onSearchChange` | `(searchTerm: string) => void` | - | Callback quando a busca muda |
| `slotProps` | `object` | `{}` | Props adicionais para componentes internos |

### RHFSapDepotCombobox

Herda todas as props do `SapDepotCombobox`, exceto `value` e `onChange`, e adiciona:

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `name` | `string` | - | Nome do campo no formulário (obrigatório) |

## Funções Utilitárias

```jsx
import { 
  SAP_DEPOT_OPTIONS, 
  searchSapDepotOptions, 
  getSapDepotLabel, 
  getSapDepotCode 
} from 'src/components/sap-depot-combobox';

// Obter todas as opções
const allOptions = SAP_DEPOT_OPTIONS;

// Buscar opções por termo
const filteredOptions = searchSapDepotOptions('cotrijal');

// Obter label completo pelo código
const label = getSapDepotLabel('A001'); // "A001 - COTRIJAL - NAO-ME-TOQUE"

// Obter apenas o código
const code = getSapDepotCode('A001'); // "A001"
```

## Exemplos Avançados

### Filtro Customizado

```jsx
const lojaOptions = SAP_DEPOT_OPTIONS.filter(option => 
  option.value.startsWith('L')
);

<SapDepotCombobox
  filteredOptions={lojaOptions}
  label="Apenas Lojas"
/>
```

### Callback de Busca

```jsx
<SapDepotCombobox
  onSearchChange={(searchTerm) => {
    console.log('Usuário está buscando:', searchTerm);
  }}
/>
```

### Customização de Estilo

```jsx
<SapDepotCombobox
  slotProps={{
    textField: {
      sx: { 
        '& .MuiOutlinedInput-root': { 
          borderRadius: 2 
        } 
      }
    },
    popper: {
      sx: {
        '& .MuiAutocomplete-paper': {
          boxShadow: 3
        }
      }
    }
  }}
/>
```

## Estrutura de Dados

Cada opção de depósito possui a seguinte estrutura:

```typescript
interface DepotOption {
  value: string;  // Código do depósito (ex: "A001")
  label: string;  // Descrição completa (ex: "A001 - COTRIJAL - NAO-ME-TOQUE")
}
```

## Depósitos Incluídos

O componente inclui 150+ depósitos organizados por categoria:

- **Plantas Principais**: 0001, 0003, 1410, 1710, 9999
- **COTRIJAL - Centros**: A001 a A156, AFC1, E028, F029, T097, U012, V101
- **Lojas**: L049 a L155
- **Supermercados**: S006 a S153
- **Transportes**: TR01 a TR03
- **Em Trânsito**: IT01

## Acessibilidade

- ✅ Suporte completo a leitores de tela
- ✅ Navegação por teclado
- ✅ ARIA labels apropriados
- ✅ Foco visível
- ✅ Estados de erro e sucesso

## Performance

- ✅ Busca otimizada com debounce
- ✅ Renderização virtualizada para listas grandes
- ✅ Memoização de opções filtradas
- ✅ Lazy loading de opções quando necessário

## Contribuição

Para adicionar novos depósitos, edite o arquivo `sap-depot-constants.js`:

```javascript
export const SAP_DEPOT_OPTIONS = [
  // ... opções existentes
  { value: 'NEW001', label: 'NEW001 - NOVO DEPÓSITO' },
];
```
