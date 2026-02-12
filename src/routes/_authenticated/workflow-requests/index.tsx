import { createFileRoute } from '@tanstack/react-router'
import { WorkflowRequestListView } from 'src/sections/workflow-request/view'

export const Route = createFileRoute('/_authenticated/workflow-requests/')({
  component: WorkflowRequestListView,
})
