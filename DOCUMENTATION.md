# 🐟 Aqualyze AI: Sistem Monitoring & Prediksi Penetasan Telur Ikan

## 📝 Deskripsi Proyek
Aqualyze AI adalah sistem monitoring cerdas berbasis IoT dan Machine Learning yang dirancang untuk memantau kondisi lingkungan penetasan telur ikan secara real-time. Proyek ini mengintegrasikan sensor fisik (ESP32), database cloud (Supabase), dan algoritma kecerdasan buatan (Random Forest & LSTM) untuk memprediksi keberhasilan penetasan serta memberikan estimasi waktu tetas.

Sistem ini membantu mahasiswa dan pembudidaya ikan dalam menganalisis stabilitas parameter air seperti Suhu, pH, dan Kekeruhan (Turbidity) menggunakan pendekatan ilmiah (Gaussian Bell Curve) untuk menentukan skor kualitas lingkungan.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide React (Icons), Recharts (Visualisasi).
- **Backend (Web)**: Next.js API Routes (Serverless).
- **Backend (ML)**: Python 3, Scikit-Learn, Joblib, Pandas, Requests.
- **Database**: Supabase (PostgreSQL) dengan REST API integration.
- **Hardware Interface**: ESP32 (Arduino C++) untuk pengiriman data sensor.

---

## 📂 Struktur Folder & Penjelasan

### 📁 Root Directory
- `.env.local`: Menyimpan variabel lingkungan sensitif (Supabase URL & API Key).
- `dev.js`: Skrip otomasi untuk menjalankan server Next.js dan service Python secara bersamaan.
- `package.json`: Konfigurasi dependensi Node.js dan skrip proyek.
- `next.config.ts`: Konfigurasi framework Next.js.

### 📁 /app (Next.js App Router)
Berisi logika halaman dan API backend utama.
- `page.tsx`: Dashboard utama yang menampilkan metrik, grafik, dan panel prediksi AI.
- `layout.tsx`: Kerangka dasar aplikasi (HTML/Body/Fonts).
- `globals.css`: Definisi style global dan desain **Glassmorphism**.
- **📁 api/**:
  - `data/route.ts`: API untuk mengambil data sensor terbaru dan prediksi dari Supabase.
  - `alerts/route.ts`: API untuk mengambil riwayat anomali atau kondisi fatal.
- **📁 alerts/**:
  - `page.tsx`: Halaman khusus untuk melihat riwayat data yang melampaui ambang batas normal.

### 📁 /backend (Core Logic & IoT)
Berisi semua hal yang berkaitan dengan kecerdasan buatan dan integrasi hardware.
- **📁 python/**:
  - `ml_service.py`: Layanan utama yang berjalan di background. Tugasnya mengambil data dari Supabase, melakukan prediksi menggunakan model `.pkl`, dan mengupdate hasil prediksi kembali ke database.
- **📁 models/**:
  - `model_status.pkl`: Model AI untuk prediksi status (Berhasil/Gagal).
  - `model_prob.pkl`: Model AI untuk skor probabilitas keberhasilan.
  - `model_time.pkl`: Model AI untuk estimasi waktu penetasan.
- **📁 arduino/**:
  - `esp32_code.md`: Dokumentasi/kode firmware untuk perangkat ESP32 agar bisa mengirim data ke Supabase.
- **📁 database/**:
  - `setup_supabase.py`: Skrip bantuan untuk inisialisasi tabel di Supabase.

### 📁 /components (Reusable UI)
Berisi komponen-komponen antarmuka yang digunakan di dashboard.
- `MetricsCard.tsx`: Kartu metrik dengan animasi progres bar dan skor Gaussian.
- `RealTimeChart.tsx`: Grafik tren sensor menggunakan Recharts dengan efek gradasi.
- `PredictionPanel.tsx`: Panel khusus hasil analisis AI dan ulasan pakar.
- `StatusBadge.tsx`: Label status (Berhasil/Gagal) dengan efek animasi pulse.

### 📁 /lib (Utilities)
- `supabase.ts`: Inisialisasi client Supabase yang terhubung dengan environment variables.

---

## 🚀 Cara Menjalankan Project

1. **Persiapan Database**: Pastikan tabel `tb_sensor` dan `tb_prediksi` sudah ada di Supabase.
2. **Konfigurasi Environment**: Pastikan file `.env.local` sudah terisi dengan kredensial Supabase yang benar.
3. **Install Dependensi**:
   ```bash
   npm install
   ```
4. **Jalankan Aplikasi**:
   ```bash
   npm run dev
   ```
   *Skrip ini akan menjalankan Next.js di port 3000 dan secara otomatis memulai `ml_service.py`.*

---

## 🔬 Parameter Ambang Batas (Scientific Standard)
Sistem menggunakan standar jurnal perikanan untuk menentukan kondisi ideal:
- **Suhu**: 25°C - 30°C
- **pH**: 6.5 - 8.5
- **Kekeruhan**: > 60 NTU (Air Jernih)

---
*Dibuat untuk keperluan Tugas Akhir / Projek Machine Learning Semester 6.*
