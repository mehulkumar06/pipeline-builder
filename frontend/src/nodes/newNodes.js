import { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { BaseNode, NodeLabel, NodeInput, NodeSelect } from './baseNode';

export const FilterNode = ({ id, data }) => {
  const { deleteElements } = useReactFlow();
  const [field, setField]       = useState(data?.field || 'status');
  const [operator, setOperator] = useState(data?.operator || 'equals');
  const [value, setValue]       = useState(data?.value || '');
  return (
    <BaseNode id={id} title="Filter" accentColor="#b87333"
      inputs={[{ id: 'list', label: 'list' }]}
      outputs={[{ id: 'match', label: 'match' }, { id: 'nomatch', label: 'no match' }]}
      onDelete={() => deleteElements({ nodes: [{ id }] })}>
      <NodeLabel>Field<NodeInput value={field} onChange={e => setField(e.target.value)} /></NodeLabel>
      <NodeLabel>Operator
        <NodeSelect value={operator} onChange={e => setOperator(e.target.value)}>
          <option value="equals">equals</option>
          <option value="not_equals">not equals</option>
          <option value="contains">contains</option>
          <option value="greater_than">greater than</option>
          <option value="less_than">less than</option>
        </NodeSelect>
      </NodeLabel>
      <NodeLabel>Value<NodeInput value={value} onChange={e => setValue(e.target.value)} placeholder="compare value" /></NodeLabel>
    </BaseNode>
  );
};

export const MathNode = ({ id, data }) => {
  const { deleteElements } = useReactFlow();
  const [operation, setOperation] = useState(data?.operation || 'add');
  const opSymbols = { add: '+', subtract: '−', multiply: '×', divide: '÷', modulo: '%', power: 'xⁿ' };
  return (
    <BaseNode id={id} title="Math" accentColor="#9e9a5a"
      inputs={[{ id: 'a', label: 'a' }, { id: 'b', label: 'b' }]}
      outputs={[{ id: 'result', label: 'result' }]}
      onDelete={() => deleteElements({ nodes: [{ id }] })}>
      <NodeLabel>Operation
        <NodeSelect value={operation} onChange={e => setOperation(e.target.value)}>
          <option value="add">Add (+)</option>
          <option value="subtract">Subtract (−)</option>
          <option value="multiply">Multiply (×)</option>
          <option value="divide">Divide (÷)</option>
          <option value="modulo">Modulo (%)</option>
          <option value="power">Power (xⁿ)</option>
        </NodeSelect>
      </NodeLabel>
      <div style={{ textAlign: 'center', fontSize: 24, fontWeight: 300, color: '#9e9a5a', padding: '4px 0', fontFamily: 'serif' }}>
        {opSymbols[operation]}
      </div>
    </BaseNode>
  );
};

export const APINode = ({ id, data }) => {
  const { deleteElements } = useReactFlow();
  const [url, setUrl]       = useState(data?.url || 'https://api.example.com');
  const [method, setMethod] = useState(data?.method || 'GET');
  const methodColors = { GET: '#5a9e6f', POST: '#5a7a9e', PUT: '#b87333', DELETE: '#c0392b', PATCH: '#7a6eaa' };
  return (
    <BaseNode id={id} title="API Request" accentColor="#5a7a9e"
      inputs={[{ id: 'body', label: 'body' }, { id: 'headers', label: 'headers' }]}
      outputs={[{ id: 'response', label: 'response' }, { id: 'error', label: 'error' }]}
      onDelete={() => deleteElements({ nodes: [{ id }] })}>
      <NodeLabel>Method
        <NodeSelect value={method} onChange={e => setMethod(e.target.value)}
          style={{ color: methodColors[method] || '#ededec' }}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </NodeSelect>
      </NodeLabel>
      <NodeLabel>URL<NodeInput value={url} onChange={e => setUrl(e.target.value)} style={{ fontSize: 10 }} /></NodeLabel>
    </BaseNode>
  );
};

export const ConditionNode = ({ id, data }) => {
  const { deleteElements } = useReactFlow();
  const [condition, setCondition] = useState(data?.condition || 'value > 0');
  return (
    <BaseNode id={id} title="Condition" accentColor="#9e6a5a"
      inputs={[{ id: 'value', label: 'value' }]}
      outputs={[{ id: 'true', label: 'true' }, { id: 'false', label: 'false' }]}
      onDelete={() => deleteElements({ nodes: [{ id }] })}>
      <NodeLabel>Expression
        <NodeInput value={condition} onChange={e => setCondition(e.target.value)} placeholder="e.g. value > 0" />
      </NodeLabel>
      <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 9, padding: '3px 0',
          borderTop: '1px solid #5a9e6f', color: '#5a9e6f', letterSpacing: '0.08em' }}>TRUE</div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 9, padding: '3px 0',
          borderTop: '1px solid #c0392b', color: '#c0392b', letterSpacing: '0.08em' }}>FALSE</div>
      </div>
    </BaseNode>
  );
};

export const TransformNode = ({ id, data }) => {
  const { deleteElements } = useReactFlow();
  const [transformType, setTransformType] = useState(data?.transformType || 'json_parse');
  const [customCode, setCustomCode]       = useState(data?.customCode || 'return input.toUpperCase()');
  const isCustom = transformType === 'custom';
  return (
    <BaseNode id={id} title="Transform" accentColor="#5a9e9a"
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[{ id: 'output', label: 'output' }]}
      onDelete={() => deleteElements({ nodes: [{ id }] })}>
      <NodeLabel>Transform
        <NodeSelect value={transformType} onChange={e => setTransformType(e.target.value)}>
          <option value="json_parse">JSON Parse</option>
          <option value="json_stringify">JSON Stringify</option>
          <option value="to_uppercase">To Uppercase</option>
          <option value="to_lowercase">To Lowercase</option>
          <option value="trim">Trim Whitespace</option>
          <option value="base64_encode">Base64 Encode</option>
          <option value="base64_decode">Base64 Decode</option>
          <option value="custom">Custom (JS)</option>
        </NodeSelect>
      </NodeLabel>
      {isCustom && (
        <NodeLabel>Code
          <textarea value={customCode} onChange={e => setCustomCode(e.target.value)} rows={3}
            style={{ background: '#111110', border: '1px solid #2e2e2b', borderRadius: 6,
              color: '#5a9e9a', padding: '6px 10px', fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace", outline: 'none',
              width: '100%', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5 }}
            onFocus={e => e.target.style.borderColor = '#5a9e9a'}
            onBlur={e  => e.target.style.borderColor = '#2e2e2b'} />
        </NodeLabel>
      )}
    </BaseNode>
  );
};