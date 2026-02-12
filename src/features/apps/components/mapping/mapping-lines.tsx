'use client'

import { useEffect, useState } from 'react'
import type { DomainFieldId, FieldMapping } from '../../data/domain-schema'
import { DOMAIN_SCHEMA_FIELDS } from '../../data/domain-schema'

type RefsMap = Record<string, HTMLDivElement | null>

type MappingLinesProps = {
  containerRef: React.RefObject<HTMLDivElement | null>
  targetRefsRef: React.RefObject<Record<DomainFieldId, HTMLDivElement | null>>
  sourceRefsRef: React.RefObject<RefsMap>
  mappings: FieldMapping
  refsVersion: number
}

function getCenter(el: HTMLElement | null, container: DOMRect): { x: number; y: number } | null {
  if (!el) return null
  const rect = el.getBoundingClientRect()
  return {
    x: rect.left + rect.width / 2 - container.left,
    y: rect.top + rect.height / 2 - container.top,
  }
}

/** Curva quadrática entre dois pontos (estilo CPI) */
function pathD(
  from: { x: number; y: number },
  to: { x: number; y: number },
  curvature = 0.5
): string {
  const midX = (from.x + to.x) / 2
  const ctrlX = midX + (to.x - from.x) * curvature
  const ctrlY = from.y
  const ctrlY2 = to.y
  return `M ${from.x} ${from.y} C ${ctrlX} ${ctrlY}, ${ctrlX} ${ctrlY2}, ${to.x} ${to.y}`
}

export function MappingLines({
  containerRef,
  targetRefsRef,
  sourceRefsRef,
  mappings,
  refsVersion,
}: MappingLinesProps) {
  const [paths, setPaths] = useState<Array<{ d: string; key: string }>>([])

  const updatePaths = () => {
    const container = containerRef.current
    if (!container) {
      setPaths([])
      return
    }

    const targetRefs = targetRefsRef.current
    const sourceRefs = sourceRefsRef.current
    const containerRect = container.getBoundingClientRect()
    const newPaths: Array<{ d: string; key: string }> = []

    for (const field of DOMAIN_SCHEMA_FIELDS) {
      const mapping = mappings[field.id]
      if (!mapping?.sourcePath) continue

      const targetEl = targetRefs[field.id]
      const sourceEl = sourceRefs[mapping.sourcePath]
      const from = getCenter(sourceEl ?? null, containerRect)
      const to = getCenter(targetEl ?? null, containerRect)

      if (from && to) {
        newPaths.push({
          key: `${field.id}-${mapping.sourcePath}`,
          d: pathD(from, to),
        })
      }
    }

    setPaths(newPaths)
  }

  useEffect(() => {
    updatePaths()
    const container = containerRef.current
    if (!container) return

    const ro = new ResizeObserver(updatePaths)
    ro.observe(container)
    container.addEventListener('scroll', updatePaths, true)
    window.addEventListener('resize', updatePaths)
    return () => {
      ro.disconnect()
      container.removeEventListener('scroll', updatePaths, true)
      window.removeEventListener('resize', updatePaths)
    }
  }, [containerRef, targetRefsRef, sourceRefsRef, mappings, refsVersion])

  if (paths.length === 0) return null

  return (
    <svg
      className='pointer-events-none absolute inset-0 h-full w-full'
      aria-hidden
    >
      <defs>
        <marker
          id='mapping-arrow'
          markerWidth='8'
          markerHeight='8'
          refX='6'
          refY='4'
          orient='auto'
        >
          <path d='M0,0 L8,4 L0,8 Z' fill='hsl(var(--primary))' />
        </marker>
      </defs>
      {paths.map(({ key, d }) => (
        <path
          key={key}
          d={d}
          fill='none'
          stroke='hsl(var(--primary))'
          strokeWidth='2'
          strokeLinecap='round'
          markerEnd='url(#mapping-arrow)'
        />
      ))}
    </svg>
  )
}
