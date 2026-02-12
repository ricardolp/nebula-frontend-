import { useForms } from './forms-provider'
import { FormsDeleteDialog } from './forms-delete-dialog'

export function FormsDialogs() {
  const { open, currentForm, setOpen } = useForms()

  return (
    <>
      <FormsDeleteDialog
        open={open === 'delete'}
        onOpenChange={(o) => setOpen(o ? 'delete' : null)}
        form={currentForm}
      />
    </>
  )
}
