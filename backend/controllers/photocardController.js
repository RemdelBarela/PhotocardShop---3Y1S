const Photocard = require('../models/photocard');
const Photo = require('../models/photo');
const Material = require('../models/material');
const User = require('../models/user');


exports.newPhotocard = async (req, res, next) => {
    try {
        // Fetch photo and material using the provided IDs
        const photo = await Photo.findById(req.params.photo_id);
        const material = await Material.findById(req.params.material_id);

        // Check if photo and material exist
        if (!photo) {
            return res.status(404).json({ success: false, error: 'PHOTO NOT FOUND' });
        }

        if (!material) {
            return res.status(404).json({ success: false, error: 'MATERIAL NOT FOUND' });
        }

       const photocard = await Photocard.create({
                photo: req.params.photo_id,
                material: req.params.material_id,
                // user: req.user.id, 
                user: '65583370a6b26c8d88afe942',
                quantity: req.body.quantity || 1
            });

            console.log(req.user); // Log req.user to check its content


            return res.status(201).json({
                success: true,
                photocard
            });
   
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'FAILED TO CREATE PHOTOCARD',
            error: error.message // You might want to provide more details about the error
        });
    }
};


exports.getSinglePhotocard = async (req, res, next) => {
    try {
      const photocard = await Photocard.findById(req.params.id)
        .populate('photo') // Populate the 'photo' field (reference to Photo model)
        .populate('material')

      if (!photocard) {
        return res.status(404).json({
          success: false,
          message: 'NO PHOTOCARD FOUND'
        });
      }
  
      res.status(200).json({
        success: true,
        photocard
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching photocard',
        error: error.message
      });
    }
  };