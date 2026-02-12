import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { getOrganizationWorkflow } from 'src/actions/workflows';

import { WorkflowWizardPage } from 'src/features/workflows/components/workflow-wizard-page';
import { WorkflowEditSkeleton } from 'src/features/workflows/components/workflow-edit-skeleton';

// ----------------------------------------------------------------------

const metadata = { title: `Editar workflow | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedOrganizationId } = useAuthContext();
  const organizationId = selectedOrganizationId ?? null;

  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWorkflow = useCallback(async () => {
    if (!organizationId || !id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getOrganizationWorkflow(organizationId, id);
      setWorkflow(data);
    } catch (err) {
      setError(err?.message || 'Erro ao carregar workflow.');
    } finally {
      setLoading(false);
    }
  }, [organizationId, id]);

  useEffect(() => {
    loadWorkflow();
  }, [loadWorkflow]);

  const backTo = useCallback(() => {
    navigate(paths.dashboard.workflows.root);
  }, [navigate]);

  const redirectToEdit = useCallback(
    (workflowId) => {
      navigate(paths.dashboard.workflows.edit(workflowId));
    },
    [navigate]
  );

  if (loading) {
    return (
      <>
        <Helmet>
          <title>{metadata.title}</title>
        </Helmet>
        <DashboardContent>
          <Box sx={{ py: 3 }}>
            <WorkflowEditSkeleton />
          </Box>
        </DashboardContent>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>{metadata.title}</title>
        </Helmet>
        <DashboardContent>
          <Box sx={{ py: 3 }}>
            <Typography color="error">{error}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <Box component="span" sx={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={backTo}>
                Voltar para a listagem
              </Box>
            </Typography>
          </Box>
        </DashboardContent>
      </>
    );
  }

  if (!workflow) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>
      <DashboardContent>
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Editar workflow
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Configure tipo, ação e passos do workflow.
          </Typography>
          <WorkflowWizardPage
            workflowId={id}
            initialWorkflow={workflow}
            isNew={false}
            goToList={backTo}
            goToEdit={redirectToEdit}
          />
        </Box>
      </DashboardContent>
    </>
  );
}
