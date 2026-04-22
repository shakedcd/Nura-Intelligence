// Compact SVG risk graph for the agent panel
const MINI_NODES = [
  { id: 's',  x: 90,  y: 70,  r: 14, color: '#ef4444', label: 'Mizrahi',   isNew: false },
  { id: 'gl', x: 165, y: 28,  r: 11, color: '#f97316', label: 'Logistics',  isNew: true  },
  { id: 'w',  x: 20,  y: 28,  r: 11, color: '#f97316', label: 'Warehouse',  isNew: true  },
  { id: 'c',  x: 175, y: 90,  r: 10, color: '#fbbf24', label: 'Cohen',      isNew: false },
  { id: 'b',  x: 18,  y: 108, r: 10, color: '#f97316', label: 'Bank',       isNew: false },
  { id: 'sw', x: 148, y: 125, r: 11, color: '#ef4444', label: 'Swiss',      isNew: true  },
]

const MINI_EDGES = [
  { from: 's', to: 'gl', color: '#ef4444', dashed: false },
  { from: 's', to: 'w',  color: '#f97316', dashed: false },
  { from: 's', to: 'c',  color: '#4a6fa5', dashed: false },
  { from: 'gl', to: 'b', color: '#ef4444', dashed: false },
  { from: 'c', to: 'gl', color: '#f97316', dashed: false },
  { from: 'gl', to: 'sw', color: '#ef4444', dashed: true },
]

function getPos(id) {
  return MINI_NODES.find(n => n.id === id)
}

export default function MiniRiskGraph() {
  return (
    <svg viewBox="0 0 200 150" className="w-full" style={{ height: 110 }}>
      <defs>
        <marker id="mini-arrow" markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 5 2, 0 4" fill="#4a6fa5" />
        </marker>
        {['#ef4444', '#f97316', '#4a6fa5'].map(c => (
          <marker key={c} id={`mini-arrow-${c.slice(1)}`} markerWidth="5" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 5 2, 0 4" fill={c} />
          </marker>
        ))}
      </defs>

      {/* Edges */}
      {MINI_EDGES.map((e, i) => {
        const f = getPos(e.from), t = getPos(e.to)
        const dx = t.x - f.x, dy = t.y - f.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const x1 = f.x + (dx / dist) * (f.r + 1)
        const y1 = f.y + (dy / dist) * (f.r + 1)
        const x2 = t.x - (dx / dist) * (t.r + 4)
        const y2 = t.y - (dy / dist) * (t.r + 4)
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={e.color}
            strokeWidth="1"
            strokeOpacity="0.5"
            strokeDasharray={e.dashed ? '3 2' : '0'}
            markerEnd={`url(#mini-arrow-${e.color.slice(1)})`}
          />
        )
      })}

      {/* Nodes */}
      {MINI_NODES.map(n => (
        <g key={n.id}>
          {n.isNew && (
            <circle cx={n.x} cy={n.y} r={n.r + 4} fill="none" stroke={n.color} strokeWidth="1" strokeOpacity="0.3">
              <animate attributeName="r" values={`${n.r + 2};${n.r + 7};${n.r + 2}`} dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
            </circle>
          )}
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.color + '25'} stroke={n.color} strokeWidth="1.5" />
          <text x={n.x} y={n.y + 3.5} textAnchor="middle" fontSize="7" fill={n.color} fontWeight="600">
            {n.label.slice(0, 3)}
          </text>
        </g>
      ))}
    </svg>
  )
}
