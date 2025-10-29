const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Переходим на страницу логина
Given('I navigate to the login page', async function () {
  const loginUrl = `${this.baseUrl}/auth/login`;
  console.log(`Переходим на страницу логина: ${loginUrl}`);
  await this.page.goto(loginUrl);
  await this.page.waitForSelector('input[placeholder="Email"]', { timeout: 10000 });
});

// Вводим корректные логин и пароль из .env
When('I login with valid credentials', async function () {
  const password = process.env.PASSWORD1;
  if (!password) throw new Error('PASSWORD1 not found in .env');

  console.log(`Вводим логин и пароль для пользователя: ${this.email}`);
  await this.page.fill('input[placeholder="Email"]', this.email);
  await this.page.fill('input[placeholder="Password"]', password);
  await this.page.click('button:has-text("Login")');
  console.log('Форма логина отправлена');
});

// Проверяем, что пользователь попал на дашборд
Then('I should see the dashboard', async function () {
  console.log('Проверяем загрузку дашборда...');
  await this.page.waitForSelector('text=Home', { timeout: 10000 });
  await expect(this.page).toHaveURL(/\/home/);
  console.log('Дашборд успешно загружен');
});










