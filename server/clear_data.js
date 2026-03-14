import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pothole from './models/Pothole.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

const clearDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Purging all structural defect data (Real & Mock)...');
    const result = await Pothole.deleteMany({});
    
    console.log(`Successfully cleared ${result.deletedCount} records.`);
    console.log('The portal is now in "Zero-Base" state. Only genuine new uploads will be displayed.');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

clearDatabase();
