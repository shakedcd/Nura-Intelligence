import { ChevronRight, Bell, Wifi, Shield } from 'lucide-react'

const VIEW_LABELS = {
  case:      'Case File',
  graph:     'Risk Graph',
  documents: 'Documents',
  notes:     'Analyst Notes',
}

export default function TopBar({ activeView, onNavigate }) {
  return (
    <div className="h-12 bg-[#070c1a] border-b border-[#111f36] flex items-center px-4 gap-4 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
        <span className="hover:text-slate-300 cursor-pointer" onClick={() => onNavigate('case')}>Cases</span>
        <ChevronRight size={12} />
        <span className="hover:text-slate-300 cursor-pointer" onClick={() => onNavigate('case')}>Mizrahi, Yosef</span>
        <ChevronRight size={12} />
        <span className="text-slate-300">{VIEW_LABELS[activeView]}</span>
      </div>

      <div className="flex items-center gap-1.5 ml-3">
        <span className="font-mono text-[11px] text-slate-600">CASE-2024-0847</span>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-500/15 text-red-400 uppercase tracking-wider">
          Critical
        </span>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-4">
        {/* Nura status */}
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-scan" />
          <span className="text-[11px] text-cyan-400 font-medium tracking-wide">Nura Agent: Active</span>
        </div>

        <div className="w-px h-4 bg-[#1a2d45]" />

        <button className="relative text-slate-500 hover:text-slate-300 transition-colors">
          <Bell size={15} />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold">3</span>
        </button>

        <div className="flex items-center gap-2 text-[12px] text-slate-400">
          <Shield size={13} className="text-slate-600" />
          <span>Financial Crime Unit</span>
        </div>
      </div>
    </div>
  )
}
