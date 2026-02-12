import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

const ACTION_LABELS = {
  create: 'Criação',
  update: 'Atualização',
};

const TYPE_LABELS = {
  material: 'Material',
  partner: 'Partner',
};

// ----------------------------------------------------------------------

export function WorkflowTableFiltersResult({
  filters,
  totalResults,
  onResetPage,
  onResetAll,
  sx,
}) {
  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    filters.setState({ name: '' });
  }, [filters, onResetPage]);

  const handleRemoveAction = useCallback(() => {
    onResetPage();
    filters.setState({ action: 'all' });
  }, [filters, onResetPage]);

  const handleRemoveType = useCallback(() => {
    onResetPage();
    filters.setState({ type: 'all' });
  }, [filters, onResetPage]);

  return (
    <FiltersResult
      totalResults={totalResults}
      onReset={onResetAll || filters.onResetState}
      sx={sx}
    >
      <FiltersBlock label="Tipo:" isShow={filters.state.type !== 'all'}>
        <Chip
          {...chipProps}
          label={TYPE_LABELS[filters.state.type] || filters.state.type}
          onDelete={handleRemoveType}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Ação:" isShow={filters.state.action !== 'all'}>
        <Chip
          {...chipProps}
          label={ACTION_LABELS[filters.state.action] || filters.state.action}
          onDelete={handleRemoveAction}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Nome:" isShow={!!filters.state.name}>
        <Chip {...chipProps} label={filters.state.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
