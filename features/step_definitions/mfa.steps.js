// features/step_definitions/mfa.steps.js
const { When } = require('@cucumber/cucumber');

When('I enter the MFA code {string}', async function (code) {
  // Ждём появления хотя бы одного MFA-инпута
  const inputs = this.page.locator('input.form-control[type="text"][maxlength="1"]');
  await inputs.first().waitFor({ state: 'visible', timeout: 5000 });

  const count = await inputs.count();
  console.log('Found MFA inputs:', count);

  // Вводим код по символам
  for (let i = 0; i < code.length && i < count; i++) {
    await inputs.nth(i).fill(code[i]);
  }

  console.log(`Entered MFA code: ${code}`);
});



