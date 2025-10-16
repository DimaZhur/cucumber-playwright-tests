const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Клик по пункту меню Users
When('I navigate to the Users page', async function () {
  // Ищем элемент с текстом "Users" в боковом меню и кликаем
  await this.page.getByRole('link', { name: 'Users' }).click();
});

// Клик по кнопке Add user
When('I click on {string} to create a user', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();
});

// Заполняем данные юзера (в имени дата и время создания)
When('I fill a user info in the form with name {string}', async function (userName) {
  const modal = this.page.locator('form.modal');
  await expect(modal).toBeVisible({ timeout: 10000 });
  console.log('Modal is visible, starting to fill the form');

  // Формируем метку времени до минут
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedTime = `${year}-${month}-${day}_${hours}:${minutes}`;

  // Имя с меткой времени
  this.latestUserName = `${userName}_${formattedTime}`;
  await modal.getByPlaceholder('Name').fill(this.latestUserName);
  console.log(`Filled Name: ${this.latestUserName}`);

  // Генерируем email
  const randomEmail = `user_${Date.now()}@test.com`;
  this.latestUserEmail = randomEmail;
  await modal.getByPlaceholder('Email').fill(randomEmail);
  console.log(`Filled Email: ${randomEmail}`);

  // Телефон
  await modal.getByPlaceholder('Phone number').fill('48556666777');
  console.log('Filled Phone');

  // Открыть дропдаун Access options
  await modal.locator('text=Access options').click();
  await this.page.waitForTimeout(300); // короткая пауза, чтобы список успел открыться

  // Кликнуть "Full access"
  await modal.locator('.dropdown-list-item', { hasText: 'Full access' }).click();
  console.log('Selected Full access');

  console.log('User data filled successfully');
});



// Нажимаем на кнопку Add user
When('I click Add user', async function () {
  const modal = this.page.locator('#modals'); // сам контейнер модалки
  const submitButton = modal.locator('.modal-buttons button:has-text("Add user")');

  await submitButton.waitFor({ state: 'visible', timeout: 5000 });
  await submitButton.click();

  console.log('Clicked Add user inside modal');

  // небольшой таймаут, чтобы успело появиться окно MFA
  await this.page.waitForTimeout(500);
});

//Проверяем, что новый юзер отображается
Then('I should see the new user at the top of the list', async function () {
  const firstUser = this.page.locator('p.item-name.text-overflow').first();
  
  await expect(firstUser).toHaveText(this.latestUserName, { timeout: 15000 });
  
  console.log(`Found new user: ${this.latestUserName}`);
});




