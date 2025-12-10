module.exports = async function seedDepartments(db) {
  try {
    const count = await db.department.count();

    if (count === 0) {
      await db.department.bulkCreate(
        [
        {
            ID: 1,
            Code: '1',
            Name: 'Accounting',
            Active: 1,
            CreatedBy: 'system',
            CreatedDate: new Date(),
        },
        {
            ID: 2,
            Code: '2',
            Name: 'Budget',
            Active: 1,
            CreatedBy: 'system',
            CreatedDate: new Date(),
        },
        {
            ID: 3,
            Code: '3',
            Name: 'Treasury',
            Active: 1,
            CreatedBy: 'system',
            CreatedDate: new Date(),
        },
        {
            ID: 4,
            Code: '4',
            Name: 'Office of the Mayor',
            Active: 1,
            CreatedBy: 'system',
            CreatedDate: new Date(),
        },
        ]
      );
      console.log('✅ Seeded Departments with initial record.');
    } else {
      console.log(`ℹ️ ${count} Departments already exist. Skipping seeding.`);
    }
  } catch (error) {
    console.error('❌ Error seeding Departments:', error);
  }
};
