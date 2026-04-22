import { useState } from 'react'
import { GRAPH_NODES, GRAPH_EDGES } from '../data/mockData.js'

const TYPE_ICON  = { person: '●', company: '▲', asset: '■', account: '◆', document: '⬟' }
const TYPE_LABEL = { person: 'Person', company: 'Company', asset: 'Asset', account: 'Account', document: 'Document' }
const RISK_COLOR = { critical: '#ef4444', high: '#f97316', medium: '#fbbf24', source: '#4a6fa5' }
const RISK_FILL  = { critical: '#1a0808', high: '#1a0d04', medium: '#1a1504', source: '#07112b' }

function getNodeById(id) {
  return GRAPH_NODES.find(n => n.id === id)
}

function calcEdge(e) {
  const f = getNodeById(e.from)
  const t = getNodeById(e.to)
  const dx = t.x - f.x
  const dy = t.y - f.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const R_FROM = 30, R_TO = 34
  const x1 = f.x + (dx / dist) * R_FROM
  const y1 = f.y + (dy / dist) * R_FROM
  const x2 = t.x - (dx / dist) * R_TO
  const y2 = t.y - (dy / dist) * R_TO

  // Custom control points to avoid routing through Mizrahi
  let cx, cy
  if (e.cx && e.cy) {
    cx = e.cx; cy = e.cy
  } else {
    const curv = 0.12
    cx = (x1 + x2) / 2 - (dy / dist) * dist * curv
    cy = (y1 + y2) / 2 + (dx / dist) * dist * curv
  }

  const t50 = 0.5
  const lx = (1 - t50) * (1 - t50) * x1 + 2 * (1 - t50) * t50 * cx + t50 * t50 * x2
  const ly = (1 - t50) * (1 - t50) * y1 + 2 * (1 - t50) * t50 * cy + t50 * t50 * y2

  return { path: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, lx, ly }
}

function EdgeLabel({ e, calc }) {
  const w = e.label.length * 6 + 12
  return (
    <g>
      <rect
        x={calc.lx - w / 2} y={calc.ly - 9}
        width={w} height={16}
        rx="3" fill="#050a14" fillOpacity="0.85"
        stroke={e.color} strokeWidth="0.5" strokeOpacity="0.35"
      />
      <text
        x={calc.lx} y={calc.ly + 3}
        textAnchor="middle" fontSize="9" fill={e.color} fillOpacity="0.85"
      >
        {e.label}
      </text>
    </g>
  )
}

function NodeGroup({ node, selected, onSelect }) {
  const col = RISK_COLOR[node.risk]
  const fill = RISK_FILL[node.risk]
  const r = 28
  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={() => onSelect(node.id === selected ? null : node.id)}
      style={{ cursor: 'pointer' }}
    >
      {/* Pulse for new nodes */}
      {node.isNew && (
        <circle r={r + 4} fill="none" stroke={col} strokeWidth="1.5">
          <animate attributeName="r" values={`${r};${r + 16};${r}`} dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2.8s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Selection ring */}
      {selected && (
        <circle r={r + 5} fill="none" stroke="#00d4ff" strokeWidth="2" strokeOpacity="0.7" />
      )}

      {/* Main circle */}
      <circle r={r} fill={fill} stroke={selected ? '#00d4ff' : col} strokeWidth={selected ? 2.5 : 1.5} />

      {/* Icon */}
      <text
        textAnchor="middle" dy="5"
        fontSize={node.type === 'document' ? '12' : '14'}
        fill={col}
      >
        {TYPE_ICON[node.type]}
      </text>

      {/* "NEW" badge for newly found nodes */}
      {node.isNew && (
        <g transform={`translate(${r - 6}, ${-r + 6})`}>
          <rect x="-10" y="-7" width="20" height="13" rx="3" fill={col} />
          <text textAnchor="middle" dy="3" fontSize="7.5" fill="white" fontWeight="700">NEW</text>
        </g>
      )}

      {/* Label */}
      <text textAnchor="middle" dy={r + 16} fontSize="11.5" fill="#d1d5db" fontWeight="500">
        {node.label}
      </text>
      <text textAnchor="middle" dy={r + 29} fontSize="9.5" fill="#4a5a7a">
        {node.sublabel}
      </text>
    </g>
  )
}

export default function RiskGraphSVG({ selectedNode, onSelectNode }) {
  const edgeCalcs = GRAPH_EDGES.map(e => ({ e, calc: calcEdge(e) }))

  return (
    <svg
      viewBox="0 0 910 530"
      className="w-full h-full"
      style={{ background: 'transparent' }}
    >
      <defs>
        {Object.entries(RISK_COLOR).map(([k, c]) => (
          <marker
            key={k}
            id={`arrow-${k}`}
            markerWidth="8" markerHeight="6"
            refX="8" refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={c} fillOpacity="0.7" />
          </marker>
        ))}
      </defs>

      {/* Grid dots (subtle background) */}
      {Array.from({ length: 12 }).map((_, col) =>
        Array.from({ length: 8 }).map((_, row) => (
          <circle
            key={`${col}-${row}`}
            cx={50 + col * 75} cy={40 + row * 62}
            r="1" fill="#1a2d45" fillOpacity="0.4"
          />
        ))
      )}

      {/* Edges — draw first so nodes appear on top */}
      {edgeCalcs.map(({ e, calc }, i) => (
        <g key={i}>
          <path
            d={calc.path}
            fill="none"
            stroke={e.color}
            strokeWidth={e.isNew ? 1.8 : 1.2}
            strokeOpacity={e.isNew ? 0.65 : 0.35}
            strokeDasharray={e.dashed ? '6 4' : '0'}
            markerEnd={`url(#arrow-${e.from === 'court_doc' ? 'source' : GRAPH_NODES.find(n => n.id === e.from)?.risk || 'high'})`}
          />
          <EdgeLabel e={e} calc={calc} />
        </g>
      ))}

      {/* Nodes */}
      {GRAPH_NODES.map(node => (
        <NodeGroup
          key={node.id}
          node={node}
          selected={selectedNode === node.id}
          onSelect={onSelectNode}
        />
      ))}

      {/* Legend */}
      <g transform="translate(18, 470)">
        {[
          { color: '#ef4444', label: 'Critical risk' },
          { color: '#f97316', label: 'High risk' },
          { color: '#fbbf24', label: 'Medium risk' },
          { color: '#4a6fa5', label: 'Source document' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 130}, 0)`}>
            <circle cx="6" cy="6" r="5" fill={item.color + '25'} stroke={item.color} strokeWidth="1.5" />
            <text x="15" y="10" fontSize="10" fill="#6b7db3">{item.label}</text>
          </g>
        ))}
        <g transform="translate(520, 0)">
          <line x1="0" y1="6" x2="20" y2="6" stroke="#6b7db3" strokeWidth="1" strokeDasharray="4 3" />
          <text x="25" y="10" fontSize="10" fill="#6b7db3">Suspected connection</text>
        </g>
        <g transform="translate(680, 0)">
          <circle cx="6" cy="6" r="5" fill="#ef444425" stroke="#ef4444" strokeWidth="1.5" />
          <circle cx="6" cy="6" r="9" fill="none" stroke="#ef4444" strokeWidth="0.8" strokeOpacity="0.3" />
          <text x="20" y="10" fontSize="10" fill="#6b7db3">New finding</text>
        </g>
      </g>
    </svg>
  )
}
