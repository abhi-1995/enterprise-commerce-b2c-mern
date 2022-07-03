const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

//Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    console.log("Inside createProduct().....");
    console.log(`Product detail is >> ${req.body}`);

    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    });
});


exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {

    console.log("Inside getAllProducts() ...")

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);

    const products = await apiFeatures.query;
    res.status(200).json({
        success:true,
        products,
        productsCount
    });
});

// Update Product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    console.log("Inside updateProduct() .....")
    let product = await Product.findById(req.params.id);
    console.log(`Object ID : ${req.params.id}`);

    if (!product) {
        console.log(`Product not found for id: ${req.params.id}`);
        return next(new ErrorHandler("Product not found", 404));
    }

    console.log(`Product found for the id: ${req.params.id}`);
    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success: true,
        product
    });
});

//Delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    console.log("Inside deleteProduct() .....")
    const product = await Product.findById(req.params.id);
    console.log(`Object ID : ${req.params.id}`);

    if (!product) {
        console.log(`Product not found for id: ${req.params.id}`);
        return next(new ErrorHandler("Product not found", 404));
    }

    console.log(`Product found for the id: ${req.params.id}`);

    await product.remove();

    res.status(200).json({
        success:true,
        message: `Product deleted successfully with id ${req.params.id} and name ${product.name}`
    });
});


// GET Single Product details

exports.getSingleProductDetails = catchAsyncErrors(async (req, res, next) => {
    console.log("Inside getSingleProductDetails() .....")
    const product = await Product.findById(req.params.id);
    console.log(`Object ID : ${req.params.id}`);

    if (!product) {
        console.log(`Product not found for id: ${req.params.id}`);
        return next(new ErrorHandler("Product not found", 404));
    }

    console.log(`Product found for the id: ${req.params.id}`);

    return res.status(200).json({
        success: true,
        product
    });
});



// Create New Review or Update the Review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const {rating, comment, productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id);

    if(isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id) {
                rev.rating = rating
                rev.comment = comment
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success: true,

    });

});

// GET All Reviews of a Product

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });

});


// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next)=>{
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found",404));
    }

    const reviews =  product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    });


});












