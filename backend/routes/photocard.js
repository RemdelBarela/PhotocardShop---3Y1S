const express = require('express');
const router = express.Router();

const { newPhotocard, getPhotocards, getSinglePhotocard, updatePhotocard, deletePhotocard, getAdminPhotocards, createPhotoReview, getPhotoReviews, deleteReview, photoSales } = require('../controllers/photocardController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.post('/photocard/new/:photo_id/:material_id', newPhotocard);
router.get('/photocard/:id', getSinglePhotocard);

module.exports = router;
