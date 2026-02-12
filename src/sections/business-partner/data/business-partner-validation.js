/**
 * Validação imperativa do formulário Business Partner.
 * Retorna { valid, errors } para exibição no save.
 */

function trim(s) {
  return typeof s === 'string' ? s.trim() : '';
}

function digitsOnly(s) {
  return String(s || '').replace(/\D/g, '');
}

const CEP_DIGITS = 8;
const CPF_DIGITS = 11;
const CNPJ_DIGITS = 14;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida os valores do formulário Business Partner (campos em camelCase).
 * @param {Record<string, unknown>} values - Estado do formulário
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateBusinessPartnerForm(values) {
  const errors = {};

  // Função obrigatória
  const funcao = trim(values.funcao);
  if (!funcao) {
    errors.funcao = 'Função é obrigatória';
  }

  // Pelo menos um de nome fantasia ou razão social
  const nomeFantasia = trim(values.nomeNomeFantasia);
  const razaoSocial = trim(values.sobrenomeRazaoSocial);
  if (!nomeFantasia && !razaoSocial) {
    errors.nomeNomeFantasia = 'Informe Nome/Nome Fantasia ou Sobrenome/Razão Social';
  }

  // CEP: se preenchido, 8 dígitos (formato 00000-000)
  const cep = trim(values.cep);
  if (cep) {
    const cepDigits = digitsOnly(cep);
    if (cepDigits.length !== CEP_DIGITS) {
      errors.cep = 'CEP deve ter 8 dígitos (formato 00000-000)';
    }
  }

  // CPF: se preenchido, 11 dígitos ou formato XXX.XXX.XXX-XX
  const cpf = trim(values.cpf);
  if (cpf) {
    const cpfDigits = digitsOnly(cpf);
    if (cpfDigits.length !== CPF_DIGITS) {
      errors.cpf = 'CPF deve ter 11 dígitos (formato 000.000.000-00)';
    }
  }

  // CNPJ: se preenchido, 14 dígitos ou formato XX.XXX.XXX/XXXX-XX
  const cnpj = trim(values.cnpj);
  if (cnpj) {
    const cnpjDigits = digitsOnly(cnpj);
    if (cnpjDigits.length !== CNPJ_DIGITS) {
      errors.cnpj = 'CNPJ deve ter 14 dígitos (formato 00.000.000/0000-00)';
    }
  }

  // Email: se preenchido, formato válido
  const email = trim(values.email);
  if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = 'E-mail inválido';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
