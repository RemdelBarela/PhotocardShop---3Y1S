const Material = require('../models/material')
// const Order = require('../models/order')
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')

exports.getMaterials = async (req, res, next) => {

	const resPerPage = 4;
	const materialsCount = await Material.countDocuments();
	const apiFeatures = new APIFeatures(Material.find(), req.query).search().filter()
	apiFeatures.pagination(resPerPage);
	const materials = await apiFeatures.query;
	const filteredMaterialsCount = materials.length
	if (!materials) {
		return res.status(404).json({
			success: false,
			message: 'MATERIAL LIST IS EMPTY'
		})
	}
	res.status(200).json({
		success: true,
		count: materials.length,
		materialsCount,
		materials,
		resPerPage,
		filteredMaterialsCount,
	})
}

exports.getSingleMaterial = async (req, res, next) => {
	const material = await Material.findById(req.params.id);
	if (!material) {
		return res.status(404).json({
			success: false,
			message: 'NO MATERIALS FOUND'
		})
	}
	res.status(200).json({
		success: true,
		material
	})
}

exports.newMaterial = async (req, res, next) => {


	const { name, stock , user } = req.body;

    // Create an object with only the "email" and "password" fields for validation
    const validationFields = { name, stock , user };
    const userValidation = new Material(validationFields);

    // Validate user input against the user schema requirements
    let validationError = userValidation.validateSync();

    // Exclude the "name" field from the validation errors
    if (validationError && validationError.errors.user) {
        delete validationError.errors.user;
        if (Object.keys(validationError.errors).length === 0) {
            // If all errors are removed, set validationError to null
            validationError = null;
        }
    }

    if (validationError) {
        const errorMessages = Object.keys(validationError.errors).map(key => validationError.errors[key].message);
        return res.status(400).json({ errors: errorMessages });
    }


	let images = []
	if (typeof req.body.images === 'string') {
		images.push(req.body.images)
	} else {
		images = req.body.images
	}

	let imagesLinks = [];

	
    if (images && images.length) {
	for (let i = 0; i < images.length; i++) {
		let imageDataUri = images[i];
		// console.log(imageDataUri)
		try {
			const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
				folder: 'materials',
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

	}}

	req.body.images = imagesLinks
	req.body.user = req.user.id;

	const material = await Material.create(req.body);
	if (!material)
		return res.status(400).json({
			success: false,
			message: 'FAILED TO CREATE MATERIAL'
		})
	res.status(201).json({
		success: true,
		material
	})
}

exports.updateMaterial = async (req, res, next) => {


	
	const { name, stock , user } = req.body;

    // Create an object with only the "email" and "password" fields for validation
    const validationFields = { name, stock , user };
    const userValidation = new Material(validationFields);

    // Validate user input against the user schema requirements
    let validationError = userValidation.validateSync();

    // Exclude the "name" field from the validation errors
    if (validationError && validationError.errors.user) {
        delete validationError.errors.user;
        if (Object.keys(validationError.errors).length === 0) {
            // If all errors are removed, set validationError to null
            validationError = null;
        }
    }

    if (validationError) {
        const errorMessages = Object.keys(validationError.errors).map(key => validationError.errors[key].message);
        return res.status(400).json({ errors: errorMessages });
    }


	
	let material = await Material.findById(req.params.id);
	// console.log(req.body)
	if (!material) {
		return res.status(404).json({
			success: false,
			message: 'NO MATERIALS FOUND'
		})
	}

	let images = []

	if (typeof req.body.images === 'string') {
		images.push(req.body.images)
	} else {
		images = req.body.images
	}
	if (images !== undefined) {
		// Deleting images associated with the Material
		for (let i = 0; i < material.images.length; i++) {
			try {
				let imageDataUri = material.images[i]
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
			folder: 'materials',
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
	material = await Material.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
		useFindandModify: false
	})
	if (!material)
		return res.status(400).json({
			success: false,
			message: 'FAILED TO UPDATE MATERIAL'
		})
	// console.log(product)
	return res.status(200).json({
		success: true,
		material
	})
}

exports.deleteMaterial = async (req, res, next) => {
	try {
	const material = await Material.findByIdAndDelete(req.params.id);
	if (!material) {
		return res.status(404).json({
			success: false,
			message: 'NO MATERIALS FOUND'
		})
	}

	if (material.images && material.images.length > 0) {
		for (const images of material.images) {
			if (images.public_id) {
				await cloudinary.v2.uploader.destroy(images.public_id);
			}
		}
	}

	await Material.findByIdAndDelete(req.params.id);
	res.status(200).json({
		success: true,
		message: 'MATERIAL REMOVED'
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

exports.getAdminMaterials = async (req, res, next) => {
	const materials = await Material.find();
	if (!materials) {
		return res.status(404).json({
			success: false,
			message: 'MATERIALS NOT FOUND'
		})
	}
	res.status(200).json({
		success: true,
		materials
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

