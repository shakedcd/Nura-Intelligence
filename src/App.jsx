import { useState } from 'react'
import NavSidebar from './components/NavSidebar.jsx'
import TopBar from './components/TopBar.jsx'
import CaseFileView from './components/CaseFileView.jsx'
import RiskGraphView from './components/RiskGraphView.jsx'
import DocumentsView from './components/DocumentsView.jsx'
import AnalystNotesView from './components/AnalystNotesView.jsx'
import BankCMSView from './components/BankCMSView.jsx'

export default function App() {
  const [activeView, setActiveView] = useState('case')

  if (activeView === 'bank') {
    return <BankCMSView onExit={() => setActiveView('case')} />
  }

  return (
    <div className="flex h-screen bg-[#080d1a] text-slate-200 overflow-hidden">
      <NavSidebar activeView={activeView} onNavigate={setActiveView} />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar activeView={activeView} onNavigate={setActiveView} />
        <main className="flex-1 overflow-hidden">
          {activeView === 'case'      && <CaseFileView onNavigate={setActiveView} />}
          {activeView === 'graph'     && <RiskGraphView />}
          {activeView === 'documents' && <DocumentsView />}
          {activeView === 'notes'     && <AnalystNotesView />}
        </main>
      </div>
    </div>
  )
}
