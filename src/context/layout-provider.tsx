import * as React from 'react'

type LayoutContextType = Record<string, unknown>

const LayoutContext = React.createContext<LayoutContextType | null>(null)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const value: LayoutContextType = {}
  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const ctx = React.useContext(LayoutContext)
  return ctx ?? {}
}
