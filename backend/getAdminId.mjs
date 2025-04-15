import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function getAdminId() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admin = await User.findOne({role:'admin'});
    console.log(admin?._id || 'No admin found');
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

getAdminId();
