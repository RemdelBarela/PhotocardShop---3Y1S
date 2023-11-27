const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { newReview, getReviews, getSingleReview, updateReview, deleteReview, getAdminReviews, getAllPhotos} = require('../controllers/reviewController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

// router.post('/admin/photo/new', isAuthenticatedUser, authorizeRoles('admin'), upload.array('images'), newPhoto)
// router.get('/photos', getPhotos)
// router.get('/photo/:id', getSinglePhoto);
// router.route('/admin/photo/:id', isAuthenticatedUser, authorizeRoles('admin')).put(upload.array('images'), updatePhoto).delete(deletePhoto);
// router.get('/admin/photos', isAuthenticatedUser, authorizeRoles('admin'), getAdminPhotos);
router.put('/review/new', newReview);
router.get('/reviews', getReviews)
router.get('/review/:id', getSingleReview);
router.route('/admin/review/:id', isAuthenticatedUser, authorizeRoles('admin')).put(updateReview).delete(deleteReview);
// router.delete('/reviews', isAuthenticatedUser, authorizeRoles('admin'), deleteReview)
router.get('/admin/reviews', getAdminReviews);
router.get('/allphotos', getAllPhotos);
// router.get('/admin/photo-sales', photoSales);

module.exports = router;
