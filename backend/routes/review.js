const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { createPhotoReview, getPhotoReviews, deleteReview, getSingleReview, updateReview, getAdminReviews, getAllPhotos} = require('../controllers/reviewController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.post('/review/new/:id', isAuthenticatedUser, createPhotoReview);
// router.get('/reviews', getReviews)
router.get('/review/:id', getSingleReview);
router.route('/admin/review/:id', isAuthenticatedUser, authorizeRoles('admin')).put(updateReview).delete(deleteReview);
// router.delete('/reviews', isAuthenticatedUser, authorizeRoles('admin'), deleteReview)
router.get('/admin/reviews', getAdminReviews);
router.get('/allphotos', getAllPhotos);
// router.get('/admin/photo-sales', photoSales);

module.exports = router;
