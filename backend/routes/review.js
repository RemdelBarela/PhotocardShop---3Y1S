const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { createPhotoReview, getPhotoReview, deleteReview, getAdminReviews, getAllPhotos, getRatingStats } = require('../controllers/reviewController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.post('/review/new/:id', isAuthenticatedUser, createPhotoReview);
// router.get('/reviews', getReviews)
router.get('/review/photo/:id',  getPhotoReview);
router.route('/admin/review/:id', isAuthenticatedUser, authorizeRoles('admin')).delete(deleteReview);
// router.delete('/reviews', isAuthenticatedUser, authorizeRoles('admin'), deleteReview)
router.get('/admin/reviews', isAuthenticatedUser, authorizeRoles('admin'), getAdminReviews);
// router.get('/allphotos', getAllPhotos);
// router.get('/admin/photo-sales', photoSales);

router.get('/admin/rating-stats', getRatingStats);


module.exports = router;
