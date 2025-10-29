const { setDefaultTimeout } = require('@cucumber/cucumber');
const { BeforeAll, AfterAll, Before, After } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
setDefaultTimeout(60 * 1000); // 60 секунд для всех шагов
require('dotenv').config({
  path: path.resolve(__dirname, `../../env/${process.env.TEST_ENV || 'test.individual'}.env`)
});

/**
 * Автоматически пропускает сценарии в зависимости от контекста.
 * Контекст берётся из переменной окружения TEST_ENV
 * (например: test.individual, test.business, sandbox.individual, sandbox.business)
 */
Before(function (scenario) {
  const currentContext = process.env.TEST_ENV;
  const tags = scenario.pickle.tags.map(tag => tag.name);

  // Сценарии, доступные только для test.individual
  if (tags.includes('@only-individual') && currentContext !== 'test.individual') {
    console.log(`⏭ Пропущен сценарий "${scenario.pickle.name}" — разрешён только для test.individual`);
    return 'skipped';
  }

  // Сценарии, доступные только для business
  if (tags.includes('@only-business') && !currentContext.includes('business')) {
    console.log(`⏭ Пропущен сценарий "${scenario.pickle.name}" — только для business`);
    return 'skipped';
  }

  // Сценарии, доступные только для sandbox
  if (tags.includes('@only-sandbox') && !currentContext.includes('sandbox')) {
    console.log(`⏭ Пропущен сценарий "${scenario.pickle.name}" — только для sandbox`);
    return 'skipped';
  }
});


let browser;
let context;
let page;

// Запускаем браузер перед всеми тестами
BeforeAll(async function () {
  console.log(`Запускаем браузер для окружения: ${process.env.TEST_ENV}`);
  browser = await chromium.launch({ headless: false }); // если хочешь — поменяй на true
});

// Создаём новый контекст и страницу перед каждым сценарием
Before(async function () {
  context = await browser.newContext();
  page = await context.newPage();

  // Делаем значения .env доступными через this.*
  this.page = page;
  this.context = context;
  this.baseUrl = process.env.BASE_URL;
  this.email = process.env.EMAIL;
  this.password = process.env.PASSWORD;
  this.mfa = process.env.MFA_CODE;
  this.subEmail = process.env.SUB_EMAIL;
  this.subPassword = process.env.SUB_PASSWORD;

  console.log(`Загружено окружение: ${process.env.BASE_URL}`);
});

// Закрываем контекст после каждого сценария
After(async function () {
  await context.close();
  console.log('Контекст закрыт');
});

// Закрываем браузер после всех тестов
AfterAll(async function () {
  await browser.close();
  console.log('Браузер закрыт');
});








