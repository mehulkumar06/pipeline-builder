// ui.js

import { useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  EdgeLabelRenderer,
  BaseEdge,
  getSmoothStepPath,
} from 'reactflow';
import { useStore } from './store';
import { InputNode }    from './nodes/inputNode';
import { LLMNode }      from './nodes/llmNode';
import { OutputNode }   from './nodes/outputNode';
import { TextNode }     from './nodes/textNode';
import { FilterNode, MathNode, APINode, ConditionNode, TransformNode } from './nodes/newNodes';
import { NoteNode } from './nodes/noteNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

// ── Custom deletable edge ────────────────────────────────────────────────────
const DeletableEdge = ({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, selected,
}) => {
  const { deleteElements } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke: selected ? '#e8a23a' : '#3d3d3a',
          strokeWidth: selected ? 2 : 1.5,
          transition: 'stroke 0.12s',
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            opacity: selected ? 1 : 0,
            transition: 'opacity 0.15s',
          }}
          className="nodrag nopan"
        >
          <button
            onClick={() => deleteElements({ edges: [{ id }] })}
            title="Delete connection"
            style={{
              width: 18, height: 18, borderRadius: '50%',
              background: '#1c1c1a', border: '1px solid #c0392b',
              color: '#e05a4a', fontSize: 9,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              padding: 0, fontFamily: 'inherit',
            }}
          >✕</button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

// ── Node + edge type registries (must be outside component) ─────────────────
const nodeTypes = {
  customInput:  InputNode,
  customOutput: OutputNode,
  llm:          LLMNode,
  text:         TextNode,
  filter:       FilterNode,
  math:         MathNode,
  api:          APINode,
  condition:    ConditionNode,
  transform:    TransformNode,
  note:         NoteNode,
};

const edgeTypes = { deletable: DeletableEdge };

// ── Empty canvas hint ────────────────────────────────────────────────────────
const EmptyState = () => (
  <div style={{
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 12,
    pointerEvents: 'none', userSelect: 'none',
    zIndex: 5,
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 14,
      border: '1.5px dashed #2e2e2b',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20, color: '#3d3d3a',
    }}>
      +
    </div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: '#555552', marginBottom: 4 }}>
        Canvas is empty
      </div>
      <div style={{ fontSize: 11, color: '#3d3d3a', lineHeight: 1.6 }}>
        Drag nodes from the toolbar above<br />to start building your pipeline
      </div>
    </div>
    <div style={{
      display: 'flex', gap: 16, marginTop: 4,
    }}>
      {['Input', 'LLM', 'Output'].map(label => (
        <div key={label} style={{
          fontSize: 10, color: '#3d3d3a',
          border: '1px dashed #2e2e2b',
          borderRadius: 6, padding: '3px 10px',
          letterSpacing: '0.05em',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {label}
        </div>
      ))}
    </div>
  </div>
);

// ── Main Flow component ──────────────────────────────────────────────────────
const Flow = () => {
  const { screenToFlowPosition, deleteElements } = useReactFlow();

  const nodes         = useStore((s) => s.nodes);
  const edges         = useStore((s) => s.edges);
  const getNodeID     = useStore((s) => s.getNodeID);
  const addNode       = useStore((s) => s.addNode);
  const onNodesChange = useStore((s) => s.onNodesChange);
  const onEdgesChange = useStore((s) => s.onEdgesChange);
  const onConnect     = useStore((s) => s.onConnect);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/reactflow');
    if (!data) return;
    let appData;
    try { appData = JSON.parse(data); } catch { return; }
    const type = appData?.nodeType;
    if (!type || !nodeTypes[type]) return;
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    const nodeID = getNodeID(type);
    // Notes get a default size so they're usable immediately
    const style = type === 'note' ? { width: 280, height: 200 } : {};
    addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type }, style });
  }, [screenToFlowPosition, getNodeID, addNode]);

  const onEdgeContextMenu = useCallback((e, edge) => {
    e.preventDefault();
    deleteElements({ edges: [{ id: edge.id }] });
  }, [deleteElements]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Show empty state hint only when canvas has no nodes */}
      {nodes.length === 0 && <EmptyState />}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onEdgeContextMenu={onEdgeContextMenu}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'deletable', animated: false }}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        deleteKeyCode="Delete"
        fitView
      >
        <Background
          color="#2a2a27"
          gap={gridSize}
          variant="dots"
          style={{ background: '#111110' }}
        />
        <Controls style={{
          background: '#1c1c1a',
          border: '1px solid #2e2e2b',
          borderRadius: 8, overflow: 'hidden',
        }} />
        <MiniMap
          style={{
            background: '#161614',
            border: '1px solid #2e2e2b',
            borderRadius: 8,
          }}
          nodeColor="#2e2e2b"
          maskColor="rgba(0,0,0,0.6)"
        />
      </ReactFlow>
    </div>
  );
};

export const PipelineUI = () => (
  <div style={{ width: '100%', height: '100%', background: '#111110' }}>
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  </div>
);