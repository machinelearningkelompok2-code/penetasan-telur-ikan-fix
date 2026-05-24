import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Ambil 20 data sensor terakhir untuk grafik
    const { data: sensorData, error: sensorError } = await supabase
      .from('tb_sensor')
      .select('id, suhu, ph, kekeruhan, waktu')
      .order('waktu', { ascending: false })
      .limit(20);

    if (sensorError) throw sensorError;

    // Ambil data sensor PALING terbaru untuk Metrics Card
    const { data: latestSensor, error: latestError } = await supabase
      .from('tb_sensor')
      .select('id, suhu, ph, kekeruhan, waktu')
      .order('waktu', { ascending: false })
      .limit(1);

    if (latestError) throw latestError;

    // Ambil prediksi terbaru beserta data sensor terkait
    // Di Supabase, kita bisa menggunakan join melalui relasi foreign key
    const { data: predictionData, error: predictionError } = await supabase
      .from('tb_prediksi')
      .select(`
        id, 
        sensor_id, 
        status_keberhasilan, 
        estimasi_waktu_tetas, 
        probabilitas, 
        waktu_prediksi,
        tb_sensor (
          suhu, 
          ph, 
          kekeruhan
        )
      `)
      .order('waktu_prediksi', { ascending: false })
      .limit(1);

    if (predictionError) throw predictionError;

    // Format data agar sesuai dengan struktur sebelumnya
    const latestRaw = predictionData?.[0];
    let latest = null;

    if (latestRaw) {
      // Supabase bisa mengembalikan join sebagai objek tunggal atau array
      const sensorInfo = Array.isArray(latestRaw.tb_sensor) 
        ? latestRaw.tb_sensor[0] 
        : latestRaw.tb_sensor;

      latest = {
        ...latestRaw,
        suhu: sensorInfo?.suhu,
        ph: sensorInfo?.ph,
        kekeruhan: sensorInfo?.kekeruhan
      };
    }

    return NextResponse.json({
      sensors: (sensorData || []).reverse(),
      latest: latest,
      realtime: latestSensor?.[0] || null,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
