import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

/**
 * @param {Object} props
 * @param {Object} props.filters - Filter state object
 * @param {Function} props.onResetPage - Reset page callback
 * @param {number} props.totalResults - Total filtered results count
 * @param {Object} props.sx - Custom styles
 */
export function BusinessPartnerTableFiltersResult({ filters, onResetPage, totalResults, sx }) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    filters.setState({ status: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveTipo = useCallback(
    (inputValue) => {
      const newValue = filters.state.tipo.filter((item) => item !== inputValue);

      onResetPage();
      filters.setState({ tipo: newValue });
    },
    [filters, onResetPage]
  );

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Status:" isShow={filters.state.status !== 'all'}>
        <Chip
          {...chipProps}
          label={filters.state.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Tipo:" isShow={!!filters.state.tipo.length}>
        {filters.state.tipo.map((item) => (
          <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveTipo(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Busca:" isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}

