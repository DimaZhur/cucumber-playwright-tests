const fs = require('fs');
const path = require('path');
const reporter = require('cucumber-html-reporter');

const reportsDir = path.join(__dirname, 'reports');
const logsDir = path.join(__dirname, 'logs');

// создаём папку logs, если нет
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// ищем последний JSON
const latestJson = path.join(reportsDir, 'report.json');
const options = {
  theme: 'bootstrap',
  jsonFile: latestJson,
  output: path.join(reportsDir, 'report.html'),
  reportSuiteAsScenarios: true,
  launchReport: true,
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": "STAGE",
    "Browser": "Chromium",
    "Platform": process.platform
  }
};

// генерим HTML отчёт
reporter.generate(options);

// читаем json для статистики
const reportData = JSON.parse(fs.readFileSync(latestJson, 'utf-8'));
const features = reportData.length;
let scenarios = 0;
let passed = 0;
let failed = 0;

reportData.forEach(f => {
  f.elements.forEach(s => {
    scenarios++;
    const isFailed = s.steps.some(step => step.result.status === 'failed');
    if (isFailed) failed++;
    else passed++;
  });
});

// берём длительность из JSON (берём максимум среди фич)
let durationMs = 0;
reportData.forEach(f => {
  f.elements.forEach(s => {
    let scDuration = s.steps.reduce((acc, step) => acc + (step.result.duration || 0), 0);
    durationMs += scDuration;
  });
});
const durationSec = (durationMs / 1e9).toFixed(2); // в секундах

// пишем лог
const timestamp = new Date().toLocaleString('sv-SE', { 
  timeZone: 'Europe/Warsaw' 
}).replace('T', ' ');
const logFile = path.join(logsDir, 'test-runs.log');
const logEntry = `[${timestamp}] Features: ${features}, Scenarios: ${scenarios}, Passed: ${passed}, Failed: ${failed}, Duration: ${durationSec}s\n`;

fs.appendFileSync(logFile, logEntry, 'utf-8');

console.log(`Log saved to ${logFile}`);




