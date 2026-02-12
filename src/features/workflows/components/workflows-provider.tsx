import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Workflow } from '@/api/workflows'

type WorkflowsDialogType = 'delete'

type WorkflowsContextType = {
  open: WorkflowsDialogType | null
  setOpen: (str: WorkflowsDialogType | null) => void
  currentWorkflow: Workflow | null
  setCurrentWorkflow: React.Dispatch<React.SetStateAction<Workflow | null>>
}

const WorkflowsContext = React.createContext<WorkflowsContextType | null>(null)

export function WorkflowsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<WorkflowsDialogType>(null)
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null)

  return (
    <WorkflowsContext.Provider
      value={{ open, setOpen, currentWorkflow, setCurrentWorkflow }}
    >
      {children}
    </WorkflowsContext.Provider>
  )
}

export function useWorkflows() {
  const ctx = React.useContext(WorkflowsContext)
  if (!ctx) throw new Error('useWorkflows must be used within WorkflowsProvider')
  return ctx
}
