import { useMemo, useState } from 'react';
import { ArrowUpRight, Brain, FileText, Link2, Send, Sparkles } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { demoConversation } from '../data/demoData';
import { renderHighlightedText } from '../utils/content.jsx';
import './HybridView.css';

export default function HybridView() {
  const navigate = useNavigate();
  const { activeNote, saveNote, notes, isDemoData, setSelectedNotePath } = useOutletContext();
  const [inputText, setInputText] = useState('');

  const memoryReferences = useMemo(() => activeNote?.links ?? [], [activeNote]);

  return (
    <div className="hybrid-view workspace-view">
      <div className="workspace-surface hybrid-surface">
        <div className="hybrid-column hybrid-chat-column">
          <div className="workspace-section-header">
            <div>
              <span className="eyebrow">Conversation</span>
              <h2>Thinking Thread</h2>
            </div>
            {isDemoData && (
              <span className="status-pill accent">
                <Sparkles size={14} /> Demo context
              </span>
            )}
          </div>

          <div className="hybrid-message-stack">
            {demoConversation.map((message) => (
              <article
                key={message.id}
                className={`thinking-message ${message.role === 'assistant' ? 'assistant' : 'user'}`}
              >
                <div className="thinking-message-meta">
                  <span>{message.role === 'assistant' ? 'Merlin' : 'You'}</span>
                  {message.memoryUsed && (
                    <span className="memory-inline-indicator">
                      <Brain size={14} /> Memory active
                    </span>
                  )}
                </div>
                <p>{message.content}</p>
                {message.references && (
                  <div className="thinking-chip-row">
                    {message.references.map((reference) => {
                      const linkedNote = notes.find((note) => note.name === reference);
                      return (
                        <button
                          key={reference}
                          type="button"
                          className="memory-reference-chip"
                          onClick={() => linkedNote && setSelectedNotePath(linkedNote.path)}
                        >
                          <Link2 size={14} />
                          {reference}
                        </button>
                      );
                    })}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="composer composer-floating">
            <div className="composer-header">
              <span className="eyebrow">Prompt</span>
              <button type="button" className="soft-action" onClick={() => navigate('/graph')}>
                Open graph <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="composer-input-shell">
              <textarea
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                placeholder="Ask Merlin to connect this idea to your notes..."
                rows={3}
              />
              <button type="button" className="primary-action icon-only">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="hybrid-column hybrid-note-column">
          {activeNote ? (
            <HybridNoteEditor
              key={activeNote.path}
              activeNote={activeNote}
              memoryReferences={memoryReferences}
              saveNote={saveNote}
            />
          ) : (
            <div className="workspace-empty-state">Pick a note to open the hybrid editor.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function HybridNoteEditor({ activeNote, memoryReferences, saveNote }) {
  const [draft, setDraft] = useState(activeNote.content);
  const [saveState, setSaveState] = useState('');

  async function handleSave() {
    const success = await saveNote(activeNote.path, draft);
    setSaveState(success ? 'Saved to memory.' : 'Unable to save note.');
  }

  return (
    <>
      <div className="workspace-section-header">
        <div>
          <span className="eyebrow">Linked Memory</span>
          <h2>{activeNote.name}</h2>
        </div>
        <div className="workspace-header-actions">
          {saveState && <span className="status-pill success">{saveState}</span>}
          <button type="button" className="soft-action" onClick={handleSave}>
            Save note
          </button>
        </div>
      </div>

      <div className="hybrid-editor-shell">
        <div className="hybrid-note-meta">
          <span className="status-pill">
            <FileText size={14} /> {activeNote.category}
          </span>
          {memoryReferences.map((reference) => (
            <span key={reference} className="status-pill subtle">
              {reference}
            </span>
          ))}
        </div>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="hybrid-note-editor"
        />
        <div className="hybrid-note-preview">{renderHighlightedText(draft)}</div>
      </div>
    </>
  );
}
