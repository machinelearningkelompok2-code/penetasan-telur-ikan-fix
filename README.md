# 🐟 Aqualyze AI: Sistem Monitoring & Prediksi Penetasan Telur Ikan

## 📝 Deskripsi Proyek
Aqualyze AI adalah sistem monitoring cerdas berbasis IoT dan Machine Learning yang dirancang untuk memantau kondisi lingkungan penetasan telur ikan secara real-time. Proyek ini mengintegrasikan sensor fisik (ESP32), database cloud (Supabase), dan algoritma kecerdasan buatan (Random Forest & LSTM) untuk memprediksi keberhasilan penetasan serta memberikan estimasi waktu tetas.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Recharts.
- **Backend**: Next.js API Routes & Python (ML Service).
- **Database**: Supabase (PostgreSQL).
- **Hardware**: ESP32.

---

## 📂 Struktur Folder Utama

| Folder | Deskripsi |
| :--- | :--- |
| `app/` | Logika halaman dashboard dan API routes Next.js. |
| `backend/python/` | Skrip Python untuk pemrosesan Machine Learning secara real-time. |
| `backend/models/` | File model AI terlatih (`.pkl`). |
| `backend/arduino/` | Kode firmware untuk perangkat keras ESP32. |
| `components/` | Komponen UI seperti grafik, kartu metrik, dan panel prediksi. |
| `lib/` | Konfigurasi library (Supabase client). |

---

## 🚀 Cara Menjalankan Project

1. **Install Dependensi**:
   ```bash
   npm install
   ```
2. **Setup Environment**:
   Buat file `.env.local` dan isi dengan:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
3. **Jalankan Aplikasi**:
   ```bash
   npm run dev
   ```

---
*Penjelasan detail mengenai struktur file dapat dilihat di [DOCUMENTATION.md](./DOCUMENTATION.md).*
