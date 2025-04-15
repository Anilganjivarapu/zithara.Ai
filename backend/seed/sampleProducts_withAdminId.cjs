const products = [
  {
    name: "Wireless Headphones",
    description: "Noise-cancelling Bluetooth headphones with 30hr battery",
    price: 199.99,
    image: "https://example.com/headphones.jpg",
    category: "Electronics",
    stock: 50,
    createdBy: "67f4fa868a1fa4f003f52096" // Valid admin ObjectId
  },
  {
    name: "Smart Watch",
    description: "Fitness tracker with heart rate monitor and GPS",
    price: 159.99,
    image: "https://example.com/smartwatch.jpg",
    category: "Electronics",
    stock: 30,
    createdBy: "67f4fa868a1fa4f003f52096" // Valid admin ObjectId
  },
  {
    name: "Coffee Maker",
    description: "Programmable 12-cup coffee machine",
    price: 89.99,
    image: "https://example.com/coffeemaker.jpg",
    category: "Home",
    stock: 20,
    createdBy: "67f4fa868a1fa4f003f52096" // Valid admin ObjectId
  }
];

module.exports = products;
