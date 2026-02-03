import { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', padding: 24, fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#f87171' }}>Erreur</h1>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
