import mongoose from 'mongoose';

const connectToDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to database');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export default connectToDB;
