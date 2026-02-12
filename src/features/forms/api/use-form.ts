import type { Form } from '@/api/forms'
import { useAuthStore } from '@/stores/auth-store'

/** Form API request disabled to avoid CORS issues - returns null */
export function useForm(formId: string | undefined, _enabled: boolean) {
  const organizationId = useAuthStore((s) => s.auth.organizationId)

  return {
    form: undefined as Form | undefined,
    isLoading: false,
    isPending: false,
    error: null,
    refetch: async () => {},
  }
}
