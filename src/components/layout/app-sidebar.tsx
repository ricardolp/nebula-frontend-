import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronDown, ChevronRight } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import type { SidebarNavItem } from './types'
import { useSidebar } from '@/components/ui/sidebar'

function NavItem({ item }: { item: SidebarNavItem }) {
  const [expanded, setExpanded] = useState(true)
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const href = item.url ?? '#'
  const isActive = href !== '#' && pathname === href
  const Icon = item.icon

  if (item.items?.length) {
    const hasActiveChild = item.items.some(
      (sub) => sub.url && pathname === sub.url
    )
    const isOpen = expanded || hasActiveChild

    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <span className="flex size-4 shrink-0 items-center justify-center">
            {isOpen ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </span>
          {Icon && <Icon className="size-4 shrink-0" />}
          <span className="truncate font-medium">{item.title}</span>
        </button>
        {isOpen && (
          <div className="flex flex-col gap-1 pl-4">
            {item.items.map((sub) => (
              <NavItem key={sub.url ?? sub.title} item={sub} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link to={href} className="block">
      <SidebarMenuButton isActive={isActive} className="w-full">
        {Icon && <Icon className="size-4 shrink-0" />}
        <span className="truncate">{item.title}</span>
        {item.badge != null && (
          <span className="ml-auto rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
            {item.badge}
          </span>
        )}
      </SidebarMenuButton>
    </Link>
  )
}

export function AppSidebar() {
  const { open } = useSidebar()
  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-2">
        <SidebarTrigger />
        {open && (
          <span className="text-sm font-semibold truncate">Nebula</span>
        )}
      </div>
      <SidebarContent>
        {sidebarData.navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              {group.items.map((item) => (
                <NavItem key={item.url ?? item.title} item={item} />
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
