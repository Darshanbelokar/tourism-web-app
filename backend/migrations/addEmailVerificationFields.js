// Migration: Add email verification fields to existing users
import mongoose from "mongoose";

const addEmailVerificationFields = async () => {
  try {
    console.log('📧 Starting email verification fields migration...');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Update all existing users to have email verification fields
    const result = await usersCollection.updateMany(
      { isEmailVerified: { $exists: false } }, // Only update users without the field
      {
        $set: {
          isEmailVerified: true, // Mark existing users as verified
          emailVerificationToken: null,
          emailVerificationExpires: null
        }
      }
    );

    console.log(`✅ Email verification migration completed:`);
    console.log(`   - Modified ${result.modifiedCount} user(s)`);
    console.log(`   - Matched ${result.matchedCount} user(s)`);
    console.log(`   - Existing users marked as verified to prevent login issues`);

    return {
      success: true,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    };

  } catch (error) {
    console.error('❌ Email verification migration failed:', error);
    throw error;
  }
};

export default addEmailVerificationFields;