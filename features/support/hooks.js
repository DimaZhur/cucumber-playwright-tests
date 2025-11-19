const { setDefaultTimeout } = require('@cucumber/cucumber');
const { BeforeAll, AfterAll, Before, After } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

setDefaultTimeout(60 * 1000);

require('dotenv').config({
  path: path.resolve(__dirname, `../../env/${process.env.TEST_ENV || 'test.individual'}.env`)
});

/**
 * Автоматический пропуск сценариев по контексту
 */
Before(function (scenario) {
  const currentContext = process.env.TEST_ENV;
  const tags = scenario.pickle.tags.map(tag => tag.name);

  if (tags.includes('@only-individual') && currentContext !== 'test.individual') {
    console.log(`⏭ Пропущен сценарий "${scenario.pickle.name}" — разрешён только для test.individual`);
    return 'skipped';
  }

  if (tags.includes('@only-business') && !currentContext.includes('business')) {
    console.log(`⏭ Пропущен сценарий "${scenario.pickle.name}" — только для business`);
    return 'skipped';
  }

  if (tags.includes('@only-sandbox') && !currentContext.includes('sandbox')) {
    console.log(`⏭ Пропущен сценарий "${scenario.pickle.name}" — только для sandbox`);
    return 'skipped';
  }
});

let browser;
let context;
let page;

/**
 * Запускаем браузер один раз для всех сценариев
 */
BeforeAll(async function () {
  console.log(`Запускаем браузер для окружения: ${process.env.TEST_ENV}`);

  browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-gpu',
      '--use-gl=swiftshader',
      '--disable-dev-shm-usage',
      '--disable-software-rasterizer'
    ]
  });
});

/**
 * Создаём новый контекст перед каждым сценарием
 */
Before(async function () {
  context = await browser.newContext();
  page = await context.newPage();

  this.page = page;
  this.context = context;
  this.baseUrl = process.env.BASE_URL;
  this.email = process.env.EMAIL;
  this.password = process.env.PASSWORD;
  this.mfa = process.env.MFA_CODE;
  this.subEmail = process.env.SUB_EMAIL;
  this.subPassword = process.env.SUB_PASSWORD;

  console.log(`Загружено окружение: ${this.baseUrl}`);
});

/**
 * Закрываем контекст
 */
After(async function () {
  await context.close();
  console.log('Контекст закрыт');
});

/**
 * Закрываем браузер
 */
AfterAll(async function () {
  await browser.close();
  console.log('Браузер закрыт');
});









