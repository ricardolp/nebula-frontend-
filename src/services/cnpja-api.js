/**
 * Consulta dados de empresa (estabelecimento) na API CNPJA.
 * GET https://api.cnpja.com/office/{cnpj}
 * CNPJ deve ser enviado apenas com 14 dígitos.
 */

const CNPJA_BASE = 'https://api.cnpja.com';

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

/**
 * Busca dados do estabelecimento pelo CNPJ.
 * @param {string} cnpj - CNPJ com ou sem máscara (14 dígitos)
 * @returns {Promise<object>} Resposta da API (updated, taxId, company, alias, founded, status, address, phones, emails, mainActivity, sideActivities, members, etc.)
 * @throws {Error} Se CNPJ inválido ou API retornar erro
 */
export async function fetchCnpjaOffice(cnpj) {
  const digits = onlyDigits(cnpj);
  if (digits.length !== 14) {
    throw new Error('CNPJ deve ter 14 dígitos');
  }

  const apiKey = import.meta.env.VITE_CNPJA_API_KEY;
  const url = `${CNPJA_BASE}/office/${digits}?simples=true&registrations=ORIGIN&suframa=true`;
  const headers = {
    Accept: 'application/json',
    ...(apiKey ? { Authorization: apiKey } : {}),
  };

  const res = await fetch(url, { method: 'GET', headers });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 404) {
      throw new Error('CNPJ não encontrado');
    }
    throw new Error(text || `Erro ao consultar CNPJ (${res.status})`);
  }

  return res.json();
}
