import { Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function WorkflowsPrimaryButtons() {
  const navigate = useNavigate()

  return (
    <Button
      onClick={() => navigate({ to: '/workflows/new' })}
      className="space-x-1"
    >
      <span>Novo workflow</span>
      <Plus size={18} />
    </Button>
  )
}
