const cloudinary = require('cloudinary').v2;
const { abortIf } = require('./responder');
const httpStatus = require('http-status');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'bidding-items',
            resource_type: 'auto'
        });

        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        abortIf(true, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload image');
    }
};

const uploadMultipleImages = async (files) => {
    const uploadPromises = files.map(file => uploadImage(file));
    return Promise.all(uploadPromises);
};

module.exports = {
    uploadImage,
    uploadMultipleImages
}; 