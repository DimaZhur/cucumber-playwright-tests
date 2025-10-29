const { When } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Вход под саб-юзером
When('I login with sub-user credentials', async function () {
  const password = process.env.PASSWORD1;
  if (!password) throw new Error('PASSWORD1 not found in .env');

  await this.page.waitForSelector('input[placeholder="Email"]');
  await this.page.fill('input[placeholder="Email"]', this.subEmail);
  await this.page.fill('input[placeholder="Password"]', password);
  await this.page.click('button:has-text("Login")');
  console.log(`Sub-user login submitted: ${this.subEmail}`);
});

