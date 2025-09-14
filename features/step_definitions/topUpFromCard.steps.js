const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');


// Кликаем по кнопке с указанным текстом
When('I click the {string} on the page', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

// Открываем дропдаун
When('I click {string} on the modal', async function (text) {
  await this.page.locator('div.dropdown-item', { hasText: text }).click();
});

// Выбираем валлет
When('I select {string} in the dropdown', async function (walletName) {
  await this.page.getByText(walletName, { exact: true }).click();
});

// Проверяем, что модалка с указанным текстом открылась
Then('I should see the {string} on the modal window', async function (modalTitle) {
  await expect(this.page.getByText(modalTitle, { exact: true })).toBeVisible();
});

// Выбираем способ оплаты по названию
When('I select {string} method', async function (methodName) {
  await this.page.getByText(methodName, { exact: true }).click();
});

// Ввод суммы
When('I enter top up amount {string} in field', async function (amount) {
  await this.page.waitForSelector('input.form-control', { timeout: 10000 });
  await this.page.fill('input.form-control', amount);
  console.log(`Entered amount: ${amount}`);
});

//Жмем Confirm, ждем редирект на Paytech
When('I click "Confirm" on the modal window', async function () {
  const [newPage] = await Promise.all([
    this.context.waitForEvent('page'), // ждём новую вкладку
    this.page.getByText('Confirm', { exact: true }).click()
  ]);

  this.page = newPage; // переключаемся на новую вкладку
  await this.page.waitForLoadState('domcontentloaded');

  await this.page.waitForSelector('input[placeholder="0000 0000 0000 0000"]', { timeout: 20000 });
  console.log('Redirected to payment form and ready');
});

//Вводим данные карты
When('I pay with test card', async function () {
  if (await this.page.$('#cardNumber')) {
    // ---- G2Pay форма ----
    await this.page.fill('#cardNumber', '4000 0000 0000 0002');
    await this.page.fill('#expiryDate', '1230');
    await this.page.fill('#cardSecurityCode', '555');
    await this.page.fill('#cardholderName', 'Atest');

    console.log('Filled G2Pay form');
  } else if (await this.page.$('input.base-input__input[placeholder="0000 0000 0000 0000"]')) {
    // ---- AltPay форма ----
    await this.page.fill('input.base-input__input[placeholder="0000 0000 0000 0000"]', '4111 1111 1111 1111');
    await this.page.fill('input[placeholder="MM / YY"]', '01/38');
    await this.page.fill('input[placeholder="CVV"]', '555');
    await this.page.fill('#cardholderName', 'DZMITRY ZHURAULEU');

    // Дата рождения
    const birthdate = this.page.locator('input[name="birthdate"]');
    await birthdate.click();
    await birthdate.fill('');
    await birthdate.type('2000-01-01');
    await expect(birthdate).toHaveValue('2000-01-01');

    // Район
    const district = this.page.locator('#district');
    await district.click();
    await district.fill('');
    await district.type('Wroclaw');

    console.log('Filled AltPay form');
  } else {
    throw new Error('Unknown payment form');
  }

  // Ждём и жмём Pay
  await this.page.waitForSelector('button[type="submit"]', { timeout: 10000 });
  await this.page.click('button[type="submit"]');
  console.log('Clicked Pay');
});

// Проверяем появление окна успеха
Then('I should see success payment screen', async function () {
  // Ждём появления любого из окон
  const finseiSuccess = this.page.locator('text=Top up received');
  const g2paySuccess = this.page.locator('text=Completed Successfully');

  await Promise.race([
    finseiSuccess.waitFor({ state: 'visible', timeout: 20000 }),
    g2paySuccess.waitFor({ state: 'visible', timeout: 20000 })
  ]);

  if (await finseiSuccess.isVisible()) {
    console.log('Success screen: Finsei');
    await expect(finseiSuccess).toBeVisible();
  } else if (await g2paySuccess.isVisible()) {
    console.log('Success screen: G2Pay');
    await expect(g2paySuccess).toBeVisible();
  } else {
    throw new Error('Success screen not found');
  }
});












