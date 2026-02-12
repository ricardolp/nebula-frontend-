import { createContext, useContext, type ReactNode } from 'react'

export interface WorkflowRequestsRouterContextValue {
  goToRequest: (requestId: string) => void
  goToNew: () => void
  goToList: () => void
}

const WorkflowRequestsRouterContext =
  createContext<WorkflowRequestsRouterContextValue | null>(null)

export function WorkflowRequestsRouterProvider({
  value,
  children,
}: {
  value: WorkflowRequestsRouterContextValue
  children: ReactNode
}) {
  return (
    <WorkflowRequestsRouterContext.Provider value={value}>
      {children}
    </WorkflowRequestsRouterContext.Provider>
  )
}

export function useWorkflowRequestsRouter(): WorkflowRequestsRouterContextValue {
  const ctx = useContext(WorkflowRequestsRouterContext)
  if (!ctx) {
    throw new Error(
      'useWorkflowRequestsRouter must be used within WorkflowRequestsRouterProvider'
    )
  }
  return ctx
}

/** Returns context value or null when used outside provider (e.g. detail page in TanStack route). */
export function useOptionalWorkflowRequestsRouter(): WorkflowRequestsRouterContextValue | null {
  return useContext(WorkflowRequestsRouterContext)
}
