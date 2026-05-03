'use client'

import { Node } from './RoadmapApp'

const PHASE_LABELS: Record<number, string> = {
  0: 'Core',
  1: 'Phase 1',
  2: 'Phase 2',
  3: 'Phase 3',
}

const PHASE_COLORS: Record<number, string> = {
  0: 'var(--navy)',
  1: 'var(--indigo)',
  2: 'var(--teal)',
  3: 'var(--amber)',
}

const STATUS_STYLES: Record<string, { background: string; color: string }> = {
  'planned':     { background: 'var(--border)', color: 'var(--slate)' },
  'in-progress': { background: 'var(--indigo-light)', color: 'var(--indigo)' },
  'done':        { background: 'var(--teal-light)', color: 'var(--teal)' },
}

type Props = {
  nodes: Node[]
  selected: Node | null
  onSelect: (node: Node) => void
}

export default function ListView({ nodes, selected, onSelect }: Props) {
  const phases = [0, 1, 2, 3]
  const byPhase = (phase: number) => nodes.filter(n => n.phase === phase)

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
      {phases.map(phase => {
        const group = byPhase(phase)
        if (group.length === 0) return null
        return (
          <section key={phase} style={{ marginBottom: 36 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
            }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: PHASE_COLORS[phase],
                flexShrink: 0,
              }} />
              <h2 style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: PHASE_COLORS[phase],
              }}>
                {PHASE_LABELS[phase]}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {group.map(node => {
                const isSelected = selected?.id === node.id
                const statusStyle = STATUS_STYLES[node.status] ?? STATUS_STYLES['planned']
                return (
                  <button
                    key={node.id}
                    onClick={() => onSelect(node)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 'var(--radius)',
                      border: isSelected
                        ? `1.5px solid ${PHASE_COLORS[phase]}`
                        : '1.5px solid var(--border)',
                      background: isSelected ? 'var(--indigo-light)' : 'var(--white)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--slate)',
                        marginBottom: 2,
                      }}>
                        {node.label}
                      </div>
                      <div style={{
                        fontSize: 13,
                        color: 'var(--muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {node.description}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 4,
                      whiteSpace: 'nowrap',
                      ...statusStyle,
                    }}>
                      {node.status}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
