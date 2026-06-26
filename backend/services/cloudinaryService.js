const { uploadToCloudinary } = require('../config/cloudinary');

const uploadImage = async (localPath, folder = 'prosper_design/images') => {
  try {
    const uploadRes = await uploadToCloudinary(localPath, folder);
    return uploadRes ? uploadRes.secure_url : '';
  } catch (error) {
    console.error('Cloudinary Image Upload Error:', error);
    return '';
  }
};

const uploadVideo = async (localPath, folder = 'prosper_design/videos') => {
  try {
    const uploadRes = await uploadToCloudinary(localPath, folder);
    return uploadRes ? uploadRes.secure_url : '';
  } catch (error) {
    console.error('Cloudinary Video Upload Error:', error);
    return '';
  }
};

module.exports = {
  uploadImage,
  uploadVideo
};
