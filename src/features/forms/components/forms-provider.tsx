import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Form } from '@/api/forms'

type FormsDialogType = 'delete'

type FormsContextType = {
  open: FormsDialogType | null
  setOpen: (str: FormsDialogType | null) => void
  currentForm: Form | null
  setCurrentForm: React.Dispatch<React.SetStateAction<Form | null>>
}

const FormsContext = React.createContext<FormsContextType | null>(null)

export function FormsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<FormsDialogType>(null)
  const [currentForm, setCurrentForm] = useState<Form | null>(null)

  return (
    <FormsContext.Provider value={{ open, setOpen, currentForm, setCurrentForm }}>
      {children}
    </FormsContext.Provider>
  )
}

export function useForms() {
  const ctx = React.useContext(FormsContext)
  if (!ctx) throw new Error('useForms must be used within FormsProvider')
  return ctx
}
