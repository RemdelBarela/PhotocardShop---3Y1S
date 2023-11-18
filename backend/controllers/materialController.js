const Material = require('../models/material')
const Order = require('../models/order')
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
			message: 'No Materials'
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
			message: 'Material not found'
		})
	}
	res.status(200).json({
		success: true,
		material
	})
}

exports.newMaterial = async (req, res, next) => {

	let images = []
	if (typeof req.body.images === 'string') {
		images.push(req.body.images)
	} else {
		images = req.body.images
	}

	let imagesLinks = [];

	for (let i = 0; i < images.length; i++) {
		let imageDataUri = images[i]
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

	}

	req.body.images = imagesLinks
	req.body.user = req.user.id;

	const material = await Material.create(req.body);
	if (!material)
		return res.status(400).json({
			success: false,
			message: 'Material not created'
		})
	res.status(201).json({
		success: true,
		material
	})
}

exports.updateMaterial = async (req, res, next) => {
	let material = await Material.findById(req.params.id);
	// console.log(req.body)
	if (!material) {
		return res.status(404).json({
			success: false,
			message: 'Material not found'
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
	product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
		useFindandModify: false
	})
	if (!product)
		return res.status(400).json({
			success: false,
			message: 'Product not updated'
		})
	// console.log(product)
	return res.status(200).json({
		success: true,
		product
	})
}

exports.deleteProduct = async (req, res, next) => {
	const product = await Product.findByIdAndDelete(req.params.id);
	if (!product) {
		return res.status(404).json({
			success: false,
			message: 'Product not found'
		})
	}

	res.status(200).json({
		success: true,
		message: 'Product deleted'
	})

}