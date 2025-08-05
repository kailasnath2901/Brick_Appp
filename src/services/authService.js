const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../../models'); 
const { isSuperAdmin } = require('../middleware/auth');
const { Op } = require('sequelize');




class AuthService {
  // Generate JWT token
  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
  }

  // Super admin login (from env variables)
  async superAdminLogin(email, password) {
    try {
      // 1. Implement proper super admin validation
      const isValid = await this.validateSuperAdmin(email, password);
      if (!isValid) {
        return {
          success: false,
          message: 'Invalid super admin credentials'
        };
      }

      // 2. Generate token with proper expiration
      const payload = {
        id: 1, 
        email: email,
        role: 'super_admin',
        username: 'Super Admin'
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '8h' 
      });

      return {
        success: true,
        data: {
          user: payload,
          token
        },
        message: 'Super admin login successful'
      };
    } catch (error) {
      console.error('Super admin login error:', error);
      return {
        success: false,
        message: error.message || 'Super admin login failed'
      };
    }
  }

  // Add this validation method
  async validateSuperAdmin(email, password) {
    // Replace with actual validation logic
    return email === process.env.SUPER_ADMIN_EMAIL &&
      password === process.env.SUPER_ADMIN_PASSWORD;
  }

  // Regular user login
  async login(email, password) {
    try {
      // Debug: Check if User model is available
      if (!User) {
        console.error('User model is undefined');
        throw new Error('User model not initialized');
      }

      // Find user by email
      const user = await User.findOne({
        where: {
          email: email.toLowerCase(),
          isActive: true
        }
      });

      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Check password
      const isPasswordValid = await user.checkPassword(password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate token
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username
      };

      const token = this.generateToken(payload);

      return {
        success: true,
        data: {
          user: user.toJSON(),
          token
        },
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  }

  // Register new user
  async register(userData) {
    console.log("Registration attempt with:", userData);
    try {
      // Debug: Check if User model is available
      if (!User) {
        console.error('User model is undefined');
        throw new Error('User model not initialized');
      }

      console.log('User model is available, proceeding with registration...');

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { email: userData.email.toLowerCase() },
            { username: userData.username }
          ]
        }
      });

      if (existingUser) {
        return {
          success: false,
          message: 'User with this email or username already exists'
        };
      }

      // Create new user
      const user = await User.create({
        ...userData,
        email: userData.email.toLowerCase(),
        role: userData.role || 'viewer'
      });

      return {
        success: true,
        data: { user: user.toJSON() },
        message: 'User registered successfully'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Verify current password
      const isCurrentPasswordValid = await user.checkPassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          message: 'Current password is incorrect'
        };
      }

      // Update password
      await user.update({ password: newPassword });

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: error.message || 'Password change failed'
      };
    }
  }

  // Verify token
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Special case for super admin
      if (decoded.id === 1) {
        return {
          success: true,
          data: {
            id: 1,
            email: decoded.email,
            role: 'super_admin',
            username: 'Super Admin',
            isActive: true
          }
        };
      }

      // Find regular user
      const user = await User.findOne({
        where: {
          id: decoded.id,
          isActive: true
        }
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found or inactive'
        };
      }

      return {
        success: true,
        data: user.toJSON()
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid or expired token'
      };
    }
  }
}

module.exports = new AuthService();