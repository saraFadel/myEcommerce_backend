const express = require('express');
const router = express.Router();

const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const {
    createOrder, getUserOrders, getAllOrders, approveOrder, cancelOrderByUser, cancelOrderByAdmin, updateOrderStatus} = require('../controllers/order.controller');

router.post('/', authenticate, authorize('admin', 'user'), createOrder);
router.get('/myOrders', authenticate, getUserOrders);
router.patch('/:id/userCancel', authenticate, authorize('user'), cancelOrderByUser);

router.get('/', authenticate, authorize('admin'), getAllOrders);
router.patch('/:id/approve', authenticate, authorize('admin'), approveOrder);
router.patch('/:id/adminCancel', authenticate, authorize('admin'), cancelOrderByAdmin);

router.patch('/:id/status', authenticate, authorize('admin'), updateOrderStatus);

module.exports = router;
