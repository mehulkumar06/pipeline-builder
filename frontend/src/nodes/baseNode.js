import { Handle, Position } from 'reactflow';

const C = {
  nodeBg:     '#1c1c1a',
  nodeBorder: '#2e2e2b',
  headerBg:   '#161614',
  text:       '#ededec',
  textMuted:  '#878680',
  shadow:     'rgba(0,0,0,0.5)',
};

export const BaseNode = ({
  id,
  title,
  accentColor = '#e8a23a',
  inputs = [],
  outputs = [],
  children,
  onDelete,
  style = {},
}) => {
  const handleDotStyle = (color) => ({
    width: 10,
    height: 10,
    background: color,
    border: `2px solid #1c1c1a`,
    borderRadius: '50%',
  });

  const getHandleTop = (index, total) => {
    if (total === 1) return '50%';
    return `${((index + 1) / (total + 1)) * 100}%`;
  };

  const HANDLE_LABEL_WIDTH = 62;
  const leftPad  = inputs.length  > 0 ? HANDLE_LABEL_WIDTH : 16;
  const rightPad = outputs.length > 0 ? HANDLE_LABEL_WIDTH : 16;

  return (
    <div style={{
      background: C.nodeBg,
      border: `1px solid ${C.nodeBorder}`,
      borderLeft: `3px solid ${accentColor}`,
      borderRadius: 10,
      minWidth: 256,
      boxShadow: `0 4px 24px ${C.shadow}`,
      fontFamily: "'Inter', sans-serif",
      fontSize: 12,
      color: C.text,
      position: 'relative',
      ...style,
    }}>

      {/* Header */}
      <div style={{
        background: C.headerBg,
        borderBottom: `1px solid ${C.nodeBorder}`,
        borderRadius: '8px 10px 0 0',
        padding: '10px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: accentColor, flexShrink: 0,
          boxShadow: `0 0 6px ${accentColor}88`,
        }} />

        <span style={{
          fontWeight: 600, fontSize: 11,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: C.text, flex: 1,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {title}
        </span>

        <div
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); if (onDelete) onDelete(); }}
          title="Delete node"
          style={{
            width: 16, height: 16, borderRadius: 4,
            background: 'transparent', border: '1px solid #3d3d3a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 9,
            color: C.textMuted, flexShrink: 0,
            transition: 'all 0.12s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#3d1a1a';
            e.currentTarget.style.borderColor = '#c0392b';
            e.currentTarget.style.color = '#e05a4a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#3d3d3a';
            e.currentTarget.style.color = C.textMuted;
          }}
        >✕</div>
      </div>

      {/* Body */}
      <div style={{
        padding: `12px ${rightPad}px 12px ${leftPad}px`,
        display: 'flex', flexDirection: 'column', gap: 10,
        boxSizing: 'border-box',
      }}>
        {children}
      </div>

      {/* Input handles LEFT */}
      {inputs.map((handle, i) => (
        <div key={handle.id}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${handle.id}`}
            style={{
              ...handleDotStyle(accentColor),
              top: getHandleTop(i, inputs.length),
              left: -6,
            }}
          />
          {handle.label && (
            <span style={{
              position: 'absolute',
              left: 10,
              top: getHandleTop(i, inputs.length),
              transform: 'translateY(-50%)',
              fontSize: 9, fontWeight: 500,
              color: C.textMuted,
              letterSpacing: '0.04em',
              pointerEvents: 'none', userSelect: 'none',
              whiteSpace: 'nowrap',
              background: C.nodeBg,
              padding: '1px 4px', borderRadius: 3,
            }}>
              {handle.label}
            </span>
          )}
        </div>
      ))}

      {/* Output handles RIGHT */}
      {outputs.map((handle, i) => (
        <div key={handle.id}>
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-${handle.id}`}
            style={{
              ...handleDotStyle(accentColor),
              top: getHandleTop(i, outputs.length),
              right: -6,
            }}
          />
          {handle.label && (
            <span style={{
              position: 'absolute',
              right: 10,
              top: getHandleTop(i, outputs.length),
              transform: 'translateY(-50%)',
              fontSize: 9, fontWeight: 500,
              color: C.textMuted,
              letterSpacing: '0.04em',
              textAlign: 'right',
              pointerEvents: 'none', userSelect: 'none',
              whiteSpace: 'nowrap',
              background: C.nodeBg,
              padding: '1px 4px', borderRadius: 3,
            }}>
              {handle.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export const NodeLabel = ({ children }) => (
  <label style={{
    display: 'flex', flexDirection: 'column', gap: 5,
    fontSize: 10, color: '#878680',
    letterSpacing: '0.07em', textTransform: 'uppercase',
    fontFamily: "'Inter', sans-serif", fontWeight: 500,
  }}>
    {children}
  </label>
);

export const NodeInput = (props) => (
  <input
    {...props}
    style={{
      background: '#111110',
      border: '1px solid #2e2e2b',
      borderRadius: 6, color: '#ededec',
      padding: '6px 10px', fontSize: 12,
      fontFamily: "'Inter', sans-serif",
      outline: 'none', width: '100%', boxSizing: 'border-box',
      transition: 'border-color 0.12s, box-shadow 0.12s',
      ...props.style,
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#e8a23a';
      e.target.style.boxShadow = '0 0 0 2px rgba(232,162,58,0.15)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = '#2e2e2b';
      e.target.style.boxShadow = 'none';
    }}
  />
);

export const NodeSelect = (props) => (
  <select
    {...props}
    style={{
      background: '#111110',
      border: '1px solid #2e2e2b',
      borderRadius: 6, color: '#ededec',
      padding: '6px 10px', fontSize: 12,
      fontFamily: "'Inter', sans-serif",
      outline: 'none', width: '100%', cursor: 'pointer',
      transition: 'border-color 0.12s',
      ...props.style,
    }}
    onFocus={(e) => (e.target.style.borderColor = '#e8a23a')}
    onBlur={(e)  => (e.target.style.borderColor = '#2e2e2b')}
  />
);