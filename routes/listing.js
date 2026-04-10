const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn, isOwner} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        console.log(error.message);
        throw new ExpressError(400,error);
    } else{
        next();
    }
}

// index route
// router.get("/", (listingController.index));

router.get("/", async (req, res) => {
    let { category } = req.query;

    console.log("CATEGORY:", category);

    let listings;

    if (category) {
        listings = await Listing.find({ category });
    } else {
        listings = await Listing.find({});
    }

    console.log("DATA:", listings.length);

    res.render("listings/index", { listings, category });
});


// new route
router.get("/new", isLoggedIn, (req,res) => {
    res.render("listings/new.ejs");
})

// create route
router
    .post("/", isLoggedIn, validateListing, upload.single("listing[image]"), (listingController.createListing));
    // .post("/",  (req,res) => {
    //     res.send(req.file);
    // })

    // category route
// router.get("/listings", async (req, res) => {
//     let { category } = req.query;

//     console.log("CATEGORY:", category); // debug

//     let listings;

//     if (category) {
//         listings = await Listing.find({ category: category });
//     } else {
//         listings = await Listing.find({});
//     }

//     console.log("DATA:", listings.length); // debug

//     res.render("listings/index.ejs", { listings, category });
// });

// show route
router.get("/:id", (listingController.showListing));


// edit route
router.get("/:id/edit", isLoggedIn, isOwner, (listingController.editListing));

// update route

// app.put("/listings/:id", async (req,res) => {
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);
// })


router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), (listingController.updateListing));

// delete route
router.delete("/:id", isLoggedIn,isOwner, (listingController.deleteListing));



module.exports = router;