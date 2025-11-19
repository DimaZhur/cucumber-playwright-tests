// import { When } from '@cucumber/cucumber';

// When('I close the promo banner if it appears', async function () {
//   const page = this.page;

//   const skipButton = page.locator('button.btn-skip');

//   // Ждём появления баннера максимум 10 секунд,
//   // но не падаем, если его нет
//   const appears = await skipButton
//     .waitFor({ state: 'visible', timeout: 10000 })
//     .then(() => true)
//     .catch(() => false);

//   if (appears) {
//     console.log(' Promo banner detected. Closing it...');
//     await skipButton.click();
//     await page.waitForTimeout(300); // даём анимации исчезнуть
//   } else {
//     console.log('ℹ Promo banner did not appear — continuing...');
//   }
// });



