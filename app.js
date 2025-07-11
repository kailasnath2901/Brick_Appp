const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import database
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('combined'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
};

// Initialize database connection
testConnection();

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Brick Management API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

module.exports = app;