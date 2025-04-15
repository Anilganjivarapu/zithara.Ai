import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminExists = await User.findOne({ email: 'admin@test.com' });
    if (adminExists) {
      console.log('✅ Admin user already exists');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const adminUser = new User({
      name: 'admin2',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
  } catch (err) {
    console.error('❌ Error creating admin user:', err);
  } finally {
    mongoose.disconnect();
  }
};

createAdminUser();
