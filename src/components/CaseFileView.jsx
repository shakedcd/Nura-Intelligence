import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, FileText, User,
         Banknote, ChevronRight, ExternalLink, Loader2, Sparkles, Shield } from 'lucide-react'
import { CASES, SUSPECT, NURA_FINDINGS } from '../data/mockData.js'
import MiniRiskGraph from './MiniRiskGraph.jsx'

const RISK_COLOR = { critical: '#ef4444', high: '#f97316', medium: '#fbbf24', low: '#34d399' }
const RISK_BG    = { critical: 'bg-red-500/10 text-red-400 border-red-500/20',
                     high:     'bg-orange-500/10 text-orange-400 border-orange-500/20',
                     medium:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                     low:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }

function CaseListItem({ c, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3 border-b border-[#0f1e33] transition-all ${
        active ? 'bg-[#0d1e36] border-l-2 border-l-cyan-500' : 'hover:bg-[#0a1525]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[13px] font-medium text-slate-200 truncate">{c.name}</div>
          <div className="text-[11px] text-slate-500 truncate mt-0.5">{c.type}</div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span
            className="text-[11px] font-bold px-1.5 py-0.5 rounded"
            style={{ color: RISK_COLOR[c.risk], background: RISK_COLOR[c.risk] + '18' }}
          >
            {c.riskScore}
          </span>
          {c.newFindings > 0 && (
            <span className="text-[10px] bg-cyan-500/15 text-cyan-400 px-1.5 py-0.5 rounded">
              +{c.newFindings} new
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="font-mono text-[10px] text-slate-600">{c.id}</span>
        <span className="text-[10px] text-slate-600">· {c.lastActivity}</span>
      </div>
    </button>
  )
}

function StatusRow({ label, value, ok }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#0f1e33] last:border-0">
      <span className="text-[12px] text-slate-500">{label}</span>
      <div className="flex items-center gap-1.5">
        {ok === true  && <CheckCircle size={12} className="text-emerald-400" />}
        {ok === false && <XCircle     size={12} className="text-red-400" />}
        {ok === null  && <Clock       size={12} className="text-slate-500" />}
        <span className={`text-[12px] font-medium ${ok === true ? 'text-emerald-400' : ok === false ? 'text-red-400' : 'text-slate-400'}`}>
          {value}
        </span>
      </div>
    </div>
  )
}

function DataRow({ label, value, muted }) {
  return (
    <div className="flex items-start justify-between py-1.5 gap-4">
      <span className="text-[12px] text-slate-500 flex-shrink-0">{label}</span>
      <span className={`text-[12px] text-right ${muted ? 'text-slate-600' : 'text-slate-300'}`}>{value}</span>
    </div>
  )
}

function FindingCard({ f, idx }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400 + idx * 600)
    return () => clearTimeout(t)
  }, [idx])

  if (!visible) return null

  return (
    <div className="animate-slide-in border border-[#1a2d45] rounded-lg p-3 bg-[#080f1e] mb-2">
      <div className="flex items-start gap-2.5">
        <div
          className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
          style={{ background: RISK_COLOR[f.risk] }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[12px] font-semibold text-slate-200">{f.title}</span>
            <span
              className="text-[10px] font-bold flex-shrink-0"
              style={{ color: RISK_COLOR[f.risk] }}
            >
              {f.confidence}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[11px] font-medium text-cyan-400">{f.entity}</span>
            <span className="text-[10px] text-slate-600 bg-[#0f1e33] px-1.5 py-0.5 rounded">{f.entityType}</span>
          </div>
          <p className="text-[11px] text-slate-500 italic leading-relaxed border-l-2 border-[#1a2d45] pl-2">
            {f.snippet}
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            <FileText size={9} className="text-slate-600" />
            <span className="text-[10px] text-slate-600">{f.source} · {f.sourceDate}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CaseFileView({ onNavigate }) {
  const [activeCase] = useState(CASES[0])
  const [scanning, setScanning] = useState(true)
  const [showFindings, setShowFindings] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setScanning(false), 2200)
    const t2 = setTimeout(() => setShowFindings(true), 2400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="flex h-full">
      {/* Case List */}
      <div className="w-64 flex-shrink-0 bg-[#070c18] border-r border-[#0f1e33] flex flex-col">
        <div className="px-3 py-3 border-b border-[#0f1e33] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 uppercase tracking-widest font-medium">Active Cases</span>
          <span className="text-[10px] text-slate-600 bg-[#0f1e33] px-1.5 py-0.5 rounded font-mono">5</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {CASES.map(c => (
            <CaseListItem key={c.id} c={c} active={c.id === activeCase.id} onClick={() => {}} />
          ))}
        </div>
      </div>

      {/* Case Details — traditional CMS view */}
      <div className="flex-1 overflow-y-auto bg-[#080d1a] p-5 min-w-0">
        {/* Case header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-semibold text-white">{SUSPECT.name}</h2>
              <span className={`text-[11px] font-bold px-2 py-1 rounded border ${RISK_BG.critical}`}>
                CRITICAL RISK · {activeCase.riskScore}/100
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-slate-500">
              <span className="font-mono">{activeCase.id}</span>
              <span>·</span>
              <span>{activeCase.type}</span>
              <span>·</span>
              <span>Opened {activeCase.opened}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-[12px] px-3 py-1.5 rounded border border-[#1a2d45] text-slate-400 hover:text-slate-200 hover:border-[#2a3d55] transition-all">
              Assign
            </button>
            <button className="text-[12px] px-3 py-1.5 rounded bg-[#0f1e38] border border-[#1a2d45] text-slate-300 hover:bg-[#142540] transition-all">
              File SAR
            </button>
          </div>
        </div>

        {/* Entity Summary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#0a1220] border border-[#0f1e33] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <User size={13} className="text-slate-500" />
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Entity Details</span>
            </div>
            <DataRow label="Full Name"    value={SUSPECT.name} />
            <DataRow label="Date of Birth" value={SUSPECT.dob} />
            <DataRow label="Nationality"  value={SUSPECT.nationality} />
            <DataRow label="National ID"  value={SUSPECT.id} />
            <DataRow label="Address"      value={SUSPECT.address} />
            <DataRow label="Occupation"   value={SUSPECT.occupation} />
          </div>

          <div className="bg-[#0a1220] border border-[#0f1e33] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Banknote size={13} className="text-slate-500" />
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Declared Financial Profile</span>
            </div>
            <DataRow label="Annual Income"      value={SUSPECT.declaredIncome} />
            <DataRow label="Bank Accounts"      value={`1  (${SUSPECT.bankRef})`} />
            <DataRow label="Real Estate"        value={SUSPECT.realEstate}       muted />
            <DataRow label="Business Interests" value={SUSPECT.companies}         muted />
            <DataRow label="Foreign Accounts"   value={SUSPECT.foreignAccounts}  muted />
          </div>
        </div>

        {/* AML System Assessment */}
        <div className="bg-[#0a1220] border border-[#0f1e33] rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={13} className="text-slate-500" />
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Legacy AML System Assessment</span>
            <span className="ml-auto text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-medium">
              System: No Flags
            </span>
          </div>
          <StatusRow label="Transaction Monitoring" value="CLEAN — No anomalous patterns detected"      ok={true} />
          <StatusRow label="Sanctions Screening"    value="CLEAR — No matches on OFAC, UN, EU lists"   ok={true} />
          <StatusRow label="PEP Screening"          value="NOT A PEP — No political exposure found"    ok={true} />
          <StatusRow label="Adverse Media Check"    value="CLEAR — No negative structured media hits"  ok={true} />
          <StatusRow label="SAR History"            value="None filed"                                   ok={null} />
        </div>

        <div className="text-[11px] text-slate-600 text-center py-2 border border-dashed border-[#0f1e33] rounded-lg">
          Legacy system shows no flags. Traditional entity resolution complete. ✓
        </div>
      </div>

      {/* Nura Agent Panel */}
      <div className="w-[360px] flex-shrink-0 border-l border-[#1a2d45] bg-[#060b17] flex flex-col">
        {/* Panel header */}
        <div className="px-4 py-3 border-b border-[#1a2d45] flex items-center gap-2 bg-[#070d1c]">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
            N
          </div>
          <span className="text-[12px] font-semibold text-cyan-400 tracking-wide">Nura Intelligence</span>
          <span className="text-[10px] text-slate-600 ml-1">— Unstructured Analysis</span>
          {scanning ? (
            <div className="ml-auto flex items-center gap-1.5">
              <Loader2 size={11} className="text-cyan-500 animate-spin" />
              <span className="text-[10px] text-cyan-500 animate-scan">Scanning…</span>
            </div>
          ) : (
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-scan" />
              <span className="text-[10px] text-cyan-400">Active</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {/* Risk score */}
          <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Computed Risk Score</span>
              <span className="text-[22px] font-bold text-red-400">94</span>
            </div>
            <div className="w-full bg-[#0a1525] rounded-full h-1.5 mb-2">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: '94%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>Based on 12 documents · 7 entities · 8 graph connections</span>
              <span className="text-red-400 font-medium">CRITICAL</span>
            </div>
          </div>

          {/* Mini Graph */}
          <div className="bg-[#07101e] border border-[#1a2d45] rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Risk Graph</span>
              <button
                onClick={() => onNavigate('graph')}
                className="flex items-center gap-1 text-[10px] text-cyan-500 hover:text-cyan-300 transition-colors"
              >
                Expand <ExternalLink size={9} />
              </button>
            </div>
            <MiniRiskGraph />
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-600">
              <span>7 entities · 8 connections</span>
              <span className="text-cyan-400 font-medium">3 new from unstructured</span>
            </div>
          </div>

          {/* Findings */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2.5">
              {scanning ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 size={11} className="text-slate-500 animate-spin" />
                  <span className="text-[11px] text-slate-500">Scanning {activeCase.documents} documents…</span>
                </div>
              ) : (
                <>
                  <Sparkles size={11} className="text-amber-400" />
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">New Findings from Unstructured Text</span>
                  <span className="ml-auto text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    {NURA_FINDINGS.length} NEW
                  </span>
                </>
              )}
            </div>

            {showFindings && NURA_FINDINGS.map((f, i) => (
              <FindingCard key={f.id} f={f} idx={i} />
            ))}
          </div>

          {/* Document status */}
          {!scanning && (
            <div className="animate-fade-in border border-[#1a2d45] rounded-xl p-3 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={11} className="text-slate-500" />
                <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Document Coverage</span>
              </div>
              {[
                { label: 'Legal / Court filings', count: 3, findings: 5 },
                { label: 'Regulatory filings',    count: 2, findings: 1 },
                { label: 'News & media',          count: 2, findings: 2 },
                { label: 'Police reports',        count: 2, findings: 2 },
                { label: 'Tax returns',           count: 1, findings: 0 },
                { label: 'Intelligence files',    count: 1, findings: 0, scanning: true },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#0f1e33] last:border-0">
                  <span className="text-[11px] text-slate-500">{row.label}</span>
                  <div className="flex items-center gap-2">
                    {row.scanning ? (
                      <span className="text-[10px] text-slate-600 animate-scan">Scanning…</span>
                    ) : (
                      <span className={`text-[10px] font-medium ${row.findings > 0 ? 'text-amber-400' : 'text-slate-600'}`}>
                        {row.findings > 0 ? `${row.findings} findings` : 'No findings'}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-600">{row.count} docs</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-[#1a2d45] flex gap-2">
          <button
            onClick={() => onNavigate('graph')}
            className="flex-1 text-[12px] py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/15 transition-all font-medium"
          >
            View Full Graph
          </button>
          <button
            onClick={() => onNavigate('notes')}
            className="flex-1 text-[12px] py-2 rounded-lg bg-[#0f1e33] border border-[#1a2d45] text-slate-400 hover:text-slate-200 transition-all"
          >
            Add Insight
          </button>
        </div>
      </div>
    </div>
  )
}
