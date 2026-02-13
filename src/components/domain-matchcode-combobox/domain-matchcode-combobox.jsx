import { useState, useEffect, useCallback, useMemo } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';

import { getOrganizationDomains } from 'src/actions/domains';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

/**
 * Combobox Matchcode com autocomplete para domínios (ex: agrupamento de contas - TB002).
 * Busca dados na API /api/organizations/:organizationId/domains
 *
 * @param {Object} props
 * @param {string} props.tabela - Nome da tabela (ex: TB002)
 * @param {string} [props.value] - Valor selecionado (valor do domínio)
 * @param {function} props.onChange - Callback (valor) ou (valor, domain) se valueKey='object'
 * @param {string} [props.organizationId] - ID da organização (usa contexto se não informado)
 * @param {Object} [props.queryParams] - Parâmetros extras para a API (campo, status, etc.)
 * @param {string} [props.label='Agrupamento de contas']
 * @param {string} [props.placeholder='Buscar...']
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.required]
 * @param {string} [props.helperText]
 * @param {boolean} [props.error]
 * @param {string} [props.size='medium']
 * @param {boolean} [props.fullWidth=true]
 * @param {number} [props.take=20] - Quantidade de registros por página
 * @param {'valor'|'object'} [props.valueKey='valor'] - Se retorna apenas valor ou objeto completo
 */
export function DomainMatchcodeCombobox({
  tabela,
  value,
  onChange,
  organizationId: organizationIdProp,
  queryParams = {},
  label = 'Agrupamento de contas',
  placeholder = 'Buscar...',
  disabled = false,
  required = false,
  helperText,
  error = false,
  size = 'medium',
  fullWidth = true,
  take = 20,
  valueKey = 'valor',
  slotProps = {},
  ...other
}) {
  const { selectedOrganizationId } = useAuthContext();
  const organizationId = organizationIdProp ?? selectedOrganizationId ?? null;

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchDomains = useCallback(
    async (searchSkip = 0) => {
      if (!organizationId || !tabela) {
        setOptions([]);
        return;
      }

      setLoading(true);
      try {
        const { domains } = await getOrganizationDomains(organizationId, {
          tabela,
          skip: searchSkip,
          take,
          ...queryParams,
        });
        setOptions(domains);
      } catch (err) {
        console.error('DomainMatchcodeCombobox: erro ao buscar domínios', err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [organizationId, tabela, take, queryParams]
  );

  useEffect(() => {
    if (open && organizationId && tabela) {
      fetchDomains();
    }
  }, [open, organizationId, tabela, fetchDomains]);

  const selectedOption = useMemo(() => {
    if (!value) return null;
    return options.find((opt) => opt.valor === value) || null;
  }, [value, options]);

  const handleChange = (event, newValue) => {
    if (valueKey === 'object') {
      onChange?.(newValue?.valor ?? '', newValue);
    } else {
      onChange?.(newValue?.valor ?? '');
    }
  };

  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    return option?.descricaoCampo ? `${option.valor} - ${option.descricaoCampo}` : option.valor ?? '';
  };

  const isDisabled = disabled || !organizationId || !tabela;

  const filterOptions = useCallback((opts, state) => {
    const term = (state.inputValue || '').toLowerCase();
    if (!term) return opts;
    return opts.filter(
      (opt) =>
        (opt.valor || '').toLowerCase().includes(term) ||
        (opt.descricaoCampo || '').toLowerCase().includes(term)
    );
  }, []);

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={selectedOption}
      onChange={handleChange}
      options={options}
      filterOptions={filterOptions}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, val) => option?.valor === val?.valor}
      disabled={isDisabled}
      fullWidth={fullWidth}
      size={size}
      loading={loading}
      renderInput={(inputParams) => (
        <TextField
          {...inputParams}
          label={label}
          placeholder={isDisabled ? 'Selecione a organização e tabela' : placeholder}
          required={required}
          error={error}
          helperText={
            isDisabled && !organizationId
              ? 'Selecione uma organização'
              : isDisabled && !tabela
                ? 'Tabela é obrigatória'
                : helperText
          }
          InputProps={{
            ...inputParams.InputProps,
            ...slotProps.inputProps,
          }}
          {...slotProps.textField}
        />
      )}
      renderOption={(optionProps, option) => (
        <Box component="li" {...optionProps}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {option.valor}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.descricaoCampo}
            </Typography>
          </Box>
        </Box>
      )}
      noOptionsText={loading ? 'Buscando...' : 'Nenhuma opção encontrada'}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            '& .MuiAutocomplete-paper': {
              maxHeight: 300,
            },
          },
          ...slotProps.popper,
        },
        ...slotProps,
      }}
      {...other}
    />
  );
}
