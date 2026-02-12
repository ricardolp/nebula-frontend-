import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { useDomainsByTable } from '../api/use-domains-by-table'
import { DomainItemsTable } from './domain-items-table'
import { DomainItemsTableSkeleton } from './domain-items-table-skeleton'

type DomainTablePageProps = {
  tabela: string
}

export function DomainTablePage({ tabela }: DomainTablePageProps) {
  const { domains, isLoading } = useDomainsByTable(tabela)

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-col gap-2'>
          <Button variant='ghost' size='sm' className='w-fit -ms-2' asChild>
            <Link to='/domains' className='gap-2'>
              <ArrowLeft className='size-4' />
              Voltar aos catálogos
            </Link>
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Tabela {tabela}
            </h2>
            <p className='text-muted-foreground'>
              Itens do catálogo da tabela {tabela}.
            </p>
          </div>
        </div>

        {isLoading ? (
          <DomainItemsTableSkeleton />
        ) : (
          <DomainItemsTable data={domains} tabela={tabela} />
        )}
    </Main>
  )
}
