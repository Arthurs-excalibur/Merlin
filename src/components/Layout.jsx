import {
  Brain,
  ChevronLeft,
  Compass,
  Focus,
  GitBranch,
  LayoutPanelLeft,
  MessageSquare,
  Plus,
  Search,
  Settings as SettingsIcon,
  Sparkles,
} from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useAppState } from '../context/useAppState';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import './Layout.css';

const modeLinks = [
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/hybrid', label: 'Hybrid', icon: LayoutPanelLeft },
  { to: '/memory', label: 'Memory', icon: Brain },
  { to: '/graph', label: 'Graph', icon: GitBranch },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    vaultPath,
    memoryEnabled,
    selectedNotePath,
    sidebarCollapsed,
    focusMode,
    updateState,
  } = useAppState();
  const knowledgeBase = useKnowledgeBase(vaultPath, memoryEnabled);

  const activeNote = useMemo(() => {
    return (
      knowledgeBase.noteMap.get(selectedNotePath) ??
      knowledgeBase.notes[0] ??
      null
    );
  }, [knowledgeBase.noteMap, knowledgeBase.notes, selectedNotePath]);

  useEffect(() => {
    if (!selectedNotePath && knowledgeBase.notes[0]) {
      updateState({ selectedNotePath: knowledgeBase.notes[0].path });
    }
  }, [knowledgeBase.notes, selectedNotePath, updateState]);

  const relatedNotes = useMemo(() => {
    if (!activeNote) {
      return [];
    }

    const relatedIds = new Set();
    knowledgeBase.edges.forEach((edge) => {
      if (edge.source === activeNote.path) {
        relatedIds.add(edge.target);
      }
      if (edge.target === activeNote.path) {
        relatedIds.add(edge.source);
      }
    });

    return knowledgeBase.notes.filter((note) => relatedIds.has(note.path)).slice(0, 6);
  }, [activeNote, knowledgeBase.edges, knowledgeBase.notes]);

  const currentMode = location.pathname.replace('/', '') || 'chat';

  return (
    <div className={`workspace-shell ${focusMode ? 'focus-mode' : ''}`}>
      <aside className={`workspace-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="workspace-brand">
          <div className="workspace-brand-mark">
            <Sparkles size={18} />
          </div>
          {!sidebarCollapsed && (
            <div>
              <strong>Merlin</strong>
              <span>Intelligence workspace</span>
            </div>
          )}
        </div>

        <button type="button" className="primary-action sidebar-primary" onClick={() => navigate('/chat')}>
          <Plus size={16} />
          {!sidebarCollapsed && <span>New Chat</span>}
        </button>

        <div className="sidebar-section">
          {!sidebarCollapsed && <span className="sidebar-label">Navigate</span>}
          <nav className="sidebar-nav">
            {modeLinks.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                <Icon size={18} />
                {!sidebarCollapsed && <span>{label}</span>}
              </NavLink>
            ))}
            <NavLink to="/settings" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <SettingsIcon size={18} />
              {!sidebarCollapsed && <span>Settings</span>}
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-section grow">
          {!sidebarCollapsed && <span className="sidebar-label">Collections</span>}
          <div className="collection-list">
            {knowledgeBase.groupedNotes.map((group) => (
              <div key={group.name} className="collection-group">
                {!sidebarCollapsed && <span className="collection-title">{group.name}</span>}
                {group.items.slice(0, sidebarCollapsed ? 1 : 3).map((note) => (
                  <button
                    key={note.path}
                    type="button"
                    className={`collection-note ${activeNote?.path === note.path ? 'active' : ''}`}
                    onClick={() => updateState({ selectedNotePath: note.path })}
                    title={note.name}
                  >
                    <span className="collection-dot" />
                    {!sidebarCollapsed && <span>{note.name}</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="sidebar-collapse"
          onClick={() => updateState({ sidebarCollapsed: !sidebarCollapsed })}
        >
          <ChevronLeft size={16} className={sidebarCollapsed ? 'rotated' : ''} />
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </aside>

      <div className="workspace-main">
        <header className="workspace-topbar">
          <div className="workspace-topbar-left">
            <div className="topbar-search">
              <Search size={16} />
              <input type="text" placeholder="Search notes, conversations, and links" />
            </div>
            <div className="mode-switcher">
              {modeLinks.map(({ to, label }) => (
                <button
                  key={to}
                  type="button"
                  className={`mode-switcher-button ${currentMode === to.slice(1) ? 'active' : ''}`}
                  onClick={() => navigate(to)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="workspace-topbar-right">
            <span className="status-pill">
              <Compass size={14} />
              {knowledgeBase.isDemoData ? 'Demo knowledge graph' : 'Vault connected'}
            </span>
            <span className="status-pill subtle">
              <Brain size={14} />
              {memoryEnabled ? 'Memory on' : 'Memory off'}
            </span>
            <button
              type="button"
              className={`topbar-icon-button ${focusMode ? 'active' : ''}`}
              onClick={() => updateState({ focusMode: !focusMode })}
            >
              <Focus size={16} />
            </button>
          </div>
        </header>

        <div className="workspace-body">
          <main className="workspace-center">
            <Outlet
              context={{
                ...knowledgeBase,
                activeNote,
                relatedNotes,
                selectedNotePath,
                setSelectedNotePath: (path) => updateState({ selectedNotePath: path }),
              }}
            />
          </main>

          <aside className="workspace-insight-panel">
            <section className="insight-card">
              <div className="insight-card-header">
                <span className="eyebrow">Active Memory</span>
                <h3>{activeNote?.name ?? 'No note selected'}</h3>
              </div>
              <p className="insight-summary">
                {activeNote?.excerpt ?? 'Select a note or connect a vault to start building live context.'}
              </p>
              <div className="insight-chip-row">
                {(activeNote?.tags ?? []).slice(0, 4).map((tag) => (
                  <span key={tag} className="status-pill subtle">
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section className="insight-card">
              <div className="insight-card-header">
                <span className="eyebrow">Related Notes</span>
                <h3>Connected thinking</h3>
              </div>
              <div className="related-note-list">
                {relatedNotes.length === 0 && <p className="insight-summary">Open a linked note and Merlin will reveal its neighborhood here.</p>}
                {relatedNotes.map((note) => (
                  <button
                    key={note.path}
                    type="button"
                    className="related-note-item"
                    onClick={() => updateState({ selectedNotePath: note.path })}
                  >
                    <div>
                      <strong>{note.name}</strong>
                      <span>{note.category}</span>
                    </div>
                    <GitBranch size={15} />
                  </button>
                ))}
              </div>
            </section>

            <section className="insight-card">
              <div className="insight-card-header">
                <span className="eyebrow">AI Insights</span>
                <h3>Working intelligence</h3>
              </div>
              <div className="insight-stack">
                {knowledgeBase.insights.map((insight) => (
                  <article key={insight.title} className="insight-note">
                    <strong>{insight.title}</strong>
                    <p>{insight.body}</p>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
