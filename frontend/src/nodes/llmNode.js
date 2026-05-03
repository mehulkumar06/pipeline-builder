import { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { BaseNode, NodeLabel, NodeSelect } from './baseNode';

export const LLMNode = ({ id, data }) => {
  const { deleteElements } = useReactFlow();
  const [model, setModel] = useState(data?.model || 'gpt-4o');
  return (
    <BaseNode id={id} title="LLM" accentColor="#7a6eaa"
      inputs={[{ id: 'system', label: 'system' }, { id: 'prompt', label: 'prompt' }]}
      outputs={[{ id: 'response', label: 'response' }]}
      onDelete={() => deleteElements({ nodes: [{ id }] })}>
      <NodeLabel>Model
        <NodeSelect value={model} onChange={e => setModel(e.target.value)}>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-4o-mini">GPT-4o Mini</option>
          <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
          <option value="gemini-pro">Gemini Pro</option>
        </NodeSelect>
      </NodeLabel>
      <div style={{ fontSize: 10, color: '#555552', marginTop: 2 }}>
        system + prompt → response
      </div>
    </BaseNode>
  );
};