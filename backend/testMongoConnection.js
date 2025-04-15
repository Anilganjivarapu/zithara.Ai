import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
  }
};

testConnection();
