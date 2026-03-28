// routes/testimonial.route.js
const express = require('express');
const router = express.Router();
const { authenticate} = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');


const { 
    getAllTestimonials,
    getApprovedTestimonials,
    getMyTestimonial,
    updateStatus,
    addTestimonial,
    deleteMyTestimonial,
    
} = require('../controllers/testimonial.controller');

router.get('/approved', getApprovedTestimonials);
router.get('/all', authenticate, authorize('admin'), getAllTestimonials);
router.post('/', authenticate, authorize('admin', 'user'), addTestimonial);
router.get('/me', authenticate, authorize('admin', 'user'), getMyTestimonial);
router.delete('/me', authenticate, authorize('admin', 'user'), deleteMyTestimonial);

router.patch('/status/:id', authenticate, authorize('admin'), updateStatus);

module.exports = router;
