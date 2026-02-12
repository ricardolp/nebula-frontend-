/**
 * Máscaras centralizadas para CEP, CPF, CNPJ e telefone.
 * Usado em Business Partner e workflow-request.
 */

/**
 * Aplica máscara de CEP (XXXXX-XXX).
 * @param {string} value - Valor com ou sem formatação
 * @returns {string}
 */
export function formatCep(value) {
  if (!value) return '';
  const numbers = String(value).replace(/\D/g, '');
  if (numbers.length < 8) return numbers;
  return numbers.slice(0, 8).replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Aplica máscara de CPF (XXX.XXX.XXX-XX).
 * @param {string} value - Valor com ou sem formatação
 * @returns {string}
 */
export function formatCpf(value) {
  if (!value) return '';
  const numbers = String(value).replace(/\D/g, '');
  if (numbers.length < 11) return numbers;
  return numbers.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Aplica máscara de CNPJ (XX.XXX.XXX/XXXX-XX).
 * @param {string} value - Valor com ou sem formatação
 * @returns {string}
 */
export function formatCnpj(value) {
  if (!value) return '';
  const numbers = String(value).replace(/\D/g, '');
  if (numbers.length < 14) return numbers;
  return numbers.slice(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Aplica máscara de telefone: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.
 * @param {string} value - Valor com ou sem formatação
 * @returns {string}
 */
export function formatPhone(value) {
  if (!value) return '';
  const numbers = String(value).replace(/\D/g, '');
  if (numbers.length <= 2) return numbers.length ? `(${numbers}` : '';
  if (numbers.length <= 6) return numbers.replace(/(\d{2})(\d{1,4})/, '($1) $2');
  if (numbers.length <= 10) return numbers.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
  return numbers.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}
