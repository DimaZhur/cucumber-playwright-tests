const fs = require('fs');
const path = require('path');   // <-- вот этого не хватает
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');


//Жмем на иконку аватара
When('I click on the profile avatar on the home page', async function () {
  await this.page.waitForSelector('div.profile-icon.header-profile-avatar', { timeout: 10000 });
  await this.page.click('div.profile-icon.header-profile-avatar');
  console.log('Clicked on profile avatar');
});

//Идем в настройки
When('I select Settings in the profile menu', async function () {
  await this.page.waitForSelector('span:text("Settings")', { timeout: 10000 });
  await this.page.click('span:text("Settings")');
  console.log('Clicked on Settings in profile menu');
});

//Вкладка Security
When('I click on the password tab', async function () {
  await this.page.waitForSelector('li.settings-tab:has-text("Password")', { timeout: 10000 });
  await this.page.click('li.settings-tab:has-text("Password")');
  console.log('Clicked on Password tab');
});

// Кликаем по кнопке с указанным текстом
When('I click the {string} on the change password page', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

// Меняем пароль на новый и обратно
When('I change password from {string} to {string}', async function (oldPassword, newPassword) {
  // Берем пароли из env, если они указаны в виде PLACEHOLDER'ов
  const current = process.env[oldPassword] || oldPassword;
  const next = process.env[newPassword] || newPassword;

  // Заполняем поля
  await this.page.fill('input[placeholder="Current password"]', current);
  await this.page.fill('input[placeholder="New password"]', next);
  await this.page.fill('input[placeholder="New password repeat"]', next);

  // Сохраняем изменения
  await this.page.click('button:has-text("Save changes")');
  console.log(`Changed password from ${current} to ${next}`);
});


//Выходим из системы
When('I click the {string} button for logout', async function (buttonText) {
  await this.page.waitForSelector(`a.menu-link:has-text("${buttonText}")`, { timeout: 10000 });
  await this.page.click(`a.menu-link:has-text("${buttonText}")`);
  console.log(`Clicked ${buttonText} button`);
});

//Логинимся заново
// Логинимся заново
When('I login again', async function () {
  const loginUrl = process.env.BASE_URL + '/auth/login';
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD2;

  console.log(`Logging in again at: ${loginUrl} with ${email}`);

  // Открываем страницу логина
  await this.page.goto(loginUrl);
  await this.page.waitForSelector('input[placeholder="Email"]');

  // Заполняем форму
  await this.page.fill('input[placeholder="Email"]', email);
  await this.page.fill('input[placeholder="Password"]', password);

  // Нажимаем кнопку входа
  await this.page.click('button:has-text("Login")');
  console.log(`Login form submitted for ${email}`);
});












