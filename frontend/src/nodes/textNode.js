import { useState, useEffect, useRef } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
const extractVariables = (text) => {
  const vars = []; const seen = new Set(); let match;
  VAR_REGEX.lastIndex = 0;
  while ((match = VAR_REGEX.exec(text)) !== null) {
    const name = match[1].trim();
    if (!seen.has(name)) { seen.add(name); vars.push(name); }
  }
  return vars;
};

export const TextNode = ({ id, data }) => {
  const { deleteElements } = useReactFlow();
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState(() => extractVariables(data?.text || '{{input}}'));
  const textareaRef = useRef(null);

  useEffect(() => { setVariables(extractVariables(currText)); }, [currText]);
  useEffect(() => {
    const ta = textareaRef.current; if (!ta) return;
    ta.style.height = 'auto'; ta.style.height = `${ta.scrollHeight}px`;
  }, [currText]);

  const nodeWidth = Math.max(260, Math.min(500, currText.length * 7 + 80));
  const leftPad = variables.length > 0 ? 56 : 16;
  const getHandleTop = (i, total) => total === 1 ? '50%' : `${((i + 1) / (total + 1)) * 100}%`;

  return (
    <div style={{
      background: '#1c1c1a', border: '1px solid #2e2e2b',
      borderRadius: 10, minWidth: nodeWidth,
      boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      fontFamily: "'Inter', sans-serif", fontSize: 12,
      color: '#ededec', position: 'relative',
    }}>
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: '#5a8a9e', borderRadius: '10px 10px 0 0', opacity: 0.7 }} />

      {/* Header */}
      <div style={{ background: '#161614', borderBottom: '1px solid #2e2e2b',
        borderRadius: '10px 10px 0 0', padding: '10px 12px', marginTop: 2,
        display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5a8a9e',
          boxShadow: '0 0 6px #5a8a9e88', flexShrink: 0 }} />
        <span style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: '#ededec', flex: 1,
          fontFamily: "'JetBrains Mono', monospace" }}>Text</span>
        <div
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); deleteElements({ nodes: [{ id }] }); }}
          style={{ width: 16, height: 16, borderRadius: 4, background: 'transparent',
            border: '1px solid #3d3d3a', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', fontSize: 9, color: '#878680' }}
          onMouseEnter={(e) => { e.currentTarget.style.background='#3d1a1a'; e.currentTarget.style.borderColor='#c0392b'; e.currentTarget.style.color='#e05a4a'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='#3d3d3a'; e.currentTarget.style.color='#878680'; }}
        >✕</div>
      </div>

      {/* Body */}
      <div style={{ padding: `12px 16px 12px ${leftPad}px`, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 10,
          color: '#878680', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 500 }}>
          Text
          <textarea ref={textareaRef} value={currText} onChange={(e) => setCurrText(e.target.value)} rows={1}
            style={{ background: '#111110', border: '1px solid #2e2e2b', borderRadius: 6,
              color: '#ededec', padding: '7px 10px', fontSize: 12,
              fontFamily: "'Inter', sans-serif", outline: 'none',
              width: '100%', boxSizing: 'border-box', resize: 'none',
              overflow: 'hidden', lineHeight: '1.6', minHeight: 36 }}
            onFocus={(e) => { e.target.style.borderColor='#5a8a9e'; e.target.style.boxShadow='0 0 0 2px rgba(90,138,158,0.15)'; }}
            onBlur={(e)  => { e.target.style.borderColor='#2e2e2b'; e.target.style.boxShadow='none'; }}
          />
        </label>
        {variables.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {variables.map((v) => (
              <span key={v} style={{ background: 'rgba(90,138,158,0.1)',
                border: '1px solid rgba(90,138,158,0.3)', borderRadius: 4,
                color: '#5a8a9e', fontSize: 10, padding: '2px 7px',
                fontFamily: "'JetBrains Mono', monospace" }}>
                {`{{${v}}}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Variable handles LEFT */}
      {variables.map((varName, i) => (
        <div key={varName}>
          <Handle type="target" position={Position.Left} id={`${id}-${varName}`}
            style={{ top: getHandleTop(i, variables.length), width: 10, height: 10,
              background: '#5a8a9e', border: '2px solid #1c1c1a', borderRadius: '50%', left: -5 }} />
          <span style={{ position: 'absolute', left: 8, top: getHandleTop(i, variables.length),
            transform: 'translateY(-50%)', fontSize: 9, fontWeight: 500, color: '#878680',
            pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
            background: '#1c1c1a', padding: '1px 4px', borderRadius: 3 }}>
            {varName}
          </span>
        </div>
      ))}

      {/* Output handle RIGHT */}
      <Handle type="source" position={Position.Right} id={`${id}-output`}
        style={{ top: '50%', width: 10, height: 10, background: '#5a8a9e',
          border: '2px solid #1c1c1a', borderRadius: '50%', right: -5 }} />
    </div>
  );
};