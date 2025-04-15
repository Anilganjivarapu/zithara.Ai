import mongoose from 'mongoose';
import User from './models/User.js';
import { MONGODB_URI } from './serverConfig.js';

async function checkAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    const admin = await User.findOne({ role: 'admin' });
    console.log(admin ? 'Admin exists:' : 'No admin found');
    if (admin) console.log(admin.email);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkAdmin();
