import React, { useState, useEffect } from 'react';
import './Statistics.css';

function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/predictions/stats');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading statistics...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  if (!stats || stats.total_predictions === 0) {
    return (
      <div className="stats-container">
        <p className="empty-message">No statistics available yet. Make some predictions!</p>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <h2>📈 Overall Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Total Predictions</div>
            <div className="stat-value">{stats.total_predictions}</div>
          </div>
        </div>

        <div className="stat-card viral">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <div className="stat-label">Viral Content</div>
            <div className="stat-value">{stats.viral_count}</div>
            <div className="stat-percentage">{stats.viral_percentage.toFixed(1)}%</div>
          </div>
        </div>

        <div className="stat-card not-viral">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <div className="stat-label">Non-Viral Content</div>
            <div className="stat-value">{stats.non_viral_count}</div>
            <div className="stat-percentage">{(100 - stats.viral_percentage).toFixed(1)}%</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-label">Avg. Confidence</div>
            <div className="stat-value">{(stats.average_confidence * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h3>Distribution of Predictions</h3>
        <div className="chart-bar">
          <div className="bar-segment viral" style={{ width: `${stats.viral_percentage}%` }}>
            <span className="bar-label">
              {stats.viral_percentage > 10 && `${stats.viral_percentage.toFixed(0)}%`}
            </span>
          </div>
          <div className="bar-segment not-viral" style={{ width: `${100 - stats.viral_percentage}%` }}>
            <span className="bar-label">
              {(100 - stats.viral_percentage) > 10 && `${(100 - stats.viral_percentage).toFixed(0)}%`}
            </span>
          </div>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color viral"></div>
            Viral ({stats.viral_count})
          </div>
          <div className="legend-item">
            <div className="legend-color not-viral"></div>
            Non-Viral ({stats.non_viral_count})
          </div>
        </div>
      </div>

      <button className="refresh-button" onClick={fetchStats}>
        🔄 Refresh
      </button>
    </div>
  );
}

export default Statistics;
