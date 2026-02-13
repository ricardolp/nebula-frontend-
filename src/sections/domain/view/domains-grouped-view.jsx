import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { EmptyContent } from 'src/components/empty-content';

import { getOrganizationDomainsGrouped } from 'src/actions/domains';

import { DomainGroupCard } from '../domain-group-card';

// ----------------------------------------------------------------------

export function DomainsGroupedView() {
  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [groupedDomains, setGroupedDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGrouped = useCallback(async () => {
    if (!organizationId) {
      setGroupedDomains([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { groupedDomains: data } = await getOrganizationDomainsGrouped(organizationId);
      setGroupedDomains(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Erro ao carregar domínios');
      setGroupedDomains([]);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    loadGrouped();
  }, [loadGrouped]);

  const isEmpty = !organizationId || (!loading && groupedDomains.length === 0);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Domínios agrupados"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Domínios', href: paths.dashboard.domains.root },
          { name: 'Agrupados' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {loading && (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
          <CircularProgress />
        </Stack>
      )}

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && isEmpty && !error && (
        <EmptyContent
          filled
          title={organizationId ? 'Nenhum domínio encontrado' : 'Selecione uma organização'}
          description={organizationId ? '' : 'Selecione uma organização no seletor do cabeçalho.'}
          sx={{ py: 10 }}
        />
      )}

      {!loading && groupedDomains.length > 0 && (
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
        >
          {groupedDomains.map((item) => (
            <DomainGroupCard
              key={item.tabela}
              tabela={item.tabela}
              count={item.count ?? 0}
            />
          ))}
        </Box>
      )}
    </DashboardContent>
  );
}
