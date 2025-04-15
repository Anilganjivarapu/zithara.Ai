import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

userSchema.index({ email: 1 }, { 
  unique: true,
  name: 'email_index'
});

let User;
try {
  User = mongoose.model('User');
} catch {
  User = mongoose.model('User', userSchema);
  // Configure schema with explicit timeout handling
  // Basic schema configuration
  userSchema.set('timestamps', true);
  userSchema.set('autoIndex', true);
  
  // Add proper query helper registration
  userSchema.query.setTimeout = function(ms) {
    return this.maxTimeMS(ms);
  };
  userSchema.loadClass(class {
    setTimeout(ms) {
      return this.maxTimeMS(ms);
    }
  });
}

mongoose.connection.on('connected', async () => {
  try {
    // Skip index creation if already exists
    const indexes = await User.collection.getIndexes();
    if (!indexes.email_1) {
      await User.init();
      console.log('✅ User indexes verified');
    }
  } catch (err) {
    console.warn('⚠️ Index verification warning:', err.message);
  }
});

export default User;