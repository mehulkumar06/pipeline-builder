// toolbar.js

import { DraggableNode } from './draggableNode';

const NODE_DEFS = [
  { type: 'customInput',  label: 'Input',     color: '#5a9e6f', icon: '↳' },
  { type: 'customOutput', label: 'Output',    color: '#9e5a8a', icon: '↴' },
  { type: 'llm',          label: 'LLM',       color: '#7a6eaa', icon: '◈' },
  { type: 'text',         label: 'Text',      color: '#5a8a9e', icon: 'T' },
  { type: 'filter',       label: 'Filter',    color: '#b87333', icon: '⊗' },
  { type: 'math',         label: 'Math',      color: '#9e9a5a', icon: '∑' },
  { type: 'api',          label: 'API',       color: '#5a7a9e', icon: '⇆' },
  { type: 'condition',    label: 'Condition', color: '#9e6a5a', icon: '?' },
  { type: 'transform',    label: 'Transform', color: '#5a9e9a', icon: '⟳' },
];

export const PipelineToolbar = () => (
  <div style={{
    background: '#161614',
    borderBottom: '1px solid #2e2e2b',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  }}>
    {/* Logo */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9,
      paddingRight: 16,
      borderRight: '1px solid #2e2e2b',
      flexShrink: 0,
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 6,
        background: '#e8a23a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700, color: '#111110',
        fontFamily: "'JetBrains Mono', monospace",
      }}>P</div>
      <span style={{
        fontSize: 13, fontWeight: 600,
        color: '#ededec', letterSpacing: '0.01em',
        fontFamily: "'Inter', sans-serif",
      }}>Pipeline</span>
    </div>

    <span style={{
      fontSize: 10, color: '#555552',
      letterSpacing: '0.1em', textTransform: 'uppercase',
      fontWeight: 500, flexShrink: 0,
    }}>Nodes</span>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
      {NODE_DEFS.map((n) => (
        <DraggableNode key={n.type} type={n.type} label={n.label} color={n.color} icon={n.icon} />
      ))}
    </div>

    {/* Separator before utility items */}
    <div style={{ width: 1, height: 20, background: '#2e2e2b', flexShrink: 0 }} />

    {/* Note chip — styled differently to signal it's not a pipeline node */}
    <DraggableNode type="note" label="Note" color="#ca8a04" icon="✎" />
  </div>
);