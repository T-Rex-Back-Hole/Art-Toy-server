const clodinary = require('cloudinary').v2;
const multer = require("multer");

clodinary.config({
    cloud_name: 'dinx9s4q7',
    api_key: '424767843677837',
    api_secret: 'U12n_BE-zD6W5FPN0uI3zWex9Kg',
  });
  
  const storage = new multer.memoryStorage();
  
  async function imageUploadUtil(file) {
    const result = await clodinary.uploader.upload(file, {
      resource_type: "auto",
    });
  
    return result;
  }
  
  const upload = multer({ storage });
  
  module.exports = { upload, imageUploadUtil };