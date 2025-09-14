const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');


// Кликаем по кнопке с указанным текстом
When('I click the {string} button', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

// Открываем дропдаун
When('I click the {string} dropdown', async function (text) {
  await this.page.locator('div.dropdown-item', { hasText: text }).click();
});

// Выбираем валлет
When('I select payment wallet {string}', async function (walletName) {
  await this.page.getByText(walletName, { exact: true }).click();
});

// Проверяем, что модалка с указанным текстом открылась
Then('I should see the {string} modal', async function (modalTitle) {
  await expect(this.page.getByText(modalTitle, { exact: true })).toBeVisible();
});

// Выбираем способ оплаты по названию
When('I select {string} payment method', async function (methodName) {
  await this.page.getByText(methodName, { exact: true }).click();
});

// Ввод суммы
When('I enter top up amount {string}', async function (amount) {
  await this.page.waitForSelector('input.currency-input-sum', { timeout: 10000 });
  await this.page.fill('input.currency-input-sum', amount);
  console.log(`Entered amount: ${amount}`);
});

When('I fill amount {string}', async function (value) {
  await this.page.getByPlaceholder('0.00').fill(value);
});

// Открываем дропдаун Wallet кликом по placeholder "Wallet"
When('I click the Wallet dropdown', async function () {
  const dropdownPlaceholder = this.page.getByText('Wallet', { exact: true });
  await dropdownPlaceholder.click({ force: true });

  // ждём появления опций
  await this.page.waitForSelector('.dropdown-size-bg .dropdown-item', { state: 'visible', timeout: 5000 });
});

// Выбираем конечный валлет по названию
When('I select destination wallet {string}', async function (walletName) {
  await this.page.getByText(walletName, { exact: true }).click();
});

// Проверяем, что в верхней транзакции совпадает время с текущим
Then('I should see transaction at current time', async function () {
  // Берём текущее время (HH:MM)
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  console.log(`Ждём 3 секунды перед проверкой транзакции...`);
  await this.page.waitForTimeout(3000);

  console.log(`Ищем первую транзакцию и проверяем время ${currentTime}`);

  // Берём самый верхний элемент .group-item
  const firstTransaction = this.page.locator('.group-item').first();

  // Проверяем, что он содержит текущее время
  await expect(firstTransaction).toContainText(currentTime, { timeout: 10000 });
});


// Проверяем, что URL содержит нужный walletId
Then('I should be on wallet page {string}', async function (walletId) {
  await expect(this.page).toHaveURL(new RegExp(`/wallet/${walletId}$`));
});














