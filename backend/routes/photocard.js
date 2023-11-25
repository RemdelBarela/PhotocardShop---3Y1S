const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { newPhotocard, getPhotocards, getSinglePhotocard, updatePhotocard, deletePhotocard, getAdminPhotocards, createPhotoReview, getPhotoReviews, deleteReview, photoSales } = require('../controllers/photocardController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

// router.post('/photocard/new/:photo_id/:material_id', isAuthenticatedUser, newPhotocard);
router.post('/photocard/new/:photo_id/:material_id', newPhotocard);
// router.get('/photocards', getPhotocards)
// router.get('/photocards/:id', getSinglePhotocard);
// router.route('photocards/:id', updatePhotocard).delete(deletePhotocard);
// router.get('/admin/photocards', isAuthenticatedUser, authorizeRoles('admin'), getAdminPhotocards);
// // router.put('/review', isAuthenticatedUser, createPhotoReview);
// // router.get('/reviews', isAuthenticatedUser, getPhotoReviews)
// // router.delete('/reviews', isAuthenticatedUser, authorizeRoles('admin'), deleteReview)
// // router.get('/admin/photo-sales', productSales);

module.exports = router;
