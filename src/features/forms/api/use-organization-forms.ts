import { useAuthStore } from '@/stores/auth-store'

/** Forms API request disabled to avoid CORS issues - returns empty list */
export function useOrganizationForms() {
  const organizationId = useAuthStore((s) => s.auth.organizationId)

  return {
    forms: [] as never[],
    isLoading: false,
    isPending: false,
    error: null,
    refetch: async () => {},
  }
}
