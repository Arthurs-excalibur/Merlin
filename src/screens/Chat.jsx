import { Brain, Link2, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { demoConversation } from '../data/demoData';
import './Chat.css';

export default function Chat() {
  const navigate = useNavigate();
  const { activeNote, relatedNotes, setSelectedNotePath, isDemoData } = useOutletContext();
  const [inputText, setInputText] = useState('');

  return (
    <div className="chat-view workspace-view">
      <div className="workspace-surface chat-surface">
        <div className="workspace-section-header">
          <div>
            <span className="eyebrow">Conversation Workspace</span>
            <h2>Ask Merlin inside your thinking system</h2>
          </div>
          <div className="workspace-header-actions">
            {isDemoData && (
              <span className="status-pill accent">
                <Sparkles size={14} /> Demo mode
              </span>
            )}
            {activeNote && (
              <button
                type="button"
                className="soft-action"
                onClick={() => navigate('/hybrid')}
              >
                Open {activeNote.name} in hybrid
              </button>
            )}
          </div>
        </div>

        <div className="chat-reading-column">
          {demoConversation.map((message) => (
            <article key={message.id} className={`chat-message-block ${message.role}`}>
              <div className="chat-message-heading">
                <span>{message.role === 'assistant' ? 'Merlin' : 'You'}</span>
                {message.memoryUsed && (
                  <span className="memory-inline-indicator">
                    <Brain size={14} /> Memory-aware response
                  </span>
                )}
              </div>
              <p>{message.content}</p>
              {message.references && (
                <div className="thinking-chip-row">
                  {message.references.map((reference) => (
                    <button
                      key={reference}
                      type="button"
                      className="memory-reference-chip"
                      onClick={() => {
                        const matchingNote = [...relatedNotes, activeNote].find((note) => note?.name === reference);
                        if (matchingNote) {
                          setSelectedNotePath(matchingNote.path);
                        }
                      }}
                    >
                      <Link2 size={14} />
                      {reference}
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="composer composer-floating">
          <div className="composer-header">
            <div>
              <span className="eyebrow">Prompt</span>
              <h3>Continue the thread</h3>
            </div>
            {activeNote && (
              <span className="status-pill subtle">
                <Brain size={14} /> Anchored to {activeNote.name}
              </span>
            )}
          </div>

          <div className="composer-input-shell">
            <textarea
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              placeholder="Ask Merlin to reason across notes, extract a connection, or open a local graph."
              rows={3}
            />
            <button type="button" className="primary-action icon-only">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
