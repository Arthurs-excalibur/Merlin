import { Brain, Folder, GitBranch, MessageSquare, PanelsTopLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { open } from '@tauri-apps/plugin-dialog';
import { useAppState } from '../context/useAppState';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();
  const { vaultPath, memoryEnabled, chatModel, memoryModel, updateState } = useAppState();
  const [error, setError] = useState('');

  async function handleBrowseVault() {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Obsidian Vault',
      });

      if (selected) {
        updateState({ vaultPath: selected });
        setError('');
      }
    } catch (browseError) {
      console.error('Failed to select vault:', browseError);
      setError('Unable to open the vault picker right now.');
    }
  }

  function handleEnterWorkspace() {
    if (memoryEnabled && !vaultPath.trim()) {
      setError('Choose a vault path or disable memory before entering the workspace.');
      return;
    }

    navigate('/hybrid');
  }

  return (
    <div className="welcome-page">
      <div className="welcome-hero">
        <div className="welcome-copy">
          <span className="status-pill accent">
            <Brain size={14} /> Merlin
          </span>
          <h1>Step inside your own thinking system.</h1>
          <p>
            Merlin is no longer a chat window with memory attached. It is a spatial workspace for
            conversations, notes, and the links between them.
          </p>

          <div className="welcome-capability-grid">
            <div className="welcome-capability">
              <MessageSquare size={18} />
              <div>
                <strong>Context-aware chat</strong>
                <span>Prompt Merlin inside a live memory field.</span>
              </div>
            </div>
            <div className="welcome-capability">
              <PanelsTopLeft size={18} />
              <div>
                <strong>Hybrid workspace</strong>
                <span>Read, write, and reason side by side.</span>
              </div>
            </div>
            <div className="welcome-capability">
              <GitBranch size={18} />
              <div>
                <strong>Visual graph</strong>
                <span>See how notes cluster and connect.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="welcome-control-panel">
          <div className="workspace-section-header">
            <div>
              <span className="eyebrow">Workspace Setup</span>
              <h2>Connect your vault</h2>
            </div>
          </div>

          <div className="welcome-input-group">
            <label className="eyebrow">Obsidian Vault</label>
            <div className="welcome-input-shell">
              <Folder size={18} />
              <input
                type="text"
                value={vaultPath}
                onChange={(event) => updateState({ vaultPath: event.target.value })}
                placeholder="Choose your markdown vault"
              />
              <button type="button" className="soft-action" onClick={handleBrowseVault}>
                Browse
              </button>
            </div>
          </div>

          <div className="welcome-select-grid">
            <div className="welcome-input-group">
              <label className="eyebrow">Chat Model</label>
              <select value={chatModel} onChange={(event) => updateState({ chatModel: event.target.value })}>
                <option>Gemini 3.1 Pro (High)</option>
                <option>GPT-4o</option>
                <option>Claude 3.5 Sonnet</option>
              </select>
            </div>

            <div className="welcome-input-group">
              <label className="eyebrow">Memory Model</label>
              <select value={memoryModel} onChange={(event) => updateState({ memoryModel: event.target.value })}>
                <option>text-embedding-3-large</option>
                <option>local-embed</option>
              </select>
            </div>
          </div>

          <div className="welcome-memory-toggle">
            <div>
              <strong>Enable memory awareness</strong>
              <span>Expose linked notes, graph structure, and contextual recall.</span>
            </div>
            <button
              type="button"
              className={`toggle ${memoryEnabled ? 'active' : ''}`}
              aria-pressed={memoryEnabled}
              onClick={() => updateState({ memoryEnabled: !memoryEnabled })}
            >
              <div className="toggle-knob" />
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="button" className="primary-action welcome-primary" onClick={handleEnterWorkspace}>
            Enter workspace
          </button>
        </div>
      </div>
    </div>
  );
}
