import { PipelineToolbar } from './toolbar';
import { PipelineUI }      from './ui';
import { SubmitButton }    from './submit';

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#0f1117',
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
    }}>
      <PipelineToolbar />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PipelineUI />
      </div>
      <SubmitButton />
    </div>
  );
}

export default App;