import { useState } from 'react'
import { ZoomIn, ZoomOut, RefreshCw, Filter, Info, FileText, Link } from 'lucide-react'
import RiskGraphSVG from './RiskGraphSVG.jsx'
import { GRAPH_NODES } from '../data/mockData.js'

const RISK_COLOR = { critical: '#ef4444', high: '#f97316', medium: '#fbbf24', source: '#4a6fa5' }
const TYPE_LABEL = { person: 'Person', company: 'Company', asset: 'Asset', account: 'Account', document: 'Source Document' }

const NODE_DETAILS = {
  suspect:   { desc: 'Primary subject of investigation. Declared income of ₪60,000 — contradicted by multiple unstructured sources.',            connections: 4, risk: 'critical' },
  logistics: { desc: 'Undeclared company. Discovered in court deposition. Estimated revenue ₪4.2M. Mizrahi identified as controlling interest.', connections: 3, risk: 'high'     },
  warehouse: { desc: 'Physical asset in Haifa port district. Undeclared. Linked to Golden Logistics Ltd operations.',                             connections: 2, risk: 'high'     },
  cohen:     { desc: 'Known associate with prior import-export irregularity investigation. Listed director of Golden Logistics Ltd.',             connections: 2, risk: 'medium'   },
  bank:      { desc: 'Undeclared bank account. Linked to financial flows from Golden Logistics Ltd.',                                             connections: 1, risk: 'high'     },
  swiss:     { desc: 'Offshore entity in Switzerland. 67% beneficial owner matches profile of Israeli tax resident. No IL tax ID provided.',     connections: 1, risk: 'critical' },
  court_doc: { desc: 'Court deposition providing primary evidence of Mizrahi\'s undeclared business interests. Haifa District Court, 2023.',     connections: 1, risk: 'source'   },
}

export default function RiskGraphView() {
  const [selectedNode, setSelectedNode] = useState(null)

  const selected = selectedNode ? GRAPH_NODES.find(n => n.id === selectedNode) : null
  const detail   = selectedNode ? NODE_DETAILS[selectedNode] : null

  return (
    <div className="flex h-full">
      {/* Graph area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#060b14]">
        {/* Toolbar */}
        <div className="h-10 border-b border-[#0f1e33] flex items-center px-4 gap-3">
          <span className="text-[11px] text-slate-500 uppercase tracking-widest font-medium">Risk Graph — CASE-2024-0847</span>
          <div className="ml-auto flex items-center gap-1">
            {[
              { icon: ZoomIn,    title: 'Zoom in'  },
              { icon: ZoomOut,   title: 'Zoom out' },
              { icon: RefreshCw, title: 'Reset'    },
              { icon: Filter,    title: 'Filter'   },
            ].map(({ icon: Icon, title }) => (
              <button
                key={title}
                title={title}
                className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:text-slate-300 hover:bg-[#0f1e33] transition-all"
              >
                <Icon size={13} />
              </button>
            ))}
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5">
            {['All', 'New findings', 'High risk', 'Undeclared'].map(f => (
              <button
                key={f}
                className={`text-[10px] px-2 py-1 rounded-full border transition-all ${
                  f === 'All'
                    ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                    : 'border-[#1a2d45] text-slate-500 hover:text-slate-300 hover:border-[#2a3d55]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[10px] text-slate-600">7 nodes · 8 edges</span>
            <span className="text-[10px] text-cyan-400 font-medium">· 3 new from unstructured</span>
          </div>
        </div>

        {/* SVG canvas */}
        <div className="flex-1 p-2 overflow-hidden">
          <RiskGraphSVG selectedNode={selectedNode} onSelectNode={setSelectedNode} />
        </div>

        {!selectedNode && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[11px] text-slate-600 flex items-center gap-1.5 pointer-events-none">
            <Info size={11} />
            Click a node to inspect its details and source documents
          </div>
        )}
      </div>

      {/* Node detail panel */}
      <div className="w-72 flex-shrink-0 bg-[#060b17] border-l border-[#1a2d45] flex flex-col">
        <div className="px-4 py-3 border-b border-[#1a2d45]">
          <span className="text-[11px] text-slate-500 uppercase tracking-widest font-medium">Node Inspector</span>
        </div>

        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-6">
            <div className="w-10 h-10 rounded-full bg-[#0f1e33] flex items-center justify-center">
              <Info size={16} className="text-slate-600" />
            </div>
            <p className="text-[12px] text-slate-600">Select a node in the graph to inspect its details and linked source documents.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            {/* Node header */}
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 border"
                style={{
                  background: RISK_COLOR[selected.risk] + '18',
                  borderColor: RISK_COLOR[selected.risk] + '40',
                  color: RISK_COLOR[selected.risk],
                }}
              >
                {selected.type === 'person' ? '●' : selected.type === 'company' ? '▲' : selected.type === 'asset' ? '■' : selected.type === 'account' ? '◆' : '⬟'}
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-white">{selected.label}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-slate-500 bg-[#0f1e33] px-1.5 py-0.5 rounded">
                    {TYPE_LABEL[selected.type]}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase"
                    style={{ color: RISK_COLOR[selected.risk], background: RISK_COLOR[selected.risk] + '18' }}
                  >
                    {selected.risk}
                  </span>
                </div>
              </div>
            </div>

            {selected.isNew && (
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">New Finding</span>
                </div>
                <p className="text-[11px] text-amber-300/80">
                  This entity was discovered from unstructured text. It was not present in structured data systems.
                </p>
                {selected.source && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <FileText size={9} className="text-amber-500" />
                    <span className="text-[10px] text-amber-500">Source: {selected.source}</span>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-[12px] text-slate-400 leading-relaxed mb-4">{detail?.desc}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-[#0a1525] rounded-lg p-3 text-center">
                <div className="text-[18px] font-bold text-slate-200">{detail?.connections}</div>
                <div className="text-[10px] text-slate-600">Connections</div>
              </div>
              <div className="bg-[#0a1525] rounded-lg p-3 text-center">
                <div className="text-[18px] font-bold" style={{ color: RISK_COLOR[selected.risk] }}>
                  {selected.risk.charAt(0).toUpperCase() + selected.risk.slice(1)}
                </div>
                <div className="text-[10px] text-slate-600">Risk Level</div>
              </div>
            </div>

            {/* Connected nodes */}
            <div className="mb-4">
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium mb-2">Connected Entities</div>
              {GRAPH_NODES
                .filter(n => n.id !== selected.id && (
                  GRAPH_EDGES.some(e =>
                    (e.from === selected.id && e.to === n.id) ||
                    (e.to === selected.id && e.from === n.id)
                  )
                ))
                .map(n => (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNode(n.id)}
                    className="w-full flex items-center gap-2.5 py-2 border-b border-[#0f1e33] last:border-0 hover:bg-[#0a1525] -mx-1 px-1 rounded transition-colors text-left"
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: RISK_COLOR[n.risk] + '20', color: RISK_COLOR[n.risk] }}
                    >
                      ●
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] text-slate-300 truncate">{n.label}</div>
                      <div className="text-[10px] text-slate-600">{n.sublabel}</div>
                    </div>
                    <Link size={10} className="text-slate-600 ml-auto flex-shrink-0" />
                  </button>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
