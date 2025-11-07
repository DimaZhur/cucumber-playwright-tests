const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Клик по кнопке Send
When('I click on Send to create a new payment', async function () {
  await this.page.click('button:has-text("Send")');
});

// Выбор беника
When('I select the automation beneficiary', async function () {
  const iban = process.env.BENEFICIARY_IBAN;
  const beneficiary = this.page.locator(`div.target-data-subtitle:text("${iban}")`);
  await expect(beneficiary).toBeVisible({ timeout: 10000 });
  await beneficiary.click();
});

// Проверка наличия формы оплаты
Then('I should see the payment form', async function () {
  await this.page.waitForSelector('text=Transfer', { timeout: 10000 });
  console.log('Payment form is visible');
});

// Ввод суммы
When('I enter payment amount {string}', async function (amount) {
  await this.page.waitForSelector('input.currency-input-sum', { timeout: 10000 });
  await this.page.fill('input.currency-input-sum', amount);
  console.log(`Entered amount: ${amount}`);
});

//Открываем дропдаун по клику на "EUR"
When('I open the wallet drop down list to select a wallet', async function () {
  await this.page.waitForSelector('div.currency-input >> text=EUR', { timeout: 10000 });
  await this.page.click('div.currency-input >> text=EUR');
  console.log('Wallet dropdown opened by clicking EUR');
});

// Выбираем валлет
When('I select wallet {string} from context', async function (walletKey) {
  const walletValue = process.env[`WALLET_${walletKey.toUpperCase()}`];
  if (!walletValue) {
    throw new Error(`Wallet variable WALLET_${walletKey.toUpperCase()} not found in .env`);
  }

  console.log(`Selecting wallet from context: ${walletKey} → ${walletValue}`);

  // Дожидаемся, пока дропдаун откроется и появятся элементы
  await this.page.waitForSelector('.dropdown-list-item', { timeout: 10000 });

  // Ищем элемент по тексту
  const wallet = this.page.locator('.dropdown-list-item').filter({
    hasText: walletValue.trim(),
  });

  await expect(wallet).toBeVisible({ timeout: 10000 });

  // Скроллим и кликаем
  await wallet.scrollIntoViewIfNeeded();
  await wallet.click({ force: true });

  console.log(`Wallet selected successfully: ${walletValue}`);
});

// Вводим reference
When('I enter reference {string}', async function (referenceText) {
  await this.page.fill('textarea[placeholder="Reference"]', referenceText);
});

// Проверяем, что чекбокс "When creating, sign the payment" включен по умолчанию
Then('I should the "Sign the payment" flag should be enabled by default', async function () {
  const checkbox = await this.page.$('input[type="checkbox"][value="true"]');
  const isChecked = await checkbox.isChecked();
  expect(isChecked).toBe(true);
});

// Клик по Create and sign
When('I click Create and sign', async function () {
  await this.page.click('button:has-text("Create and sign")');
});

// Проверка, что мы находимся на home
Then('I should be on the home page', async function () {
  await expect(this.page).toHaveURL(/.*\/home/);
  await expect(this.page.locator('text=Home')).toBeVisible();
  console.log('User is on Home page');
});

// Then('I should see the latest payment at current time', async function () {
//   // Берём текущее время (HH:MM)
//   const now = new Date();
//   const hours = String(now.getHours()).padStart(2, '0');
//   const minutes = String(now.getMinutes()).padStart(2, '0');
//   const currentTime = `${hours}:${minutes}`;

//   console.log(`Ищем платёж с временем: ${currentTime}`);

//   // Берём первый платёж
//   const firstPayment = this.page.locator('.group-item').first();

//   // Проверяем, что время совпадает
//   await expect(firstPayment).toContainText(currentTime, { timeout: 15000 });

//   console.log(`Найден верхний платёж с временем ${currentTime}`);
// });




