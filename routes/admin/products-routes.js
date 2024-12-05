import express from 'express';

const {
    handleImageUpload,
    addProduct,
    fetchAllProducts,
    editProduct,
    deleteProduct,
getFilteredProducts,} = require('../../controllers/admin/products-controller');

const {upload} = require('../../helpers/cloudinary');

const router = express.Router();

router.post('/upload-image',upload.single("my_file"),handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);
router.get("/get/filtered", getFilteredProducts);


export default router;