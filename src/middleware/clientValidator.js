const Joi = require('joi');

// Define the client schema
const clientSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Valid email is required',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    }),
    totalCredit: Joi.number().min(0).optional().messages({
        'number.base': 'Total credit must be a number',
        'number.min': 'Total credit must be a positive number'
    }),
    totalDebit: Joi.number().min(0).optional().messages({
        'number.base': 'Total debit must be a number',
        'number.min': 'Total debit must be a positive number'
    }),
    pendingAmount: Joi.number().optional(),
    hasPendingDues: Joi.boolean().optional(),
    isActive: Joi.boolean().optional().messages({
        'boolean.base': 'isActive must be a boolean value'
    })
});

// Validation middleware
const validateClient = (req, res, next) => {
    const { error } = clientSchema.validate(req.body, { 
        abortEarly: false,
        allowUnknown: false
    });
    
    if (error) {
        const errors = error.details.map(detail => ({
            message: detail.message,
            field: detail.context.key
        }));
        return res.status(400).json({ errors });
    }
    
    next();
};

// Schema for financial transactions
const financialTransactionSchema = Joi.object({
    amount: Joi.number().positive().required().messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be a positive number',
        'any.required': 'Amount is required'
    }),
    type: Joi.string().valid('credit', 'debit').required().messages({
        'string.base': 'Type must be a string',
        'any.only': 'Type must be either "credit" or "debit"',
        'any.required': 'Type is required'
    })
});

const validateFinancialTransaction = (req, res, next) => {
    const { error } = financialTransactionSchema.validate(req.body, {
        abortEarly: false
    });
    
    if (error) {
        const errors = error.details.map(detail => ({
            message: detail.message,
            field: detail.context.key
        }));
        return res.status(400).json({ errors });
    }
    
    next();
};

module.exports = {
    validateClient,
    validateFinancialTransaction
};