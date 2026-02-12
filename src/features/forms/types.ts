/**
 * Represents a field on the Form Builder canvas.
 * Either from API (id, formId) or newly added (tempId, no id).
 */
export interface CanvasFormField {
  id?: string
  formId?: string
  tempId?: string
  campo: string
  tabela: string
  sequencia: number
}

export const LIBRARY_DRAG_TYPE = 'form-field-library'
export const CANVAS_DRAG_TYPE = 'form-field-canvas'
