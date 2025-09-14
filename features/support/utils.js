const iban = require('iban');

function generateAustrianIban() {
  const bankCode = String(Math.floor(Math.random() * 99999)).padStart(5, "0"); // 5 цифр
  const accountNumber = String(Math.floor(Math.random() * 99999999999)).padStart(11, "0"); // 11 цифр
  const bban = bankCode + accountNumber;

  return iban.fromBBAN("AT", bban);
}

module.exports = {
  generateAustrianIban,
};
