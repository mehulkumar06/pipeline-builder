import { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { BaseNode, NodeLabel, NodeInput, NodeSelect } from './baseNode';

export const InputNode = ({ id, data }) => {
  const { deleteElements } = useReactFlow();
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  return (
    <BaseNode id={id} title="Input" accentColor="#5a9e6f"
      inputs={[]} outputs={[{ id: 'value', label: 'value' }]}
      onDelete={() => deleteElements({ nodes: [{ id }] })}>
      <NodeLabel>Name<NodeInput value={currName} onChange={e => setCurrName(e.target.value)} /></NodeLabel>
      <NodeLabel>Type
        <NodeSelect value={inputType} onChange={e => setInputType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </NodeSelect>
      </NodeLabel>
    </BaseNode>
  );
};