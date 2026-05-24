import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Ambil data sensor yang melampaui batas normal atau status "Gagal"
    // Batas Normal Baru: Suhu 25-30, pH 6.5-8.5, Kekeruhan > 60
    const { data: alerts, error } = await supabase
      .from('tb_sensor')
      .select(`
        id, 
        suhu, 
        ph, 
        kekeruhan, 
        waktu,
        tb_prediksi (
          status_keberhasilan,
          probabilitas
        )
      `)
      .or('suhu.lt.25,suhu.gt.30,ph.lt.6.5,ph.gt.8.5,kekeruhan.lte.60')
      .order('waktu', { ascending: false })
      .limit(50);

    if (error) throw error;

    // Format data agar sesuai dengan struktur sebelumnya
    const formattedAlerts = (alerts || []).map(alert => ({
      ...alert,
      status_keberhasilan: alert.tb_prediksi?.[0]?.status_keberhasilan,
      probabilitas: alert.tb_prediksi?.[0]?.probabilitas || 0
    }));

    return NextResponse.json(formattedAlerts);
  } catch (error: any) {
    console.error('Alerts API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
