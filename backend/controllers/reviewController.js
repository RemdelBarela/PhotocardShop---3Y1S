const Review = require('../models/review')
// const Photo = require('../models/photo')
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

exports.newReview = async (req, res, next) => {
	const { photo, rating, comment } = req.body;

    const userValidation = new Review({ photo, rating, comment });
    const validationError = userValidation.validateSync();

    if (validationError) {
        const errorMessages = Object.keys(validationError.errors).map(key => validationError.errors[key].message);
        return res.status(400).json({ errors: errorMessages });
    }
	const review = await Review.create(req.body);
	if (!review)
		return res.status(400).json({
			success: false,
			message: 'FAILED TO CREATE REVIEW'
		})
	res.status(201).json({
		success: true,
		review
	})
}

exports.updateReview = async (req, res, next) => {
	const { photo, rating, comment } = req.body;

    const userValidation = new Review({ photo, rating, comment });
    const validationError = userValidation.validateSync();

    if (validationError) {
        const errorMessages = Object.keys(validationError.errors).map(key => validationError.errors[key].message);
        return res.status(400).json({ errors: errorMessages });
    }

	let review = await Review.findById(req.params.id);
	// console.log(req.body)
	if (!review) {
		return res.status(404).json({
			success: false,
			message: 'NO REVIEW FOUND'
		})
	}
	review = await Review.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
		useFindandModify: false
	})
	if (!review)
		return res.status(400).json({
			success: false,
			message: 'FAILED TO UPDATE REVIEW'
		})
	return res.status(200).json({
		success: true,
		review
	})
}

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