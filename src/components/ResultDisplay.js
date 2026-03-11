import React from 'react';
import './ResultDisplay.css';

function ResultDisplay({ result }) {
  const viralityPercentage = (result.probability_viral * 100).toFixed(1);
  const confidencePercentage = (result.confidence * 100).toFixed(1);

  return (
    <div className="result-display">
      <div className={`result-card ${result.is_viral ? 'viral' : 'not-viral'}`}>
        <div className="result-header">
          <h2>{result.is_viral ? '🚀 VIRAL!' : '📍 NOT VIRAL'}</h2>
          <p className="prediction-status">
            {result.is_viral 
              ? 'This content has high potential to go viral!' 
              : 'This content may not reach viral status.'}
          </p>
        </div>

        <div className="metrics-grid">
          <div className="metric">
            <label>Viral Probability</label>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${viralityPercentage}%` }}
              ></div>
            </div>
            <span className="metric-value">{viralityPercentage}%</span>
          </div>

          <div className="metric">
            <label>Model Confidence</label>
            <div className="progress-bar">
              <div 
                className="progress-fill confidence" 
                style={{ width: `${confidencePercentage}%` }}
              ></div>
            </div>
            <span className="metric-value">{confidencePercentage}%</span>
          </div>
        </div>

        <div className="probability-breakdown">
          <h3>📊 Probability Breakdown</h3>
          <div className="probability-items">
            <div className="probability-item">
              <span>Not Viral</span>
              <span className="percentage">
                {(result.probability_not_viral * 100).toFixed(1)}%
              </span>
            </div>
            <div className="probability-item">
              <span>Viral</span>
              <span className="percentage">
                {(result.probability_viral * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="recommendation">
          <h3>💡 Recommendation</h3>
          <p>{result.recommendation}</p>
        </div>

        <div className="tips">
          <h3>🎯 Tips to Improve Virality</h3>
          <ul>
            <li>Use 5-15 hashtags for better discoverability</li>
            <li>Include 2-4 relevant mentions to expand reach</li>
            <li>Add 5-8 emojis for visual appeal</li>
            <li>Post during peak hours (10 AM - 8 PM)</li>
            <li>Keep content between 100-300 words for optimal engagement</li>
            <li>Post on weekdays for better engagement</li>
          </ul>
        </div>

        <div className="timestamp">
          Prediction made: {new Date(result.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default ResultDisplay;
