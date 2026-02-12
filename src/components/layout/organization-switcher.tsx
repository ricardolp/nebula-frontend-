import { Building2, Check, ChevronsUpDown } from 'lucide-react'
import type { AuthOrganization } from '@/stores/auth-store'
import { useAuthStore } from '@/stores/auth-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function OrganizationSwitcher() {
  const { isMobile } = useSidebar()
  const { auth } = useAuthStore()

  const organizations = auth.organizations
  const currentOrgId = auth.organizationId
  const currentOrg = organizations.find((org) => org.id === currentOrgId)

  function handleSelect(org: AuthOrganization) {
    auth.selectOrganization(org.id)
  }

  if (organizations.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' className='cursor-default'>
            <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
              <Building2 className='size-4' />
            </div>
            <div className='grid flex-1 text-start text-sm leading-tight'>
              <span className='truncate font-semibold'>Nenhuma organização</span>
              <span className='truncate text-xs text-muted-foreground'>
                Faça login para ver as orgs
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <Building2 className='size-4' />
              </div>
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {currentOrg?.name ?? 'Selecione uma org'}
                </span>
                <span className='truncate text-xs text-muted-foreground'>
                  {currentOrg?.slug ?? organizations.length} organização(ões)
                </span>
              </div>
              <ChevronsUpDown className='ms-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Organizações com acesso
            </DropdownMenuLabel>
            {organizations.map((org) => {
              const isSelected = org.id === currentOrgId
              return (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleSelect(org)}
                  className='gap-2 p-2'
                >
                  <div className='flex size-6 items-center justify-center rounded-sm border'>
                    <Building2 className='size-4 shrink-0 text-muted-foreground' />
                  </div>
                  <div className='grid flex-1 gap-0.5'>
                    <span className='font-medium'>{org.name}</span>
                    <span className='text-xs text-muted-foreground'>{org.slug}</span>
                  </div>
                  {isSelected && (
                    <Check className='size-4 shrink-0 text-primary' />
                  )}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
