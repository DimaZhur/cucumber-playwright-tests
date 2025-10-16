const { Before, After } = require('@cucumber/cucumber');
const { chromium } = require('playwright');


Before(async function () {
  this.browser = await chromium.launch({ headless: false });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  await this.page.setDefaultTimeout(120000); // ждём до 2 минут
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});








