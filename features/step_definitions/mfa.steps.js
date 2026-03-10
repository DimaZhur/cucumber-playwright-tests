const { When } = require('@cucumber/cucumber');

When('I enter the MFA code {string}', async function (codeFromFeature) {
  const code = codeFromFeature || process.env.MFA;
  if (!code) throw new Error('MFA code not provided (neither feature nor .env)');

  const inputs = this.page.locator('input.form-control[type="text"][maxlength="1"]');
  await inputs.first().waitFor({ state: 'visible', timeout: 5000 });

  const count = await inputs.count();
  console.log('Found MFA inputs:', count);

  for (let i = 0; i < code.length && i < count; i++) {
    await inputs.nth(i).fill(code[i]);
  }

  //await this.page.waitForTimeout(7000);

  console.log(`Entered MFA code: ${code}`);
});

// Альтернативный шаг - если код не указывается в feature
When('I enter the MFA code', async function () {
  const code = process.env.MFA;
  if (!code) throw new Error('MFA code missing in .env');

  const inputs = this.page.locator('input.form-control[type="text"][maxlength="1"]');
  await inputs.first().waitFor({ state: 'visible', timeout: 5000 });

  const count = await inputs.count();
  console.log('Found MFA inputs:', count);

  for (let i = 0; i < code.length && i < count; i++) {
    await inputs.nth(i).fill(code[i]);
  }

    await this.page.waitForTimeout(3000);

  console.log(`Entered MFA code from .env: ${code}`);
});




