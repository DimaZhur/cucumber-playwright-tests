const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Клик по пункту меню Report
When('I navigate to the Reports page', async function () {
  // Ищем элемент с текстом "Report" в боковом меню и кликаем
  await this.page.getByRole('link', { name: 'Report' }).click();
});

// Нажимаем на Create report
When('I click the {string} to get a report', async function (buttonText) {
  const submitButton = this.page.locator(`button:has-text("${buttonText}")`);
  await submitButton.waitFor({ state: 'visible', timeout: 5000 });
  await submitButton.click();
  console.log(`Clicked button: ${buttonText}`);
  
  // Небольшая пауза, чтобы успело появиться следующее окно
  await this.page.waitForTimeout(500);
});

// Нажатие на кнопку Create report для завершения создания отчета
When('I submit the create a report', async function () {
  const submitButton = this.page.locator('#modals button:has-text("Create report")');
  await submitButton.waitFor({ state: 'visible', timeout: 10000 });
  await submitButton.click();
  console.log('Clicked Create report button (modal)');
//   await this.page.waitForTimeout(1000);
});

Then('I should see a new report at current time', async function () {
  // ждём несколько секунд, пока отчёт появится
  await this.page.waitForTimeout(3000);

  // берём текущее время (HH.MM) — у тебя на скрине такой формат
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  // формируем строку с датой как в интерфейсе
  const currentDate = `${day}.${month}.${year}`;

  console.log(`Проверяем наличие отчёта за ${currentDate}`);

  // ищем строку отчёта по текущей дате
  const reportRow = this.page.locator(`.section-content:has-text("${currentDate}")`);

  // ждём пока отчёт будет виден
  await expect(reportRow).toBeVisible({ timeout: 10000 });
});


    