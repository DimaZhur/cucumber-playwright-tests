const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Кликаем по кнопке
When('I click the {string} button', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

// Кликаем по пункту меню
When('I click the {string} menu item', async function (menuName) {
  const menuItem = this.page.getByRole('link', { name: menuName, exact: true });
  await expect(menuItem).toBeVisible();
  await menuItem.click();
  console.log(`Clicked menu item: ${menuName}`);
});

// Открываем кошелёк по имени из контекста (.env)
When('I open wallet {string} from context', async function (walletKey) {
  const walletValue = process.env[`WALLET_${walletKey.toUpperCase()}`];
  if (!walletValue) throw new Error(`Wallet variable WALLET_${walletKey.toUpperCase()} not found in .env`);

  await this.page.waitForSelector('.wallet-title', { timeout: 10000 });
  const wallet = this.page.locator(`.wallet-title:has-text("${walletValue}")`);
  await expect(wallet).toBeVisible({ timeout: 10000 });

  await wallet.click();
  console.log(`Opened wallet from context: ${walletValue}`);
});

// Проверяем, что модалка открылась
Then('I should see the {string} modal', async function (modalTitle) {
  await expect(this.page.getByText(modalTitle, { exact: true })).toBeVisible();
});

// Выбираем метод оплаты в модалке ("Top up from wallet")
When('I select {string} payment method', async function (methodName) {
  const option = this.page.locator('.modal-panel-list li', { hasText: methodName });
  await expect(option).toBeVisible({ timeout: 10000 });
  await option.click();
  console.log(`Selected payment method: ${methodName}`);
});

// Вводим сумму
When('I enter top up amount {string}', async function (amount) {
  await this.page.waitForSelector('input.currency-input-sum', { timeout: 10000 });
  await this.page.fill('input.currency-input-sum', amount);
  console.log(`Entered amount: ${amount}`);
});

// Открываем dropdown “Wallet”
When('I click the Wallet dropdown', async function () {
  const dropdown = this.page.getByText('Wallet', { exact: true });
  await dropdown.click({ force: true });
  await this.page.waitForSelector('.dropdown-list-item', { state: 'visible', timeout: 5000 });
});

// Выбираем кошелёк (из контекста)
When('I select destination wallet {string} from context', async function (walletKey) {
  const walletValue = process.env[`WALLET_${walletKey.toUpperCase()}`];
  if (!walletValue) throw new Error(`Wallet variable WALLET_${walletKey.toUpperCase()} not found in .env`);

  await this.page.waitForSelector('.dropdown-list-item.ellipses', { state: 'visible', timeout: 10000 });
  const wallet = this.page.locator(`.dropdown-list-item.ellipses:has-text("${walletValue}")`);
  await expect(wallet).toBeVisible({ timeout: 10000 });
  await wallet.click();

  console.log(`Selected destination wallet from context: ${walletValue}`);
});

// Проверяем, что мы на странице того же кошелька, который пополняли
Then('I should be on the same wallet page from context {string}', async function (walletKey) {
  const walletValue = process.env[`WALLET_${walletKey.toUpperCase()}`];
  if (!walletValue) throw new Error(`Wallet variable WALLET_${walletKey.toUpperCase()} not found in environment`);

  // Извлекаем ID из walletValue (предположим, формат "7167_GuruPay_EUR")
  const walletId = walletValue.split('_')[0];

  console.log(`Checking that current wallet page matches ID: ${walletId}`);

  // Проверяем, что URL оканчивается на этот ID
  await expect(this.page).toHaveURL(new RegExp(`/wallet/${walletId}$`));
  console.log(`Verified: we are on wallet page ${walletId} (${walletValue})`);
});

