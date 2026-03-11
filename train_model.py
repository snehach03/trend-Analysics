"""
Train ML model to predict viral content
This script creates synthetic training data and trains a Random Forest classifier
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_auc_score
import joblib
import os
import json

# Set random seed for reproducibility
np.random.seed(42)

def generate_synthetic_data(n_samples=1000):
    """
    Generate synthetic viral content data
    Features:
    - content_length: Length of the content (words)
    - hashtags_count: Number of hashtags
    - mentions_count: Number of mentions
    - urls_count: Number of URLs
    - emojis_count: Number of emojis
    - engagement_rate: Initial engagement rate (%)
    - posting_hour: Hour of posting (0-23)
    - day_of_week: Day of week (0-6)
    """
    
    data = {
        'content_length': np.random.randint(10, 500, n_samples),
        'hashtags_count': np.random.randint(0, 30, n_samples),
        'mentions_count': np.random.randint(0, 20, n_samples),
        'urls_count': np.random.randint(0, 5, n_samples),
        'emojis_count': np.random.randint(0, 15, n_samples),
        'engagement_rate': np.random.uniform(0, 50, n_samples),
        'posting_hour': np.random.randint(0, 24, n_samples),
        'day_of_week': np.random.randint(0, 7, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Create target variable (viral or not)
    # Content is more likely to be viral if it has:
    # - Good number of hashtags (3-15)
    # - Mentions (1-10)
    # - Some emojis (3-10)
    # - Posted at peak hours (10-20)
    # - High engagement rate (>10%)
    
    viral_score = (
        (df['hashtags_count'] > 3) & (df['hashtags_count'] < 15) * 0.25 +
        (df['mentions_count'] > 0) & (df['mentions_count'] < 10) * 0.25 +
        (df['emojis_count'] > 2) & (df['emojis_count'] < 12) * 0.2 +
        (df['posting_hour'] >= 10) & (df['posting_hour'] <= 20) * 0.2 +
        (df['engagement_rate'] > 10) * 0.1
    )
    
    # Add some noise to make it more realistic
    viral_score = viral_score + np.random.normal(0, 0.1, n_samples)
    df['is_viral'] = (viral_score > 0.5).astype(int)
    
    return df

def train_model():
    """Train the viral prediction model"""
    
    print("=" * 60)
    print("VIRAL CONTENT PREDICTOR - MODEL TRAINING")
    print("=" * 60)
    
    # Create data directory if not exists
    os.makedirs('data', exist_ok=True)
    os.makedirs('models', exist_ok=True)
    
    # Generate data
    print("\n1. Generating synthetic training data...")
    df = generate_synthetic_data(n_samples=1000)
    print(f"   ✓ Generated {len(df)} samples")
    
    # Save training data
    df.to_csv('data/training_data.csv', index=False)
    print(f"   ✓ Training data saved to data/training_data.csv")
    
    # Data statistics
    print(f"\n   Data Statistics:")
    print(f"   - Viral samples: {df['is_viral'].sum()} ({df['is_viral'].mean()*100:.1f}%)")
    print(f"   - Non-viral samples: {(df['is_viral']==0).sum()} ({(df['is_viral']==0).mean()*100:.1f}%)")
    
    # Prepare features
    print("\n2. Preparing features...")
    X = df[['content_length', 'hashtags_count', 'mentions_count', 'urls_count',
             'emojis_count', 'engagement_rate', 'posting_hour', 'day_of_week']]
    y = df['is_viral']
    print(f"   ✓ Features prepared: {X.shape}")
    
    # Split data
    print("\n3. Splitting data into train/test sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"   ✓ Training set: {X_train.shape}")
    print(f"   ✓ Test set: {X_test.shape}")
    
    # Scale features
    print("\n4. Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print(f"   ✓ Features scaled")
    
    # Train model
    print("\n5. Training Random Forest classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train_scaled, y_train)
    print(f"   ✓ Model trained successfully")
    
    # Evaluate model
    print("\n6. Evaluating model...")
    y_pred = model.predict(X_test_scaled)
    y_pred_proba = model.predict_proba(X_test_scaled)
    
    accuracy = accuracy_score(y_test, y_pred)
    auc_score = roc_auc_score(y_test, y_pred_proba[:, 1])
    
    print(f"   ✓ Accuracy: {accuracy:.4f}")
    print(f"   ✓ AUC Score: {auc_score:.4f}")
    
    print("\n   Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Not Viral', 'Viral']))
    
    # Feature importance
    print("\n7. Feature Importance:")
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    for idx, row in feature_importance.iterrows():
        print(f"   - {row['feature']}: {row['importance']:.4f}")
    
    # Save model
    print("\n8. Saving model and scaler...")
    joblib.dump(model, 'models/viral_model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    joblib.dump(feature_importance.to_dict('records'), 'models/feature_importance.json')
    print(f"   ✓ Model saved to models/viral_model.pkl")
    print(f"   ✓ Scaler saved to models/scaler.pkl")
    print(f"   ✓ Feature importance saved")
    
    # Save metrics
    metrics = {
        'accuracy': accuracy,
        'auc_score': auc_score,
        'training_samples': len(X_train),
        'test_samples': len(X_test),
        'features': list(X.columns),
        'feature_importance': feature_importance.to_dict('records')
    }
    
    with open('models/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print("\n" + "=" * 60)
    print("✓ MODEL TRAINING COMPLETED SUCCESSFULLY!")
    print("=" * 60)
    
    return model, scaler

if __name__ == '__main__':
    train_model()
