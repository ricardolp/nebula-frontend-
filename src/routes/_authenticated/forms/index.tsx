import { createFileRoute } from '@tanstack/react-router'
import { Forms } from '@/features/forms'

export const Route = createFileRoute('/_authenticated/forms/')({
  component: Forms,
})
