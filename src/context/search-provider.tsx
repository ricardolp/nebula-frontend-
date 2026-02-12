import * as React from 'react'

type SearchContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}

const SearchContext = React.createContext<SearchContextType | null>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const ctx = React.useContext(SearchContext)
  if (!ctx) return { open: false, setOpen: () => {} }
  return ctx
}
