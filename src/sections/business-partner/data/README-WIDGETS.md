# Business Partner – Campos com máscara, combobox e outros widgets

Resumo da configuração em `field-widget-config.js`.

## Máscara

| Tipo      | Campos                                                                 |
|-----------|------------------------------------------------------------------------|
| **CPF**   | `cpf`, `cpf_favorecido`                                                |
| **CNPJ**  | `cnpj`                                                                |
| **CEP**   | `cep`                                                                 |
| **Telefone** | `telefone`, `telefone2`, `telefone3`, `celular`                     |

## Combobox (Select)

Campos que usam lista fixa de opções:

- **tipo** – PF / PJ  
- **funcao** – Cliente (C), Fornecedor (F), Cliente e Fornecedor (A)  
- **sexo** – M, F, O  
- **cond_pgto** – Condição de pagamento (à vista, 30/60/90 dias)  
- **form_pgto** – Forma de pagamento (Boleto, Transferência, Cartão, Débito)  
- **moeda_cliente** / **moeda_pedido** – BRL, USD, EUR  
- **pais** – BR, AR, UY, PY  
- **estado** – UF (AC, AL, …, TO)  
- **verificar_fatura_duplicada** – Sim / Não  
- **optante_simples** / **simples_nacional** – Sim / Não  
- **tipo_nfe** – NF-e, NFC-e  
- **regime_pis_cofins** – Regime Normal, Simples Nacional  
- **tipo_imposto** – ICMS, Isento  
- **recebedor_alternativo** – Sim / Não  
- **xblocked** – Bloqueado Sim/Não  
- **check_relevant** – Sim / Não  

## Data (DatePicker)

- `data_nascimento`, `data_fundacao`  
- `valid_date_from`, `valid_date_to`  
- `limit_valid_date`, `follow_up_dt`  
- `date_from`, `date_to`, `date_follow_up`  

## Número

- `cod_banco`, `cod_agencia`, `dig_agencia`, `cod_conta`, `dig_conta`  
- `numero` (endereço)  
- `credit_limit`, `amount`  

## Email

- `email`  

## Texto (padrão)

Todos os demais campos são tratados como texto livre (sem máscara nem combobox).
