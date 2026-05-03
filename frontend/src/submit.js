import { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
  const [loading, setLoading] = useState(false);
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const { num_nodes, num_edges, is_dag } = await response.json();
      alert(`Pipeline Analysis\n─────────────────\nNodes:  ${num_nodes}\nEdges:  ${num_edges}\nIs DAG: ${is_dag ? '✓ Yes (no cycles)' : '✗ No (cycle detected)'}`);
    } catch (err) {
      alert(`Error: ${err.message}\n\nMake sure FastAPI is running on port 8000.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '14px', background: '#161614', borderTop: '1px solid #2e2e2b' }}>
      <button onClick={handleSubmit} disabled={loading}
        style={{ background: loading ? '#2e2e2b' : '#e8a23a',
          color: loading ? '#878680' : '#111110',
          border: 'none', borderRadius: 7,
          padding: '9px 28px', fontSize: 12,
          fontFamily: "'Inter', sans-serif", fontWeight: 600,
          letterSpacing: '0.04em', cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background 0.12s, transform 0.1s',
          boxShadow: loading ? 'none' : '0 2px 12px rgba(232,162,58,0.25)',
        }}
        onMouseEnter={(e) => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; }}
      >
        {loading ? 'Analyzing…' : 'Run Pipeline'}
      </button>
    </div>
  );
};