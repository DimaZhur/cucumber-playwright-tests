const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Клик по пункту меню "Crypto"
When('I navigate to the Crypto page from the menu', async function () {
  // Ищем элемент с текстом "Crypto" в боковом меню и кликаем
  await this.page.getByRole('link', { name: 'Crypto' }).click();
});

// Клик именно по кнопке Buy Crypto
When('I click on the Buy Crypto action', async function () {
  // Явный селектор для уникальности
  await this.page.getByRole('button', { name: 'Buy crypto' }).click();
});

// Клик по выпадашке "Select network" и выбор первого элемента (TRC 20)
When('I select {string} network in Buy Crypto form', async function (network) {
  // Открыть дропдаун
  await this.page.locator('.modal .dropdown-size-bg').first().click();

  // Ждать появления списка
  const option = this.page.locator('.dropdown-list-item.ellipses', { hasText: network });
  await option.waitFor({ state: 'visible' });

  // Клик по нужной сети
  await option.click();
});

// Генерация и ввод адреса криптокошелька
When('I enter crypto wallet address in Buy Crypto form', async function () {
  // Попробуем взять адрес из переменных окружения (удобно для CI)
  const envAddress = process.env.CRYPTO_ADDRESS;

  // Твой фиксированный адрес (резервный, если в env не задано)
  const fallbackAddress = 'TKSXDA8HfE9E1y39RczVQ1ZascUEtaSToF';

  // Выбираем окончательный адрес: env -> фиксированный
  const address = envAddress && envAddress.trim().length > 0 ? envAddress.trim() : fallbackAddress;

  // Сохраняем в контекст (this) чтобы другие шаги могли использовать
  this.cryptoAddress = address;

  console.log(`Generated/selected crypto wallet address: ${address}`);

  // Вводим адрес в textarea (селектор у тебя был textarea[placeholder="Crypto wallet address"])
  await this.page.locator('textarea[placeholder="Crypto wallet address"]').fill(address);

  console.log('Crypto wallet address entered successfully');
});

// Ввод суммы в поле Amount
When('I enter {string} as amount in Buy Crypto form', async function (amount) {
  // Находим поле суммы и вводим значение
  await this.page.locator('input.currency-input-sum[placeholder="0.00"]').fill(amount);
});

// Открываем дропдаун Wallet кликом по placeholder "Wallet"
When('I click the Wallet list', async function () {
  const dropdownPlaceholder = this.page.getByText('Wallet', { exact: true });
  await dropdownPlaceholder.click({ force: true });

  // ждём появления опций
  await this.page.waitForSelector('.dropdown-size-bg .dropdown-item', { state: 'visible', timeout: 5000 });
});

// Выбор кошелька из контекста (.env)
When('I select wallet from context in Buy Crypto form', async function () {
  // Берём имя кошелька из .env
  const walletName = process.env.WALLET_GURUPAY_EUR;

  if (!walletName) {
    throw new Error('WALLET_GURUPAY_EUR not found in .env');
  }

  console.log(`Selecting wallet from context: ${walletName}`);

  // Ждём появления списка после клика
  await this.page.locator('.dropdown-list-wrap .dropdown-list-item').first().waitFor({
    state: 'visible',
    timeout: 5000,
  });

  // Кликаем по нужному кошельку
  await this.page.locator('.dropdown-list-wrap .dropdown-list-item', { hasText: walletName }).click();

  console.log(`Wallet "${walletName}" selected in Buy Crypto form`);
});

// Нажатие на кнопку Submit для завершения покупки крипты
When('I submit the Buy Crypto form', async function () {
  const submitButton = this.page.locator('button:has-text("Submit")');
  await submitButton.waitFor({ state: 'visible', timeout: 10000 });
  await submitButton.click();
  console.log('Clicked Submit button in exchange');

  // Таймаут, чтобы успело появиться окно MFA
  await this.page.waitForTimeout(1000);
});

// Проверка, что мы находимся на home
Then('I should be on the crypto page after buy crypto', async function () {
  await expect(this.page).toHaveURL(/.*\/crypto/);

  // Проверяем пункт меню Crypto
  await expect(this.page.locator('span.menu-link-text:has-text("Crypto")')).toBeVisible();

  console.log('User is on Crypto page after buy crypto');
    
  // Таймаут, чтобы успела появиться новая транзакция (чтобы проверить, что она есть в след шаге)
  await this.page.waitForTimeout(1000);
});

// Проверяем, что появилась транзакция с суммой и текущим временем
Then('I should see buy crypto transaction {string} at current time', async function (amount) {
  // Берём текущее время (HH:MM)
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  console.log(`Ждём 3 секунды перед проверкой транзакции...`);
  await this.page.waitForTimeout(3000); // пауза 3 секунды

  console.log(`Ищем транзакцию с суммой ${amount} и временем ${currentTime}`);

  // Локатор: ищем строку .group-item, которая содержит время и сумму
  const transactionRow = this.page.locator(`.group-item:has-text("${currentTime}"):has-text("${amount}")`);

  // Проверяем, что видна именно такая строка
  await expect(transactionRow).toBeVisible({ timeout: 10000 });
});















