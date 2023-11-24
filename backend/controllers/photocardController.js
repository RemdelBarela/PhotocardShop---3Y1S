const Photocard = require('../models/photocard')
const Photo = require('../models/photo')
const Material = require('../models/material')
// const Order = require('../models/order')

const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')

exports.getPhotocards = async (req, res, next) => {
	// const photos = await Photo.find({});
	const resPerPage = 4;
	const photocardsCount = await Photocard.countDocuments();
	const apiFeatures = new APIFeatures(Photocard.find(), req.query).search().filter()
	apiFeatures.pagination(resPerPage);
	const photocards = await apiFeatures.query;
	const filteredPhotocardsCount = photocards.length
	if (!photocards) {
		return res.status(404).json({
			success: false,
			message: 'PHOTOCARD LIST IS EMPTY'
		})
	}
	res.status(200).json({
		success: true,
		count: photocards.length,
		photocardsCount,
		photocards,
		resPerPage,
		filteredPhotocardsCount,
	})
}

exports.getSinglePhotocard = async (req, res, next) => {
	const photocard = await Photocard.findById(req.params.id);
	if (!photocard) {
		return res.status(404).json({
			success: false,
			message: 'NO PHOTOCARD FOUND'
		})
	}
	res.status(200).json({
		success: true,
		photocard
	})
}

exports.newPhotocard = async (req, res, next) => {

    try {
        const { photo, material, user } = req.body;
    
        // Create a new Product instance
        const newProduct = new Product({
          photo,
          material,
          user,
        });
    
        // Save the new product to the database
        const savedProduct = await newProduct.save();
    
        res.status(201).json({ success: true, product: savedProduct });
      } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
    // const { rating, comment, photocardId } = req.body;
	// const photocard = {
    //     photo: req.photo._id,
    //     name: req.photo.name,
    //     material: req.material._id,
    //     name: req.material.name,
	// 	user: req.user._id,
	// 	name: req.user.name,
	// 	// rating: Number(rating),
	// 	// comment
	// }

	// let images = []
	// if (typeof req.body.images === 'string') {
	// 	images.push(req.body.images)
	// } else {
	// 	images = req.body.images
	// }

	// let imagesLinks = [];

	// for (let i = 0; i < images.length; i++) {
	// 	let imageDataUri = images[i]
	// 	// console.log(imageDataUri)
	// 	try {
	// 		const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
	// 			folder: 'photos',
	// 			width: 150,
	// 			crop: "scale",
	// 		});

	// 		imagesLinks.push({
	// 			public_id: result.public_id,
	// 			url: result.secure_url
	// 		})

	// 	} catch (error) {
	// 		console.log(error)
	// 	}

	// }

	// req.body.images = imagesLinks
	// req.body.user = req.user.id;

    // const Photocard = await Photocard.findById(photocardId);

	// const photocard = await Photocard.create(req.body);
	// if (!photocard)
	// 	return res.status(400).json({
	// 		success: false,
	// 		message: 'FAILED TO CREATE PHOTOCARD'
	// 	})
	// res.status(201).json({
	// 	success: true,
	// 	photocard
	// })
}

exports.updatePhotocard = async (req, res, next) => {
	let photocard = await Photocard.findById(req.params.id);
	// console.log(req.body)
	if (!photocard) {
		return res.status(404).json({
			success: false,
			message: 'NO PHOTOCARD FOUND'
		})
	}

	// let images = []

	// if (typeof req.body.images === 'string') {
	// 	images.push(req.body.images)
	// } else {
	// 	images = req.body.images
	// }
	// if (images !== undefined) {
	// 	// Deleting images associated with the Photo
	// 	for (let i = 0; i < photocard.images.length; i++) {
	// 		try {
	// 			let imageDataUri = photocard.images[i]
	// 		const result = await cloudinary.v2.uploader.destroy(`${imageDataUri.public_id}`)
	// 		} catch (error) {
	// 			console.log(error)
	// 		}
	// 	}
	// }
	// let imagesLinks = [];
	// for (let i = 0; i < images.length; i++) {
	// 	try {
	// 		let imageDataUri = images[i]
	// 	const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
	// 		folder: 'photocards',
	// 		width: 150,
	// 		crop: "scale",
	// 	});
	// 	imagesLinks.push({
	// 		public_id: result.public_id,
	// 		url: result.secure_url
	// 	})
	// 	} catch (error) {
	// 		console.log(error)
	// 	}
		

	// }
	// req.body.images = imagesLinks
	photocard = await Photocard.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
		useFindandModify: false
	})
	if (!photocard)
		return res.status(400).json({
			success: false,
			message: 'FAILED TO UPDATE PHOTOCARD'
		})
	// console.log(Photo)
	return res.status(200).json({
		success: true,
		photocard
	})
}

exports.deletePhotocard = async (req, res, next) => {
	const photocard = await Photocard.findByIdAndDelete(req.params.id);
	if (!photocard) {
		return res.status(404).json({
			success: false,
			message: 'NO PHOTOCARD FOUND'
		})
	}
	res.status(200).json({
		success: true,
		message: 'PHOTOCARD REMOVED'
	})
}

exports.getAdminPhotocards = async (req, res, next) => {
	const photocards = await Photocard.find();
	if (!photocards) {
		return res.status(404).json({
			success: false,
			message: 'PHOTOCARD NOT FOUND'
		})
	}
	res.status(200).json({
		success: true,
		photocards
	})
}

exports.getAllMaterials = async (req, res, next) => {
	const allmaterials = await Material.find();
	if (!allmaterials) {
		return res.status(404).json({
			success: false,
			message: 'MATERIALS NOT FOUND'
		})
	}
	res.status(200).json({
		success: true,
		allmaterials
	})
}

// exports.createPhotoReview = async (req, res, next) => {
// 	const { rating, comment, photoId } = req.body;
// 	const review = {
// 		user: req.user._id,
// 		name: req.user.name,
// 		rating: Number(rating),
// 		comment
// 	}
// 	const Photo = await Photo.findById(photoId);
// 	const isReviewed = Photo.reviews.find(
// 		r => r.user.toString() === req.user._id.toString()
// 	)
// 	if (isReviewed) {
// 		Photo.reviews.forEach(review => {
// 			if (review.user.toString() === req.user._id.toString()) {
// 				review.comment = comment;
// 				review.rating = rating;
// 			}
// 		})
// 	} else {
// 		Photo.reviews.push(review);
// 		Photo.numOfReviews = Photo.reviews.length
// 	}
// 	Photo.ratings = Photo.reviews.reduce((acc, item) => item.rating + acc, 0) / Photo.reviews.length
// 	await Photo.save({ validateBeforeSave: false });
// 	if (!Photo)
// 		return res.status(400).json({
// 			success: false,
// 			message: 'FAILED TO SUBMIT REVIEW'
// 		})
// 	return res.status(200).json({
// 		success: true
// 	})
// }

// exports.getPhotoReviews = async (req, res, next) => {
//     const Photo = await Photo.findById(req.query.id);
//     res.status(200).json({
//         success: true,
//         reviews: Photo.reviews
//     })
// }

// exports.deleteReview = async (req, res, next) => {
//     const Photo = await Photo.findById(req.query.photoId);
//     const reviews = Photo.reviews.filter(review => review._id.toString() !== req.query.id.toString());
//     const numOfReviews = reviews.length;

//     const ratings = Photo.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

//     await Photo.findByIdAndUpdate(req.query.photoId, {
//         reviews,
//         ratings,
//         numOfReviews
//     }, {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false
//     })

//     return res.status(200).json({
//         success: true
//     })
// }