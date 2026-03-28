const express = require('express');
const router = express.Router();

const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');

const {getAllFAQs, createFAQ, updateFAQ, deleteFAQ} = require('../controllers/faq.controller');

router.get('/', getAllFAQs);

router.post('/', authenticate, authorize('admin'), createFAQ);

router.patch('/:id', authenticate, authorize('admin'), updateFAQ);

router.delete('/:id', authenticate, authorize('admin'), deleteFAQ);




module.exports = router;