export const fallbackLng = 'pt';
export const languages = ['pt', 'en', 'es'];
export const defaultNS = 'common';
export const cookieName = 'i18next';

// ----------------------------------------------------------------------

export function i18nOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    lng,
    fallbackLng,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
    supportedLngs: languages,
  };
}

// ----------------------------------------------------------------------

export const changeLangMessages = {
  pt: {
    success: 'Idioma alterado!',
    error: 'Erro ao alterar o idioma!',
    loading: 'Carregando...',
  },
  en: {
    success: 'Language has been changed!',
    error: 'Error changing language!',
    loading: 'Loading...',
  },
  es: {
    success: '¡Idioma cambiado!',
    error: '¡Error al cambiar el idioma!',
    loading: 'Cargando...',
  },
};
