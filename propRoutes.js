const express = require('express');
const {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty
} = require('../controllers/propController');

const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { propertySchema, updatePropertySchema } = require('../validations/property.validation');

const router = express.Router();

router.route('/')
    .get(getProperties)
    .post(protect, validate(propertySchema), createProperty);

router.route('/:id')
    .get(getProperty)
    .put(protect, validate(updatePropertySchema), updateProperty)
    .delete(protect, deleteProperty);

module.exports = router;
