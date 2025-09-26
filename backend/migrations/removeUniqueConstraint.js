// Migration to remove unique constraint from feedback collection
import mongoose from 'mongoose';

const removeUniqueConstraint = async () => {
  try {
    console.log('🔄 Starting removeUniqueConstraint migration...');

    // Get the feedback collection
    const db = mongoose.connection.db;
    const collection = db.collection('feedbacks');

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

    console.log('🎉 removeUniqueConstraint migration completed!');
    return { success: true };
    
  } catch (error) {
    console.error('❌ removeUniqueConstraint migration failed:', error);
    throw error;
  }
};

export default removeUniqueConstraint;