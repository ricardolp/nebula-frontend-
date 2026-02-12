import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { CanvasFormField } from '../types'

const schema = z.object({
  campo: z.string().min(1, 'Campo é obrigatório'),
  tabela: z.string().min(1, 'Tabela é obrigatória'),
})

type FormValues = z.infer<typeof schema>

type FormBuilderEditFieldDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  field: CanvasFormField | null
  onSave: (field: CanvasFormField, values: { campo: string; tabela: string }) => void
}

export function FormBuilderEditFieldDialog({
  open,
  onOpenChange,
  field,
  onSave,
}: FormBuilderEditFieldDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { campo: '', tabela: '' },
  })

  useEffect(() => {
    if (field) {
      form.reset({ campo: field.campo, tabela: field.tabela })
    }
  }, [field, form])

  function handleSubmit(values: FormValues) {
    if (!field) return
    onSave(field, values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar campo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="campo"
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Campo (nome técnico)</FormLabel>
                  <FormControl>
                    <Input {...f} placeholder="ex: MATNR" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tabela"
              render={({ field: f }) => (
                <FormItem>
                  <FormLabel>Tabela</FormLabel>
                  <FormControl>
                    <Input {...f} placeholder="ex: MARA" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
