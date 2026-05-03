// noteNode.js

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useReactFlow, NodeResizer } from 'reactflow';

const NOTE_COLORS = [
  { label: 'Yellow', bg: '#fef9c3', border: '#fde047', text: '#713f12' },
  { label: 'Green',  bg: '#dcfce7', border: '#86efac', text: '#14532d' },
  { label: 'Blue',   bg: '#dbeafe', border: '#93c5fd', text: '#1e3a5f' },
  { label: 'Pink',   bg: '#fce7f3', border: '#f9a8d4', text: '#831843' },
  { label: 'Purple', bg: '#f3e8ff', border: '#d8b4fe', text: '#4a1d96' },
  { label: 'Slate',  bg: '#f1f5f9', border: '#cbd5e1', text: '#1e293b' },
];

const stop = (e) => e.stopPropagation();

export const NoteNode = ({ id, data }) => {
  const { deleteElements } = useReactFlow();
  const editorRef  = useRef(null);
  const colorDotRef = useRef(null);
  const savedRange = useRef(null);

  const [colorIdx, setColorIdx]           = useState(data?.colorIdx ?? 0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pickerPos, setPickerPos]         = useState({ top: 0, left: 0 });
  const [isEmpty, setIsEmpty]             = useState(true);
  const [activeFormats, setActiveFormats] = useState({});

  const color = NOTE_COLORS[colorIdx];

  // Position the portal picker under the color dot
  const openPicker = (e) => {
    stop(e);
    if (!showColorPicker) {
      const rect = colorDotRef.current.getBoundingClientRect();
      setPickerPos({ top: rect.bottom + 8, left: rect.left });
    }
    setShowColorPicker(p => !p);
  };

  // Close picker when clicking outside
  useEffect(() => {
    if (!showColorPicker) return;
    const handler = () => setShowColorPicker(false);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [showColorPicker]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const editor = editorRef.current;
    if (!editor || !savedRange.current) return;
    editor.focus();
    const sel = window.getSelection();
    if (sel) { sel.removeAllRanges(); sel.addRange(savedRange.current); }
  };

  const updateActiveFormats = () => {
    setActiveFormats({
      bold:      document.queryCommandState('bold'),
      italic:    document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
    });
  };

  const applyFormat = (e, cmd, value = null) => {
    e.stopPropagation();
    restoreSelection();
    document.execCommand(cmd, false, value);
    updateActiveFormats();
    saveSelection();
  };

  const handleInput = () => {
    setIsEmpty((editorRef.current?.innerText || '').trim() === '');
  };

  const Divider = () => (
    <div style={{ width: 1, height: 14, background: 'rgba(0,0,0,0.2)', margin: '0 2px', flexShrink: 0 }} />
  );

  const Btn = ({ cmd, value, active, title, children }) => (
    <button
      title={title}
      onClick={(e) => applyFormat(e, cmd, value)}
      style={{
        background: active ? 'rgba(0,0,0,0.15)' : 'transparent',
        border: 'none', borderRadius: 4,
        padding: '2px 5px', cursor: 'pointer',
        fontSize: 13, fontWeight: 700,
        color: color.text, lineHeight: 1,
        minWidth: 24, height: 22, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Georgia, serif',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.background = active ? 'rgba(0,0,0,0.15)' : 'transparent'}
    >{children}</button>
  );

  return (
    <div style={{
      background: color.bg,
      border: `1.5px solid ${color.border}`,
      borderRadius: 10,
      width: '100%', height: '100%',
      minWidth: 220, minHeight: 160,
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      fontFamily: "'Inter', sans-serif",
      color: color.text,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <NodeResizer
        minWidth={200} minHeight={140}
        lineStyle={{ borderColor: color.border }}
        handleStyle={{ background: color.border, borderRadius: 3, width: 8, height: 8 }}
      />

      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        borderBottom: `1px solid ${color.border}`,
        flexShrink: 0, userSelect: 'none',
        borderRadius: '10px 10px 0 0',
      }}>
        {/* Scrollable section */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 1,
          padding: '5px 6px', flex: 1, minWidth: 0,
          overflowX: 'auto', overflowY: 'visible',
          scrollbarWidth: 'none',
        }}>
          {/* Color dot — portal trigger */}
          <div
            ref={colorDotRef}
            onClick={openPicker}
            style={{
              width: 16, height: 16, borderRadius: '50%',
              background: color.border, cursor: 'pointer',
              border: '2px solid rgba(0,0,0,0.2)',
              flexShrink: 0, marginRight: 4,
            }}
          />

          <Divider />
          <Btn cmd="bold"      active={activeFormats.bold}      title="Bold"><b>B</b></Btn>
          <Btn cmd="italic"    active={activeFormats.italic}    title="Italic"><em>I</em></Btn>
          <Btn cmd="underline" active={activeFormats.underline} title="Underline">
            <span style={{ textDecoration: 'underline' }}>U</span>
          </Btn>
          <Divider />
          <Btn cmd="insertUnorderedList" title="Bullet list"><span style={{ fontSize: 13 }}>•≡</span></Btn>
          <Btn cmd="insertOrderedList"   title="Numbered list"><span style={{ fontSize: 11 }}>1≡</span></Btn>
          <Divider />
          <Btn cmd="formatBlock" value="h2" title="Large heading"><span style={{ fontSize: 11, fontWeight: 800 }}>H2</span></Btn>
          <Btn cmd="formatBlock" value="h3" title="Small heading"><span style={{ fontSize: 10, fontWeight: 700 }}>H3</span></Btn>
          <Btn cmd="formatBlock" value="p"  title="Normal paragraph"><span style={{ fontSize: 11, fontFamily: 'serif' }}>¶</span></Btn>
        </div>

        {/* Pinned delete */}
        <div style={{ padding: '0 8px', flexShrink: 0, borderLeft: `1px solid ${color.border}`, display: 'flex', alignItems: 'center', alignSelf: 'stretch' }}>
          <button
            onClick={(e) => { stop(e); deleteElements({ nodes: [{ id }] }); }}
            title="Delete note"
            style={{
              width: 18, height: 18, borderRadius: 4,
              background: 'transparent', border: `1px solid ${color.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 9, color: color.text,
              padding: 0, lineHeight: 1, transition: 'all 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.15)'; e.currentTarget.style.borderColor = '#c0392b'; e.currentTarget.style.color = '#c0392b'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = color.border; e.currentTarget.style.color = color.text; }}
          >✕</button>
        </div>
      </div>

      {/* ── Editor ── */}
      <div
        className="nodrag nopan nowheel"
        style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '0 0 10px 10px' }}
        onClick={() => editorRef.current?.focus()}
      >
        {isEmpty && (
          <div style={{
            position: 'absolute', top: 10, left: 12,
            fontSize: 13, color: `${color.text}55`,
            pointerEvents: 'none', userSelect: 'none', fontStyle: 'italic',
          }}>Write a note...</div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="nodrag nopan nowheel"
          onInput={handleInput}
          onKeyUp={(e) => { stop(e); updateActiveFormats(); saveSelection(); }}
          onMouseUp={() => { updateActiveFormats(); saveSelection(); }}
          onKeyDown={stop}
          style={{
            width: '100%', height: '100%',
            padding: '10px 12px 10px 16px',
            outline: 'none', fontSize: 13, lineHeight: 1.7,
            color: color.text, overflowY: 'auto',
            boxSizing: 'border-box', cursor: 'text',
            userSelect: 'text', WebkitUserSelect: 'text',
          }}
        />
      </div>

      {/* ── Color picker rendered as portal directly in document.body ── */}
      {showColorPicker && createPortal(
        <div
          onClick={(e) => stop(e)}
          style={{
            position: 'fixed',
            top: pickerPos.top,
            left: pickerPos.left,
            background: '#1c1c1a',
            border: '1px solid #3d3d3a',
            borderRadius: 8,
            padding: '8px 10px',
            display: 'flex', gap: 7,
            zIndex: 99999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          {NOTE_COLORS.map((c, i) => (
            <div
              key={i}
              onClick={(e) => { stop(e); setColorIdx(i); setShowColorPicker(false); }}
              title={c.label}
              style={{
                width: 20, height: 20, borderRadius: '50%',
                background: c.bg, border: `2px solid ${c.border}`,
                cursor: 'pointer', flexShrink: 0,
                outline: colorIdx === i ? '2px solid #e8a23a' : 'none',
                outlineOffset: 2,
                transition: 'transform 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};