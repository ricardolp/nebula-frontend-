'use client'

import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  type ApiFieldNode,
  type DomainFieldId,
  type FieldMapping,
} from '../../data/domain-schema'
import { buildApiTreeFromJson } from '../../utils/build-api-tree'
import { OurApiPanel } from './our-api-panel'
import { ApiFieldsPanel } from './api-fields-panel'
import { MappingLines } from './mapping-lines'
import { testIntegration } from '@/api/integrations'

type MappingPanelProps = {
  organizationId: string
  integrationId: string
  token: string
  initialMappings?: FieldMapping
  onMappingsChange?: (mappings: FieldMapping) => void
}

const emptyMappings: FieldMapping = {
  tabela: undefined,
  campo: undefined,
  valor: undefined,
  descricaoCampo: undefined,
}

export function MappingPanel({
  organizationId,
  integrationId,
  token,
  initialMappings = emptyMappings,
  onMappingsChange,
}: MappingPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mappings, setMappings] = useState<FieldMapping>(initialMappings)
  const [selectedTarget, setSelectedTarget] = useState<DomainFieldId | null>(null)
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [apiTree, setApiTree] = useState<ApiFieldNode[] | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [ourSearch, setOurSearch] = useState('')
  const [apiSearch, setApiSearch] = useState('')

  const targetRefsRef = useRef<Record<DomainFieldId, HTMLDivElement | null>>({
    tabela: null,
    campo: null,
    valor: null,
    descricaoCampo: null,
  })
  const sourceRefsRef = useRef<Record<string, HTMLDivElement | null>>({})
  const [refsVersion, setRefsVersion] = useState(0)

  const registerTargetRef = useCallback((fieldId: DomainFieldId, el: HTMLDivElement | null) => {
    if (targetRefsRef.current[fieldId] === el) return
    targetRefsRef.current[fieldId] = el
    requestAnimationFrame(() => setRefsVersion((v) => v + 1))
  }, [])

  const registerSourceRef = useCallback((path: string, el: HTMLDivElement | null) => {
    if (sourceRefsRef.current[path] === el) return
    sourceRefsRef.current[path] = el
    requestAnimationFrame(() => setRefsVersion((v) => v + 1))
  }, [])

  const handleTest = useCallback(async () => {
    setTestLoading(true)
    try {
      const res = await testIntegration(organizationId, integrationId, token)
      const body = res.data.body
      const tree = buildApiTreeFromJson(body)
      setApiTree(tree)
      toast.success('Campos da API carregados')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Falha ao testar integração'
      toast.error(message)
      setApiTree(null)
    } finally {
      setTestLoading(false)
    }
  }, [organizationId, integrationId, token])

  const handleSelectTarget = useCallback((fieldId: DomainFieldId) => {
    if (selectedSource) {
      setMappings((prev) => {
        const next = { ...prev, [fieldId]: { sourcePath: selectedSource } }
        onMappingsChange?.(next)
        return next
      })
      setSelectedSource(null)
      setSelectedTarget(null)
    } else {
      setSelectedTarget(fieldId)
    }
  }, [selectedSource, onMappingsChange])

  const handleSelectSource = useCallback((path: string) => {
    if (selectedTarget) {
      setMappings((prev) => {
        const next = { ...prev, [selectedTarget]: { sourcePath: path } }
        onMappingsChange?.(next)
        return next
      })
      setSelectedSource(null)
      setSelectedTarget(null)
    } else {
      setSelectedSource(path)
    }
  }, [selectedTarget, onMappingsChange])

  return (
    <div
      ref={containerRef}
      className='relative flex min-h-[420px] w-full overflow-hidden rounded-lg border bg-muted/30'
    >
      <div className='flex w-full flex-1 gap-0'>
        <div className='w-[280px] shrink-0 border-r bg-card'>
          <OurApiPanel
            mappings={mappings}
            selectedFieldId={selectedTarget}
            onSelectField={handleSelectTarget}
            search={ourSearch}
            onSearchChange={setOurSearch}
            registerTargetRef={registerTargetRef}
          />
        </div>
        <div className='relative flex-1 min-w-0' style={{ minWidth: 80 }}>
          <MappingLines
            containerRef={containerRef}
            targetRefsRef={targetRefsRef}
            sourceRefsRef={sourceRefsRef}
            mappings={mappings}
            refsVersion={refsVersion}
          />
        </div>
        <div className='w-[280px] shrink-0 border-l bg-card'>
          <ApiFieldsPanel
            nodes={apiTree}
            isLoading={testLoading}
            onTest={handleTest}
            selectedPath={selectedSource}
            onSelectPath={handleSelectSource}
            search={apiSearch}
            onSearchChange={setApiSearch}
            registerSourceRef={registerSourceRef}
          />
        </div>
      </div>
    </div>
  )
}
