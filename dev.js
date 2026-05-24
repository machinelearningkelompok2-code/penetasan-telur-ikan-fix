const { spawn } = require('child_process');

// Menjalankan Next.js dev server
const nextDev = spawn(/^win/.test(process.platform) ? 'npx.cmd' : 'npx', ['next', 'dev'], { 
  stdio: 'inherit',
  shell: true
});

// Menjalankan ML Service
const mlService = spawn('py', ['-u', 'backend/python/ml_service.py'], { 
  stdio: 'inherit',
  shell: true
});

// Fungsi untuk mematikan kedua proses saat Ctrl+C ditekan
const killProcesses = () => {
  console.log('\n[dev] Mematikan Next.js dan ML Service...');
  nextDev.kill('SIGINT');
  mlService.kill('SIGINT');
  process.exit();
};

process.on('SIGINT', killProcesses);
process.on('SIGTERM', killProcesses);
