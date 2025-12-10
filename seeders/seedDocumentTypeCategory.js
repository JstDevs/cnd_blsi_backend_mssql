module.exports = async function seedDocumentTypeCategory(db) {
  try {
    const count = await db.documentTypeCategory.count();

    if (count === 0) {
      await db.documentTypeCategory.bulkCreate(
        [
        {
            ID: 1,
            Name: 'Official',
            Active: 1,
            CreatedBy: 'system',
            CreatedDate: new Date(),
        }
        ]
      );
      console.log('✅ Seeded Document Type Categories with initial record.');
    } else {
      console.log(`ℹ️ ${count} Document Type Categories already exist. Skipping seeding.`);
    }
  } catch (error) {
    console.error('❌ Error seeding Document Type Categories:', error);
  }
};
