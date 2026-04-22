import { useState } from 'react'
import { FileText, Scale, Newspaper, Shield, ReceiptText, BrainCircuit,
         Loader2, CheckCircle, Tag, AlertCircle, Plus } from 'lucide-react'
import { DOCUMENTS } from '../data/mockData.js'

const TYPE_ICON = {
  'Legal Document':     Scale,
  'News Article':       Newspaper,
  'Regulatory Filing':  Shield,
  'Police Report':      Shield,
  'Tax Filing':         ReceiptText,
  'Intelligence File':  BrainCircuit,
}

const CONFIDENCE_COLOR = (c) =>
  c >= 90 ? '#34d399' : c >= 75 ? '#fbbf24' : '#f97316'

function HighlightedText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <p className="text-[12px] text-slate-400 leading-relaxed font-mono">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <mark key={i} className="bg-amber-400/15 text-amber-300 not-italic px-0.5 rounded">
              {part.slice(2, -2)}
            </mark>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </p>
  )
}

function DocListItem({ doc, active, onClick }) {
  const Icon = TYPE_ICON[doc.type] || FileText
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-[#0f1e33] transition-all ${
        active ? 'bg-[#0e1e38] border-l-2 border-l-cyan-500' : 'hover:bg-[#0a1525]'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex-shrink-0 ${doc.status === 'scanning' ? 'text-cyan-500 animate-scan' : doc.findings > 0 ? 'text-amber-400' : 'text-slate-600'}`}>
          <Icon size={14} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-medium text-slate-300 truncate leading-tight">{doc.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-slate-600">{doc.type}</span>
            <span className="text-[10px] text-slate-700">·</span>
            <span className="text-[10px] text-slate-600">{doc.date}</span>
            <span className="text-[10px] text-slate-700">·</span>
            <span className="text-[10px] text-slate-600">{doc.pages}pp</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          {doc.status === 'scanning' ? (
            <Loader2 size={11} className="text-cyan-500 animate-spin" />
          ) : doc.findings > 0 ? (
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
              {doc.findings}
            </span>
          ) : (
            <CheckCircle size={11} className="text-slate-700" />
          )}
        </div>
      </div>
    </button>
  )
}

export default function DocumentsView() {
  const [activeDoc, setActiveDoc] = useState(DOCUMENTS[0])
  const [addedEntities, setAddedEntities] = useState(new Set())

  const totalFindings = DOCUMENTS.reduce((s, d) => s + d.findings, 0)

  const handleAddToGraph = (entityText) => {
    setAddedEntities(prev => new Set([...prev, entityText]))
  }

  return (
    <div className="flex h-full">
      {/* Doc list */}
      <div className="w-72 flex-shrink-0 bg-[#070c18] border-r border-[#0f1e33] flex flex-col">
        <div className="px-4 py-3 border-b border-[#0f1e33] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 uppercase tracking-widest font-medium">Documents</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-amber-400 font-medium">{totalFindings} findings</span>
            <span className="text-[10px] text-slate-600">{DOCUMENTS.length} docs</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {DOCUMENTS.map(doc => (
            <DocListItem
              key={doc.id}
              doc={doc}
              active={activeDoc?.id === doc.id}
              onClick={() => setActiveDoc(doc)}
            />
          ))}
        </div>
      </div>

      {/* Document analysis */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#080d1a]">
        {activeDoc && (
          <>
            {/* Doc header */}
            <div className="px-6 py-4 border-b border-[#0f1e33] bg-[#070c18]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[14px] font-semibold text-white mb-1">{activeDoc.name}</h2>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{activeDoc.type}</span>
                    <span>·</span>
                    <span>{activeDoc.date}</span>
                    <span>·</span>
                    <span>{activeDoc.pages} pages</span>
                    {activeDoc.findings > 0 && (
                      <>
                        <span>·</span>
                        <span className="text-amber-400 font-medium">{activeDoc.findings} Nura findings</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {activeDoc.status === 'scanning' ? (
                    <div className="flex items-center gap-1.5 text-cyan-500 text-[11px]">
                      <Loader2 size={12} className="animate-spin" />
                      Scanning…
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                      <CheckCircle size={12} />
                      Scanned
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex gap-6">
              {/* Document excerpt */}
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-slate-600 uppercase tracking-widest font-medium mb-3 flex items-center gap-2">
                  <FileText size={11} />
                  Document Extract — Nura Annotated
                </div>

                {activeDoc.status === 'scanning' ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 size={24} className="text-cyan-500 animate-spin" />
                    <p className="text-[12px] text-slate-500">Scanning document for entities and relationships…</p>
                  </div>
                ) : activeDoc.excerpt ? (
                  <div className="bg-[#07101e] border border-[#1a2d45] rounded-xl p-5">
                    <div className="text-[11px] text-slate-600 font-mono mb-3 pb-2 border-b border-[#0f1e33]">
                      EXTRACT — Page 6 / 28 &nbsp;·&nbsp; Confidence-highlighted
                    </div>
                    <HighlightedText text={activeDoc.excerpt} />
                    <div className="mt-4 pt-3 border-t border-[#0f1e33] flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-scan" />
                      <span className="text-[10px] text-slate-600">
                        Highlighted terms were extracted and mapped to the Risk Graph by Nura Intelligence
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[12px] text-slate-600 text-center py-12">No content extracted yet</div>
                )}

                {/* Legend */}
                {activeDoc.excerpt && (
                  <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <mark className="bg-amber-400/15 text-amber-300 px-1.5 py-0.5 rounded not-italic">highlighted</mark>
                      <span>= entity extracted by Nura</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Extracted entities */}
              {activeDoc.entities.length > 0 && (
                <div className="w-72 flex-shrink-0">
                  <div className="text-[11px] text-slate-600 uppercase tracking-widest font-medium mb-3 flex items-center gap-2">
                    <Tag size={11} />
                    Extracted Entities
                  </div>
                  <div className="flex flex-col gap-2">
                    {activeDoc.entities.map((ent, i) => {
                      const added = addedEntities.has(ent.text)
                      return (
                        <div key={i} className="bg-[#07101e] border border-[#1a2d45] rounded-xl p-3">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="text-[12px] font-medium text-slate-200">{ent.text}</span>
                            <span
                              className="text-[10px] font-bold flex-shrink-0"
                              style={{ color: CONFIDENCE_COLOR(ent.confidence) }}
                            >
                              {ent.confidence}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-600 bg-[#0f1e33] px-1.5 py-0.5 rounded">
                              {ent.type}
                            </span>
                            <button
                              onClick={() => handleAddToGraph(ent.text)}
                              disabled={added}
                              className={`text-[10px] px-2 py-1 rounded transition-all flex items-center gap-1 ${
                                added
                                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 cursor-default'
                                  : 'text-cyan-400 bg-cyan-500/8 border border-cyan-500/20 hover:bg-cyan-500/15'
                              }`}
                            >
                              {added ? (
                                <><CheckCircle size={9} /> In Graph</>
                              ) : (
                                <><Plus size={9} /> Add to Graph</>
                              )}
                            </button>
                          </div>
                          {/* Confidence bar */}
                          <div className="mt-2 w-full bg-[#0a1525] rounded-full h-1">
                            <div
                              className="h-1 rounded-full transition-all"
                              style={{ width: `${ent.confidence}%`, background: CONFIDENCE_COLOR(ent.confidence) }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {activeDoc.findings === 0 && (
                    <div className="mt-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={12} className="text-emerald-400" />
                        <span className="text-[11px] text-emerald-400">No new risk entities found</span>
                      </div>
                      <p className="text-[10px] text-slate-600 mt-1">
                        Entities in this document are consistent with declared profile.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
