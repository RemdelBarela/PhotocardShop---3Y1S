const Review = require('../models/review')
const Photo = require('../models/photo')
// const Order = require('../models/order')

const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

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

exports.getPhotoReview = async (req, res, next) => {
	try {
	  const photo = await Photo.findById(req.params.id);
	  
	  if (!photo) {
		return res.status(404).json({
		  success: false,
		  message: 'No Photo Found'
		});
	  }
  
	  // Assuming there's a relationship between Photo and Review models
	  // and the Review model has a reference to the Photo ID
	  const review = await Review.find({ photo: req.params.id });
  
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
}
  
exports.createPhotoReview = async (req, res, next) => {
	try {
	  const { rating, comment } = req.body;
	  const photoId = req.params.id; // Assuming 'id' is passed correctly in the request
  
	  const existingReview = await Review.findOne({
		photo: photoId,
		user: req.user._id // Check if any review exists for this photo by the user
	  });
  
	  if (existingReview) {
		// Update the existing review
		existingReview.rating = Number(rating);
		existingReview.comment = comment;
  
		await existingReview.save();
  
		console.log('Review Updated Successfully');
		console.log('Updated Review:', existingReview);
	  } else {
		// If no review exists for the user, create a new review
		const newReview = new Review({
		  photo: photoId,
		  user: req.user._id,
		  name: req.user.name,
		  rating: Number(rating),
		  comment
		});

		await newReview.save();
	  }
  
	  	// Fetch reviews for the given photoId
		const reviews = await Review.find({ photo: photoId });

		// Calculate review count
		const reviewCount = reviews.length;

		// Calculate average rating
		const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
		const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

		// Update Photo document
		await Photo.findByIdAndUpdate(photoId, {
		numOfReviews: reviewCount,
		ratings: averageRating
		});

  
	  return res.status(200).json({
		success: true,
		message: 'SUCCESSFULLY SUBMITTED YOUR REVIEW'
	  });
	} catch (err) {
	  console.error(err);
	  return res.status(500).json({
		success: false,
		message: 'FAILED TO SUBMIT REVIEW'
	  });
	}
  };
  
  exports.deleteReview = async (req, res, next) => {
	try {
	  const review = await Review.findByIdAndDelete(req.params.id);
  
	  if (!review) {
		return res.status(404).json({
		  success: false,
		  message: 'Review not found'
		});
	  }
  
	  const reviews = await Review.find({ photo: review.photo });
  
	  // Calculate review count
	  const reviewCount = reviews.length;
  
	  // Calculate average rating
	  const totalRating = reviews.reduce((acc, item) => acc + item.rating, 0);
	  const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
  
	  // Update Photo document
	  await Photo.findByIdAndUpdate(review.photo, {
		numOfReviews: reviewCount,
		ratings: averageRating
	  });
  
	  res.status(200).json({
		success: true,
		message: 'Review deleted successfully'
	  });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({
		success: false,
		message: 'Server error'
	  });
	}
  };

exports.getAdminReviews = async (req, res, next) => {
	const reviews = await Review.find();
	if (!reviews) {
		return res.status(404).json({
			success: false,
			message: 'REVIEW NOT FOUND'
		})
	}
	res.status(200).json({
		success: true,
		reviews
	})
}

// exports.getAllPhotos = async (req, res, next) => {
//     try {
//         const allphotos = await Photo.find({}, 'name'); // Only fetch the name field
//         if (!allphotos) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'PHOTOS NOT FOUND'
//             });
//         }
//         res.status(200).json({
//             success: true,
//             allphotos
//         });
//     } catch (error) {
//         console.error('ERROR GETTING PHOTOS:', error);
//         res.status(500).json({
//             success: false,
//             message: 'INTERNAL SERVER ERROR'
//         });
//     }
// };