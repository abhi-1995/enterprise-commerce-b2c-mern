const {getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProductDetails, createProductReview, getProductReviews, deleteReview} = require("../controllers/productController");
const { isAuthenticatedUser,authorizedRoles } = require("../middleware/auth");
const express = require("express");

const router = express.Router();


router.route("/products").get(getAllProducts);

router.route("/admin/product/new").post(isAuthenticatedUser,authorizedRoles("admin"),createProduct);

router.route("/admin/product/:id").put(isAuthenticatedUser,authorizedRoles("admin"),updateProduct)
                            .delete(isAuthenticatedUser,authorizedRoles("admin"),deleteProduct);

router.route("/product/:id").get(getSingleProductDetails);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router;