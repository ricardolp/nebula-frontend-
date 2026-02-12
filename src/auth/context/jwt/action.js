import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';

/** **************************************
 * Sign in (login por senha)
 * POST /api/auth/login
 * Resposta: { success, data: { token, user, organizations } }
 *************************************** */
export const signInWithPassword = async ({ email, password }) => {
  try {
    const res = await axios.post(endpoints.auth.login, { email, password });

    const { success, data } = res.data;

    if (!success || !data?.token) {
      throw new Error('Token não encontrado na resposta');
    }

    setSession({ token: data.token, user: data.user, organizations: data.organizations ?? [] });
  } catch (error) {
    console.error('Erro no login:', error);
    const message =
      error?.response?.data?.message || error?.message || 'Credenciais inválidas. Tente novamente.';
    throw new Error(message);
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName }) => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Token não encontrado na resposta');
    }

    setSession({ token: accessToken, user: null, organizations: [] });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Erro ao sair:', error);
    throw error;
  }
};
