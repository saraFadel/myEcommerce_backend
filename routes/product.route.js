const express = require('express');
const router = express.Router();

const {addProduct, getAllProducts, getProductbySlug, getProductbyId, deleteProductById, editProductById, getRelatedsbyCategoryAndSlug} = require('../controllers/product.controller');

const {upload} = require('../middlewares/upload.middleware');
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware');

router.get('/', getAllProducts);
router.get('/p/:slug', getProductbySlug);
router.get('/id/:id', getProductbyId);
router.get('/related/:categoryId/:slug', getRelatedsbyCategoryAndSlug);


router.post('/', authenticate, authorize('admin'), upload.single('img'), addProduct);

router.delete('/id/:id', authenticate, authorize('admin'), deleteProductById);

router.patch('/id/:id', authenticate, authorize('admin'), upload.single('img'), editProductById);


module.exports = router