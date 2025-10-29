const fs = require("fs");
const path = require("path");
const reporter = require("cucumber-html-reporter");

const reportsDir = path.join(__dirname, "reports");
const logsDir = path.join(__dirname, "logs");

if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

// === Ищем последний JSON отчёт ===
const jsonFiles = fs
  .readdirSync(reportsDir)
  .filter(f => f.endsWith(".json"))
  .map(f => path.join(reportsDir, f))
  .sort((a, b) => fs.statSync(b).mtime - fs.statSync(a).mtime);

if (jsonFiles.length === 0) {
  console.error("❌ No JSON reports found in reports directory.");
  process.exit(1);
}

const latestJson = jsonFiles[0];
console.log(`📄 Using JSON: ${latestJson}`);

// === Определяем имя окружения / отчёта ===
const envName = path.basename(latestJson, ".json");

// === Генерация HTML отчёта ===
const options = {
  theme: "bootstrap",
  jsonFile: latestJson,
  output: path.join(reportsDir, `${envName}.html`),
  reportSuiteAsScenarios: true,
  launchReport: true, // откроет в браузере
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": "STAGE",
    "Browser": "Chromium",
    "Platform": process.platform
  },
};

try {
  reporter.generate(options);
  console.log(`✅ HTML report generated: ${options.output}`);
} catch (err) {
  console.error(`❌ Failed to generate HTML report: ${err.message}`);
}

// --- Анализ JSON и корректный подсчёт статусов по СЦЕНАРИЯМ ---
const reportData = JSON.parse(fs.readFileSync(latestJson, 'utf-8'));

let features = reportData.length;
let scenarios = 0, passed = 0, failed = 0, skipped = 0;
let durationMs = 0;

function scenarioStatus(scn) {
  // берём статусы шагов + хуков
  const stepStatuses =
    (scn.steps || []).map(s => s.result?.status).filter(Boolean);
  const hookStatuses = [
    ...((scn.before || []).map(h => h.result?.status) || []),
    ...((scn.after  || []).map(h => h.result?.status) || []),
  ].filter(Boolean);

  const statuses = [...stepStatuses, ...hookStatuses];

  // если вообще нет статусов — считаем как skipped (сценарий отфильтрован)
  if (statuses.length === 0) return 'skipped';

  if (statuses.includes('failed')) return 'failed';
  if (statuses.every(s => s === 'passed')) return 'passed';
  if (statuses.every(s => s === 'skipped')) return 'skipped';

  // pending/undefined/ambiguous и т.п. — в skipped
  return 'skipped';
}

reportData.forEach(f => {
  (f.elements || [])
    .filter(scn => scn.keyword === 'Scenario' || scn.type === 'scenario') // <== вот эта строка ключевая!
    .forEach(scn => {
      scenarios++;
      const st = scenarioStatus(scn);
      if (st === 'failed') failed++;
      else if (st === 'passed') passed++;
      else skipped++;

      durationMs += (scn.steps || [])
        .reduce((acc, step) => acc + (step.result?.duration || 0), 0);
    });
});

const durationSec = (durationMs / 1e9).toFixed(2);
const timestamp = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Warsaw' }).replace('T', ' ');

// === Запись логов в компактном формате ===
const safeEnvName = envName.replace(/[:]/g, '.').replace('test.report.', 'test-');
const logFile = path.join(logsDir, `test-runs-${safeEnvName}.log`);
const now = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Warsaw' }).replace('T', ' ');

const logLine = `[${now}] Features: ${features}, Scenarios: ${scenarios}, Passed: ${passed}, Failed: ${failed}, Skipped: ${skipped}, Duration: ${durationSec}s\n`;

try {
  fs.appendFileSync(logFile, logLine, "utf-8");
  console.log(`📝 Log updated: ${logFile}`);
  console.log(logLine.trim());
} catch (err) {
  console.error(`❌ Failed to write log: ${err.message}`);
}

