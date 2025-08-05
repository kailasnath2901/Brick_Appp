const authService = require('../services/authService');

class AuthController {
  // Super admin login
  async superAdminLogin(req, res) {
    try {
      const { email, password } = req.body;

      // Directly use the service response
      const result = await authService.superAdminLogin(email, password);

      // Consistent response handling
      if (!result.success) {
        return res.status(401).json({
          success: false,
          message: result.message
        });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error('Controller error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error during super admin login',
        error: error.message
      });
    }
  }

  // Regular user login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      if (!result.success) {
        return res.status(401).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error during login',
        error: error.message
      });
    }
  }

  // Register new user
  async register(req, res) {
    try {
      const result = await authService.register(req.body);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error during registration',
        error: error.message
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Super admin cannot change password through this endpoint
      if (userId === 0) {
        return res.status(400).json({
          success: false,
          message: 'Super admin password cannot be changed through this endpoint'
        });
      }

      const result = await authService.changePassword(userId, currentPassword, newPassword);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error during password change',
        error: error.message
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      // For super admin, return static data
      if (req.user.id === 1) {
        return res.status(200).json({
          success: true,
          data: {
            user: {
              id: 1,
              email: req.user.email,
              role: 'super_admin',
              username: 'Super Admin',
              isActive: true
            }
          }
        });
      }

      res.status(200).json({
        success: true,
        data: { user: req.user.toJSON() }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error fetching profile',
        error: error.message
      });
    }
  }

  // Verify token
  verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required"
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      // Specific error messages
      let message = 'Invalid token';
      if (err.name === 'TokenExpiredError') {
        message = 'Token expired';
      } else if (err.name === 'JsonWebTokenError') {
        message = 'Malformed token';
      }

      return res.status(401).json({
        success: false,
        message
      });
    }
  };

  // Logout (client-side token removal, server doesn't store tokens)
  async logout(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error during logout',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();