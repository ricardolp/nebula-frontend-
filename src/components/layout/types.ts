import type { LucideIcon } from 'lucide-react'

export interface SidebarNavItem {
  title: string
  url?: string
  icon?: LucideIcon
  badge?: string
  items?: SidebarNavItem[]
}

export interface SidebarNavGroup {
  title: string
  items: SidebarNavItem[]
}

export interface SidebarTeam {
  name: string
  logo: LucideIcon
  plan?: string
}

export interface SidebarUser {
  name: string
  email: string
  avatar?: string
}

export interface SidebarData {
  user: SidebarUser
  teams: SidebarTeam[]
  navGroups: SidebarNavGroup[]
}
