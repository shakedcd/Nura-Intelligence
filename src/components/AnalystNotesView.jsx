import { useState } from 'react'
import { BookOpen, Tag, Link, Plus, Loader2, CheckCircle, Sparkles, X } from 'lucide-react'
import { ANALYST_NOTES } from '../data/mockData.js'

function NoteCard({ note }) {
  return (
    <div className="bg-[#070c18] border border-[#0f1e33] rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
          {note.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[12px] font-semibold text-slate-300">{note.analyst}</span>
            <span className="text-[10px] text-slate-600 font-mono">{note.timestamp}</span>
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed mb-3">{note.content}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {note.tags.map(tag => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
              >
                {tag}
              </span>
            ))}
            {note.linkedFindings > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-amber-400 ml-auto">
                <Link size={9} />
                {note.linkedFindings} graph link{note.linkedFindings > 1 ? 's' : ''} generated
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RescanToast({ result, onClose }) {
  return (
    <div className="animate-slide-in fixed top-14 right-4 bg-[#07101e] border border-cyan-500/30 rounded-xl p-4 shadow-2xl shadow-cyan-500/5 w-80 z-50">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
          <Sparkles size={13} className="text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-semibold text-cyan-300 mb-1">Re-scan complete</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Nura found <span className="text-amber-300 font-semibold">{result.links} new secondary links</span> based on your insight:
          </p>
          <ul className="mt-1.5 flex flex-col gap-0.5">
            {result.entities.map((e, i) => (
              <li key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <div className="w-1 h-1 rounded-full bg-amber-400" />
                {e}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={onClose} className="text-slate-600 hover:text-slate-400 flex-shrink-0">
          <X size={13} />
        </button>
      </div>
    </div>
  )
}

export default function AnalystNotesView() {
  const [notes, setNotes] = useState(ANALYST_NOTES)
  const [noteText, setNoteText] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [rescanning, setRescanning] = useState(false)
  const [rescanResult, setRescanResult] = useState(null)

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      setTags(prev => [...prev, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (i) => setTags(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = () => {
    if (!noteText.trim()) return
    setSubmitting(true)

    setTimeout(() => {
      const newNote = {
        id: `n-${Date.now()}`,
        analyst: 'A. Levi',
        initials: 'AL',
        timestamp: 'Just now',
        content: noteText,
        tags,
        linkedFindings: 0,
      }
      setNotes(prev => [newNote, ...prev])
      setNoteText('')
      setTags([])
      setSubmitting(false)
      setRescanning(true)

      setTimeout(() => {
        setRescanning(false)
        setRescanResult({
          links: 2,
          entities: [
            'Port Authority Access Logs → TLV Warehouse 7',
            'Haifa Chamber of Commerce registry cross-reference',
          ],
        })
      }, 2500)
    }, 800)
  }

  return (
    <div className="flex h-full relative">
      {/* Toast */}
      {rescanResult && (
        <RescanToast result={rescanResult} onClose={() => setRescanResult(null)} />
      )}

      {/* Notes feed */}
      <div className="flex-1 overflow-y-auto p-6 min-w-0">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={14} className="text-slate-500" />
            <span className="text-[13px] font-semibold text-slate-300">Analyst Knowledge Base</span>
            <span className="text-[10px] text-slate-600 bg-[#0f1e33] px-1.5 py-0.5 rounded font-mono ml-auto">
              CASE-2024-0847
            </span>
          </div>

          <p className="text-[12px] text-slate-600 mb-5 leading-relaxed border-l-2 border-[#1a2d45] pl-3">
            Insights added here are permanently stored in the Knowledge Graph.
            After each insertion, Nura re-scans the full document corpus to surface
            secondary links that were previously hidden.
          </p>

          {rescanning && (
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3 mb-4 flex items-center gap-3 animate-fade-in">
              <Loader2 size={14} className="text-cyan-500 animate-spin flex-shrink-0" />
              <div>
                <div className="text-[12px] font-medium text-cyan-400">Re-scanning database…</div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Nura is querying all 12 documents for secondary links to your new insight
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="flex flex-col gap-3">
            {notes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      </div>

      {/* Add insight panel */}
      <div className="w-80 flex-shrink-0 bg-[#060b17] border-l border-[#1a2d45] flex flex-col">
        <div className="px-4 py-3 border-b border-[#1a2d45]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
              N
            </div>
            <span className="text-[12px] font-semibold text-slate-300">Add Analyst Insight</span>
          </div>
          <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
            Your insight will be added to the permanent Knowledge Graph and trigger a full re-scan.
          </p>
        </div>

        <div className="flex-1 p-4 flex flex-col gap-3">
          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-medium block mb-1.5">
              Insight
            </label>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Describe your finding, observation, or intelligence here…"
              rows={6}
              className="w-full bg-[#07101e] border border-[#1a2d45] rounded-lg p-3 text-[12px] text-slate-300 placeholder-slate-700 resize-none focus:outline-none focus:border-cyan-500/40 transition-colors leading-relaxed"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-medium block mb-1.5">
              Link to Entities <span className="text-slate-700 normal-case tracking-normal">(press Enter to add)</span>
            </label>
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="e.g. Golden Logistics Ltd"
              className="w-full bg-[#07101e] border border-[#1a2d45] rounded-lg px-3 py-2 text-[12px] text-slate-300 placeholder-slate-700 focus:outline-none focus:border-cyan-500/40 transition-colors"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                  >
                    {tag}
                    <button onClick={() => removeTag(i)} className="hover:text-white transition-colors">
                      <X size={8} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-medium block mb-1.5">
              Analyst
            </label>
            <div className="flex items-center gap-2 bg-[#07101e] border border-[#1a2d45] rounded-lg px-3 py-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[9px] font-bold">
                AL
              </div>
              <span className="text-[12px] text-slate-400">A. Levi — Financial Crime Unit</span>
            </div>
          </div>

          <div className="mt-auto pt-2">
            <button
              onClick={handleSubmit}
              disabled={!noteText.trim() || submitting}
              className={`w-full py-2.5 rounded-lg text-[12px] font-semibold transition-all flex items-center justify-center gap-2 ${
                noteText.trim() && !submitting
                  ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
                  : 'bg-[#0a1525] border border-[#1a2d45] text-slate-600 cursor-not-allowed'
              }`}
            >
              {submitting ? (
                <><Loader2 size={13} className="animate-spin" /> Saving…</>
              ) : (
                <><Plus size={13} /> Add to Knowledge Graph</>
              )}
            </button>
            <p className="text-[10px] text-slate-700 text-center mt-2 leading-relaxed">
              Submitting will trigger an automatic re-scan of all 12 documents
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
