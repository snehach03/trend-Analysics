import React, { useState } from 'react';
import './PredictorForm.css';

function PredictorForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    content_length: 100,
    hashtags_count: 5,
    mentions_count: 3,
    urls_count: 1,
    emojis_count: 5,
    engagement_rate: 2.5,
    posting_hour: 14,
    day_of_week: 3,
    content_preview: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'content_preview' ? value : Number(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <form className="predictor-form" onSubmit={handleSubmit}>
      <h2>📋 Enter Your Content Details</h2>
      
      <div className="form-grid">
        <div className="form-group">
          <label>📝 Content Length (words)</label>
          <input
            type="range"
            name="content_length"
            value={formData.content_length}
            onChange={handleChange}
            min="10"
            max="500"
          />
          <span className="value-display">{formData.content_length} words</span>
        </div>

        <div className="form-group">
          <label>#️⃣ Hashtags Count</label>
          <input
            type="range"
            name="hashtags_count"
            value={formData.hashtags_count}
            onChange={handleChange}
            min="0"
            max="30"
          />
          <span className="value-display">{formData.hashtags_count}</span>
        </div>

        <div className="form-group">
          <label>@️ Mentions Count</label>
          <input
            type="range"
            name="mentions_count"
            value={formData.mentions_count}
            onChange={handleChange}
            min="0"
            max="20"
          />
          <span className="value-display">{formData.mentions_count}</span>
        </div>

        <div className="form-group">
          <label>🔗 URLs Count</label>
          <input
            type="range"
            name="urls_count"
            value={formData.urls_count}
            onChange={handleChange}
            min="0"
            max="5"
          />
          <span className="value-display">{formData.urls_count}</span>
        </div>

        <div className="form-group">
          <label>😊 Emojis Count</label>
          <input
            type="range"
            name="emojis_count"
            value={formData.emojis_count}
            onChange={handleChange}
            min="0"
            max="15"
          />
          <span className="value-display">{formData.emojis_count}</span>
        </div>

        <div className="form-group">
          <label>💬 Initial Engagement Rate (%)</label>
          <input
            type="range"
            name="engagement_rate"
            value={formData.engagement_rate}
            onChange={handleChange}
            min="0"
            max="50"
            step="0.5"
          />
          <span className="value-display">{formData.engagement_rate.toFixed(1)}%</span>
        </div>

        <div className="form-group">
          <label>⏰ Posting Hour (24h format)</label>
          <input
            type="range"
            name="posting_hour"
            value={formData.posting_hour}
            onChange={handleChange}
            min="0"
            max="23"
          />
          <span className="value-display">{String(formData.posting_hour).padStart(2, '0')}:00</span>
        </div>

        <div className="form-group">
          <label>📅 Day of Week</label>
          <select name="day_of_week" value={formData.day_of_week} onChange={handleChange}>
            {days.map((day, index) => (
              <option key={index} value={index}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group full-width">
        <label>✍️ Content Preview (optional)</label>
        <textarea
          name="content_preview"
          value={formData.content_preview}
          onChange={handleChange}
          placeholder="Enter a preview of your content..."
          rows="4"
        />
      </div>

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? '⏳ Analyzing...' : '🎯 Predict Virality'}
      </button>
    </form>
  );
}

export default PredictorForm;
