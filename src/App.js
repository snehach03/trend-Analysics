import React, { useState, useEffect } from 'react';
import './App.css';
import PredictorForm from './components/PredictorForm';
import ResultDisplay from './components/ResultDisplay';
import History from './components/History';
import Statistics from './components/Statistics';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('predictor');

  const handlePredict = async (formData) => {
    console.log('Submitting prediction payload', formData);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Received response status', response.status);

      if (!response.ok) {
        // attempt to read server error message
        const errText = await response.text();
        console.error('Server responded with error:', errText);
        throw new Error(errText || 'Failed to make prediction');
      }

      const data = await response.json();
      console.log('Prediction data', data);
      setResult(data);
      // stay on predictor tab so the result card is visible
      setActiveTab('predictor');
    } catch (err) {
      console.error('Prediction request failed', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>🚀 Viral Content Predictor</h1>
          <p>AI-powered prediction of your content's viral potential</p>
        </div>
      </header>

      <nav className="tabs">
        <button 
          className={`tab-button ${activeTab === 'predictor' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictor')}
        >
          📝 Predictor
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📊 History
        </button>
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📈 Statistics
        </button>
      </nav>

      <main className="container">
        {activeTab === 'predictor' && (
          <div className="content-section">
            {error && <div className="error-message">❌ {error}</div>}
            <PredictorForm onSubmit={handlePredict} loading={loading} />
            {result ? <ResultDisplay result={result} /> : null}
          </div>
        )}
        
        {activeTab === 'history' && <History />}
        {activeTab === 'stats' && <Statistics />}
      </main>

      <footer className="footer">
        <p>© 2024 Viral Content Predictor. Built with ML & React.</p>
      </footer>
    </div>
  );
}

export default App;
