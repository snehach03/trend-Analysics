import React, { useState, useEffect } from 'react';
import './History.css';

function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/predictions/history?limit=20');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setPredictions(data.predictions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading predictions...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="history-container">
      <h2>📊 Prediction History</h2>
      
      {predictions.length === 0 ? (
        <p className="empty-message">No predictions yet. Create one to get started!</p>
      ) : (
        <div className="history-list">
          {predictions.map((pred, index) => (
            <div key={pred.id} className={`history-item ${pred.is_viral ? 'viral' : 'not-viral'}`}>
              <div className="item-number">#{predictions.length - index}</div>
              <div className="item-content">
                <div className="item-header">
                  <span className={`status ${pred.is_viral ? 'viral' : 'not-viral'}`}>
                    {pred.is_viral ? '🚀 VIRAL' : '📍 NOT VIRAL'}
                  </span>
                  <span className="confidence">{(pred.confidence * 100).toFixed(1)}% confidence</span>
                </div>
                <div className="item-preview">{pred.content_preview || 'No preview available'}</div>
                <div className="item-time">
                  {new Date(pred.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="refresh-button" onClick={fetchHistory}>
        🔄 Refresh
      </button>
    </div>
  );
}

export default History;
