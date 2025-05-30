import config from '@/common/config/config';
import mongoose from 'mongoose';
import QdrantService from './qdrant.service';

export const connectDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUrl);
    console.info('MongoDB connected successfully!');
    QdrantService.getInstance();
    console.info('Qdrant service initialized successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};
