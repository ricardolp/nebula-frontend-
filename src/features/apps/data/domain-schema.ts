/**
 * Schema de campos para criação de domain (nossa API).
 * Exemplo: { tabela: "t001", campo: "bukrs", valor: "0001", descricaoCampo: "empresa" }
 */
export const DOMAIN_SCHEMA_FIELDS = [
  { id: 'tabela' as const, label: 'Tabela', descricao: 'Código da tabela (ex: t001)' },
  { id: 'campo' as const, label: 'Campo', descricao: 'Nome do campo (ex: bukrs)' },
  { id: 'valor' as const, label: 'Valor', descricao: 'Valor do campo (ex: 0001)' },
  { id: 'descricaoCampo' as const, label: 'Descrição do campo', descricao: 'Descrição (ex: empresa)' },
] as const

export type DomainFieldId = (typeof DOMAIN_SCHEMA_FIELDS)[number]['id']

/** Nó da árvore de campos da API externa (resposta do "Testar") */
export interface ApiFieldNode {
  id: string
  path: string
  label: string
  type: 'string' | 'number' | 'object' | 'array' | 'boolean' | 'unknown'
  children?: ApiFieldNode[]
  occurrence?: string
}

/** Mapeamento: campo nosso -> caminho na API externa */
export type FieldMapping = Record<DomainFieldId, { sourcePath: string } | undefined>
