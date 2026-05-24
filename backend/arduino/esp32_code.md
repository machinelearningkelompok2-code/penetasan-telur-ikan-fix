#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ===== 1. KONFIGURASI WIFI & SUPABASE =====
const char* ssid = "Infinix";
const char* password = "12345678";

// Ganti dengan URL Project Supabase Anda
String supabaseURL = "https://zcumouzhjwymkrhitqpw.supabase.co/rest/v1/tb_sensor";
// Masukkan Anon Key Supabase Anda
String supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjdW1vdXpoand5bWtyaGl0cXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NDEwNTQsImV4cCI6MjA5NTIxNzA1NH0.PZPcHkzJ3lrz7z8CHmD6YsHc7Ft54hRgRe6_OAMrEbI";

WiFiServer server(80);

// ===== 2. PIN HARDWARE =====
#define PH_PIN 34
#define TURBIDITY_PIN 35
#define ONE_WIRE_BUS 4
#define LED_HIJAU 18
#define LED_MERAH 19
#define BUZZER 23

// ===== 3. SETUP SENSOR & LCD =====
LiquidCrystal_I2C lcd(0x27, 16, 2);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// ===== 4. KALIBRASI & VARIABEL =====
float ph4_voltage = 3.1;      // Tegangan saat pH 4 (Sesuaikan hasil test)
float ph7_voltage = 2.5;      // Tegangan saat pH 7 (Sesuaikan hasil test)
float PH_OFFSET = 0.0;        // Fine-tuning: Tambah/kurang jika hasil kurang tepat
float ph, suhu, turbidity;

// Fungsi Filter ADC (Lebih Akurat dengan 50 sampel)
float readADC(int pin) {
  long total = 0;
  for (int i = 0; i < 50; i++) {
    total += analogRead(pin);
    delay(1);
  }
  float avg = total / 50.0;
  return (avg / 4095.0) * 3.3;
}

// Fungsi Baca Suhu DS18B20
float bacaSuhuStabil() {
  float total = 0;
  int valid = 0;
  for (int i = 0; i < 5; i++) {
    sensors.requestTemperatures();
    float t = sensors.getTempCByIndex(0);
    if (t != -127 && t > -10 && t < 100) {
      total += t;
      valid++;
    }
    delay(100);
  }
  return (valid == 0) ? 25.0 : (total / valid);
}

// Fungsi Hitung pH
float hitungPH(float voltage) {
  float slope = (4.0 - 7.0) / (ph4_voltage - ph7_voltage);
  float phValue = 7.0 + (voltage - ph7_voltage) * slope;
  
  phValue += PH_OFFSET; // Tambahkan offset untuk koreksi akhir

  if (phValue < 0) phValue = 0;
  if (phValue > 14) phValue = 14;
  return phValue;
}

// Fungsi Hitung Kekeruhan
float hitungKekeruhan(float voltage) {
  float turb = (voltage - 0.5) * (100.0 / (3.2 - 0.5));
  if (turb < 0) turb = 0.0;
  if (turb > 100) turb = 100.0;
  return turb;
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_HIJAU, OUTPUT);
  pinMode(LED_MERAH, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  lcd.init();
  lcd.backlight();
  sensors.begin();

  WiFi.begin(ssid, password);
  lcd.setCursor(0,0);
  lcd.print("Connecting WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  lcd.clear();
  lcd.print("Connected!");
  Serial.println("\nWiFi Terhubung!");
  server.begin();
}

void loop() {
  // ===== 5. BACA SENSOR =====
  float voltPH = readADC(PH_PIN);
  float voltTurb = readADC(TURBIDITY_PIN);
  suhu = bacaSuhuStabil();
  ph = hitungPH(voltPH);
  turbidity = hitungKekeruhan(voltTurb);

  // ===== 6. LOGIKA STATUS (LED/BUZZER) =====
  bool ideal = (suhu >= 25 && suhu <= 30 && ph >= 6.5 && ph <= 8.5 && turbidity > 60);
  bool fatal = (suhu < 20 || suhu > 35 || ph < 5 || ph > 10 || turbidity < 30);
  bool risky = !ideal && !fatal;

  digitalWrite(LED_HIJAU, ideal);
  digitalWrite(LED_MERAH, risky || fatal);
  if (fatal) digitalWrite(BUZZER, HIGH); else digitalWrite(BUZZER, LOW);

  // ===== 7. TAMPILAN LCD =====
  String statusKekeruhan;
  if (turbidity >= 85) statusKekeruhan = "Sgt Jernih";
  else if (turbidity >= 70) statusKekeruhan = "Jernih";
  else if (turbidity >= 50) statusKekeruhan = "Agak Keruh";
  else if (turbidity >= 25) statusKekeruhan = "Keruh";
  else statusKekeruhan = "Sgt Keruh";

  lcd.setCursor(0,0);
  lcd.print("pH:"); lcd.print(ph,1);
  lcd.setCursor(8,0);
  lcd.print("S:"); lcd.print((int)suhu); lcd.print("C");
  
  lcd.setCursor(0,1);
  lcd.print("K:"); lcd.print(turbidity, 1); 
  lcd.print(" "); lcd.print(statusKekeruhan);
  lcd.print("    ");

  // ===== 8. KIRIM LANGSUNG KE SUPABASE =====
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure(); // Mengabaikan verifikasi SSL agar lancar
    
    HTTPClient http;
    http.begin(client, supabaseURL); 
    
    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", supabaseKey);
    http.addHeader("Authorization", "Bearer " + supabaseKey);

    // Format JSON untuk Supabase
    String jsonData = "{\"suhu\": " + String(suhu) + ", \"ph\": " + String(ph) + ", \"kekeruhan\": " + String(turbidity) + "}";
    
    Serial.println("Mengirim data ke Supabase...");
    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      Serial.println("Supabase Terkirim! Status: " + String(httpResponseCode));
      String response = http.getString();
      Serial.println("Response: " + response);
    } else {
      Serial.print("Gagal kirim ke Supabase. Error: ");
      Serial.println(http.errorToString(httpResponseCode).c_str());
    }
    http.end();
  } else {
    Serial.println("WiFi Disconnected!");
  }

  // ===== 9. WEB SERVER LOCAL (Optional) =====
  WiFiClient client = server.available();
  if (client) {
    client.println("HTTP/1.1 200 OK\nContent-type:text/html\n");
    client.println("<html><body><h2>Monitoring Ikan (Supabase Version)</h2>");
    client.println("<p>pH: " + String(ph,1) + "</p>");
    client.println("<p>Suhu: " + String((int)suhu) + " C</p>");
    client.println("<p>Kekeruhan: " + String((int)turbidity) + "</p>");
    client.println(ideal ? "<h3 style='color:green;'>IDEAL</h3>" : (fatal ? "<h3 style='color:red;'>BAHAYA (FATAL)</h3>" : "<h3 style='color:orange;'>KURANG STABIL</h3>"));
    client.println("</body></html>");
    client.stop();
  }

  delay(30000); // Kirim data tiap 30 detik
}
