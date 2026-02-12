import { createFileRoute } from '@tanstack/react-router'
import { WorkflowSlaListView } from 'src/sections/workflow-sla/view'

export const Route = createFileRoute('/_authenticated/workflow-slas/')({
  component: WorkflowSlaListView,
})
