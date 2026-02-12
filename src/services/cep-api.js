/**
 * Busca de CEP via ViaCEP.
 * Retorna logradouro, bairro, localidade, uf, cep.
 */

const VIACEP_URL = 'https://viacep.com.br/ws';

/**
 * Remove caracteres não numéricos do CEP.
 * @param {string} cep
 * @returns {string}
 */
function onlyDigits(cep) {
  return String(cep || '').replace(/\D/g, '');
}

/**
 * Busca endereço pelo CEP.
 * @param {string} cep - CEP com ou sem máscara (8 dígitos)
 * @returns {Promise<{ logradouro: string, bairro: string, localidade: string, uf: string, cep: string }>}
 * @throws {Error} Se CEP inválido ou não encontrado
 */
export async function searchCep(cep) {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos');
  }

  const url = `${VIACEP_URL}/${digits}/json/`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Erro ao consultar CEP. Tente novamente.');
  }

  const data = await res.json();

  if (data.erro === true) {
    throw new Error('CEP não encontrado');
  }

  return {
    logradouro: data.logradouro || '',
    bairro: data.bairro || '',
    localidade: data.localidade || '',
    uf: data.uf || '',
    cep: data.cep || digits,
  };
}
