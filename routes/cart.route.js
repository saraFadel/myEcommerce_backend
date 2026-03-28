const express = require('express');
const router = express.Router();

const {addToCart, updateQuantity, clearCart, mergeCart, removeItem, userCart, allCarts} =  require('../controllers/cart.controller');
const {authenticate} =  require('../middlewares/auth.middleware');
const {authorize} =  require('../middlewares/role.middleware');

router.use(authenticate);


router.post('/', authorize('admin', 'user'), addToCart);
router.post('/merge', authorize('admin', 'user'), mergeCart);

router.get('/all', authorize('admin'), allCarts);
router.get('/:userId', authorize('admin', 'user'), userCart);

router.patch('/', authorize('admin', 'user'), updateQuantity);

router.delete('/clear', authorize('admin', 'user'), clearCart);
router.delete('/item', authorize('admin', 'user'), removeItem);



module.exports = router;
