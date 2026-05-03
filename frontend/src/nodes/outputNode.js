import { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { BaseNode, NodeLabel, NodeInput, NodeSelect } from './baseNode';

export const OutputNode = ({ id, data }) => {
  const { deleteElements } = useReactFlow();
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');
  return (
    <BaseNode id={id} title="Output" accentColor="#9e5a8a"
      inputs={[{ id: 'value', label: 'value' }]} outputs={[]}
      onDelete={() => deleteElements({ nodes: [{ id }] })}>
      <NodeLabel>Name<NodeInput value={currName} onChange={e => setCurrName(e.target.value)} /></NodeLabel>
      <NodeLabel>Type
        <NodeSelect value={outputType} onChange={e => setOutputType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </NodeSelect>
      </NodeLabel>
    </BaseNode>
  );
};