const Review = require('../models/review')
const Photo = require('../models/photo')
// const Order = require('../models/order')

const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

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
        const photoId = req.params.id;

        const existingReview = await Review.findOne({
            photo: photoId,
            user: req.user._id
        });

        let imagesLinks = [];

        if (existingReview) {
            existingReview.rating = Number(rating);
            existingReview.comment = comment;

            let images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];

            if (images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    try {
                        const result = await cloudinary.v2.uploader.upload(images[i], {
                            folder: 'photos',
                            width: 150,
                            crop: "scale",
                        });

                        imagesLinks.push({
                            public_id: result.public_id,
                            url: result.secure_url
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
            }

            req.body.images = imagesLinks;

			existingReview.images = imagesLinks;
            await existingReview.save();

            console.log('Review Updated Successfully');
            console.log('Updated Review:', existingReview);
        } else {
            let images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];

            if (images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    try {
                        const result = await cloudinary.v2.uploader.upload(images[i], {
                            folder: 'photos',
                            width: 150,
                            crop: "scale",
                        });

                        imagesLinks.push({
                            public_id: result.public_id,
                            url: result.secure_url
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }
            }

            req.body.images = imagesLinks;

            const newReview = new Review({
                photo: photoId,
                user: req.user._id,
                name: req.user.name,
				images: imagesLinks,
                rating: Number(rating),
                comment
            });

            await newReview.save();
        }

        const reviews = await Review.find({ photo: photoId });
        const reviewCount = reviews.length;
        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

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

// exports.getRatingStats = async (req, res, next) => {
//   try {
//     // Get the average rating and percentage from your reviews
//     const ratingStats = await Review.aggregate([
//       {
//         $group: {
//           _id: null,
//           average: { $avg: '$rating' },
//           percentage: {
//             $push: {
//               rating: '$rating',
//               count: { $sum: 1 },
//             },
//           },
//         },
//       },
//     ]);

//     if (ratingStats.length === 0) {
//       return next(new ErrorResponse('No rating statistics found', 404));
//     }

//     // Calculate the percentage for each rating
//     const totalReviews = ratingStats[0].percentage.reduce((acc, curr) => acc + curr.count, 0);
//     ratingStats[0].percentage = ratingStats[0].percentage.map(item => ({
//       rating: item.rating,
//       percentage: (item.count / totalReviews) * 100,
//     }));

//     res.status(200).json({
//       success: true,
//       ratingPercentage: ratingStats[0],
//     });
//   } catch (error) {
//     console.error(error);
//     next(new ErrorResponse('Internal Server Error', 500));
//   }
// };
exports.getRatingStats = async (req, res, next) => {
  try {
    const ratingStats = await Review.aggregate([
      {
        $group: {
          _id: '$photo',
          averageRating: { $avg: '$rating' },
        },
      },
    ]);

    if (ratingStats.length === 0) {
      return next(new ErrorResponse('No rating statistics found', 404));
    }

    // If you want to include the photo details, you can use $lookup to join with the Photo model
    const ratingStatsWithPhotoDetails = await Review.aggregate([
      {
        $group: {
          _id: '$photo',
          averageRating: { $avg: '$rating' },
        },
      },
      {
        $lookup: {
          from: 'photos', // Change this to the actual name of your Photo model's collection
          localField: '_id',
          foreignField: '_id',
          as: 'photoDetails',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      ratingStats: ratingStatsWithPhotoDetails,
    });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse('Internal Server Error', 500));
  }
};