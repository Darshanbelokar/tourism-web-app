// Migration to remove unique constraint from feedback collection
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const removeUniqueConstraint = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the feedback collection
    const db = mongoose.connection.db;
    const collection = db.collection('feedbacks');

    // List existing indexes
    console.log('Current indexes:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log(JSON.stringify(index, null, 2));
    });

    // Drop the unique index if it exists
    try {
      await collection.dropIndex({ user: 1, targetType: 1, targetId: 1 });
      console.log('✅ Successfully dropped unique constraint index');
    } catch (error) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️ Unique constraint index not found (already removed)');
      } else {
        console.error('❌ Error dropping index:', error.message);
      }
    }

    // Create new non-unique index
    await collection.createIndex({ user: 1, targetType: 1, targetId: 1 });
    console.log('✅ Created non-unique index for queries');

    // List indexes after change
    console.log('\nIndexes after migration:');
    const newIndexes = await collection.indexes();
    newIndexes.forEach(index => {
      console.log(JSON.stringify(index, null, 2));
    });

    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the migration
removeUniqueConstraint();