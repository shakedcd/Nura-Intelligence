import { useState, useEffect } from 'react'
import { CheckCircle, Shield, Building2, User, Banknote,
         Loader2, Sparkles, ChevronRight, LogOut, Bell, Lightbulb } from 'lucide-react'
import { NURA_FINDINGS } from '../data/mockData.js'
import MiniRiskGraph from './MiniRiskGraph.jsx'

const BANK_BLUE = '#002f87'

const BANK_CASES = [
  { id: 'FL-2024-3892', name: 'Mizrahi, Yosef',   type: 'AML Review',  status: 'active'    },
  { id: 'FL-2024-3801', name: 'Sunrise Capital',   type: 'STR Filing',  status: 'review'    },
  { id: 'FL-2024-3756', name: 'Vasquez, Elena',    type: 'Sanctions',   status: 'review'    },
  { id: 'FL-2024-3701', name: 'Harbor Trade Co.',  type: 'SAR Review',  status: 'escalated' },
]

const TRANSACTIONS = [
  { date: 'Jan 15, 2024', desc: 'Consulting Fee — Orion Advisory', type: 'Credit', amount: '+₪5,000', balance: '₪22,840' },
  { date: 'Jan 8, 2024',  desc: 'Utility Payment — Electric Co.',  type: 'Debit',  amount: '-₪320',   balance: '₪17,840' },
  { date: 'Jan 5, 2024',  desc: 'ATM Withdrawal — Haifa Central',  type: 'Debit',  amount: '-₪500',   balance: '₪18,160' },
  { date: 'Dec 29, 2023', desc: 'Consulting Fee — Orion Advisory', type: 'Credit', amount: '+₪5,000', balance: '₪18,660' },
  { date: 'Dec 15, 2023', desc: 'Rent Payment',                    type: 'Debit',  amount: '-₪3,200', balance: '₪13,660' },
  { date: 'Dec 1, 2023',  desc: 'Consulting Fee — Orion Advisory', type: 'Credit', amount: '+₪5,000', balance: '₪16,860' },
]

function KYCTab() {
  return (
    <div className="p-5">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <User size={12} /> Personal Information
          </h3>
          {[
            ['Full Name',       'Yosef Mizrahi'],
            ['Date of Birth',   'March 15, 1978'],
            ['National ID',     '123-456-789-0'],
            ['Nationality',     'Israeli'],
            ['Address',         '18 Allenby St., Haifa'],
            ['Customer Since',  'February 2015'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
              <span className="text-[12px] text-gray-500">{label}</span>
              <span className="text-[12px] text-gray-800 font-medium">{value}</span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Banknote size={12} /> Declared Financial Profile
          </h3>
          {[
            ['Annual Income',       '₪60,000'],
            ['Occupation',          'Independent Consultant'],
            ['Employer',            'Self-employed'],
            ['Bank Accounts',       '1 (this account)'],
            ['Foreign Accounts',    'None declared'],
            ['Business Interests',  'None declared'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
              <span className="text-[12px] text-gray-500">{label}</span>
              <span className="text-[12px] text-gray-800 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Shield size={12} /> Compliance Checks
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            'Sanctions (OFAC/UN)', 'PEP Screening', 'Adverse Media',
            'Transaction Monitoring', 'KYC Completeness', 'SAR History',
          ].map(label => (
            <div key={label} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-[11px] text-gray-600">{label}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-2 flex-shrink-0">
                PASS
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <CheckCircle size={13} />
          All compliance checks passed — no flags raised by legacy AML system
        </div>
      </div>
    </div>
  )
}

function TransactionsTab() {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[12px] font-semibold text-gray-700">Transaction History — Account #7821</h3>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
          AML Score: LOW — 12/100
        </span>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Date', 'Description', 'Type', 'Amount', 'Balance', 'Nura AI'].map(h => (
                <th key={h} className="text-left px-3 py-2.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((tx, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                <td className="px-3 py-2.5 text-[11px] text-gray-500 font-mono whitespace-nowrap">{tx.date}</td>
                <td className="px-3 py-2.5 text-[12px] text-gray-800">{tx.desc}</td>
                <td className="px-3 py-2.5">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    tx.type === 'Credit' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className={`px-3 py-2.5 text-[12px] font-mono font-semibold ${
                  tx.type === 'Credit' ? 'text-emerald-700' : 'text-gray-600'
                }`}>
                  {tx.amount}
                </td>
                <td className="px-3 py-2.5 text-[12px] text-gray-500 font-mono">{tx.balance}</td>
                <td className="px-3 py-2.5">
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600">
                    <CheckCircle size={10} /> Clean
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px] text-gray-400 text-center">
        No anomalous patterns detected — 6 months of transaction history reviewed
      </p>
    </div>
  )
}

function NuraFindingCard({ f, idx }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400 + idx * 650)
    return () => clearTimeout(t)
  }, [idx])

  if (!visible) return null

  const color = f.risk === 'critical' ? '#ef4444' : '#f97316'
  return (
    <div className="animate-slide-in mb-2 border border-[#1a2d45] rounded-lg p-3 bg-[#080f1e]">
      <div className="flex items-start gap-2">
        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[11px] font-semibold text-slate-200">{f.title}</span>
            <span className="text-[10px] font-bold flex-shrink-0" style={{ color }}>{f.confidence}%</span>
          </div>
          <div className="text-[11px] font-medium text-cyan-400 mb-1">{f.entity}</div>
          <p className="text-[10px] text-slate-500 italic leading-relaxed border-l border-[#1a2d45] pl-2">
            {f.snippet.length > 95 ? f.snippet.slice(0, 95) + '…' : f.snippet}
          </p>
          <div className="text-[10px] text-slate-600 mt-1">{f.source}</div>
        </div>
      </div>
    </div>
  )
}

export default function BankCMSView({ onExit }) {
  const [activeTab,    setActiveTab]    = useState('kyc')
  const [activeCase,   setActiveCase]   = useState(BANK_CASES[0])
  const [scanning,     setScanning]     = useState(true)
  const [showFindings, setShowFindings] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setScanning(false),     2200)
    const t2 = setTimeout(() => setShowFindings(true),  2500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="flex flex-col h-screen" style={{ fontFamily: 'Inter, sans-serif', background: '#f3f4f6' }}>

      {/* ── Bank Header ── */}
      <header style={{ background: BANK_BLUE }} className="flex items-center px-5 h-14 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center flex-shrink-0">
            <Building2 size={16} style={{ color: BANK_BLUE }} />
          </div>
          <div>
            <div className="text-white font-bold text-[13px] tracking-wide">BANK HAPOALOT</div>
            <div className="text-blue-300 text-[9px] uppercase tracking-widest">AML · Financial Crime Management</div>
          </div>
        </div>

        <nav className="flex items-center gap-0.5 ml-10">
          {['Dashboard', 'Cases', 'Reports', 'Administration'].map(item => (
            <button
              key={item}
              className={`px-3 py-1.5 rounded text-[12px] transition-all ${
                item === 'Cases'
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <button className="relative text-blue-200 hover:text-white transition-colors">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold">
              3
            </span>
          </button>
          <div className="flex items-center gap-2 text-[12px] text-blue-100">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold">
              AC
            </div>
            A. Cohen · Senior Analyst
          </div>
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 text-[11px] text-blue-300 hover:text-white transition-colors border border-blue-700 hover:border-blue-400 px-2.5 py-1 rounded"
          >
            <LogOut size={12} /> Exit Demo
          </button>
        </div>
      </header>

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-200 px-5 py-2 flex items-center gap-1.5 text-[11px] text-gray-500 flex-shrink-0">
        <span className="hover:text-gray-700 cursor-pointer">Cases</span>
        <ChevronRight size={11} />
        <span className="hover:text-gray-700 cursor-pointer">Financial Crime</span>
        <ChevronRight size={11} />
        <span className="text-gray-800 font-medium">{activeCase.id}</span>
        <span className="ml-2 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
          AML REVIEW
        </span>
        {showFindings && (
          <span className="ml-1 text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded animate-fade-in">
            ⚡ Nura: CRITICAL RISK DETECTED
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Case List */}
        <div className="w-52 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-3 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Open Cases</span>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">4</span>
          </div>
          {BANK_CASES.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCase(c)}
              className={`w-full text-left px-3 py-3 border-b border-gray-100 transition-all ${
                activeCase.id === c.id
                  ? 'bg-blue-50 border-l-2 border-l-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="text-[12px] font-medium text-gray-800">{c.name}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">{c.type}</div>
              <div className="font-mono text-[10px] text-gray-400 mt-1">{c.id}</div>
            </button>
          ))}
        </div>

        {/* Case Details — light / traditional CMS */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Case header */}
          <div className="bg-white border-b border-gray-200 px-5 py-4 flex items-start justify-between flex-shrink-0">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-[16px] font-semibold text-gray-900">Mizrahi, Yosef</h2>
                <span className="text-[10px] font-semibold px-2 py-1 rounded bg-gray-100 text-gray-500 border border-gray-200">
                  #IL-2015-78431
                </span>
                <span className="text-[10px] font-semibold px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ✓ Standard Risk
                </span>
              </div>
              <div className="text-[11px] text-gray-500">
                Case {activeCase.id} · AML Review · Opened Jan 14, 2024 · Assigned to A. Cohen
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-[12px] px-3 py-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
                Assign
              </button>
              <button className="text-[12px] px-3 py-1.5 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">
                File STR
              </button>
              <button
                className="text-[12px] px-3 py-1.5 rounded text-white transition-all hover:opacity-90"
                style={{ background: BANK_BLUE }}
              >
                Close Case
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-gray-200 px-5 flex flex-shrink-0">
            {[
              { id: 'kyc',          label: 'KYC Details'      },
              { id: 'transactions', label: 'Transactions'      },
              { id: 'alerts',       label: 'Alerts (0)'        },
              { id: 'documents',    label: 'Documents (5)'     },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-[12px] font-medium border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {activeTab === 'kyc'          && <KYCTab />}
            {activeTab === 'transactions' && <TransactionsTab />}
            {activeTab === 'alerts' && (
              <div className="py-16 text-center text-[12px] text-gray-400">
                No system alerts triggered for this customer.
              </div>
            )}
            {activeTab === 'documents' && (
              <div className="py-16 text-center text-[12px] text-gray-400">
                5 documents attached — click to open.
              </div>
            )}
          </div>
        </div>

        {/* ── Nura Agent Panel (dark, embedded) ── */}
        <div className="w-[300px] flex-shrink-0 bg-[#060b17] border-l-2 border-cyan-500/25 flex flex-col">
          {/* Panel header */}
          <div className="px-4 py-3 border-b border-[#1a2d45] bg-[#07101e] flex-shrink-0">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Lightbulb size={11} className="text-white" />
              </div>
              <span className="text-[12px] font-semibold text-cyan-400 tracking-wide">Nura Intelligence</span>
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
            <div className="text-[9px] text-slate-600 uppercase tracking-widest">
              Embedded Agent · Unstructured Document Analysis
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {/* System vs Nura contrast cards */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-lg p-2.5 text-center">
                <div className="text-[9px] text-slate-500 mb-1 uppercase tracking-wider">System</div>
                <div className="text-[20px] font-bold text-emerald-400 leading-none">12</div>
                <div className="text-[9px] text-emerald-400 mt-0.5">LOW RISK</div>
              </div>
              <div className="bg-red-500/8 border border-red-500/20 rounded-lg p-2.5 text-center">
                <div className="text-[9px] text-slate-500 mb-1 uppercase tracking-wider">Nura</div>
                <div className="text-[20px] font-bold text-red-400 leading-none">94</div>
                <div className="text-[9px] text-red-400 mt-0.5">CRITICAL</div>
              </div>
            </div>

            {/* Mini graph */}
            <div className="bg-[#07101e] border border-[#1a2d45] rounded-xl p-3 mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Risk Graph</span>
                <span className="text-[10px] text-cyan-400">7 entities</span>
              </div>
              <MiniRiskGraph />
              <div className="text-[10px] text-amber-400 text-center mt-1.5 font-medium">
                3 new from unstructured text
              </div>
            </div>

            {/* Findings feed */}
            <div>
              {scanning ? (
                <div className="flex items-center gap-2 py-3">
                  <Loader2 size={11} className="text-slate-500 animate-spin" />
                  <span className="text-[11px] text-slate-500">Scanning 5 case documents…</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={11} className="text-amber-400" />
                  <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Unstructured Findings</span>
                  <span className="ml-auto text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    3 NEW
                  </span>
                </div>
              )}
              {showFindings && NURA_FINDINGS.map((f, i) => (
                <NuraFindingCard key={f.id} f={f} idx={i} />
              ))}
            </div>
          </div>

          {/* Footer badge */}
          <div className="px-4 py-2.5 border-t border-[#1a2d45] flex-shrink-0">
            <div className="text-[9px] text-slate-700 text-center uppercase tracking-widest">
              Powered by Nura Intelligence · Agent v2.1
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
