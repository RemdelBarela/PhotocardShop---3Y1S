const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { newPhoto, getPhotos, getSinglePhoto, updatePhoto, deletePhoto, getAdminPhotos, photoSales, getAllMaterials } = require('../controllers/photoController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.post('/admin/photo/new', isAuthenticatedUser, authorizeRoles('admin'), upload.array('images'), newPhoto)
router.get('/photos', getPhotos)
router.get('/photo/:id', getSinglePhoto);
router.route('/admin/photo/:id', isAuthenticatedUser, authorizeRoles('admin')).put(upload.array('images'), updatePhoto).delete(deletePhoto);
router.get('/admin/photos', isAuthenticatedUser, authorizeRoles('admin'), getAdminPhotos);
router.get('/allmaterials', getAllMaterials);
router.get('/admin/photo-sales', photoSales);
// router.get('/admin/rating-stats', getRatingStats);

module.exports = router;
