from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import json
from dotenv import load_dotenv
from datetime import datetime
import sqlite3

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load the trained model (use absolute paths to avoid issues when the
# working directory is different than the backend folder)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'viral_model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'models', 'scaler.pkl')
DATABASE = os.path.join(BASE_DIR, 'data', 'viral_predictions.db')

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content_length INTEGER,
            hashtags_count INTEGER,
            mentions_count INTEGER,
            urls_count INTEGER,
            emojis_count INTEGER,
            engagement_rate REAL,
            posting_hour INTEGER,
            day_of_week INTEGER,
            prediction REAL,
            is_viral BOOLEAN,
            confidence REAL,
            created_at TIMESTAMP,
            content_preview TEXT
        )
    ''')
    conn.commit()
    conn.close()

@app.before_request
def setup():
    """Initialize app on startup"""
    if not os.path.exists(DATABASE):
        init_db()

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Viral Predictor API is running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict if content will go viral"""
    try:
        data = request.get_json()
        print(f"[predict] received data: {data}")
        
        # Validate input
        required_fields = ['content_length', 'hashtags_count', 'mentions_count', 
                         'urls_count', 'emojis_count', 'engagement_rate',
                         'posting_hour', 'day_of_week', 'content_preview']
        
        for field in required_fields:
            if field not in data:
                print(f"[predict] missing field: {field}")
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Load model and scaler
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        
        # Prepare features
        features = [
            data['content_length'],
            data['hashtags_count'],
            data['mentions_count'],
            data['urls_count'],
            data['emojis_count'],
            data['engagement_rate'],
            data['posting_hour'],
            data['day_of_week']
        ]
        
        # Scale features
        features_scaled = scaler.transform([features])
        
        # Make prediction
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0]
        
        # convert numpy types to native python types
        is_viral = bool(prediction == 1)
        confidence = float(max(probability))
        
        # Store prediction in database
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO predictions 
            (content_length, hashtags_count, mentions_count, urls_count, 
             emojis_count, engagement_rate, posting_hour, day_of_week, 
             prediction, is_viral, confidence, created_at, content_preview)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['content_length'],
            data['hashtags_count'],
            data['mentions_count'],
            data['urls_count'],
            data['emojis_count'],
            data['engagement_rate'],
            data['posting_hour'],
            data['day_of_week'],
            float(prediction),
            is_viral,
            confidence,
            datetime.now(),
            data.get('content_preview', '')[:200]
        ))
        conn.commit()
        conn.close()
        
        return jsonify({
            'is_viral': is_viral,
            'confidence': confidence,
            'probability_not_viral': float(probability[0]),
            'probability_viral': float(probability[1]),
            'recommendation': 'This content has high potential to go viral!' if is_viral else 'Consider improving engagement factors',
            'timestamp': datetime.now().isoformat()
        })
        
    except FileNotFoundError:
        return jsonify({'error': 'Model not found. Please train the model first.'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predictions/history', methods=['GET'])
def get_history():
    """Get prediction history"""
    try:
        limit = request.args.get('limit', 10, type=int)
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, is_viral, confidence, created_at, content_preview
            FROM predictions
            ORDER BY created_at DESC
            LIMIT ?
        ''', (limit,))
        
        predictions = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        # convert any datetime objects to iso strings
        for pred in predictions:
            val = pred.get('created_at')
            if isinstance(val, datetime):
                pred['created_at'] = val.isoformat()
        
        return jsonify({
            'predictions': predictions,
            'count': len(predictions)
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"[get_history] error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/predictions/stats', methods=['GET'])
def get_stats():
    """Get prediction statistics"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*) as total FROM predictions')
        total = cursor.fetchone()['total']
        
        cursor.execute('SELECT COUNT(*) as viral FROM predictions WHERE is_viral = 1')
        viral = cursor.fetchone()['viral']
        
        cursor.execute('SELECT AVG(confidence) as avg_confidence FROM predictions')
        avg_confidence = cursor.fetchone()['avg_confidence'] or 0
        
        conn.close()
        
        return jsonify({
            'total_predictions': total,
            'viral_count': viral,
            'non_viral_count': total - viral,
            'viral_percentage': (viral / total * 100) if total > 0 else 0,
            'average_confidence': avg_confidence
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000 , host='0.0.0.0')
