const orders = [
  {
    userId: "67f4fed162a53b2b2ddbdeff",
    products: [
      { productId: "1", quantity: 2 },
      { productId: "3", quantity: 1 }
    ],
    total: 489.97,
    status: "completed",
    createdAt: new Date("2024-05-15")
  },
  {
    userId: "67f4fed162a53b2b2ddbdeff",
    products: [
      { productId: "2", quantity: 1 }
    ],
    total: 159.99,
    status: "shipped",
    createdAt: new Date("2024-06-01")
  }
];

module.exports = orders;
