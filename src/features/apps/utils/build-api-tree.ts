import type { ApiFieldNode } from '../data/domain-schema'

function getValueType(value: unknown): ApiFieldNode['type'] {
  if (value === null) return 'unknown'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  return 'unknown'
}

/**
 * Converte um objeto JSON em árvore de nós para exibição no painel da API.
 * Arrays são expandidos com índice 0 para inferir estrutura (estilo CPI).
 */
export function buildApiTreeFromJson(
  obj: unknown,
  basePath = ''
): ApiFieldNode[] {
  if (obj === null || obj === undefined) {
    return []
  }

  if (Array.isArray(obj)) {
    const first = obj[0]
    if (first === undefined) {
      return [{ id: `${basePath}[]`, path: basePath, label: '[]', type: 'array', occurrence: '0.*', children: [] }]
    }
    return buildApiTreeFromJson(first, basePath).map((n) => ({
      ...n,
      occurrence: '0.*',
    }))
  }

  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj)
    return entries.map(([key, value]) => {
      const path = basePath ? `${basePath}.${key}` : key
      const type = getValueType(value)
      const isNested = type === 'object' || type === 'array'
      const children =
        isNested && (typeof value === 'object' || Array.isArray(value))
          ? buildApiTreeFromJson(value, path)
          : undefined
      const occurrence = type === 'array' ? '0.*' : '1.1'
      return {
        id: path,
        path,
        label: key,
        type,
        children,
        occurrence,
      }
    })
  }

  return []
}
