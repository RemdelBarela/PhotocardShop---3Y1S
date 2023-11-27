const Review = require('../models/review')
const Photo = require('../models/photo')
// const Order = require('../models/order')

const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')

exports.getReviews = async (req, res, next) => {
	// const photos = await Photo.find({});
	const resPerPage = 4;
	const reviewsCount = await Review.countDocuments();
	const apiFeatures = new APIFeatures(Review.find(), req.query).search().filter()
	apiFeatures.pagination(resPerPage);
	const reviews = await apiFeatures.query;
	console.log(reviews); 
	const filteredReviewsCount = reviews.length
	if (!reviews) {
		return res.status(404).json({
			success: false,
			message: 'REVIEW LIST IS EMPTY'
		})
	}
	res.status(200).json({
		success: true,
		count: reviews.length,
		reviewsCount,
		reviews,
		resPerPage,
		filteredReviewsCount,
	})
}

exports.getSingleReview = async (req, res, next) => {
	const review = await Review.findById(req.params.id);
	if (!review) {
		return res.status(404).json({
			success: false,
			message: 'NO REVIEW FOUND'
		})
	}
	res.status(200).json({
		success: true,
		review
	})
}

// exports.getPhotoReview = async (req, res, next) => {
// 	try {
// 	  const photo = await Photo.findById(req.params.id);
	  
// 	  if (!photo) {
// 		return res.status(404).json({
// 		  success: false,
// 		  message: 'No Photo Found'
// 		});
// 	  }
  
// 	  // Assuming there's a relationship between Photo and Review models
// 	  // and the Review model has a reference to the Photo ID
// 	  const reviews = await Review.find({ photo: req.params.id });
  
// 	  res.status(200).json({
// 		success: true,
// 		photo,
// 		reviews
// 	  });
// 	} catch (err) {
// 	  return res.status(500).json({
// 		success: false,
// 		message: 'Error retrieving photo and reviews'
// 	  });
// 	}
//   };

exports.getPhotoReview = async (req, res, next) => {
	try {
	  const photo = await Photo.findById(req.params.id);
	  
	  if (!photo) {
		return res.status(404).json({
		  success: false,
		  message: 'No Photo Found'
		});
	  }
  
	  // Assuming you want to update the review for a specific user ID
	  const userId = req.user._id; // Get user ID from request query or wherever it's provided
  
	  // Check if a review exists for the given user ID and photo ID
	  let review = await Review.findOne({ photo: req.params.id, user_id: userId });
  
	  if (review) {
		// If a review exists, update it
		review = await Review.findOneAndUpdate(
		  { photo: req.params.id, user_id: userId },
		  { /* Update the review fields here */ },
		  { new: true } // Return the updated review
		);
	  } else {
		// If no review exists, create a new one
		review = new Review({
		  photo: req.params.id,
		  user_id: userId,
		  /* Other review fields */
		});
		review = await review.save();
	  }
  
	  res.status(200).json({
		success: true,
		photo,
		review
	  });
	} catch (err) {
	  return res.status(500).json({
		success: false,
		message: 'Error retrieving photo and reviews'
	  });
	}
  };

  exports.createPhotoReview = async (req, res, next) => {
	try {
	  const { rating, comment } = req.body;
	  const photoId = req.params.id; // Assuming 'id' is passed correctly in the request
  
	  const existingReview = await Review.findOne({
		photo: photoId,
		'rev.user': req.user._id // Check if the user has already submitted a review for this photo
	  });
  
	  if (existingReview) {
		// If the user has already submitted a review, update it
		existingReview.rev.rating = Number(rating);
		existingReview.rev.comment = comment;
		await existingReview.save();
	  } else {
		// If no review exists for the user, create a new review
		const newReview = new Review({
		  photo: photoId,
		  rev: {
			user: req.user._id,
			name: req.user.name,
			rating: Number(rating),
			comment
		  }
		});
		await newReview.save();
	  }
  
	  // Update numOfReviews in the Review model for the particular photo
	  const reviewCount = await Review.countDocuments({ photo: photoId });
	  await Photo.findByIdAndUpdate(photoId, { numOfReviews: reviewCount });
  
	  return res.status(200).json({
		success: true,
		message: 'Review submitted successfully'
	  });
	} catch (err) {
	  console.error(err);
	  return res.status(500).json({
		success: false,
		message: 'Failed to submit review'
	  });
	}
  };

exports.deleteReview = async (req, res, next) => {
	try {
	const review = await review.findByIdAndDelete(req.params.id);
	if (!review) {
		return res.status(404).json({
			success: false,
			message: 'NO PRODUCT FOUND'
		})
	}

    await Review.findByIdAndDelete(req.params.id);
	res.status(200).json({
		success: true,
		message: 'REVIEW REMOVED'
	});
	} catch (error) {
		// Log the error for debugging purposes
		console.error(error);

		// Send an error response
		res.status(500).json({
			success: false,
			message: 'INTERNAL SERVER ERROR'
		});
	}
}

exports.getAdminReviews = async (req, res, next) => {
	const reviews = await Review.find();
	if (!reviews) {
		return res.status(404).json({
			success: false,
			message: 'PRODUCTS NOT FOUND'
		})
	}
	res.status(200).json({
		success: true,
		reviews
	})
}

exports.getAllPhotos = async (req, res, next) => {
    try {
        const allphotos = await Photo.find({}, 'name'); // Only fetch the name field
        if (!allphotos) {
            return res.status(404).json({
                success: false,
                message: 'PHOTOS NOT FOUND'
            });
        }
        res.status(200).json({
            success: true,
            allphotos
        });
    } catch (error) {
        console.error('ERROR GETTING PHOTOS:', error);
        res.status(500).json({
            success: false,
            message: 'INTERNAL SERVER ERROR'
        });
    }
};