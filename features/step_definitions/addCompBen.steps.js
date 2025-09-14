const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const path = require('path');
const { generateAustrianIban } = require(path.resolve(__dirname, '../support/utils.js'));


// Клик по пункту меню Beneficiaries
When('I go to the Beneficiaries page', async function () {
  // Ищем элемент с текстом "Beneficiaries" в боковом меню и кликаем
  await this.page.getByRole('link', { name: 'Beneficiaries' }).click();
});

// Клик по кнопке Add beneficiary
When('I click on {string} on the page', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

//Выбираем Company
When('I click on {string} tab on the modal Add beneficiary', async function (tabName) {
  await this.page.click(`li.has-label:text-is("${tabName}")`);
});

//Выбираем валюту
When('I select currency {string} on the modal', async function (currency) {
  // открываем дропдаун
  await this.page.click('div.dropdown');  

  // ждём появления списка
  await this.page.waitForSelector('div.dropdown-list-item');  

  // кликаем по валюте
  await this.page.click(`div.dropdown-list-item:has-text("${currency}")`);
});

// Заполняем данные беника
When('I fill a company beneficiary info in the form', async function () {

 // Название компании
  await this.page.getByPlaceholder('Company name').fill('Test company auto');

  // Template name с указанием текущего времени (до минут)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;

  this.latestBenName = `A test ben company ${formattedTime}`;

  await this.page.getByPlaceholder('Template name').fill(this.latestBenName);
});

//Вводим IBAN
When('I fill IBAN field with random Austrian IBAN on the modal', async function () {
  const randomIban = generateAustrianIban();
  await this.page.fill('input[placeholder="IBAN"]', randomIban);
});

// Нажимаем на кнопку Add beneficiary
When('I click Add beneficiary on the modal', async function () {
  const modal = this.page.locator('#modals'); // сам контейнер модалки
  const submitButton = modal.locator('.modal-buttons button:has-text("Add beneficiary")');

  await submitButton.waitFor({ state: 'visible', timeout: 5000 });
  await submitButton.click();

  console.log('Clicked Add user inside modal');
});

//Проверяем, что новый беник отображается
Then('I should see the new beneficiary on the dashboard', async function () {
  const firstName = this.page.locator('div.user .user-name').first();
  await expect(firstName).toHaveText(this.latestBenName, { timeout: 15000 });
});



