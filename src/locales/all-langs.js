// core (MUI)
import {
  ptBR as ptBRCore,
  esES as esESCore,
} from '@mui/material/locale';
// date pickers (MUI)
import {
  enUS as enUSDate,
  ptBR as ptBRDate,
  esES as esESDate,
} from '@mui/x-date-pickers/locales';
// data grid (MUI)
import {
  enUS as enUSDataGrid,
  ptBR as ptBRDataGrid,
  esES as esESDataGrid,
} from '@mui/x-data-grid/locales';

// ----------------------------------------------------------------------

export const allLangs = [
  {
    value: 'pt',
    label: 'Português',
    countryCode: 'BR',
    adapterLocale: 'pt-br',
    numberFormat: { code: 'pt-BR', currency: 'BRL' },
    systemValue: {
      components: { ...ptBRCore.components, ...ptBRDate.components, ...ptBRDataGrid.components },
    },
  },
  {
    value: 'en',
    label: 'English',
    countryCode: 'US',
    adapterLocale: 'en',
    numberFormat: { code: 'en-US', currency: 'USD' },
    systemValue: {
      components: { ...enUSDate.components, ...enUSDataGrid.components },
    },
    disabled: true,
  },
  {
    value: 'es',
    label: 'Español',
    countryCode: 'ES',
    adapterLocale: 'es',
    numberFormat: { code: 'es-ES', currency: 'EUR' },
    systemValue: {
      components: { ...esESCore.components, ...esESDate.components, ...esESDataGrid.components },
    },
    disabled: true,
  },
];

/**
 * Country code:
 * https://flagcdn.com/en/codes.json
 *
 * Number format code:
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */
