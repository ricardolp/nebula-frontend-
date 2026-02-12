import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { useAuthContext } from 'src/auth/hooks';
import { getOrganizationWorkflowRequest } from 'src/actions/workflow-requests';
import { getOrganizationMe } from 'src/actions/users';
import { WorkflowRequestDetailsView } from 'src/sections/workflow-request/view';

// ----------------------------------------------------------------------

const metadata = { title: `Solicitação | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserOrganizationRoleId, setCurrentUserOrganizationRoleId] = useState(null);

  useEffect(() => {
    if (!organizationId) {
      setCurrentUserOrganizationRoleId(null);
      return;
    }
    getOrganizationMe(organizationId)
      .then((data) => {
        setCurrentUserOrganizationRoleId(data?.organizationRoleId ?? null);
      })
      .catch(() => {
        setCurrentUserOrganizationRoleId(null);
      });
  }, [organizationId]);

  const loadRequest = useCallback(() => {
    if (!organizationId || !requestId) {
      setRequest(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    getOrganizationWorkflowRequest(organizationId, requestId)
      .then((data) => {
        setRequest(data);
      })
      .catch((err) => {
        setError(err?.message || 'Erro ao carregar solicitação');
        setRequest(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [organizationId, requestId]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  const handleBack = () => {
    navigate(paths.dashboard.workflowRequests.root);
  };

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <DashboardContent>
        {error && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'error.lighter',
              color: 'error.darker',
            }}
          >
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <Typography variant="body2" color="text.secondary">
              Carregando solicitação…
            </Typography>
          </Box>
        )}

        {!loading && !error && request && (
          <WorkflowRequestDetailsView
            request={request}
            organizationId={organizationId}
            onBack={handleBack}
            onSuccess={loadRequest}
            currentUserOrganizationRoleId={currentUserOrganizationRoleId}
          />
        )}
      </DashboardContent>
    </>
  );
}
