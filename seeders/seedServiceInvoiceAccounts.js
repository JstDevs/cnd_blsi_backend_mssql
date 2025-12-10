module.exports = async function seedServiceInvoiceAccounts(db) {
  try {
    const count = await db.ServiceInvoiceAccounts.count();

    if (count === 0) {
      await db.ServiceInvoiceAccounts.bulkCreate([
        {
          Name: 'Marriage Service Invoice',
          ChartofAccountsID: null,
          CreatedBy: 'system',
          CreatedDate: new Date(),
          Rate: 0
        },
        {
          Name: 'Burial Service Invoice',
          ChartofAccountsID: null,
          CreatedBy: 'system',
          CreatedDate: new Date(),
          Rate: 0
        },
        {
          Name: 'Due from Local Government Units',
          ChartofAccountsID: null,
          CreatedBy: 'system',
          CreatedDate: new Date(),
          Rate: 0
        },
        {
          Name: 'Due To LGUs',
          ChartofAccountsID: null,
          CreatedBy: 'system',
          CreatedDate: new Date(),
          Rate: 0
        },
        {
          Name: 'Real Property Tax',
          ChartofAccountsID: null,
          CreatedBy: 'system',
          CreatedDate: new Date(),
          Rate: 0
        }
      ]);
      console.log('✅ Seeded ServiceInvoiceAccounts with initial 5 records.');
    } else {
      console.log(`ℹ️ ${count} ServiceInvoiceAccounts already exist. Skipping seeding.`);
    }
  } catch (error) {
    console.error('❌ Error seeding ServiceInvoiceAccounts:', error);
  }
};
