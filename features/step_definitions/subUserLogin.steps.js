const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');



When('I login with sub-user credentials', async function () {
  await this.page.waitForSelector('input[placeholder="Email"]');
  await this.page.fill('input[placeholder="Email"]', 'sarah@haras.com');
  await this.page.fill('input[placeholder="Password"]', '111111zZ!');
  await this.page.click('button:has-text("Login")');
  console.log('Sub-user login form submitted');
});