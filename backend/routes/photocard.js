const express = require('express');
const router = express.Router();

const { newPhotocard, getPhotocards, getSinglePhotocard, deletePhotocard} = require('../controllers/photocardController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.post('/photocard/new/:photo_id/:material_id', newPhotocard);
router.get('/photocard/:id', getSinglePhotocard);
router.delete('/photocard/delete/:id', deletePhotocard);

module.exports = router;
