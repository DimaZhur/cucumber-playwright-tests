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

  // Имя
  await this.page.getByPlaceholder('First name').fill('A test');

  // Фамилия
  await this.page.getByPlaceholder('Last name').fill('A test');

  // Телефон
  await this.page.getByPlaceholder('Phone number').fill('48556666777');
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

// Заполняем блок Delivery address
When('I fill in the recipient Delivery address form', async function () {
  const modal = this.page.locator('form.modal');
  await expect(modal).toBeVisible({ timeout: 10000 });

  // Город
  await this.page.getByPlaceholder('City').fill('A test');

  // Улица
  await this.page.getByPlaceholder('Street').fill('A test');

  // Дом
  await this.page.getByPlaceholder('House').fill('A test');

  // Квартира
  await this.page.getByPlaceholder('Flat/Office').fill('A test');

  // Почтовый код
  await this.page.getByPlaceholder('Postal code').fill('A test');
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

//Вводим статический пароль
When('I fill a static password', async function () {
  const modal = this.page.locator('form.modal');
  await expect(modal).toBeVisible({ timeout: 10000 });

  await this.page.getByPlaceholder('Static password').fill('111111zZ!');
});

// Клик по кнопке Next
When('I click {string} to go to the final modal', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

When('I click "Pay" to complete the order', async function () {
  const modalButton = this.page.locator('form.modal >> .modal-buttons button');
  await expect(modalButton).toBeVisible({ timeout: 10000 });
  await modalButton.click({ timeout: 10000 });
});









