const fs = require('fs');
const path = require('path');   // <-- вот этого не хватает
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');


//Жмем на иконку аватара
When('I click on the profile avatar', async function () {
  await this.page.waitForSelector('div.profile-icon.header-profile-avatar', { timeout: 10000 });
  await this.page.click('div.profile-icon.header-profile-avatar');
  console.log('Clicked on profile avatar');
});

//Идем в настройки
When('I click on Settings in the profile menu', async function () {
  await this.page.waitForSelector('span:text("Settings")', { timeout: 10000 });
  await this.page.click('span:text("Settings")');
  console.log('Clicked on Settings in profile menu');
});

//Вкладка Security
When('I click on the Security tab', async function () {
  await this.page.waitForSelector('li.settings-tab:has-text("Security")', { timeout: 10000 });
  await this.page.click('li.settings-tab:has-text("Security")');
  console.log('Clicked on Security tab');
});

//нажимаем Create token pair
When('I click on the {string} button', async function (buttonText) {
  await this.page.waitForSelector(`button:has-text("${buttonText}")`, { timeout: 10000 });
  const button = await this.page.locator(`button:has-text("${buttonText}")`);
  await button.scrollIntoViewIfNeeded();
  await button.click();
  console.log(`Clicked on button: ${buttonText}`);
});

//Вводим ip 172.31.2.106
When('I enter {string} into the IP address field', async function (ip) {
  await this.page.waitForSelector('input[placeholder="IP address or subnet"]', { timeout: 10000 });
  await this.page.fill('input[placeholder="IP address or subnet"]', ip);
  console.log(`Entered IP address: ${ip}`);
});

//Даем название сессии с датой и временем
When('I enter a session name with current date and time', async function () {
  const now = new Date();
  
  // Формат YYYY-MM-DD_HH-mm
  const datePart = now.toISOString().split('T')[0]; // 2025-09-10
  const timePart = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
  
  const sessionName = `AT_${datePart}_${timePart}`;
  
  await this.page.waitForSelector('input[placeholder="Session name (optional)"]', { timeout: 10000 });
  await this.page.fill('input[placeholder="Session name (optional)"]', sessionName);
  
  console.log(`Entered session name: ${sessionName}`);
  
  // Сохраняем в контекст, чтобы потом проверить наличие в списке
  this.sessionName = sessionName;
});


// Жмем Confirm
When('I push {string}', async function (buttonText) {
  await this.page.getByRole('button', { name: buttonText }).click();

  // небольшой таймаут, чтобы успело появиться окно MFA
  await this.page.waitForTimeout(500);
});

//Сохраняем токены в файл
Then('I save the generated tokens to a file', async function () {
  await this.page.waitForSelector('div.jwt-panels', { timeout: 10000 });

  const accessToken = await this.page.textContent('div.jwt-panels div.panel-target:nth-of-type(1)');
  const refreshToken = await this.page.textContent('div.jwt-panels div.panel-target:nth-of-type(2)');

  // Создаём папку tokens, если её нет
  const dir = path.join(process.cwd(), 'jwtTokens');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Генерим имя файла с датой
  const now = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = path.join(dir, `generated_tokens_${now}.txt`);

  const content = `Access Token: ${accessToken}\nRefresh Token: ${refreshToken}\n`;
  fs.writeFileSync(filename, content, 'utf8');

  console.log(`Tokens saved to ${filename}`);
});

//Жмем Ok, I got it
When('I click on {string}', async function (buttonText) {
  await this.page.waitForSelector(`button:has-text("${buttonText}")`, { timeout: 10000 });
  await this.page.click(`button:has-text("${buttonText}")`);
  console.log(`Clicked on button: ${buttonText}`);
});

//Проверяем, что новая сессия с токенами отобразилась
Then('I should see the new session in the list', async function () {
  // Берём имя сессии, сохранённое ранее
  const sessionName = this.sessionName;
  if (!sessionName) {
    throw new Error('Session name was not set earlier in the scenario');
  }

  // Ждём появления сессии в списке
  await this.page.waitForSelector(`div.sheet-item:has-text("${sessionName}")`, { timeout: 10000 });

  // Проверяем, что текст действительно есть
  const sessionText = await this.page.textContent(`div.sheet-item:has-text("${sessionName}")`);
  expect(sessionText).toContain(sessionName);

  console.log(`Verified that session "${sessionName}" appeared in the list`);
});




