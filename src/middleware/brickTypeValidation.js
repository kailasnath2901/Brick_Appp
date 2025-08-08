// validation/brickTypeValidation.js
'use strict';

const Joi = require('joi');

// Validation schemas for brick types
const schemas = {
  createBrickType: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .pattern(/^[a-zA-Z0-9\s\-_()]+$/)
      .messages({
        'string.min': 'Brick type name must be at least 2 characters long',
        'string.max': 'Brick type name cannot exceed 100 characters',
        'string.pattern.base': 'Brick type name can only contain letters, numbers, spaces, hyphens, underscores, and parentheses',
        'any.required': 'Brick type name is required'
      }),
    pricePerBrick: Joi.number()
      .precision(2)
      .positive()
      .max(9999999.99)
      .required()
      .messages({
        'number.positive': 'Price per brick must be a positive number',
        'number.max': 'Price per brick cannot exceed 9,999,999.99',
        'any.required': 'Price per brick is required'
      }),
    isActive: Joi.boolean().optional().default(true)
  }),

  updateBrickType: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .pattern(/^[a-zA-Z0-9\s\-_()]+$/)
      .optional()
      .messages({
        'string.min': 'Brick type name must be at least 2 characters long',
        'string.max': 'Brick type name cannot exceed 100 characters',
        'string.pattern.base': 'Brick type name can only contain letters, numbers, spaces, hyphens, underscores, and parentheses'
      }),
    pricePerBrick: Joi.number()
      .precision(2)
      .positive()
      .max(9999999.99)
      .optional()
      .messages({
        'number.positive': 'Price per brick must be a positive number',
        'number.max': 'Price per brick cannot exceed 9,999,999.99'
      }),
    isActive: Joi.boolean().optional()
  }),

  bulkCreateBrickTypes: Joi.object({
    brickTypes: Joi.array()
      .items(
        Joi.object({
          name: Joi.string()
            .trim()
            .min(2)
            .max(100)
            .required()
            .pattern(/^[a-zA-Z0-9\s\-_()]+$/)
            .messages({
              'string.min': 'Brick type name must be at least 2 characters long',
              'string.max': 'Brick type name cannot exceed 100 characters',
              'string.pattern.base': 'Brick type name can only contain letters, numbers, spaces, hyphens, underscores, and parentheses',
              'any.required': 'Brick type name is required'
            }),
          pricePerBrick: Joi.number()
            .precision(2)
            .positive()
            .max(9999999.99)
            .required()
            .messages({
              'number.positive': 'Price per brick must be a positive number',
              'number.max': 'Price per brick cannot exceed 9,999,999.99',
              'any.required': 'Price per brick is required'
            }),
          isActive: Joi.boolean().optional().default(true)
        })
      )
      .min(1)
      .max(50)
      .required()
      .messages({
        'array.min': 'At least one brick type is required',
        'array.max': 'Cannot create more than 50 brick types at once',
        'any.required': 'Brick types array is required'
      })
  }),

  queryParams: Joi.object({
    page: Joi.number().integer().min(1).optional().default(1).messages({
      'number.min': 'Page must be at least 1',
      'number.integer': 'Page must be an integer'
    }),
    limit: Joi.number().integer().min(1).max(100).optional().default(10).messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100',
      'number.integer': 'Limit must be an integer'
    }),
    isActive: Joi.boolean().optional(),
    search: Joi.string().trim().max(100).optional().messages({
      'string.max': 'Search term cannot exceed 100 characters'
    }),
    sortBy: Joi.string()
      .valid('name', 'pricePerBrick', 'isActive', 'createdAt', 'updatedAt')
      .optional()
      .default('createdAt')
      .messages({
        'any.only': 'Sort field must be one of: name, pricePerBrick, isActive, createdAt, updatedAt'
      }),
    sortOrder: Joi.string()
      .valid('ASC', 'DESC', 'asc', 'desc')
      .optional()
      .default('DESC')
      .messages({
        'any.only': 'Sort order must be ASC or DESC'
      }),
    minPrice: Joi.number()
      .precision(2)
      .min(0)
      .max(9999999.99)
      .optional()
      .messages({
        'number.min': 'Minimum price cannot be negative',
        'number.max': 'Minimum price cannot exceed 9,999,999.99'
      }),
    maxPrice: Joi.number()
      .precision(2)
      .min(0)
      .max(9999999.99)
      .optional()
      .messages({
        'number.min': 'Maximum price cannot be negative',
        'number.max': 'Maximum price cannot exceed 9,999,999.99'
      })
  }).custom((value, helpers) => {
    // Custom validation to ensure minPrice <= maxPrice
    if (value.minPrice && value.maxPrice && value.minPrice > value.maxPrice) {
      return helpers.error('custom.priceRange');
    }
    return value;
  }).messages({
    'custom.priceRange': 'Minimum price cannot be greater than maximum price'
  }),

  idParam: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      'number.positive': 'ID must be a positive number',
      'number.integer': 'ID must be an integer',
      'any.required': 'ID is required'
    })
  })
};

// Generic validation middleware
const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    const dataToValidate = target === 'query' ? req.query : 
                          target === 'params' ? req.params : req.body;
    
    const { error, value } = schema.validate(dataToValidate, { 
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    // Update the request object with validated and sanitized data
    if (target === 'query') {
      req.query = value;
    } else if (target === 'params') {
      req.params = value;
    } else {
      req.body = value;
    }
    
    next();
  };
};

// Specific validation middlewares
const validateCreateBrickType = validate(schemas.createBrickType);
const validateUpdateBrickType = validate(schemas.updateBrickType);
const validateBulkCreateBrickTypes = validate(schemas.bulkCreateBrickTypes);
const validateQueryParams = validate(schemas.queryParams, 'query');
const validateIdParam = validate(schemas.idParam, 'params');

// Combined validation for routes that need both params and body
const validateUpdateWithId = [validateIdParam, validateUpdateBrickType];

// Advanced validation middleware for business logic
const validateBusinessRules = {
  // Prevent duplicate names (case-insensitive)
  checkDuplicateName: async (req, res, next) => {
    try {
      const { BrickType } = require('../models/BrickType/bricktypemodel');
      const { Op } = require('sequelize');
      const { name } = req.body;
      const { id } = req.params;

      if (!name) return next();

      const whereClause = { 
        name: { [Op.iLike]: name.trim() }
      };

      // For updates, exclude current record
      if (id) {
        whereClause.id = { [Op.ne]: id };
      }

      const existingBrickType = await BrickType.findOne({ where: whereClause });

      if (existingBrickType) {
        return res.status(409).json({
          success: false,
          message: 'A brick type with this name already exists',
          conflictField: 'name',
          existingId: existingBrickType.id
        });
      }

      next();
    } catch (error) {
      console.error('Error in duplicate name validation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to validate brick type name',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // Validate price against business rules
  validatePricing: (req, res, next) => {
    const { pricePerBrick } = req.body;
    
    if (!pricePerBrick) return next();

    // Business rule: Price should be reasonable (between $0.01 and $100.00 per brick)
    if (pricePerBrick < 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Price per brick must be at least $0.01',
        field: 'pricePerBrick'
      });
    }

    if (pricePerBrick > 100.00) {
      return res.status(400).json({
        success: false,
        message: 'Price per brick cannot exceed $100.00. Please review pricing.',
        field: 'pricePerBrick'
      });
    }

    next();
  }
};

module.exports = {
  validate,
  validateCreateBrickType,
  validateUpdateBrickType,
  validateBulkCreateBrickTypes,
  validateQueryParams,
  validateIdParam,
  validateUpdateWithId,
  validateBusinessRules,
  schemas
};