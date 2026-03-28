const express = require('express');
const router = express.Router();

const {createCategory, getMainCategories, getSubCategories, deleteCategorybyId, getAllCategories } = require('../controllers/category.controller');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');


router.post('', authenticate, authorize('admin'), createCategory)

router.get('/all', authenticate, authorize('admin'), getAllCategories); 
router.get('/sub', getSubCategories);
router.get('/', getMainCategories);

router.delete('/:id', authenticate, authorize('admin'), deleteCategorybyId)


module.exports = router;
