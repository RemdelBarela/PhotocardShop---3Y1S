const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { getMaterials, getSingleMaterial, newMaterial, updateMaterial, deleteMaterial, getAdminMaterials, getAllMaterials} = require('../controllers/materialController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.get('/materials', getMaterials)
router.get('/material/:id', getSingleMaterial);
router.post('/admin/material/new', isAuthenticatedUser, upload.array('images'), newMaterial)
router.route('/admin/material/:id', isAuthenticatedUser,).put(upload.array('images'), updateMaterial).delete(deleteMaterial);
router.get('/admin/materials', isAuthenticatedUser, authorizeRoles('admin'), getAdminMaterials);
router.get('/allmaterials', getAllMaterials);

module.exports = router;
