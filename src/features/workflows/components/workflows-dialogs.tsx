import { useWorkflows } from './workflows-provider'
import { WorkflowsDeleteDialog } from './workflows-delete-dialog'

export function WorkflowsDialogs() {
  const { open, currentWorkflow, setOpen } = useWorkflows()

  return (
    <WorkflowsDeleteDialog
      open={open === 'delete'}
      onOpenChange={(o) => setOpen(o ? 'delete' : null)}
      workflow={currentWorkflow}
    />
  )
}
