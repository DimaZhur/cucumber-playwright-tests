const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Клик по кнопке Exchange
When('I click on Exchange to create a new exchange', async function () {
  await this.page.waitForSelector('button:has-text("Exchange")', { timeout: 10000 });
  await this.page.click('button:has-text("Exchange")');
  console.log('Clicked on Exchange button');
});

// Проверка, что модалка открылась
Then('I should see the exchange form', async function () {
  const modal = this.page.locator('form.modal');
  await expect(modal).toBeVisible({ timeout: 10000 });
  console.log('Exchange form is visible');
});

// Ввод суммы
When('I enter exchange amount {string}', async function (amount) {
  const input = this.page.locator('input.currency-input-sum').first(); // берем только верхнее
  await input.waitFor({ state: 'visible', timeout: 10000 });
  await input.fill(amount);

  // Проверим, что ввелось
  await expect(input).toHaveValue(amount);
  console.log(`Entered exchange amount: ${amount}`);
});

// Открываем верхний дропдаун валют (EUR)
When('I open the wallets dropdown in exchange', async function () {
  const currencyDropdown = this.page.locator('div.currency-input').nth(0).locator('div.currency-helper.text-overflow');
  await currencyDropdown.waitFor({ state: 'visible', timeout: 10000 });
  await currencyDropdown.click();
  console.log('Wallet dropdown opened (top EUR block)');
});

// Выбираем исходный кошелёк по названию ("7164_IFX_EUR")
When('I select wallet {string} in exchange', async function (walletName) {
  const walletSelector = `//div[contains(@class,"wallet-balanced-helper-label") and normalize-space(text())="${walletName}"]`;
  await this.page.waitForSelector(walletSelector, { timeout: 10000 });
  await this.page.click(walletSelector);
  console.log(`Wallet "${walletName}" selected in exchange`);
});

// Открываем нижний дропдаун конечных кошельков (Wallet)
When('I open the destination wallets dropdown in exchange', async function () {
  const destinationDropdown = this.page.locator('div.currency-input').nth(1).locator('div.currency-helper.text-overflow');
  await destinationDropdown.waitFor({ state: 'visible', timeout: 10000 });
  await destinationDropdown.click();
  console.log('Destination wallets dropdown opened (bottom Wallet block)');
});

// Выбираем конечный кошелёк по названию (нижний Wallet)
When('I select destination wallet {string} in exchange', async function (walletName) {
  const walletSelector = `//div[contains(@class,"wallet-balanced-helper-label") and normalize-space(text())="${walletName}"]`;
  await this.page.waitForSelector(walletSelector, { timeout: 10000 });
  await this.page.click(walletSelector);
  console.log(`Destination wallet "${walletName}" selected in exchange`);
});

// Нажимаем на кнопку Submit в Exchange
When('I submit the exchange form', async function () {
  const submitButton = this.page.locator('button:has-text("Submit")');
  await submitButton.waitFor({ state: 'visible', timeout: 5000 });
  await submitButton.click();
  console.log('Clicked Submit button in exchange');

  // Таймаут, чтобы успело появиться окно MFA
  await this.page.waitForTimeout(500);
});

// Проверка, что мы находимся на home
Then('I should be on the home page after exchange', async function () {
  await expect(this.page).toHaveURL(/.*\/home/);
  await expect(this.page.locator('text=Home')).toBeVisible();
  console.log('User is on Home page after exchange');
});

// Проверка, что сверху появилась новая exchange-транзакция с суммой и текущим временем
Then('I should see the latest exchange transaction {string} at current time', async function (expectedText) {
  // Берём текущее время в формате HH:mm
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  console.log(`Ждём 3 секунды перед проверкой транзакции...`);
  await this.page.waitForTimeout(3000); // пауза 3 секунды

  console.log(`Ищем exchange-транзакцию "${expectedText}" с временем ${currentTime}`);

  // Ищем первую строку в истории (самую свежую транзакцию)
  const firstExchange = this.page.locator('.group-item').first();

  // Проверяем, что текст совпадает
  await expect(firstExchange).toContainText(expectedText);
  await expect(firstExchange).toContainText(currentTime);

  console.log(`Exchange "${expectedText}" at ${currentTime} is visible`);
});



























