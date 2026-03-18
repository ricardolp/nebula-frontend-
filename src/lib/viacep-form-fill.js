/**
 * Mapeia resposta ViaCEP para campos do formulário (por id de campo ou por nome do campo).
 */
import { formatCep } from 'src/lib/masks';

function normCampo(c) {
  return String(c || '').toLowerCase().trim();
}

function normTab(t) {
  return String(t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim();
}

/** Address, endereco, endereço → mesmo grupo (API / formulário variam o nome da tabela) */
function isAddressLikeTabela(t) {
  const n = normTab(t);
  return (
    n === 'address' ||
    n === 'endereco' ||
    n === 'enderereco' ||
    n.startsWith('address') ||
    n.includes('endereco')
  );
}

const RUA = ['rua', 'stras', 'street', 'logradouro', 'endereco_rua', 'nome_rua', 'addr1', 'address1'];
const CIDADE = ['cidade', 'city', 'ort01', 'localidade', 'municipio', 'nome_cidade'];
const ESTADO = ['estado', 'uf', 'regio', 'estado_uf'];

/**
 * Atualizações keyed por field.id (workflow processar solicitação).
 * Prioriza campos na mesma aba/tabela do CEP.
 *
 * @param {Array<{ id: string, campo: string, tabela?: string }>} formFields
 * @param {{ id: string, campo: string, tabela?: string }} cepField
 * @param {{ logradouro: string, bairro: string, localidade: string, uf: string, cep: string, complemento?: string }} data
 * @returns {Record<string, string>}
 */
export function buildViaCepPatchByFieldId(formFields, cepField, data) {
  const tab = normTab(cepField.tabela);

  function pickId(camposLower) {
    const list = formFields.filter((f) => camposLower.includes(normCampo(f.campo)));
    if (!list.length) return null;
    const cepAddr = isAddressLikeTabela(cepField.tabela);
    if (cepAddr) {
      const onAddr = list.filter((f) => isAddressLikeTabela(f.tabela));
      if (onAddr.length) return onAddr[0].id;
    }
    const sameTab = list.filter((f) => normTab(f.tabela) === tab);
    const chosen = sameTab[0] || list[0];
    return chosen.id;
  }

  const patch = {};
  const cepKey = String(cepField.id);
  patch[cepKey] = formatCep(data.cep);

  const put = (fieldId, v) => {
    if (fieldId != null && v != null && String(v).trim() !== '') patch[String(fieldId)] = v;
  };

  put(pickId(RUA), data.logradouro);
  put(pickId(['bairro', 'bairro_distrito', 'district']), data.bairro);
  put(pickId(CIDADE), data.localidade);
  put(pickId(ESTADO), data.uf);
  put(pickId(['complemento', 'complement']), data.complemento);

  return patch;
}

/**
 * Atualizações keyed por campo (payload da nova solicitação).
 *
 * @param {Array<{ campo: string }>} fields
 * @param {{ logradouro: string, bairro: string, localidade: string, uf: string, cep: string, complemento?: string }} data
 * @returns {Record<string, string>}
 */
export function buildViaCepPatchByCampo(fields, data) {
  const out = {};
  for (const f of fields) {
    const k = normCampo(f.campo);
    if (k === 'cep') out[f.campo] = formatCep(data.cep);
    else if (RUA.includes(k) && data.logradouro) out[f.campo] = data.logradouro;
    else if (k === 'bairro' && data.bairro) out[f.campo] = data.bairro;
    else if (CIDADE.includes(k) && data.localidade) out[f.campo] = data.localidade;
    else if (ESTADO.includes(k) && data.uf) out[f.campo] = data.uf;
    else if (k === 'complemento' && data.complemento) out[f.campo] = data.complemento;
  }
  return out;
}
