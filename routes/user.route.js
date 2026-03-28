const express = require('express');
const router = express.Router();

const {authenticate} = require('../middlewares/auth.middleware')
const {authorize} = require('../middlewares/role.middleware')

const {createUser, getUserById, editUserById, getAllUsers, getActiveUsers, deleteUserById} = require('../controllers/user.controller');


router.post('/', createUser('user'));
router.post('/createAdmin', authenticate, authorize('admin'), createUser('admin'));


router.get('/', authenticate, authorize('admin'), getAllUsers);
router.get('/activeUsers', authenticate, authorize('admin'), getActiveUsers);
router.get('/:id', getUserById);

router.patch('/:id', editUserById);

router.delete('/:id', deleteUserById);


module.exports = router;

