const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const path = require('path');
const { generateAustrianIban } = require(path.resolve(__dirname, '../support/utils.js'));


// Клик по пункту меню Beneficiaries
When('I navigate to the Beneficiaries page', async function () {
  // Ищем элемент с текстом "Beneficiaries" в боковом меню и кликаем
  await this.page.getByRole('link', { name: 'Beneficiaries' }).click();
});

// Клик по кнопке Add beneficiary
When('I click on {string} to create a beneficiary', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

//Выбираем валюту
When('I select currency {string}', async function (currency) {
  // открываем дропдаун
  await this.page.click('div.dropdown');  

  // ждём появления списка
  await this.page.waitForSelector('div.dropdown-list-item');  

  // кликаем по валюте
  await this.page.click(`div.dropdown-list-item:has-text("${currency}")`);
});

// Заполняем данные individual-бенефициара
When('I fill a individual beneficiary info in the form with name {string}', async function (beneficiaryName) {
  // Имя и фамилия
  await this.page.getByPlaceholder('First name').fill('A test');
  await this.page.getByPlaceholder('Last name').fill('Test-auto');

  // Формат даты: 2025-10-16 10:22
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;

  // Формируем уникальное имя
  this.latestBenName = `${beneficiaryName} ${formattedTime}`;

  // Заполняем Template name
  await this.page.getByPlaceholder('Template name').fill(this.latestBenName);

  console.log(`Individual beneficiary filled: ${this.latestBenName}`);
});

//Вводим IBAN
When('I fill IBAN field with random Austrian IBAN', async function () {
  const randomIban = generateAustrianIban();
  await this.page.fill('input[placeholder="IBAN"]', randomIban);
});

// Нажимаем на кнопку Add beneficiary
When('I click Add beneficiary', async function () {
  const modal = this.page.locator('#modals'); // сам контейнер модалки
  const submitButton = modal.locator('.modal-buttons button:has-text("Add beneficiary")');

  await submitButton.waitFor({ state: 'visible', timeout: 5000 });
  await submitButton.click();

  console.log('Clicked Add user inside modal');
});

//Проверяем, что новый беник отображается
Then('I should see the new beneficiary at the top of the list', async function () {
  const firstName = this.page.locator('div.user .user-name').first();
  await expect(firstName).toHaveText(this.latestBenName, { timeout: 15000 });
});
