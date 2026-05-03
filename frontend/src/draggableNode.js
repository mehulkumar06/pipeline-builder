export const DraggableNode = ({ type, label, color = '#e8a23a', icon = '◆' }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onDragStart={onDragStart}
      draggable
      style={{
        cursor: 'grab',
        padding: '5px 10px',
        display: 'flex', alignItems: 'center', gap: 7,
        borderRadius: 7,
        background: '#1c1c1a',
        border: '1px solid #2e2e2b',
        userSelect: 'none',
        transition: 'background 0.12s, border-color 0.12s',
        fontFamily: "'Inter', sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#242420';
        e.currentTarget.style.borderColor = '#3d3d3a';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#1c1c1a';
        e.currentTarget.style.borderColor = '#2e2e2b';
      }}
    >
      <span style={{
        fontSize: 11, color: color,
        fontWeight: 600, lineHeight: 1, flexShrink: 0,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        {icon}
      </span>
      <span style={{
        color: '#b8b8b4', fontSize: 11,
        fontWeight: 500, whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
    </div>
  );
};