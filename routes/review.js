const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        console.log(error.message);
        throw new ExpressError(400,error);
    } else{
        next();
    }
}

// post route
router.post("/", isLoggedIn, validateReview, (reviewController.postReview));



// delete post route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, (reviewController.deleteReview));

module.exports = router;