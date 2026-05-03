'use client'

import { useState } from 'react'
import ListView from './ListView'
import DetailPanel from './DetailPanel'
import SearchFilterBar, { Filters } from './SearchFilterBar'

export type Node = {
  id: string
  label: string
  description: string
  type: 'root' | 'module' | 'app' | 'feature' | 'infrastructure'
  status: 'planned' | 'in-progress' | 'done'
  phase: number
  parent?: string
  code?: string
  milestone?: string
  x?: number
  y?: number
}

type Props = {
  nodes: Node[]
  version: string
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  phases: [1, 2, 3],
  statuses: ['planned', 'in-progress', 'done'],
  types: ['module', 'app', 'feature', 'infrastructure'],
}

export default function RoadmapApp({ nodes, version }: Props) {
  const [selected, setSelected] = useState<Node | null>(null)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  const displayable = nodes.filter(n => n.type !== 'root')

  const filtered = displayable.filter(n => {
    if (!filters.phases.includes(n.phase)) return false
    if (!filters.statuses.includes(n.status)) return false
    if (!filters.types.includes(n.type)) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!n.label.toLowerCase().includes(q) &&
          !n.description.toLowerCase().includes(q) &&
          !(n.code?.toLowerCase().includes(q))) return false
    }
    return true
  })

  // When filtering, also include ancestor modules/apps so hierarchy renders correctly
  const filteredIds = new Set(filtered.map(n => n.id))
  const visibleIds = new Set<string>()
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]))

  filtered.forEach(n => {
    visibleIds.add(n.id)
    // walk up and include parents so grouping still renders
    let cur = n.parent ? byId[n.parent] : null
    while (cur && cur.type !== 'root') {
      visibleIds.add(cur.id)
      cur = cur.parent ? byId[cur.parent] : null
    }
  })

  const visibleNodes = nodes.filter(n => visibleIds.has(n.id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Toolbar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 24px',
        height: 52,
        borderBottom: '1px solid var(--border)',
        background: 'var(--white)',
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 15, letterSpacing: '-0.3px' }}>
          Indonesia System
        </span>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--white)',
          background: 'var(--indigo)',
          borderRadius: 4,
          padding: '2px 7px',
          letterSpacing: '0.2px',
        }}>
          v{version}
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>Roadmap</span>
      </header>

      {/* Search + Filter bar */}
      <SearchFilterBar
        filters={filters}
        onChange={setFilters}
        total={displayable.length}
        visible={filtered.length}
      />

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <ListView
          nodes={visibleNodes}
          allNodes={nodes}
          selected={selected}
          onSelect={setSelected}
          isFiltering={!!filters.search || filters.phases.length < 3}
        />
        <DetailPanel node={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  )
}
