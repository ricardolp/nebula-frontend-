/**
 * ID do formulário de Business Partner usado em /dashboard/business-partners/new.
 * Os campos visíveis no "Novo Parceiro" são os que foram arrastados neste formulário
 * em /dashboard/forms/:id/edit.
 *
 * Se não definido (null), o primeiro formulário com entity === 'partner' da organização será usado.
 * Defina VITE_BUSINESS_PARTNER_FORM_ID no .env para fixar um formulário (ex.: cmlhfqgiz000ibgzrh58okl4j).
 */
export const BUSINESS_PARTNER_FORM_ID =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_BUSINESS_PARTNER_FORM_ID
    ? import.meta.env.VITE_BUSINESS_PARTNER_FORM_ID
    : null;
