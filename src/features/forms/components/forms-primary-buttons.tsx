import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormTypeDialog } from './form-type-dialog'

export function FormsPrimaryButtons() {
  const [typeDialogOpen, setTypeDialogOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setTypeDialogOpen(true)} className="space-x-1">
        <span>Criar formulário</span>
        <Plus size={18} />
      </Button>
      <FormTypeDialog open={typeDialogOpen} onOpenChange={setTypeDialogOpen} />
    </>
  )
}
