const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

//Клик по кнопке Bulk payments
When('I click on {string} to create a new bulk payment', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

// Проверяем, что появилась модалка Bulk payments
Then('I should see the {string}', async function (title) {
  const modal = this.page.locator('form.modal');
  await expect(modal).toBeVisible({ timeout: 10000 });

  // проверим заголовок внутри модалки
  const heading = modal.getByRole('heading', { name: new RegExp(title, 'i') });
  await expect(heading).toBeVisible({ timeout: 10000 });
});

// Выбираем вариант "SEPA Transfer" в модальном окне Bulk
// Кликаем по всей панели типа перевода в модалке Bulk
When('I select {string}', async function (option) {
  const modal = this.page.locator('form.modal');
  await expect(modal).toBeVisible({ timeout: 10000 });

  // сама кликабельная панель (вся область)
  const panel =
    modal.getByRole('listitem', { name: new RegExp(option, 'i') }).first()
      .or(modal.locator('ul.modal-panel-list li.modal-panel', { hasText: option }).first());

  await expect(panel).toBeVisible({ timeout: 10000 });
  await expect(panel).toBeEnabled();

  // на всякий случай — в вьюпорт
  await panel.scrollIntoViewIfNeeded();

  // клик «куда угодно» по панели
  await panel.click({ timeout: 10000 });
});

// Загружаем файл из папки fixtures
// Без клика по Upload — напрямую в input[type=file]
When('I upload the file {string}', async function (fileName) {
  const filePath = require('path').resolve('tests/fixtures', fileName);

  // если инпут уже в DOM — этот способ всегда закрывает вопрос
  await this.page.setInputFiles('form.modal input[type="file"]', filePath, { timeout: 15000 });
});

// Клик по полю "Choose a wallet to pay"
When('I open the wallet dropdown', async function () {
  const field = this.page.locator('div.dropdown-item', { hasText: /Choose a wallet to pay/i });
  await expect(field).toBeVisible({ timeout: 10000 });
  await field.click();
});

// Выбираем валлет AT 3326 GuruPay C2S
When('I click on wallet "AT 3326 GuruPay C2S"', async function () {
  await this.page.click('text=AT 3326 GuruPay C2S');
});

// Клик по кнопке Next
When('I click {string} to proceed to the next step', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

// Клик по кнопке Confirm
When('I click {string} to finish', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

// Проверяем, что появилась транзакция с суммой и текущим временем
Then('I should see bulk payment {string} at current time', async function (amount) {
  // Берём текущее время (HH:MM)
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  console.log(`Ждём 3 секунды перед проверкой транзакции...`);
  await this.page.waitForTimeout(3000); // пауза 3 секунды

  console.log(`Ищем транзакцию с суммой ${amount} и временем ${currentTime}`);

  // Локатор: ищем строку .group-item, которая содержит и время, и сумму
  const transactionRow = this.page.locator(`.group-item:has-text("${currentTime}"):has-text("${amount}")`);

  // Проверяем, что видна именно такая строка
  await expect(transactionRow).toBeVisible({ timeout: 10000 });
});

// Проверяем, что URL содержит нужный walletId
Then('I should be on I should be on the page of the wallet {string} that was used', async function (walletId) {
  await expect(this.page).toHaveURL(new RegExp(`/wallet/${walletId}$`));
});








