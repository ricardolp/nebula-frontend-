/**
 * Templates de campos por entidade (material | partner).
 * Usado na tela de edição do formulário para arrastar da esquerda para a direita.
 * Cada item: { id, label, campo, tabela }
 * Partner: lista canônica em business-partner/data/partner-field-templates-for-builder.js
 *          (form builder e /dashboard/business-partners/new usam exatamente os mesmos campos).
 */

import {
  PARTNER_FIELD_GROUPS as BP_PARTNER_FIELD_GROUPS,
  PARTNER_FIELD_TEMPLATES as BP_PARTNER_FIELD_TEMPLATES,
} from 'src/sections/business-partner/data/partner-field-templates-for-builder';

/** Campos gerais (uso livre) */
const GENERIC = [
  { id: 'gen-text-short', label: 'Texto curto', campo: 'TEXT_SHORT', tabela: 'CUSTOM' },
  { id: 'gen-text-long', label: 'Texto longo', campo: 'TEXT_LONG', tabela: 'CUSTOM' },
  { id: 'gen-numeric', label: 'Número', campo: 'NUMERIC', tabela: 'CUSTOM' },
  { id: 'gen-date', label: 'Data', campo: 'DATE', tabela: 'CUSTOM' },
  { id: 'gen-email', label: 'E-mail', campo: 'EMAIL', tabela: 'CUSTOM' },
  { id: 'gen-boolean', label: 'Sim/Não', campo: 'BOOLEAN', tabela: 'CUSTOM' },
];

/** Campos SAP Material */
const SAP_MATERIAL = [
  { id: 'sap-matnr', label: 'Código do material', campo: 'MATNR', tabela: 'MARA' },
  { id: 'sap-mtart', label: 'Tipo de material', campo: 'MTART', tabela: 'MARA' },
  { id: 'sap-meins', label: 'Unidade de medida', campo: 'MEINS', tabela: 'MARA' },
  { id: 'sap-maktx', label: 'Descrição (PT)', campo: 'MAKTX', tabela: 'MAKT' },
  { id: 'sap-matkl', label: 'Grupo de mercadorias', campo: 'MATKL', tabela: 'MARA' },
  { id: 'sap-mbrsh', label: 'Setor de atividade', campo: 'MBRSH', tabela: 'MARA' },
  { id: 'sap-werks', label: 'Centro', campo: 'WERKS', tabela: 'MARC' },
  { id: 'sap-lgort', label: 'Depósito', campo: 'LGORT', tabela: 'MARD' },
];

/** Material = gerais + SAP Material */
export const MATERIAL_FIELD_TEMPLATES = [...GENERIC, ...SAP_MATERIAL];

// ----------------------------------------------------------------------
// Business Partner: fonte única em business-partner/data/partner-field-templates-for-builder.js
// Form builder e /dashboard/business-partners/new usam exatamente os mesmos campos.
// ----------------------------------------------------------------------
export const PARTNER_FIELD_GROUPS = BP_PARTNER_FIELD_GROUPS;
export const PARTNER_FIELD_TEMPLATES = BP_PARTNER_FIELD_TEMPLATES;

/**
 * Retorna os templates da entidade do formulário.
 * @param {string} entity - 'material' | 'partner'
 * @returns {Array<{ id, label, campo, tabela }>}
 */
export function getFieldTemplatesByEntity(entity) {
  if (entity === 'partner') {
    return PARTNER_FIELD_TEMPLATES;
  }
  return MATERIAL_FIELD_TEMPLATES;
}

/**
 * Retorna os grupos de campos partner (para seções expansíveis).
 * @returns {Array<{ key, title, templates }>}
 */
export function getPartnerFieldGroups() {
  return PARTNER_FIELD_GROUPS;
}
