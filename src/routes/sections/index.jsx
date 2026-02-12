import { Navigate, useRoutes } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { paths } from 'src/routes/paths';

import { authRoutes } from './auth';
import { mainRoutes } from './main';
import { authDemoRoutes } from './auth-demo';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

// ----------------------------------------------------------------------

/**
 * Obtém a rota de login baseada no método de autenticação configurado
 */
function getLoginPath() {
  const { method } = CONFIG.auth;
  switch (method) {
    case 'jwt':
      return paths.auth.jwt.signIn;
    case 'amplify':
      return paths.auth.amplify.signIn;
    case 'firebase':
      return paths.auth.firebase.signIn;
    case 'auth0':
      return paths.auth.auth0.signIn;
    case 'supabase':
      return paths.auth.supabase.signIn;
    default:
      return paths.auth.jwt.signIn;
  }
}

export function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={getLoginPath()} replace />,
    },

    // Auth
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard
    ...dashboardRoutes,

    // Main
    ...mainRoutes,

    // Components
    ...componentsRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
