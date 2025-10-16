const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I navigate to the login page', async function () {
  await this.page.goto('https://master.d28udzev6nhcm4.amplifyapp.com/auth/login');
});

When('I login with valid credentials', async function () {
  await this.page.waitForSelector('input[placeholder="Email"]');
  await this.page.fill('input[placeholder="Email"]', 'd.zhurauleu+900@altpay.uk');
  await this.page.fill('input[placeholder="Password"]', '111111zZ!');

  await this.page.click('button:has-text("Login")');
  console.log('Login form submitted');
});

Then('I should see the dashboard', async function () {
  await this.page.waitForSelector('text=Home', { timeout: 10000 });
  await expect(this.page).toHaveURL(/.*\/home/);

  console.log('Dashboard is visible');
});







