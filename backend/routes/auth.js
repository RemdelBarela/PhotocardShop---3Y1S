const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const {registerUser, loginUser, logout, forgotPassword, resetPassword, updatePassword, getUserProfile, updateProfile, allUsers, getUserDetails, deleteUser, updateUser} = require('../controllers/authController');

const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth')

// router.post('/register', registerUser);


router.post('/register', upload.array('avatar'), registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.put('/password/update', isAuthenticatedUser, updatePassword)
router.get('/me', isAuthenticatedUser, getUserProfile)
router.put('/me/update', upload.array('avatar'), isAuthenticatedUser, updateProfile)

router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), allUsers)
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails )
        .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)
        .put(isAuthenticatedUser,  authorizeRoles('admin'), updateUser)

module.exports = router;