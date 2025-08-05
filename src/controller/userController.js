const userService = require('../services/userService.js');

class UserController {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        role: req.query.role,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        search: req.query.search
      };

      const result = await userService.getAllUsers(options);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error fetching users',
        error: error.message
      });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      const result = await userService.getUserById(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error fetching user',
        error: error.message
      });
    }
  }

  // Create new user
  async createUser(req, res) {
    try {
      const result = await userService.createUser(req.body);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error creating user',
        error: error.message
      });
    }
  }

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      
      // Prevent users from updating their own role unless they're super admin
      if (req.user.id === parseInt(id) && req.user.role !== 'super_admin' && req.body.role) {
        return res.status(403).json({
          success: false,
          message: 'You cannot change your own role'
        });
      }

      const result = await userService.updateUser(id, req.body);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error updating user',
        error: error.message
      });
    }
  }

  // Delete user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      // Prevent users from deleting themselves
      if (req.user.id === parseInt(id)) {
        return res.status(403).json({
          success: false,
          message: 'You cannot delete your own account'
        });
      }

      const result = await userService.deleteUser(id);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error deleting user',
        error: error.message
      });
    }
  }

  // Activate user
  async activateUser(req, res) {
    try {
      const { id } = req.params;
      
      const result = await userService.activateUser(id);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error activating user',
        error: error.message
      });
    }
  }

  // Get users by role
  async getUsersByRole(req, res) {
    try {
      const { role } = req.params;
      
      const validRoles = ['admin', 'manager', 'employee', 'viewer'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role specified'
        });
      }

      const result = await userService.getUsersByRole(role);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error fetching users by role',
        error: error.message
      });
    }
  }

  // Get user statistics
  async getUserStats(req, res) {
    try {
      const result = await userService.getUserStats();
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error fetching user statistics',
        error: error.message
      });
    }
  }
  async createAdmin(req, res) {
    try {
      const result = await userService.createAdmin(req.body);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error creating user',
        error: error.message
      });
    }
  }


































































































































  
}

module.exports = new UserController();