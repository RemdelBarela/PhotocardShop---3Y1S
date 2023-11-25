const Photo = require('../models/photo')
// const Order = require('../models/order')
const Material = require('../models/material')

const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')

exports.getPhotos = async (req, res, next) => {
	// const photos = await Photo.find({});
	const resPerPage = 4;
	const photosCount = await Photo.countDocuments();
	const apiFeatures = new APIFeatures(Photo.find(), req.query).search().filter()
	apiFeatures.pagination(resPerPage);
	const photos = await apiFeatures.query;
	const filteredPhotosCount = photos.length
	if (!photos) {
		return res.status(404).json({
			success: false,
			message: 'PHOTO LIST IS EMPTY'
		})
	}
	res.status(200).json({
		success: true,
		count: photos.length,
		photosCount,
		photos,
		resPerPage,
		filteredPhotosCount,
	})
}

exports.getSinglePhoto = async (req, res, next) => {
	const photo = await Photo.findById(req.params.id);
	if (!photo) {
		return res.status(404).json({
			success: false,
			message: 'NO PRODUCT FOUND'
		})
	}
	res.status(200).json({
		success: true,
		photo
	})
}

exports.newPhoto = async (req, res, next) => {

	let images = []
	if (typeof req.body.images === 'string') 
	{
		images.push(req.body.images)
	} 
	
	else 
	{
		images = req.body.images
	}

	let imagesLinks = [];

	if (images && images.length) 
	{

		for (let i = 0; i < images.length; i++) 
		{
			let imageDataUri = images[i]

			try {
				const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
					folder: 'photos',
					width: 150,
					crop: "scale",
				});

				imagesLinks.push({
					public_id: result.public_id,
					url: result.secure_url
				})

			} catch (error) {
				console.log(error)
			}

		}
	}
	req.body.images = imagesLinks

	const photo = await Photo.create(req.body);
	if (!photo)
		return res.status(400).json({
			success: false,
			message: 'FAILED TO CREATE PHOTO'
		})
	res.status(201).json({
		success: true,
		photo
	})
}

exports.updatePhoto = async (req, res, next) => {
	let photo = await Photo.findById(req.params.id);
	// console.log(req.body)
	if (!photo) {
		return res.status(404).json({
			success: false,
			message: 'NO PHOTO FOUND'
		})
	}

	let images = []

	if (typeof req.body.images === 'string') {
		images.push(req.body.images)
	} else {
		images = req.body.images
	}
	if (images !== undefined) {
		// Deleting images associated with the Photo
		for (let i = 0; i < photo.images.length; i++) {
			try {
				let imageDataUri = photo.images[i]
			const result = await cloudinary.v2.uploader.destroy(`${imageDataUri.public_id}`)
			} catch (error) {
				console.log(error)
			}
		}
	}
	let imagesLinks = [];
	for (let i = 0; i < images.length; i++) {
		try {
			let imageDataUri = images[i]
		const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
			folder: 'photos',
			width: 150,
			crop: "scale",
		});
		imagesLinks.push({
			public_id: result.public_id,
			url: result.secure_url
		})
		} catch (error) {
			console.log(error)
		}
		

	}
	req.body.images = imagesLinks
	photo = await Photo.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
		useFindandModify: false
	})
	if (!photo)
		return res.status(400).json({
			success: false,
			message: 'FAILED TO UPDATE PHOTO'
		})
	// console.log(Photo)
	return res.status(200).json({
		success: true,
		photo
	})
}

exports.deletePhoto = async (req, res, next) => {
	try {
	const photo = await Photo.findByIdAndDelete(req.params.id);
	if (!photo) {
		return res.status(404).json({
			success: false,
			message: 'NO PRODUCT FOUND'
		})
	}

	if (photo.images && photo.images.length > 0) {
		for (const images of photo.images) {
			if (images.public_id) {
				await cloudinary.v2.uploader.destroy(images.public_id);
			}
		}
	}
	
    await Photo.findByIdAndDelete(req.params.id);
	res.status(200).json({
		success: true,
		message: 'PHOTO REMOVED'
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

exports.getAdminPhotos = async (req, res, next) => {
	const photos = await Photo.find();
	if (!photos) {
		return res.status(404).json({
			success: false,
			message: 'PRODUCTS NOT FOUND'
		})
	}
	res.status(200).json({
		success: true,
		photos
	})
}

exports.createPhotoReview = async (req, res, next) => {
	const { rating, comment, photoId } = req.body;
	const review = {
		user: req.user._id,
		name: req.user.name,
		rating: Number(rating),
		comment
	}
	const photo = await Photo.findById(photoId);
	const isReviewed = photo.reviews.find(
		r => r.user.toString() === req.user._id.toString()
	)
	if (isReviewed) {
		photo.reviews.forEach(review => {
			if (review.user.toString() === req.user._id.toString()) {
				review.comment = comment;
				review.rating = rating;
			}
		})
	} else {
		photo.reviews.push(review);
		photo.numOfReviews = photo.reviews.length
	}
	photo.ratings = photo.reviews.reduce((acc, item) => item.rating + acc, 0) / photo.reviews.length
	await photo.save({ validateBeforeSave: false });
	if (!photo)
		return res.status(400).json({
			success: false,
			message: 'FAILED TO SUBMIT REVIEW'
		})
	return res.status(200).json({
		success: true
	})
}

exports.getPhotoReviews = async (req, res, next) => {
    const photo = await Photo.findById(req.query.id);
    res.status(200).json({
        success: true,
        reviews: photo.reviews
    })
}

exports.deleteReview = async (req, res, next) => {
    const photo = await Photo.findById(req.query.photoId);
    const reviews = photo.reviews.filter(review => review._id.toString() !== req.query.id.toString());
    const numOfReviews = reviews.length;

    const ratings = photo.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Photo.findByIdAndUpdate(req.query.photoId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    return res.status(200).json({
        success: true
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


// exports.photoSales = async (req, res, next) => {
//     const totalSales = await Order.aggregate([
//         {
//             $group: {
//                 _id: null,
//                 total: { $sum: "$itemsPrice" }

//             },
            
//         },
//     ])
//     console.log(totalSales)
//     const sales = await Order.aggregate([
//         { $project: { _id: 0, "orderItems": 1, totalPrice: 1 } },
//         { $unwind: "$orderItems" },
//         {
//             $group: {
//                 _id: { Photo: "$orderItems.name" },
//                 total: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
//             },
//         },
//     ])
// 	console.log(sales)
    
//     if (!totalSales) {
// 		return res.status(404).json({
// 			message: 'error sales'
// 		})
       
//     }
//     if (!sales) {
// 		return res.status(404).json({
// 			message: 'error sales'
// 		})
      
//     }
    
//     let totalPercentage = {}
//     totalPercentage = sales.map(item => {
         
//         // console.log( ((item.total/totalSales[0].total) * 100).toFixed(2))
//         percent = Number (((item.total/totalSales[0].total) * 100).toFixed(2))
//         total =  {
//             name: item._id.Photo,
//             percent
//         }
//         return total
//     }) 
//     // return console.log(totalPercentage)
//     res.status(200).json({
//         success: true,
//         totalPercentage,
//         sales,
//         totalSales
//     })

// }