import { useMemo, useRef, useState } from 'react';
import { Aperture, Compass, Focus, Globe2, Sparkles } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import './GraphView.css';

export default function GraphView() {
  const { notes, edges, activeNote, setSelectedNotePath, isDemoData } = useOutletContext();
  const [graphMode, setGraphMode] = useState('global');

  const displayedNotes = useMemo(() => {
    if (graphMode === 'global' || !activeNote) {
      return notes;
    }

    const neighborIds = new Set([activeNote.path]);
    edges.forEach((edge) => {
      if (edge.source === activeNote.path) {
        neighborIds.add(edge.target);
      }
      if (edge.target === activeNote.path) {
        neighborIds.add(edge.source);
      }
    });

    return notes.filter((note) => neighborIds.has(note.path));
  }, [activeNote, edges, graphMode, notes]);

  const displayedEdges = useMemo(() => {
    const visibleIds = new Set(displayedNotes.map((note) => note.path));
    return edges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target));
  }, [displayedNotes, edges]);

  return (
    <div className="graph-view workspace-view">
      <div className="workspace-surface graph-surface">
        <div className="graph-toolbar">
          <div className="graph-mode-switch">
            <button
              type="button"
              className={`graph-mode-button ${graphMode === 'global' ? 'active' : ''}`}
              onClick={() => setGraphMode('global')}
            >
              <Globe2 size={16} /> Global
            </button>
            <button
              type="button"
              className={`graph-mode-button ${graphMode === 'local' ? 'active' : ''}`}
              onClick={() => setGraphMode('local')}
            >
              <Focus size={16} /> Local
            </button>
          </div>

          <div className="graph-toolbar-status">
            <span className="graph-toolbar-chip">
              <Compass size={14} /> {displayedNotes.length} nodes
            </span>
            <span className="graph-toolbar-chip">
              <Aperture size={14} /> {displayedEdges.length} links
            </span>
            {isDemoData && (
              <span className="graph-toolbar-chip accent">
                <Sparkles size={14} /> Demo graph
              </span>
            )}
          </div>
        </div>

        <GraphCanvas
          key={`${graphMode}-${activeNote?.path ?? 'none'}-${displayedNotes.map((note) => note.path).join('|')}`}
          displayedNotes={displayedNotes}
          displayedEdges={displayedEdges}
          activeNote={activeNote}
          setSelectedNotePath={setSelectedNotePath}
        />
      </div>
    </div>
  );
}

function GraphCanvas({ displayedNotes, displayedEdges, activeNote, setSelectedNotePath }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [positions, setPositions] = useState(() => buildInitialPositions(displayedNotes));
  const dragRef = useRef(null);

  const highlightedConnections = useMemo(() => {
    if (!hoveredNode) {
      return new Set();
    }

    const related = new Set([hoveredNode]);
    displayedEdges.forEach((edge) => {
      if (edge.source === hoveredNode) {
        related.add(edge.target);
      }
      if (edge.target === hoveredNode) {
        related.add(edge.source);
      }
    });

    return related;
  }, [displayedEdges, hoveredNode]);

  function beginPan(event) {
    if (event.target.dataset.role === 'node') {
      return;
    }

    dragRef.current = {
      type: 'pan',
      startX: event.clientX,
      startY: event.clientY,
      originX: transform.x,
      originY: transform.y,
    };
  }

  function beginNodeDrag(event, nodePath) {
    event.stopPropagation();
    dragRef.current = {
      type: 'node',
      nodePath,
      startX: event.clientX,
      startY: event.clientY,
      origin: positions[nodePath],
    };
  }

  function handleMove(event) {
    if (!dragRef.current) {
      return;
    }

    if (dragRef.current.type === 'pan') {
      const deltaX = event.clientX - dragRef.current.startX;
      const deltaY = event.clientY - dragRef.current.startY;
      setTransform((current) => ({
        ...current,
        x: dragRef.current.originX + deltaX,
        y: dragRef.current.originY + deltaY,
      }));
      return;
    }

    const deltaX = (event.clientX - dragRef.current.startX) / transform.scale;
    const deltaY = (event.clientY - dragRef.current.startY) / transform.scale;
    setPositions((current) => ({
      ...current,
      [dragRef.current.nodePath]: {
        x: dragRef.current.origin.x + deltaX,
        y: dragRef.current.origin.y + deltaY,
      },
    }));
  }

  function endDrag() {
    dragRef.current = null;
  }

  function handleWheel(event) {
    event.preventDefault();
    const direction = event.deltaY > 0 ? -0.08 : 0.08;

    setTransform((current) => ({
      ...current,
      scale: Math.min(2.2, Math.max(0.55, current.scale + direction)),
    }));
  }

  return (
    <div
      className="graph-canvas"
      onMouseMove={handleMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onMouseDown={beginPan}
      onWheel={handleWheel}
    >
      <svg className="graph-svg" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet">
        <g transform={`translate(${500 + transform.x} ${400 + transform.y}) scale(${transform.scale})`}>
          {displayedEdges.map((edge) => {
            const source = positions[edge.source];
            const target = positions[edge.target];

            if (!source || !target) {
              return null;
            }

            const emphasized =
              hoveredNode &&
              (edge.source === hoveredNode ||
                edge.target === hoveredNode ||
                (highlightedConnections.has(edge.source) && highlightedConnections.has(edge.target)));

            return (
              <line
                key={edge.id}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={`graph-edge ${emphasized ? 'active' : ''}`}
              />
            );
          })}

          {displayedNotes.map((note) => {
            const position = positions[note.path];
            if (!position) {
              return null;
            }

            const isActive = activeNote?.path === note.path;
            const isHighlighted = hoveredNode ? highlightedConnections.has(note.path) : false;
            const radius = 18 + Math.min(note.links.length * 2, 12);

            return (
              <g
                key={note.path}
                transform={`translate(${position.x} ${position.y})`}
                className={`graph-node ${isActive ? 'active' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                onMouseEnter={() => setHoveredNode(note.path)}
                onMouseLeave={() => setHoveredNode(null)}
                onMouseDown={(event) => beginNodeDrag(event, note.path)}
                onClick={() => setSelectedNotePath(note.path)}
              >
                <circle data-role="node" r={radius} />
                <text y={radius + 18} textAnchor="middle">
                  {note.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

function buildInitialPositions(displayedNotes) {
  const nextPositions = {};
  const radius = Math.max(180, displayedNotes.length * 26);

  displayedNotes.forEach((note, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(displayedNotes.length, 1);
    nextPositions[note.path] = {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  return nextPositions;
}
