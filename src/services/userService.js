const { User } = require('../models/user/usermodel');
const { Op } = require('sequelize');

class UserService {
  // Get all users with pagination and filtering
  async getAllUsers(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        role,
        isActive,
        search
      } = options;

      const offset = (page - 1) * limit;
      const where = {};

      // Add filters
      if (role) {
        where.role = role;
      }

      if (typeof isActive === 'boolean') {
        where.isActive = isActive;
      }

      if (search) {
        where[Op.or] = [
          { username: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows } = await User.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['password'] }
      });

      return {
        success: true,
        data: {
          users: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / limit),
            limit: parseInt(limit)
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch users'
      };
    }
  }

  // Get user by ID
  async getUserById(id) {
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        data: { user }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch user'
      };
    }
  }

  // Update user
  async updateUser(id, updateData) {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Check if email is being updated and if it already exists
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await User.findOne({
          where: { 
            email: updateData.email.toLowerCase(),
            id: { [Op.ne]: id }
          }
        });

        if (existingUser) {
          return {
            success: false,
            message: 'Email already exists'
          };
        }
      }

      // Check if username is being updated and if it already exists
      if (updateData.username && updateData.username !== user.username) {
        const existingUser = await User.findOne({
          where: { 
            username: updateData.username,
            id: { [Op.ne]: id }
          }
        });

        if (existingUser) {
          return {
            success: false,
            message: 'Username already exists'
          };
        }
      }

      // Update user
      await user.update({
        ...updateData,
        email: updateData.email ? updateData.email.toLowerCase() : user.email
      });

      return {
        success: true,
        data: { user: user.toJSON() },
        message: 'User updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update user'
      };
    }
  }

  // Delete user (soft delete by setting isActive to false)
  async deleteUser(id) {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      await user.update({ isActive: false });

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete user'
      };
    }
  }

  // Activate user
  async activateUser(id) {
    try {
      const user = await User.findByPk(id);

      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      await user.update({ isActive: true });

      return {
        success: true,
        data: { user: user.toJSON() },
        message: 'User activated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to activate user'
      };
    }
  }

  // Get users by role
  async getUsersByRole(role) {
    try {
      const users = await User.findAll({
        where: { 
          role,
          isActive: true 
        },
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      });

      return {
        success: true,
        data: { users }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch users by role'
      };
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { isActive: true } });
      const inactiveUsers = await User.count({ where: { isActive: false } });

      const roleStats = await User.findAll({
        attributes: [
          'role',
          [User.sequelize.fn('COUNT', User.sequelize.col('role')), 'count']
        ],
        group: ['role'],
        where: { isActive: true }
      });

      return {
        success: true,
        data: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          byRole: roleStats.map(stat => ({
            role: stat.role,
            count: parseInt(stat.get('count'))
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch user statistics'
      };
    }
  }
}

module.exports = new UserService();