import { BellRing, Brain, Database, ShieldCheck } from 'lucide-react';
import { useAppState } from '../context/useAppState';
import './Settings.css';

export default function Settings() {
  const { vaultPath, memoryEnabled, chatModel, memoryModel, updateState } = useAppState();

  return (
    <div className="settings-view workspace-view">
      <div className="workspace-surface settings-surface">
        <div className="workspace-section-header">
          <div>
            <span className="eyebrow">System Settings</span>
            <h2>Workspace controls</h2>
          </div>
        </div>

        <div className="settings-grid">
          <section className="settings-panel-card">
            <div className="settings-card-heading">
              <Database size={18} />
              <h3>Vault connection</h3>
            </div>
            <p>{vaultPath || 'No vault path connected yet.'}</p>
            <button
              type="button"
              className={`toggle ${memoryEnabled ? 'active' : ''}`}
              aria-pressed={memoryEnabled}
              onClick={() => updateState({ memoryEnabled: !memoryEnabled })}
            >
              <div className="toggle-knob" />
            </button>
          </section>

          <section className="settings-panel-card">
            <div className="settings-card-heading">
              <Brain size={18} />
              <h3>Models</h3>
            </div>
            <label className="settings-field">
              <span>Chat model</span>
              <select value={chatModel} onChange={(event) => updateState({ chatModel: event.target.value })}>
                <option>Gemini 3.1 Pro (High)</option>
                <option>GPT-4o</option>
                <option>Claude 3.5 Sonnet</option>
              </select>
            </label>
            <label className="settings-field">
              <span>Memory model</span>
              <select value={memoryModel} onChange={(event) => updateState({ memoryModel: event.target.value })}>
                <option>text-embedding-3-large</option>
                <option>local-embed</option>
              </select>
            </label>
          </section>

          <section className="settings-panel-card">
            <div className="settings-card-heading">
              <ShieldCheck size={18} />
              <h3>Privacy posture</h3>
            </div>
            <p>
              Merlin now routes vault access through validated Tauri commands so note reads and writes stay
              bounded to the selected vault.
            </p>
          </section>

          <section className="settings-panel-card">
            <div className="settings-card-heading">
              <BellRing size={18} />
              <h3>Attention management</h3>
            </div>
            <p>
              Focus mode hides side panels and turns Merlin into a quiet editor or graph canvas when you need less noise.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
