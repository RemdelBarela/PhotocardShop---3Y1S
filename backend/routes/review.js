const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { createPhotoReview, getPhotoReview, deleteReview, getSingleReview, getAdminReviews, getAllPhotos} = require('../controllers/reviewController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.post('/review/new/:id', isAuthenticatedUser, createPhotoReview);
// router.get('/reviews', getReviews)
router.get('/review/:id', getSingleReview);
router.get('/review/photo/:id', isAuthenticatedUser, getPhotoReview);
router.route('/admin/review/:id', isAuthenticatedUser, authorizeRoles('admin')).delete(deleteReview);
// router.delete('/reviews', isAuthenticatedUser, authorizeRoles('admin'), deleteReview)
router.get('/admin/reviews', getAdminReviews);
router.get('/allphotos', getAllPhotos);
// router.get('/admin/photo-sales', photoSales);

module.exports = router;
