const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edtech_learning_portal');
  console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

module.exports = connectDB;
