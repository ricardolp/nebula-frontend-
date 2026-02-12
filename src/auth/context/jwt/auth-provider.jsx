import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import { AuthContext } from '../auth-context';
import { getSession, setSession, isValidToken, updateSelectedOrganizationId } from './utils';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: null,
    organizations: [],
    selectedOrganizationId: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const session = getSession();

      if (session?.token && isValidToken(session.token)) {
        await setSession(session);

        const orgs = session.organizations ?? [];
        const validSelectedId =
          session.selectedOrganizationId && orgs.some((o) => o.id === session.selectedOrganizationId)
            ? session.selectedOrganizationId
            : orgs[0]?.id ?? orgs[0]?.slug ?? null;

        setState({
          user: session.user ? { ...session.user, accessToken: session.token } : null,
          organizations: orgs,
          selectedOrganizationId: validSelectedId,
          loading: false,
        });
      } else {
        setState({ user: null, organizations: [], selectedOrganizationId: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, organizations: [], selectedOrganizationId: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const setSelectedOrganizationId = useCallback(
    (organizationId) => {
      if (!organizationId) return;
      updateSelectedOrganizationId(organizationId);
      setState({ selectedOrganizationId: organizationId });
    },
    [setState]
  );

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      organizations: state.organizations ?? [],
      selectedOrganizationId: state.selectedOrganizationId,
      setSelectedOrganizationId,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [
      checkUserSession,
      setSelectedOrganizationId,
      state.user,
      state.organizations,
      state.selectedOrganizationId,
      status,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
