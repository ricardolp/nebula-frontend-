'use client'

import * as React from 'react'
import { setCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'

type SidebarContextType = {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}

type SidebarProviderProps = {
  children: React.ReactNode
  defaultOpen?: boolean
}

export function SidebarProvider({ children, defaultOpen = true }: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const toggle = React.useCallback(() => setOpen((o) => !o), [])
  const value = React.useMemo(() => ({ open, setOpen, toggle }), [open, toggle])
  React.useEffect(() => {
    setCookie('sidebar_state', open ? 'true' : 'false')
  }, [open])
  return (
    <SidebarContext.Provider value={value}>
      <div className="flex h-full w-full">{children}</div>
    </SidebarContext.Provider>
  )
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { collapsible?: 'icon' | 'offcanvas' | 'none' }
>(function Sidebar({ className, children, collapsible = 'icon', ...props }, ref) {
  const { open } = useSidebar()
  return (
    <aside
      ref={ref}
      data-state={open ? 'expanded' : 'collapsed'}
      data-collapsible={collapsible}
      className={cn(
        'flex h-full flex-col border-r border-border bg-muted/30 text-foreground transition-[width] duration-200 ease-linear shrink-0',
        open ? 'w-[var(--sidebar-width)]' : 'w-[var(--sidebar-width-icon)]',
        collapsible === 'offcanvas' && 'fixed inset-y-0 z-50 translate-x-0',
        collapsible === 'offcanvas' && !open && '-translate-x-full',
        className
      )}
      style={
        {
          '--sidebar-width': '16rem',
          '--sidebar-width-icon': '3rem',
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </aside>
  )
})
Sidebar.displayName = 'Sidebar'

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function SidebarInset({ className, ...props }, ref) {
  return (
    <main
      ref={ref}
      className={cn(
        'relative flex min-h-0 flex-1 flex-col',
        'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))]',
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = 'SidebarInset'

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function SidebarContent({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn('flex min-h-0 flex-1 flex-col gap-2 overflow-auto', className)}
      {...props}
    />
  )
})
SidebarContent.displayName = 'SidebarContent'

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function SidebarGroup({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn('flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = 'SidebarGroup'

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function SidebarGroupLabel({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-muted-foreground',
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = 'SidebarGroupLabel'

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function SidebarGroupContent({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    />
  )
})
SidebarGroupContent.displayName = 'SidebarGroupContent'

type SidebarMenuButtonProps = React.ComponentProps<'button'> & {
  isActive?: boolean
  tooltip?: string
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(function SidebarMenuButton(
  { className, isActive, children, ...props },
  ref
) {
  return (
    <button
      type="button"
      ref={ref}
      data-sidebar="menu-button"
      data-active={isActive}
      className={cn(
        'flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground disabled:pointer-events-none disabled:opacity-50',
        'data-[active=true]:bg-muted data-[active=true]:text-foreground',
        '[&_svg]:size-4 [&_svg]:shrink-0',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
SidebarMenuButton.displayName = 'SidebarMenuButton'

export function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  const { toggle, open } = useSidebar()
  return (
    <button
      type="button"
      aria-label={open ? 'Recolher menu' : 'Expandir menu'}
      onClick={toggle}
      className={cn(
        'flex size-9 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
        className
      )}
      {...props}
    >
      {open ? (
        <PanelLeftClose className="size-4" />
      ) : (
        <PanelLeftOpen className="size-4" />
      )}
    </button>
  )
}

// Icons for trigger (inline to avoid extra import from app-sidebar)
function PanelLeftClose(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m16 15-3-3 3-3" />
    </svg>
  )
}
function PanelLeftOpen(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m14 9 3 3-3 3" />
    </svg>
  )
}
