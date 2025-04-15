const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const Order = require('./models/Order');
const products = require('./seed/sampleProducts.cjs');
const orders = require('./seed/sampleOrders.cjs');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await Product.deleteMany({});
    await Order.deleteMany({});
    
    // Insert products and get their IDs
    const createdProducts = await Product.insertMany(products);
    
    // Map product names to IDs for orders
    const productIdMap = {
      "Wireless Headphones": createdProducts[0]._id,
      "Smart Watch": createdProducts[1]._id,
      "Coffee Maker": createdProducts[2]._id
    };
    
    // Prepare orders with actual product IDs
    const preparedOrders = orders.map(order => ({
      ...order,
      products: order.products.map(item => ({
        productId: productIdMap[item.productId],
        quantity: item.quantity
      }))
    }));
    
    await Order.insertMany(preparedOrders);
    
    console.log('✅ Database seeded successfully!');
    console.log(`📦 Products added: ${createdProducts.map(p => p.name).join(', ')}`);
    console.log(`📝 Orders created: ${preparedOrders.length}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
