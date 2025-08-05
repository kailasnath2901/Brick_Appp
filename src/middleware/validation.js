const Joi = require('joi');

// Validation schemas
const schemas = {
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
  }),

  register: Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 50 characters',
      'any.required': 'Username is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).max(100).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 100 characters',
      'any.required': 'Password is required'
    }),
    role: Joi.string().valid('admin', 'manager', 'employee', 'viewer').optional()
  }),

  updateUser: Joi.object({
    username: Joi.string().min(3).max(50).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid('admin', 'manager', 'employee', 'viewer').optional(),
    isActive: Joi.boolean().optional()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'any.required': 'Current password is required'
    }),
    newPassword: Joi.string().min(6).max(100).required().messages({
      'string.min': 'New password must be at least 6 characters long',
      'string.max': 'New password cannot exceed 100 characters',
      'any.required': 'New password is required'
    })
  })
};

// Generic validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

// Specific validation middlewares
const validateLogin = validate(schemas.login);
const validateRegister = validate(schemas.register);
const validateUpdateUser = validate(schemas.updateUser);
const validateChangePassword = validate(schemas.changePassword);

module.exports = {
  validate,
  validateLogin,
  validateRegister,
  validateUpdateUser,
  validateChangePassword,
  schemas
};