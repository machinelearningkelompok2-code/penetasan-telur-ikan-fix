import requests
import time
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# --- SUPABASE CONFIGURATION ---
# In Railway, these should be set in the service variables dashboard
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("WARNING: SUPABASE_URL or SUPABASE_KEY not found in environment variables!")
    # Fallback for local development (optional, but recommended to use .env)
    if not SUPABASE_URL: SUPABASE_URL = "https://zcumouzhjwymkrhitqpw.supabase.co"
    if not SUPABASE_KEY: SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdW1vdXpoand5bWtyaGl0cXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NDEwNTQsImV4cCI6MjA5NTIxNzA1NH0.PZPcHkzJ3lrz7z8CHmD6YsHc7Ft54hRgRe6_OAMrEbI"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Path configurations
MODEL_STATUS_PATH = 'backend/models/model_status.pkl'
MODEL_PROB_PATH = 'backend/models/model_prob.pkl'
MODEL_TIME_PATH = 'backend/models/model_time.pkl'

# Load Models once at startup
print("Loading Pure AI Intelligence Layers...")
model_status = None
model_prob = None
model_time = None

try:
    if os.path.exists(MODEL_STATUS_PATH):
        model_status = joblib.load(MODEL_STATUS_PATH)
    if os.path.exists(MODEL_PROB_PATH):
        model_prob = joblib.load(MODEL_PROB_PATH)
    if os.path.exists(MODEL_TIME_PATH):
        model_time = joblib.load(MODEL_TIME_PATH)
    print("Pure AI Intelligence Layers loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")

def process_ml():
    try:
        # 1. Ambil data sensor terbaru dari Supabase
        url_get = f"{SUPABASE_URL}/rest/v1/tb_sensor?select=*&order=id.desc&limit=1"
        response = requests.get(url_get, headers=HEADERS)
        
        if response.status_code != 200:
            print(f"[{datetime.now()}] Error fetching data: {response.status_code} - {response.text}")
            return

        data = response.json()
        if not data:
            # print(f"[{datetime.now()}] No sensor data found in Supabase.")
            return

        latest_sensor = data[0]
        sensor_id = latest_sensor['id']
        suhu = latest_sensor['suhu']
        ph = latest_sensor['ph']
        kekeruhan = latest_sensor['kekeruhan']

        # --- PURE AI PREDICTION ---
        X = pd.DataFrame([[suhu, ph, kekeruhan]], columns=['suhu', 'ph', 'kekeruhan'])
        
        # 1. Prediksi Status
        if model_status is not None:
            res_status = model_status.predict(X)[0]
            status = "Berhasil" if res_status == 1 else "Gagal"
        else:
            status = "Gagal"

        # 2. Prediksi Skor Kualitas (%)
        if model_prob is not None:
            prob = float(model_prob.predict(X)[0])
        else:
            prob = 0.0

        # 3. Prediksi Estimasi Waktu (Jam)
        if model_time is not None:
            estimasi = float(model_time.predict(X)[0])
        else:
            estimasi = 0.0

        status_text = f"{status} ({prob:.1f}%)"

        # 2. Cek apakah prediksi sudah ada untuk sensor_id ini
        url_check = f"{SUPABASE_URL}/rest/v1/tb_prediksi?sensor_id=eq.{sensor_id}&select=id"
        check_res = requests.get(url_check, headers=HEADERS)
        
        payload = {
            "sensor_id": sensor_id,
            "status_keberhasilan": status_text,
            "estimasi_waktu_tetas": estimasi,
            "probabilitas": prob,
            "waktu_prediksi": datetime.now().isoformat()
        }

        if check_res.status_code == 200 and check_res.json():
            # UPDATE
            exists_data = check_res.json()
            pred_id = exists_data[0]['id']
            url_update = f"{SUPABASE_URL}/rest/v1/tb_prediksi?id=eq.{pred_id}"
            upd_res = requests.patch(url_update, headers=HEADERS, json=payload)
            if upd_res.status_code >= 400:
                print(f"Update error: {upd_res.text}")
        else:
            # INSERT
            url_insert = f"{SUPABASE_URL}/rest/v1/tb_prediksi"
            ins_res = requests.post(url_insert, headers=HEADERS, json=payload)
            if ins_res.status_code >= 400:
                print(f"Insert error: {ins_res.text}")
        
        print(f"[{datetime.now()}] Pure AI -> Status: {status}, Score: {prob:.1f}%, Time: {estimasi:.1f}h (Sensor ID: {sensor_id})")

    except Exception as e:
        print(f"[{datetime.now()}] Intelligence Layer Error: {e}")

if __name__ == "__main__":
    print("Intelligence Layer (AI Trained) Started (Supabase Mode)...")
    while True:
        process_ml()
        time.sleep(30)
