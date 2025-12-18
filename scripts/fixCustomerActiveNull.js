/**
 * Script to fix null Active values in the customer table
 * Sets Active = 1 (true) for all customers where Active is currently null
 * 
 * Usage: node scripts/fixCustomerActiveNull.js
 */

const db = require('../config/database');

async function fixCustomerActiveNull() {
  try {
    console.log('🔍 Checking for customers with null Active values...');
    
    // Find all customers with null Active
    const customersWithNullActive = await db.Customer.findAll({
      where: {
        Active: null
      },
      attributes: ['ID', 'Name', 'FirstName', 'LastName', 'Active']
    });

    if (customersWithNullActive.length === 0) {
      console.log('✅ No customers with null Active values found. All good!');
      process.exit(0);
    }

    console.log(`📊 Found ${customersWithNullActive.length} customer(s) with null Active values:`);
    customersWithNullActive.forEach(customer => {
      const name = customer.Name || `${customer.FirstName || ''} ${customer.LastName || ''}`.trim() || 'N/A';
      console.log(`   - ID: ${customer.ID}, Name: ${name}`);
    });

    console.log('\n🔄 Updating Active to 1 (true) for all null values...');
    
    // Update all null Active values to true (1)
    const [updatedCount] = await db.Customer.update(
      { Active: true },
      {
        where: {
          Active: null
        }
      }
    );

    console.log(`✅ Successfully updated ${updatedCount} customer record(s).`);
    console.log('✅ All customers now have Active = 1 (true).');
    
    // Verify the fix
    const remainingNull = await db.Customer.count({
      where: {
        Active: null
      }
    });

    if (remainingNull === 0) {
      console.log('✅ Verification: No null Active values remaining.');
    } else {
      console.log(`⚠️  Warning: ${remainingNull} customer(s) still have null Active values.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing customer Active values:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the script
fixCustomerActiveNull();

