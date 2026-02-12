import { paths } from 'src/routes/paths';

import axios from 'src/utils/axios';

import { SESSION_KEY } from './constant';

// ----------------------------------------------------------------------

export function jwtDecode(token) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken) {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded || !('exp' in decoded)) {
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export function tokenExpired(exp) {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  setTimeout(() => {
    try {
      alert('Sessão expirada! Faça login novamente.');
      sessionStorage.removeItem(SESSION_KEY);
      window.location.href = paths.auth.jwt.signIn;
    } catch (error) {
      console.error('Erro ao expirar token:', error);
      throw error;
    }
  }, timeLeft);
}

// ----------------------------------------------------------------------

/**
 * Define ou limpa a sessão.
 * @param {object|null} session - { token, user, organizations, selectedOrganizationId? } ou null para logout
 */
export async function setSession(session) {
  try {
    if (session?.token) {
      const { token, user, organizations } = session;
      const orgs = organizations ?? [];
      const selectedOrganizationId =
        session.selectedOrganizationId ?? (orgs[0]?.id ?? orgs[0]?.slug ?? null);

      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          token,
          user: user ?? null,
          organizations: orgs,
          selectedOrganizationId,
        })
      );

      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      const decodedToken = jwtDecode(token);

      if (decodedToken && 'exp' in decodedToken) {
        tokenExpired(decodedToken.exp);
      } else {
        throw new Error('Token inválido');
      }
    } else {
      sessionStorage.removeItem(SESSION_KEY);
      delete axios.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error('Erro ao definir sessão:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

/**
 * Atualiza apenas a organização selecionada na sessão (sem alterar token/user).
 * @param {string} organizationId - ID da organização selecionada
 */
export function updateSelectedOrganizationId(organizationId) {
  const session = getSession();
  if (session?.token && organizationId) {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ ...session, selectedOrganizationId: organizationId })
    );
  }
}

// ----------------------------------------------------------------------

export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
