import { useEffect, useState } from 'react';
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { SignedIn, useAuth, UserButton } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';

export const Route = createFileRoute('/clerk/_authenticated/user-management')({
  component: UserManagement,
});

function UserManagement() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: 32, height: 32 }} />
      </Box>
    );
  }

  if (!isSignedIn) {
    return <Unauthorized />;
  }

  return (
    <SignedIn>
      <DashboardContent>
        <Typography variant="h5" gutterBottom>
          User List
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Manage your users and their roles. Use the main dashboard for the full user table.
        </Typography>
        <Button component={Link} to="/dashboard/user/list" variant="contained">
          Open User list
        </Button>
        <Box sx={{ position: 'fixed', top: 16, right: 16 }}>
          <UserButton />
        </Box>
      </DashboardContent>
    </SignedIn>
  );
}

const COUNTDOWN = 5;

function Unauthorized() {
  const navigate = useNavigate();
  const { history } = useRouter();
  const [cancelled, setCancelled] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN);

  useEffect(() => {
    if (cancelled) return undefined;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cancelled]);

  useEffect(() => {
    if (countdown > 0) return;
    navigate({ to: '/clerk/sign-in' });
  }, [countdown, navigate]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm">
        <Typography variant="h1" sx={{ fontSize: '7rem', fontWeight: 700 }}>
          401
        </Typography>
        <Typography variant="h6">Unauthorized Access</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          You must be authenticated via Clerk to access this resource.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => history.go(-1)}>
            Go Back
          </Button>
          <Button variant="contained" onClick={() => navigate({ to: '/clerk/sign-in' })}>
            Sign in
          </Button>
        </Box>
        {!cancelled && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography>
              {countdown > 0
                ? `Redirecting to Sign In page in ${countdown}s`
                : 'Redirecting...'}
            </Typography>
            <Button size="small" onClick={() => setCancelled(true)}>
              Cancel Redirect
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
