import { LayoutDashboard, Share2, FileText, BookOpen, Settings, Shield, Lightbulb } from 'lucide-react'

const NAV = [
  { id: 'case',      icon: LayoutDashboard, label: 'Case File',      badge: null },
  { id: 'graph',     icon: Share2,          label: 'Risk Graph',     badge: '7'  },
  { id: 'documents', icon: FileText,         label: 'Documents',      badge: '3'  },
  { id: 'notes',     icon: BookOpen,         label: 'Analyst Notes',  badge: null },
]

export default function NavSidebar({ activeView, onNavigate }) {
  return (
    <div className="w-[200px] flex-shrink-0 bg-[#060b16] border-r border-[#111f36] flex flex-col py-4">
      {/* Logo */}
      <div className="px-4 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0">
          <Lightbulb size={16} className="text-white" />
        </div>
        <div>
          <div className="text-[13px] font-semibold text-white tracking-wide">NURA</div>
          <div className="text-[10px] text-slate-500 tracking-widest uppercase">Intelligence</div>
        </div>
      </div>

      {/* Section label */}
      <div className="px-4 mb-2 text-[10px] text-slate-600 uppercase tracking-widest font-medium">
        Workspace
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-2">
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all text-left ${
              activeView === item.id
                ? 'bg-[#0e1e38] text-cyan-400'
                : 'text-slate-500 hover:text-slate-300 hover:bg-[#0c1526]'
            }`}
          >
            {activeView === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-r" />
            )}
            <item.icon size={15} />
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto w-5 h-5 bg-red-500/80 rounded-full text-[10px] flex items-center justify-center text-white font-bold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto px-2 border-t border-[#111f36] pt-4 flex flex-col gap-0.5">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] text-slate-600 hover:text-slate-400 hover:bg-[#0c1526] transition-all">
          <Settings size={15} />
          <span>Settings</span>
        </button>
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
            AL
          </div>
          <div>
            <div className="text-[12px] text-slate-400 font-medium">A. Levi</div>
            <div className="text-[10px] text-slate-600">Financial Crime Unit</div>
          </div>
        </div>
      </div>
    </div>
  )
}
