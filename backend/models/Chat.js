import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  response: {
    type: String,
    required: true,
    trim: true
  },
  metadata: {
    model: {
      type: String,
      default: 'gemini-1.5-pro-latest'
    },
    tokens: Number,
    responseTime: Number
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
chatSchema.index({ user: 1, createdAt: -1 });

// Add query helper methods
chatSchema.query.byUser = function(userId) {
  return this.where({ user: userId });
};

chatSchema.query.recentFirst = function() {
  return this.sort({ createdAt: -1 });
};

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
