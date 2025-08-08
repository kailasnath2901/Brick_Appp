const Joi = require('joi');

const createSalarySchema = Joi.object({
  amount: Joi.number().precision(2).required(),
  paymentType: Joi.string().valid('cash', 'bank_transfer', 'check', 'digital_wallet').required(),
  paymentDate: Joi.date().required(),
  description: Joi.string().allow('', null),
});

const updateSalarySchema = Joi.object({
  amount: Joi.number().precision(2),
  paymentType: Joi.string().valid('cash', 'bank_transfer', 'check', 'digital_wallet'),
  paymentDate: Joi.date(),
  description: Joi.string().allow('', null),
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    req.body = value;
    next();
  };
};

module.exports = {
  createSalarySchema,
  updateSalarySchema,
  validate
};
