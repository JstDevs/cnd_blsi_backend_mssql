const { documentType } = require('../config/database');

async function makeInvoiceNumberTravelOrder(userDepartmentCode) {
  const prefixNumber = ['00000', '0000', '000', '00', '0', '', ''];
  let newInvoiceNumber = 'invoice number test';

  const row = await documentType.findOne({ where: { Code: 'TO' } });

  if (row) {
    const currentNumber = parseInt(row['Current Number'], 10) + 1;
    const prefix = row['Prefix'];

    let paddedValue = '';

    if (currentNumber < 10) {
      paddedValue = prefixNumber[1] + currentNumber;
    } else if (currentNumber < 100) {
      paddedValue = prefixNumber[2] + currentNumber;
    } else if (currentNumber < 1000) {
      paddedValue = prefixNumber[6] + currentNumber;
    } else if (currentNumber < 10000) {
      paddedValue = prefixNumber[4] + currentNumber;
    } else if (currentNumber < 100000) {
      paddedValue = prefixNumber[5] + currentNumber;
    }

    newInvoiceNumber = `${prefix}-${paddedValue}`;
  }

  return `${newInvoiceNumber}-${userDepartmentCode}`;
}

module.exports = makeInvoiceNumberTravelOrder;
