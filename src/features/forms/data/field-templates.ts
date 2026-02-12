/**
 * Suggested input type for rendering dynamic forms (e.g. in Nova solicitação).
 * Not stored in backend; FormField only has campo, tabela, sequencia.
 */
export type FieldInputType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'email'
  | 'checkbox'
  | 'select'

export interface FieldTemplate {
  id: string
  label: string
  campo: string
  tabela: string
  inputType: FieldInputType
  group: 'generic' | 'sap-material' | 'sap-partner'
}

/** Campos gerais (uso livre) – spec tabela 2.1 */
export const GENERIC_FIELD_TEMPLATES: FieldTemplate[] = [
  { id: 'gen-text-short', label: 'Texto curto', campo: 'TEXT_SHORT', tabela: 'CUSTOM', inputType: 'text', group: 'generic' },
  { id: 'gen-text-long', label: 'Texto longo', campo: 'TEXT_LONG', tabela: 'CUSTOM', inputType: 'textarea', group: 'generic' },
  { id: 'gen-numeric', label: 'Número', campo: 'NUMERIC', tabela: 'CUSTOM', inputType: 'number', group: 'generic' },
  { id: 'gen-date', label: 'Data', campo: 'DATE', tabela: 'CUSTOM', inputType: 'date', group: 'generic' },
  { id: 'gen-email', label: 'E-mail', campo: 'EMAIL', tabela: 'CUSTOM', inputType: 'email', group: 'generic' },
  { id: 'gen-boolean', label: 'Sim/Não', campo: 'BOOLEAN', tabela: 'CUSTOM', inputType: 'checkbox', group: 'generic' },
]

/** Campos SAP – Material (tabelas MARA, MARC, etc.) – spec tabela 2.2 */
export const SAP_MATERIAL_FIELD_TEMPLATES: FieldTemplate[] = [
  { id: 'sap-matnr', label: 'Código do material', campo: 'MATNR', tabela: 'MARA', inputType: 'text', group: 'sap-material' },
  { id: 'sap-mtart', label: 'Tipo de material', campo: 'MTART', tabela: 'MARA', inputType: 'text', group: 'sap-material' },
  { id: 'sap-meins', label: 'Unidade de medida', campo: 'MEINS', tabela: 'MARA', inputType: 'text', group: 'sap-material' },
  { id: 'sap-maktx', label: 'Descrição (PT)', campo: 'MAKTX', tabela: 'MAKT', inputType: 'text', group: 'sap-material' },
  { id: 'sap-matkl', label: 'Grupo de mercadorias', campo: 'MATKL', tabela: 'MARA', inputType: 'text', group: 'sap-material' },
  { id: 'sap-mbrsh', label: 'Setor de atividade', campo: 'MBRSH', tabela: 'MARA', inputType: 'text', group: 'sap-material' },
  { id: 'sap-werks', label: 'Centro', campo: 'WERKS', tabela: 'MARC', inputType: 'text', group: 'sap-material' },
  { id: 'sap-lgort', label: 'Depósito', campo: 'LGORT', tabela: 'MARD', inputType: 'text', group: 'sap-material' },
]

/** Campos SAP – Partner (tabelas KNA1, LFA1, etc.) – spec tabela 2.3 */
export const SAP_PARTNER_FIELD_TEMPLATES: FieldTemplate[] = [
  { id: 'sap-kunnr', label: 'Cliente', campo: 'KUNNR', tabela: 'KNA1', inputType: 'text', group: 'sap-partner' },
  { id: 'sap-name1', label: 'Nome 1', campo: 'NAME1', tabela: 'KNA1', inputType: 'text', group: 'sap-partner' },
  { id: 'sap-name2', label: 'Nome 2', campo: 'NAME2', tabela: 'KNA1', inputType: 'text', group: 'sap-partner' },
  { id: 'sap-stcd1', label: 'CNPJ/CPF', campo: 'STCD1', tabela: 'KNA1', inputType: 'text', group: 'sap-partner' },
  { id: 'sap-lifnr', label: 'Fornecedor', campo: 'LIFNR', tabela: 'LFA1', inputType: 'text', group: 'sap-partner' },
  { id: 'sap-waers', label: 'Moeda', campo: 'WAERS', tabela: 'KNA1', inputType: 'text', group: 'sap-partner' },
  { id: 'sap-land1', label: 'País', campo: 'LAND1', tabela: 'KNA1', inputType: 'text', group: 'sap-partner' },
]

export const FIELD_TEMPLATE_GROUPS = [
  { key: 'generic', title: 'Campos gerais' },
  { key: 'sap-material', title: 'SAP Material' },
  { key: 'sap-partner', title: 'SAP Partner' },
] as const

export const ALL_FIELD_TEMPLATES: FieldTemplate[] = [
  ...GENERIC_FIELD_TEMPLATES,
  ...SAP_MATERIAL_FIELD_TEMPLATES,
  ...SAP_PARTNER_FIELD_TEMPLATES,
]

export function getTemplatesByGroup(group: FieldTemplate['group']): FieldTemplate[] {
  return ALL_FIELD_TEMPLATES.filter((t) => t.group === group)
}

/** Templates para tipo Material (gerais + SAP Material) */
export const MATERIAL_LIBRARY_GROUPS = [
  { key: 'generic', title: 'Campos gerais' },
  { key: 'sap-material', title: 'SAP Material' },
] as const

export function getMaterialTemplates(): FieldTemplate[] {
  return [...GENERIC_FIELD_TEMPLATES, ...SAP_MATERIAL_FIELD_TEMPLATES]
}
