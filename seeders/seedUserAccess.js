module.exports = async function seedUserAccess(db) {
  try {
    const count = await db.userAccess.count();

    if (count === 0) {
      await db.userAccess.bulkCreate([
        {
          Description: 'Administrator',
          Active: true,
          CreatedBy: 'system',
          CreatedDate: new Date(),
        }
      ]);
      console.log('✅ Seeded UserAccess with initial record - Administrator.');
    } else {
      console.log(`ℹ️ ${count} UserAccess already exist. Skipping seeding.`);
    }
  } catch (error) {
    console.error('❌ Error seeding UserAccess:', error);
  }
};
