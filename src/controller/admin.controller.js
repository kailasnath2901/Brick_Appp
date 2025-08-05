const authService = require('../services/authService');




class AdminController {
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