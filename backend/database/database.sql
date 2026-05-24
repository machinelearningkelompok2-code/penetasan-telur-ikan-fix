-- Database: iot_ikan
CREATE DATABASE IF NOT EXISTS iot_ikan;
USE iot_ikan;

-- Tabel Sensor (Input dari ESP32)
CREATE TABLE IF NOT EXISTS tb_sensor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    suhu FLOAT NOT NULL,
    ph FLOAT NOT NULL,
    kekeruhan FLOAT NOT NULL,
    waktu TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Prediksi (Output dari Python ML)
CREATE TABLE IF NOT EXISTS tb_prediksi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_id INT,
    status_keberhasilan VARCHAR(20), -- "Berhasil" / "Gagal"
    estimasi_waktu_tetas FLOAT,     -- Jam
    probabilitas FLOAT,             -- 0-100%
    waktu_prediksi TIMESTAMP DEFAULT
    CURRENT_TIMESTAMP,
    FOREIGN KEY (sensor_id) REFERENCES tb_sensor(id) ON DELETE CASCADE
);

-- Script untuk Supabase SQL Editor
-- Jalankan ini di SQL Editor Supabase Anda

-- 1. Tabel Sensor (Input dari ESP32)
CREATE TABLE tb_sensor (
    id SERIAL PRIMARY KEY,
    suhu FLOAT NOT NULL,
    ph FLOAT NOT NULL,
    kekeruhan FLOAT NOT NULL,
    waktu TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Prediksi (Output dari Python ML)
CREATE TABLE tb_prediksi (
    id SERIAL PRIMARY KEY,
    sensor_id INT REFERENCES tb_sensor(id) ON DELETE CASCADE,
    status_keberhasilan VARCHAR(50), -- "Berhasil" / "Gagal"
    estimasi_waktu_tetas FLOAT,     -- Jam
    probabilitas FLOAT,             -- 0-100%
    waktu_prediksi TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Data Dummy (Opsional)
-- INSERT INTO tb_sensor (suhu, ph, kekeruhan) VALUES (28.5, 7.2, 15.0);
-- INSERT INTO tb_prediksi (sensor_id, status_keberhasilan, estimasi_waktu_tetas, probabilitas) 
-- VALUES (1, 'Berhasil (92.0%)', 48.5, 92.0);
