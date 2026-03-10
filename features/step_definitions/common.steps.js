const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Универсальная проверка success message
Then('I should see a success message {string}', async function (message) {
  await this.page.waitForTimeout(3000);

  await expect(this.page.getByText(message, { exact: true })).toBeVisible({ timeout: 10000 });
  console.log(`Success message "${message}" is visible`);
});



