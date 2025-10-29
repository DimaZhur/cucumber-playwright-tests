const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Клик по кнопке Order a card
When('I click on {string} to order a new physical card', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

// Проверяем, что модалка Order a card открылась
Then('I should see the {string} modal window', async function (modalTitle) {
  await expect(this.page.getByText(modalTitle, { exact: true })).toBeVisible();
});

// Выбираем опцию Physical card
When('I select {string} option', async function (option) {
  // плитка = ближайший div.card-panel-group к заголовку "Physical card"
  const tile = this.page.locator(
    `xpath=//span[contains(@class,"card-panel-title") and normalize-space()=${JSON.stringify(option)}]` +
    `/ancestor::div[contains(@class,"card-panel-group")][1]`
  );

  if (await tile.count()) {
    await tile.first().click({ force: true, timeout: 3000 });
    return;
  }

  // fallback — первая плитка (на твоём UI это Physical card)
  await this.page.locator('div.card-panel-group').first().click({ force: true, timeout: 3000 });
});

// Клик по кнопке Next
When('I click {string} to proceed to data entry', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

// Заполняем блок Recipient info
When('I fill in the recipient info form', async function () {
  const modal = this.page.locator('form.modal');
  await expect(modal).toBeVisible({ timeout: 10000 });

  const firstName = process.env.RECIPIENT_FIRST_NAME;
  const lastName = process.env.RECIPIENT_LAST_NAME;
  const phone = process.env.RECIPIENT_PHONE;

  if (!firstName || !lastName || !phone) {
    throw new Error('Missing recipient info in .env');
  }

  console.log(`Заполняем данные получателя: ${firstName} ${lastName}, ${phone}`);

  await this.page.getByPlaceholder('First name').fill(firstName);
  await this.page.getByPlaceholder('Last name').fill(lastName);
  await this.page.getByPlaceholder('Phone number').fill(phone);
});

// Открываем дропдаун Country и выбираем страну Austria (первую в списке)
When('I select the first country in the list', async function () {
  // кликаем по выпадашке Country
  const countryField = this.page.getByPlaceholder('Country').or(this.page.locator('div.dropdown-item'));
  await countryField.click();

  // ждём появления списка
  const list = this.page.locator('div.dropdown-list-item');
  await expect(list.first()).toBeVisible({ timeout: 10000 });

  // кликаем по первому элементу (Австрия)
  await list.first().click();
});

// Заполняем блок Delivery address из .env
When('I fill in the recipient Delivery address form', async function () {
  const modal = this.page.locator('form.modal');
  await expect(modal).toBeVisible({ timeout: 10000 });

  // Получаем данные из .env
  const address = {
    city: process.env.DELIVERY_ADDRESS_CITY,
    street: process.env.DELIVERY_ADDRESS_STREET,
    house: process.env.DELIVERY_ADDRESS_HOUSE,
    flat: process.env.DELIVERY_ADDRESS_FLAT,
    postal: process.env.DELIVERY_ADDRESS_POSTCODE,
  };

  // Проверка, что все поля заданы
  for (const [key, value] of Object.entries(address)) {
    if (!value) throw new Error(`Missing DELIVERY_ADDRESS_${key.toUpperCase()} in .env`);
  }

  console.log('Filling delivery address:', address);

  // Заполняем поля формы
  await this.page.getByPlaceholder('City').fill(address.city);
  await this.page.getByPlaceholder('Street').fill(address.street);
  await this.page.getByPlaceholder('House').fill(address.house);
  await this.page.getByPlaceholder('Flat/Office').fill(address.flat);
  await this.page.getByPlaceholder('Postal code').fill(address.postal);

  console.log('Delivery address form filled successfully');
});

// Кликаем по первому варианту доставки (Express)
When('I select the first delivery method', async function () {
  const option = this.page.locator('label.panel-checkbox').first();
  await expect(option).toBeVisible({ timeout: 5000 });
  await option.click();
});

// Клик по кнопке Next
When('I click {string} to go to the static password', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

// Вводим универсальный пароль PASSWORD1 (используется как static password)
When('I fill a static password', async function () {
  const modal = this.page.locator('form.modal');
  await expect(modal).toBeVisible({ timeout: 10000 });

  const password = process.env.PASSWORD1;
  if (!password) throw new Error('Missing PASSWORD1 in .env');

  console.log('Filling static password from PASSWORD1');
  await this.page.getByPlaceholder('Static password').fill(password);

  console.log('Static password entered successfully');
});

// Клик по кнопке Next
When('I click {string} to go to the final modal', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

// Открываем дропдаун выбора кошелька
// When('I open the payment wallet dropdown', async function () {
//   const dropdownTrigger = this.page.locator('div.dropdown-item >> span.placeholder');
//   await expect(dropdownTrigger).toBeVisible({ timeout: 5000 });
//   await dropdownTrigger.click();
//   console.log('Payment wallet dropdown opened');
// });

// Выбираем кошелёк для оплаты доставки из контекста (.env)
// When('I click on {string} wallet for to pay for delivery', async function (walletKey) {
//   // Получаем значение кошелька из .env
//   const walletValue = process.env[`WALLET_${walletKey.toUpperCase()}`];
//   if (!walletValue) {
//     throw new Error(`Wallet variable WALLET_${walletKey.toUpperCase()} not found in environment`);
//   }

//   // Ждём, пока список кошельков будет виден
//   await this.page.waitForSelector('div.dropdown-list-item.ellipses', {
//     state: 'visible',
//     timeout: 10000,
//   });

//   // Ищем нужный кошелёк
//   const wallet = this.page.locator(`div.dropdown-list-item.ellipses:has-text("${walletValue}")`);
//   await expect(wallet).toBeVisible({ timeout: 10000 });

//   // Кликаем по нему
//   await wallet.click();

//   // Сохраняем ID кошелька в контекст для последующих проверок (если нужно)
//   this.currentWalletId = walletValue.split('_')[0];

//   console.log(`Selected payment wallet for delivery: ${walletValue}`);
// });

When('I click "Pay" to complete the order', async function () {
  const modalButton = this.page.locator('form.modal >> .modal-buttons button');
  await expect(modalButton).toBeVisible({ timeout: 10000 });
  await modalButton.click({ timeout: 10000 });
});









