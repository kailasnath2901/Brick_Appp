const express = require('express');
const router = express.Router();
const controller = require('../controller/employeeSalaryController');

const {
  createSalarySchema,
  updateSalarySchema,
  validate
} = require('../middleware/employeeSalaryValidation');

router.post('/', validate(createSalarySchema), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', validate(updateSalarySchema), controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
