module.exports = async function seedLgu(db) {
  try {
    const count = await db.Lgu.count();

    if (count === 0) {
      await db.Lgu.bulkCreate([
        {
          Logo: '',
          Code: '',
          Name: '',
          TIN: '',
          RDO: '',
          PhoneNumber: '',
          EmailAddress: '',
          Website: '',
          StreetAddress: '',
          BarangayID: null,
          MunicipalityID: null,
          ProvinceID: null,
          RegionID: null,
          ZIPCode: '',
          Active: 1,
          CreatedBy: 'system',
          CreatedDate: new Date(),
          ModifyBy: null,
          ModifyDate: null
        }
      ]);
      console.log('✅ Seeded LGU with initial record.');
    } else {
      console.log(`ℹ️ ${count} LGU already exist. Skipping seeding.`);
    }
  } catch (error) {
    console.error('❌ Error seeding LGU:', error);
  }
};
