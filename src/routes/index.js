// const express = require('express');
// const router = express.Router();

// // Import route modules
// const authRoutes = require('./auth');
// const userRoutes = require('./users');

// // Health check route
// router.get('/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// // API info route
// router.get('/', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Authentication API',
//     version: '1.0.0',
//     endpoints: {
//       auth: '/api/auth',
//       users: '/api/users',
//       health: '/api/health'
//     },
//     documentation: 'See README.md for API documentation'
//   });
// });

// // Mount route modules
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);

// // 404 handler for API routes
// router.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'API endpoint not found',
//     path: req.originalUrl
//   });
// });

// module.exports = router;