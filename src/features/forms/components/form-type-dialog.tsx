import { Package, Users } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export type FormType = 'material' | 'partner'

type FormTypeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FormTypeDialog({ open, onOpenChange }: FormTypeDialogProps) {
  const navigate = useNavigate()

  const handleSelect = (type: FormType) => {
    onOpenChange(false)
    navigate({ to: '/forms/new', search: { type } })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] min-w-0 flex-col overflow-x-hidden overflow-y-auto sm:max-w-lg">
        <DialogHeader className="shrink-0">
          <DialogTitle>Criar formulário</DialogTitle>
        </DialogHeader>
        <div className="grid min-w-0 shrink-0 gap-3 overflow-x-hidden py-4">
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-start gap-2 p-4 text-left"
            onClick={() => handleSelect('material')}
          >
            <Package className="size-5 shrink-0" />
            Material
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-start gap-2 p-4 text-left"
            onClick={() => handleSelect('partner')}
          >
            <Users className="size-5 shrink-0" />
            Parceiro
          </Button>
        </div>
        <DialogFooter className="shrink-0 border-t pt-4">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
