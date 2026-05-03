'use client'

import { useState } from 'react'
import ListView from './ListView'
import DetailPanel from './DetailPanel'

export type Node = {
  id: string
  label: string
  description: string
  type: 'root' | 'module' | 'feature' | 'infrastructure'
  status: 'planned' | 'in-progress' | 'done'
  phase: number
  parent?: string
  x?: number
  y?: number
}

type Props = {
  nodes: Node[]
  version: string
}

export default function RoadmapApp({ nodes, version }: Props) {
  const [selected, setSelected] = useState<Node | null>(null)

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

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <ListView nodes={nodes} selected={selected} onSelect={setSelected} />
        <DetailPanel node={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  )
}
