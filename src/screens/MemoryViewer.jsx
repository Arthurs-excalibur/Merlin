import { Eye, FileText, Save, Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { renderHighlightedText } from '../utils/content.jsx';
import './MemoryViewer.css';

export default function MemoryViewer() {
  const {
    groupedNotes,
    activeNote,
    setSelectedNotePath,
    saveNote,
    relatedNotes,
    isDemoData,
  } = useOutletContext();
  const [previewMode, setPreviewMode] = useState(false);
  const [query, setQuery] = useState('');

  const filteredGroups = useMemo(() => {
    if (!query.trim()) {
      return groupedNotes;
    }

    const lowered = query.toLowerCase();
    return groupedNotes
      .map((group) => ({
        ...group,
        items: group.items.filter((note) => note.name.toLowerCase().includes(lowered)),
      }))
      .filter((group) => group.items.length > 0);
  }, [groupedNotes, query]);

  return (
    <div className="memory-view workspace-view">
      <div className="workspace-surface memory-surface">
        <div className="memory-browser-panel">
          <div className="workspace-section-header">
            <div>
              <span className="eyebrow">Memory Browser</span>
              <h2>Vault knowledge</h2>
            </div>
            {isDemoData && (
              <span className="status-pill accent">
                <Sparkles size={14} /> Demo notes
              </span>
            )}
          </div>

          <div className="memory-search-shell">
            <Search size={16} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter notes"
            />
          </div>

          <div className="memory-group-list">
            {filteredGroups.map((group) => (
              <section key={group.name} className="memory-group">
                <span className="memory-group-label">{group.name}</span>
                {group.items.map((note) => (
                  <button
                    key={note.path}
                    type="button"
                    className={`memory-group-item ${activeNote?.path === note.path ? 'active' : ''}`}
                    onClick={() => setSelectedNotePath(note.path)}
                  >
                    <div>
                      <strong>{note.name}</strong>
                      <span>{note.tags.join(' ') || 'Unlinked note'}</span>
                    </div>
                    <FileText size={15} />
                  </button>
                ))}
              </section>
            ))}
          </div>
        </div>

        <div className="memory-editor-panel">
          <div className="workspace-section-header">
            <div>
              <span className="eyebrow">Editor</span>
              <h2>{activeNote?.name ?? 'Select a note'}</h2>
            </div>
            <div className="workspace-header-actions">
              <button
                type="button"
                className={`soft-action ${previewMode ? 'active' : ''}`}
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye size={15} /> Preview
              </button>
            </div>
          </div>

          {activeNote ? (
            <MemoryEditorPanel
              key={activeNote.path}
              activeNote={activeNote}
              previewMode={previewMode}
              saveNote={saveNote}
              relatedNotes={relatedNotes}
              setSelectedNotePath={setSelectedNotePath}
            />
          ) : (
            <div className="workspace-empty-state">Pick a note from the vault browser to start editing.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MemoryEditorPanel({
  activeNote,
  previewMode,
  saveNote,
  relatedNotes,
  setSelectedNotePath,
}) {
  const [draft, setDraft] = useState(activeNote.content);
  const [saveState, setSaveState] = useState('');

  async function handleSave() {
    const success = await saveNote(activeNote.path, draft);
    setSaveState(success ? 'Saved' : 'Unable to save');
  }

  return (
    <>
      <div className="workspace-header-actions">
        {saveState && <span className="status-pill success">{saveState}</span>}
        <button type="button" className="soft-action" onClick={handleSave}>
          <Save size={15} /> Save
        </button>
      </div>

      <div className="memory-link-strip">
        {activeNote.links.map((link) => (
          <span key={link} className="status-pill subtle">
            {link}
          </span>
        ))}
      </div>

      <div className="memory-editor-grid">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="memory-editor-textarea"
        />
        <div className="memory-preview-pane">{previewMode ? renderHighlightedText(draft) : activeNote.excerpt}</div>
      </div>

      <div className="memory-related-footer">
        <span className="eyebrow">Adjacent Notes</span>
        <div className="thinking-chip-row">
          {relatedNotes.map((note) => (
            <button
              key={note.path}
              type="button"
              className="memory-reference-chip"
              onClick={() => setSelectedNotePath(note.path)}
            >
              {note.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
