import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
import joblib
import os

# 1. Generate Synthetic Dataset with Smooth Scoring
def generate_dataset(n_samples=10000):
    print(f"Generating {n_samples} samples with journal-based logic...")
    np.random.seed(42)
    
    suhu = np.random.uniform(10, 45, n_samples) # Rentang lebih luas agar AI banyak lihat kondisi fatal
    ph = np.random.uniform(2, 13, n_samples)
    kekeruhan = np.random.uniform(0, 100, n_samples)
    
    status = []
    probabilitas = []
    estimasi_waktu = []
    
    for i in range(n_samples):
        s, p, k = suhu[i], ph[i], kekeruhan[i]
        
        # Smooth Temperature Score (Optimal 25-30, Fatal <20 or >35)
        s_score = 45 * np.exp(-((s - 27.5)**2) / (2 * 4.5**2))
        
        # Smooth pH Score (Optimal 6.5-8.5, Fatal <5 or >10)
        p_score = 40 * np.exp(-((p - 7.5)**2) / (2 * 2.5**2))
        
        # Smooth Turbidity Score (Sigmoid-like, favor > 60)
        k_score = 15 * (1 / (1 + np.exp(-(k - 50) / 10)))
        
        total_score = s_score + p_score + k_score
        total_score += np.random.normal(0, 1) # Small noise
        total_score = max(min(total_score, 100), 0)
        
        # Binary status based on smooth score
        # WAJIB GAGAL jika kondisi FATAL
        is_fatal = (s < 20 or s > 35) or (p < 5 or p > 10) or (k < 30)
        
        if is_fatal:
            is_success = False
            total_score = min(total_score, 20.0)
            base_time = 0.0
        else:
            is_success = total_score >= 40
            # Jika tidak sukses (Gagal biasa), waktu tetap 0
            base_time = (1300 / s) + np.random.normal(0, 0.5) if is_success else 0.0
            
        status.append(1 if is_success else 0)
        probabilitas.append(total_score)
        estimasi_waktu.append(base_time)
        
    df = pd.DataFrame({
        'suhu': suhu, 'ph': ph, 'kekeruhan': kekeruhan,
        'status': status, 'probabilitas': probabilitas, 'estimasi_waktu': estimasi_waktu
    })
    return df

# 2. Train and Save Models
def train_models():
    df = generate_dataset()
    
    X = df[['suhu', 'ph', 'kekeruhan']]
    y_status = df['status']
    y_prob = df['probabilitas']
    y_time = df['estimasi_waktu']
    
    print("Training AI Intelligence Layers...")
    
    # Model 1: Classifier for Status (Berhasil/Gagal)
    model_status = RandomForestClassifier(n_estimators=100, random_state=42)
    model_status.fit(X, y_status)
    
    # Model 2: Regressor for Probability Score (%)
    model_prob = RandomForestRegressor(n_estimators=100, random_state=42)
    model_prob.fit(X, y_prob)
    
    # Model 3: Regressor for Estimation Time
    model_time = RandomForestRegressor(n_estimators=100, random_state=42)
    model_time.fit(X, y_time)
    
    # Save all models
    if not os.path.exists('backend/models'):
        os.makedirs('backend/models')
        
    joblib.dump(model_status, 'backend/models/model_status.pkl')
    joblib.dump(model_prob, 'backend/models/model_prob.pkl')
    joblib.dump(model_time, 'backend/models/model_time.pkl')
    
    print("Pure AI Intelligence Layers saved successfully in backend/models/")

if __name__ == "__main__":
    train_models()
