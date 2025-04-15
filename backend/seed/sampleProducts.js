import mongoose from 'mongoose';
import Product from '../models/Product.js';

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30hr battery life',
    price: 199.99,
    stock: 50,
    category: 'Electronics'
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitor and GPS',
    price: 149.99,
    stock: 30,
    category: 'Electronics'
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable 12-cup coffee maker with thermal carafe',
    price: 89.99,
    stock: 20,
    category: 'Home'
  },
  {
    name: 'Yoga Mat',
    description: 'Eco-friendly non-slip yoga mat with carrying strap',
    price: 29.99,
    stock: 100,
    category: 'Fitness'
  },
  {
    name: 'Blender',
    description: 'High-speed blender with 1000W motor and 64oz pitcher',
    price: 79.99,
    stock: 15,
    category: 'Kitchen'
  }
];

const seedProducts = async () => {
  try {
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log('Products seeded successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    mongoose.disconnect();
  }
};

seedProducts();
