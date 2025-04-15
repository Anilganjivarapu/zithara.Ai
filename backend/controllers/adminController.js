import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Chat from '../models/Chat.js';

export const getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    
    res.json({
      userCount,
      productCount,
      orderCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password from response
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate('user', 'name email');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
